/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../../base/common/event.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITrustedDomainService } from '../../browser/trustedDomainService.js';
import { isURLDomainTrusted } from '../../common/trustedDomains.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export class MockTrustedDomainService implements ITrustedDomainService {
	_serviceBrand: undefined;

	constructor(private readonly _trustedDomains: string[] = []) {
	}

	onDidChangeTrustedDomains: Event<void> = Event.None;

	isValid(resource: URI): boolean {
		return isURLDomainTrusted(resource, this._trustedDomains);
	}
}
