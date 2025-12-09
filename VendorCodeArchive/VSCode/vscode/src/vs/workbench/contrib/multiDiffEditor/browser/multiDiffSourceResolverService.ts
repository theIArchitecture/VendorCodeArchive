//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BugIndicatingError } from '../../../../base/common/errors.js';
import { IValueWithChangeEvent } from '../../../../base/common/event.js';
import { IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ContextKeyValue } from '../../../../platform/contextkey/common/contextkey.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 13: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 15: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 15: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 26: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 28: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 28: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 37: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 39: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 39: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 48: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 50: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 50: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 59: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 61: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 61: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

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

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 81: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 83: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 83: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 92: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 94: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 94: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 103: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 105: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 105: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 114: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 116: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 116: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 125: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 127: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 127: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 136: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 138: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 138: Missing service brand declaration - breaks VSCode's DI system type safety
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
//   1. Line 158: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 160: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 160: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 169: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 171: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 171: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 180: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 182: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 182: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 191: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 193: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 193: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 202: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 204: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 204: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IMultiDiffSourceResolverService = createDecorator<IMultiDiffSourceResolverService>('multiDiffSourceResolverService');

export interface IMultiDiffSourceResolverService {
	readonly _serviceBrand: undefined;

	registerResolver(resolver: IMultiDiffSourceResolver): IDisposable;

	resolve(uri: URI): Promise<IResolvedMultiDiffSource | undefined>;
}

export interface IMultiDiffSourceResolver {
	canHandleUri(uri: URI): boolean;

	resolveDiffSource(uri: URI): Promise<IResolvedMultiDiffSource>;
}

export interface IResolvedMultiDiffSource {
	readonly resources: IValueWithChangeEvent<readonly MultiDiffEditorItem[]>;
	readonly contextKeys?: Record<string, ContextKeyValue>;
}

export class MultiDiffEditorItem {
	constructor(
		readonly originalUri: URI | undefined,
		readonly modifiedUri: URI | undefined,
		readonly goToFileUri: URI | undefined,
		readonly goToFileEditorTitle?: string | undefined,
		readonly contextKeys?: Record<string, ContextKeyValue>
	) {
		if (!originalUri && !modifiedUri) {
			throw new BugIndicatingError('Invalid arguments');
		}
	}

	getKey(): string {
		return JSON.stringify([this.modifiedUri?.toString(), this.originalUri?.toString()]);
	}
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

export class MultiDiffSourceResolverService implements IMultiDiffSourceResolverService {
	public readonly _serviceBrand: undefined;

	private readonly _resolvers = new Set<IMultiDiffSourceResolver>();

	registerResolver(resolver: IMultiDiffSourceResolver): IDisposable {
		// throw on duplicate
		if (this._resolvers.has(resolver)) {
			throw new BugIndicatingError('Duplicate resolver');
		}
		this._resolvers.add(resolver);
		return toDisposable(() => this._resolvers.delete(resolver));
	}

	resolve(uri: URI): Promise<IResolvedMultiDiffSource | undefined> {
		for (const resolver of this._resolvers) {
			if (resolver.canHandleUri(uri)) {
				return resolver.resolveDiffSource(uri);
			}
		}
		return Promise.resolve(undefined);
	}
}
