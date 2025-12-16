/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkspacesService } from '../../../../platform/workspaces/common/workspaces.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ProxyChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';

// @ts-ignore: interface is implemented via proxy
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export class NativeWorkspacesService implements IWorkspacesService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IMainProcessService mainProcessService: IMainProcessService,
		@INativeHostService nativeHostService: INativeHostService
	) {
		return ProxyChannel.toService<IWorkspacesService>(mainProcessService.getChannel('workspaces'), { context: nativeHostService.windowId });
	}
}

registerSingleton(IWorkspacesService, NativeWorkspacesService, InstantiationType.Delayed);
