/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { URI, UriDto } from '../../../base/common/uri.js';
import { DidChangeProfilesEvent, IUserDataProfile, IUserDataProfileOptions, IUserDataProfilesService, IUserDataProfileUpdateOptions, reviveProfile } from './userDataProfile.js';
import { IAnyWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { IURITransformer, transformIncomingURIs, transformOutgoingURIs } from '../../../base/common/uriIpc.js';

export class RemoteUserDataProfilesServiceChannel implements IServerChannel {

	constructor(
		private readonly service: IUserDataProfilesService,
		private readonly getUriTransformer: (requestContext: any) => IURITransformer
	) { }

	listen(context: any, event: string): Event<any> {
		const uriTransformer = this.getUriTransformer(context);
		switch (event) {
			case 'onDidChangeProfiles': return Event.map<DidChangeProfilesEvent, DidChangeProfilesEvent>(this.service.onDidChangeProfiles, e => {
				return {
					all: e.all.map(p => transformOutgoingURIs({ ...p }, uriTransformer)),
					added: e.added.map(p => transformOutgoingURIs({ ...p }, uriTransformer)),
					removed: e.removed.map(p => transformOutgoingURIs({ ...p }, uriTransformer)),
					updated: e.updated.map(p => transformOutgoingURIs({ ...p }, uriTransformer))
				};
			});
		}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 33: Error message without production error code - breaks React bundle size optimization
//   2. Line 33: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error(`Invalid listen ${event}`);
	}

	async call(context: any, command: string, args?: any): Promise<any> {
		const uriTransformer = this.getUriTransformer(context);
		switch (command) {
			case 'createProfile': {
				const profile = await this.service.createProfile(args[0], args[1], args[2]);
				return transformOutgoingURIs({ ...profile }, uriTransformer);
			}
			case 'updateProfile': {
				let profile = reviveProfile(transformIncomingURIs(args[0], uriTransformer), this.service.profilesHome.scheme);
				profile = await this.service.updateProfile(profile, args[1]);
				return transformOutgoingURIs({ ...profile }, uriTransformer);
			}
			case 'removeProfile': {
				const profile = reviveProfile(transformIncomingURIs(args[0], uriTransformer), this.service.profilesHome.scheme);
				return this.service.removeProfile(profile);
			}
		}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 53: Error message without production error code - breaks React bundle size optimization
//   2. Line 53: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error(`Invalid call ${command}`);
	}
}

export class UserDataProfilesService extends Disposable implements IUserDataProfilesService {

	readonly _serviceBrand: undefined;

	get defaultProfile(): IUserDataProfile { return this.profiles[0]; }
	private _profiles: IUserDataProfile[] = [];
	get profiles(): IUserDataProfile[] { return this._profiles; }

	private readonly _onDidChangeProfiles = this._register(new Emitter<DidChangeProfilesEvent>());
	readonly onDidChangeProfiles = this._onDidChangeProfiles.event;

	readonly onDidResetWorkspaces: Event<void>;

	constructor(
		profiles: readonly UriDto<IUserDataProfile>[],
		readonly profilesHome: URI,
		private readonly channel: IChannel,
	) {
		super();
		this._profiles = profiles.map(profile => reviveProfile(profile, this.profilesHome.scheme));
		this._register(this.channel.listen<DidChangeProfilesEvent>('onDidChangeProfiles')(e => {
			const added = e.added.map(profile => reviveProfile(profile, this.profilesHome.scheme));
			const removed = e.removed.map(profile => reviveProfile(profile, this.profilesHome.scheme));
			const updated = e.updated.map(profile => reviveProfile(profile, this.profilesHome.scheme));
			this._profiles = e.all.map(profile => reviveProfile(profile, this.profilesHome.scheme));
			this._onDidChangeProfiles.fire({ added, removed, updated, all: this.profiles });
		}));
		this.onDidResetWorkspaces = this.channel.listen<void>('onDidResetWorkspaces');
	}

	async createNamedProfile(name: string, options?: IUserDataProfileOptions, workspaceIdentifier?: IAnyWorkspaceIdentifier): Promise<IUserDataProfile> {
		const result = await this.channel.call<UriDto<IUserDataProfile>>('createNamedProfile', [name, options, workspaceIdentifier]);
		return reviveProfile(result, this.profilesHome.scheme);
	}

	async createProfile(id: string, name: string, options?: IUserDataProfileOptions, workspaceIdentifier?: IAnyWorkspaceIdentifier): Promise<IUserDataProfile> {
		const result = await this.channel.call<UriDto<IUserDataProfile>>('createProfile', [id, name, options, workspaceIdentifier]);
		return reviveProfile(result, this.profilesHome.scheme);
	}

	async createTransientProfile(workspaceIdentifier?: IAnyWorkspaceIdentifier): Promise<IUserDataProfile> {
		const result = await this.channel.call<UriDto<IUserDataProfile>>('createTransientProfile', [workspaceIdentifier]);
		return reviveProfile(result, this.profilesHome.scheme);
	}

	async setProfileForWorkspace(workspaceIdentifier: IAnyWorkspaceIdentifier, profile: IUserDataProfile): Promise<void> {
		await this.channel.call<UriDto<IUserDataProfile>>('setProfileForWorkspace', [workspaceIdentifier, profile]);
	}

	removeProfile(profile: IUserDataProfile): Promise<void> {
		return this.channel.call('removeProfile', [profile]);
	}

	async updateProfile(profile: IUserDataProfile, updateOptions: IUserDataProfileUpdateOptions): Promise<IUserDataProfile> {
		const result = await this.channel.call<UriDto<IUserDataProfile>>('updateProfile', [profile, updateOptions]);
		return reviveProfile(result, this.profilesHome.scheme);
	}

	resetWorkspaces(): Promise<void> {
		return this.channel.call('resetWorkspaces');
	}

	cleanUp(): Promise<void> {
		return this.channel.call('cleanUp');
	}

	cleanUpTransientProfiles(): Promise<void> {
		return this.channel.call('cleanUpTransientProfiles');
	}

}
