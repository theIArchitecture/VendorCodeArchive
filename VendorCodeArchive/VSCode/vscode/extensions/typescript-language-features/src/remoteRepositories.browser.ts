//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Extension, extensions, Uri } from 'vscode';

export interface RemoteHubApi {
	getProviderUri(uri: Uri): Uri;
	getProviderRootUri(uri: Uri): Uri;

	getVirtualUri(uri: Uri): Uri;
	getVirtualWorkspaceUri(uri: Uri): Uri | undefined;

	loadWorkspaceContents?(workspaceUri: Uri): Promise<boolean>;
}

namespace RemoteRepositories {

	let remoteHub: Extension<RemoteHubApi> | undefined;

	function getRemoteExtension(): Extension<RemoteHubApi> {
		if (remoteHub !== undefined) {
			return remoteHub;
		}

		remoteHub = extensions.getExtension<RemoteHubApi>('ms-vscode.remote-repositories')
			?? extensions.getExtension<RemoteHubApi>('GitHub.remoteHub')
			?? extensions.getExtension<RemoteHubApi>('GitHub.remoteHub-insiders');
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 32: Error message without production error code - breaks React bundle size optimization
//   2. Line 32: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


		if (remoteHub === undefined) {
			throw new Error(`No Remote repository extension found.`);
		}
		return remoteHub;
	}

	export function getApi(): Thenable<RemoteHubApi> {
		return getRemoteExtension().activate();
	}
}

export default RemoteRepositories;
