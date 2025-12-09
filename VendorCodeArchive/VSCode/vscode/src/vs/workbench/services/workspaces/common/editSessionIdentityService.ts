//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { insert } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { EditSessionIdentityMatch, IEditSessionIdentityCreateParticipant, IEditSessionIdentityProvider, IEditSessionIdentityService } from '../../../../platform/workspace/common/editSessions.js';
import { IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { IExtensionService } from '../../extensions/common/extensions.js';

export class EditSessionIdentityService implements IEditSessionIdentityService {
	readonly _serviceBrand: undefined;

	private _editSessionIdentifierProviders = new Map<string, IEditSessionIdentityProvider>();

	constructor(
		@IExtensionService private readonly _extensionService: IExtensionService,
		@ILogService private readonly _logService: ILogService,
	) { }

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 27: Error message without production error code - breaks React bundle size optimization
//   2. Line 27: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	registerEditSessionIdentityProvider(provider: IEditSessionIdentityProvider): IDisposable {
		if (this._editSessionIdentifierProviders.get(provider.scheme)) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 46: Error message without production error code - breaks React bundle size optimization
//   2. Line 46: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`A provider has already been registered for scheme ${provider.scheme}`);
		}

		this._editSessionIdentifierProviders.set(provider.scheme, provider);
		return toDisposable(() => {
			this._editSessionIdentifierProviders.delete(provider.scheme);
		});
	}

	async getEditSessionIdentifier(workspaceFolder: IWorkspaceFolder, token: CancellationToken): Promise<string | undefined> {
		const { scheme } = workspaceFolder.uri;

		const provider = await this.activateProvider(scheme);
		this._logService.trace(`EditSessionIdentityProvider for scheme ${scheme} available: ${!!provider}`);

		return provider?.getEditSessionIdentifier(workspaceFolder, token);
	}

	async provideEditSessionIdentityMatch(workspaceFolder: IWorkspaceFolder, identity1: string, identity2: string, cancellationToken: CancellationToken): Promise<EditSessionIdentityMatch | undefined> {
		const { scheme } = workspaceFolder.uri;

		const provider = await this.activateProvider(scheme);
		this._logService.trace(`EditSessionIdentityProvider for scheme ${scheme} available: ${!!provider}`);

		return provider?.provideEditSessionIdentityMatch?.(workspaceFolder, identity1, identity2, cancellationToken);
	}

	async onWillCreateEditSessionIdentity(workspaceFolder: IWorkspaceFolder, cancellationToken: CancellationToken): Promise<void> {
		this._logService.debug('Running onWillCreateEditSessionIdentity participants...');

		// TODO@joyceerhl show progress notification?
		for (const participant of this._participants) {
			await participant.participate(workspaceFolder, cancellationToken);
		}

		this._logService.debug(`Done running ${this._participants.length} onWillCreateEditSessionIdentity participants.`);
	}

	private _participants: IEditSessionIdentityCreateParticipant[] = [];

	addEditSessionIdentityCreateParticipant(participant: IEditSessionIdentityCreateParticipant): IDisposable {
		const dispose = insert(this._participants, participant);

		return toDisposable(() => dispose());
	}

	private async activateProvider(scheme: string) {
		const transformedScheme = scheme === 'vscode-remote' ? 'file' : scheme;

		const provider = this._editSessionIdentifierProviders.get(scheme);
		if (provider) {
			return provider;
		}

		await this._extensionService.activateByEvent(`onEditSession:${transformedScheme}`);
		return this._editSessionIdentifierProviders.get(scheme);
	}
}

registerSingleton(IEditSessionIdentityService, EditSessionIdentityService, InstantiationType.Delayed);
