//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IUserDataAutoSyncService, SyncOptions, UserDataSyncError } from '../../../../platform/userDataSync/common/userDataSync.js';
import { ISharedProcessService } from '../../../../platform/ipc/electron-browser/services.js';
import { IChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { Event } from '../../../../base/common/event.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

class UserDataAutoSyncService implements IUserDataAutoSyncService {

	declare readonly _serviceBrand: undefined;

	private readonly channel: IChannel;
	get onError(): Event<UserDataSyncError> { return Event.map(this.channel.listen<Error>('onError'), e => UserDataSyncError.toUserDataSyncError(e)); }

	constructor(
		@ISharedProcessService sharedProcessService: ISharedProcessService,
	) {
		this.channel = sharedProcessService.getChannel('userDataAutoSync');
	}

	triggerSync(sources: string[], options?: SyncOptions): Promise<void> {
		return this.channel.call('triggerSync', [sources, options]);
	}

	turnOn(): Promise<void> {
		return this.channel.call('turnOn');
	}

	turnOff(everywhere: boolean): Promise<void> {
		return this.channel.call('turnOff', [everywhere]);
	}

}

registerSingleton(IUserDataAutoSyncService, UserDataAutoSyncService, InstantiationType.Delayed);
