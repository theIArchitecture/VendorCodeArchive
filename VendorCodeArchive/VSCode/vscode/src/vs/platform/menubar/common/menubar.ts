//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 8: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 8: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { URI } from '../../../base/common/uri.js';

export interface ICommonMenubarService {
	updateMenubar(windowId: number, menuData: IMenubarData): Promise<void>;
}

export interface IMenubarData {
	menus: { [id: string]: IMenubarMenu };
	keybindings: { [id: string]: IMenubarKeybinding };
}

export interface IMenubarMenu {
	items: Array<MenubarMenuItem>;
}

export interface IMenubarKeybinding {
	label: string;
	userSettingsLabel?: string;
	isNative?: boolean; // Assumed true if missing
}

export interface IMenubarMenuItemAction {
	id: string;
	label: string;
	checked?: boolean; // Assumed false if missing
	enabled?: boolean; // Assumed true if missing
}

export interface IMenubarMenuRecentItemAction {
	id: string;
	label: string;
	uri: URI;
	remoteAuthority?: string;
	enabled?: boolean;
}

export interface IMenubarMenuItemSubmenu {
	id: string;
	label: string;
	submenu: IMenubarMenu;
}

export interface IMenubarMenuItemSeparator {
	id: 'vscode.menubar.separator';
}

export type MenubarMenuItem = IMenubarMenuItemAction | IMenubarMenuItemSubmenu | IMenubarMenuItemSeparator | IMenubarMenuRecentItemAction;

export function isMenubarMenuItemSubmenu(menuItem: MenubarMenuItem): menuItem is IMenubarMenuItemSubmenu {
	return (<IMenubarMenuItemSubmenu>menuItem).submenu !== undefined;
}

export function isMenubarMenuItemSeparator(menuItem: MenubarMenuItem): menuItem is IMenubarMenuItemSeparator {
	return (<IMenubarMenuItemSeparator>menuItem).id === 'vscode.menubar.separator';
}

export function isMenubarMenuItemRecentAction(menuItem: MenubarMenuItem): menuItem is IMenubarMenuRecentItemAction {
	return (<IMenubarMenuRecentItemAction>menuItem).uri !== undefined;
}

export function isMenubarMenuItemAction(menuItem: MenubarMenuItem): menuItem is IMenubarMenuItemAction {
	return !isMenubarMenuItemSubmenu(menuItem) && !isMenubarMenuItemSeparator(menuItem) && !isMenubarMenuItemRecentAction(menuItem);
}
