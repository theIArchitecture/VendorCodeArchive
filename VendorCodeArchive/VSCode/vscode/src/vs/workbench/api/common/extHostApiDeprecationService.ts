//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../platform/log/common/log.js';
import * as extHostProtocol from './extHost.protocol.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 12: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 12: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 18: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 20: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { IExtHostRpcService } from './extHostRpcService.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 26: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 26: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 32: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 34: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 38: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 38: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 44: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 46: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 50: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 50: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 56: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 58: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 62: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 62: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 68: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 70: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 74: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 74: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 80: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 82: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 86: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 86: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 92: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 94: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 98: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 98: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 104: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 106: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 110: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 110: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 116: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 118: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 122: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 122: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 128: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 130: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 134: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 134: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 140: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 142: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 146: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 146: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 152: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 154: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 158: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 158: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 164: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 166: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 170: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 170: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 176: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 178: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 182: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 182: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 188: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 190: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 194: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 194: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 200: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 202: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 206: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 206: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 212: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 214: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 218: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 218: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 224: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 226: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 230: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 230: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 236: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 238: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 242: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 242: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 248: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 250: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 254: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 254: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 260: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 262: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 266: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 266: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 272: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 274: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 278: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 278: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 284: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 286: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 290: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 290: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 296: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 298: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 302: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 302: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 308: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 310: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 314: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 314: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 320: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 322: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 326: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 326: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 332: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 334: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 338: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 338: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 344: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 346: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export interface IExtHostApiDeprecationService {
	readonly _serviceBrand: undefined;

	report(apiId: string, extension: IExtensionDescription, migrationSuggestion: string): void;
}

export const IExtHostApiDeprecationService = createDecorator<IExtHostApiDeprecationService>('IExtHostApiDeprecationService');

export class ExtHostApiDeprecationService implements IExtHostApiDeprecationService {

	declare readonly _serviceBrand: undefined;

	private readonly _reportedUsages = new Set<string>();
	private readonly _telemetryShape: extHostProtocol.MainThreadTelemetryShape;

	constructor(
		@IExtHostRpcService rpc: IExtHostRpcService,
		@ILogService private readonly _extHostLogService: ILogService,
	) {
		this._telemetryShape = rpc.getProxy(extHostProtocol.MainContext.MainThreadTelemetry);
	}

	public report(apiId: string, extension: IExtensionDescription, migrationSuggestion: string): void {
		const key = this.getUsageKey(apiId, extension);
		if (this._reportedUsages.has(key)) {
			return;
		}
		this._reportedUsages.add(key);

		if (extension.isUnderDevelopment) {
			this._extHostLogService.warn(`[Deprecation Warning] '${apiId}' is deprecated. ${migrationSuggestion}`);
		}

		type DeprecationTelemetry = {
			extensionId: string;
			apiId: string;
		};
		type DeprecationTelemetryMeta = {
			extensionId: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The id of the extension that is using the deprecated API' };
			apiId: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The id of the deprecated API' };
			owner: 'mjbvz';
			comment: 'Helps us gain insights on extensions using deprecated API so we can assist in migration to new API';
		};
		this._telemetryShape.$publicLog2<DeprecationTelemetry, DeprecationTelemetryMeta>('extHostDeprecatedApiUsage', {
			extensionId: extension.identifier.value,
			apiId: apiId,
		});
	}

	private getUsageKey(apiId: string, extension: IExtensionDescription): string {
		return `${apiId}-${extension.identifier.value}`;
	}
}


export const NullApiDeprecationService = Object.freeze(new class implements IExtHostApiDeprecationService {
	declare readonly _serviceBrand: undefined;

	public report(_apiId: string, _extension: IExtensionDescription, _warningMessage: string): void {
		// noop
	}
}());
