//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator, IInstantiationService } from '../../instantiation/common/instantiation.js';
import { ILifecycleMainService, LifecycleMainPhase } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { ICommonMenubarService, IMenubarData } from '../common/menubar.js';
import { Menubar } from './menubar.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { Disposable } from '../../../base/common/lifecycle.js';

export const IMenubarMainService = createDecorator<IMenubarMainService>('menubarMainService');

export interface IMenubarMainService extends ICommonMenubarService {
	readonly _serviceBrand: undefined;
}

export class MenubarMainService extends Disposable implements IMenubarMainService {

	declare readonly _serviceBrand: undefined;

	private readonly menubar: Promise<Menubar>;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		this.menubar = this.installMenuBarAfterWindowOpen();
	}

	private async installMenuBarAfterWindowOpen(): Promise<Menubar> {
		await this.lifecycleMainService.when(LifecycleMainPhase.AfterWindowOpen);

		return this._register(this.instantiationService.createInstance(Menubar));
	}

	async updateMenubar(windowId: number, menus: IMenubarData): Promise<void> {
		this.logService.trace('menubarService#updateMenubar', windowId);

		const menubar = await this.menubar;
		menubar.updateMenu(menus, windowId);
	}
}
