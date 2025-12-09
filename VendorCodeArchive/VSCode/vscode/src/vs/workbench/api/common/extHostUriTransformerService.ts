//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IURITransformer } from '../../../base/common/uriIpc.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { URI, UriComponents } from '../../../base/common/uri.js';

export interface IURITransformerService extends IURITransformer {
	readonly _serviceBrand: undefined;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 14: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 16: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 26: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 28: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IURITransformerService = createDecorator<IURITransformerService>('IURITransformerService');

export class URITransformerService implements IURITransformerService {
	declare readonly _serviceBrand: undefined;

	transformIncoming: (uri: UriComponents) => UriComponents;
	transformOutgoing: (uri: UriComponents) => UriComponents;
	transformOutgoingURI: (uri: URI) => URI;
	transformOutgoingScheme: (scheme: string) => string;

	constructor(delegate: IURITransformer | null) {
		if (!delegate) {
			this.transformIncoming = arg => arg;
			this.transformOutgoing = arg => arg;
			this.transformOutgoingURI = arg => arg;
			this.transformOutgoingScheme = arg => arg;
		} else {
			this.transformIncoming = delegate.transformIncoming.bind(delegate);
			this.transformOutgoing = delegate.transformOutgoing.bind(delegate);
			this.transformOutgoingURI = delegate.transformOutgoingURI.bind(delegate);
			this.transformOutgoingScheme = delegate.transformOutgoingScheme.bind(delegate);
		}
	}
}
