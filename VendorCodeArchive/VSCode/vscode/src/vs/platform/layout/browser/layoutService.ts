//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDimension } from '../../../base/browser/dom.js';
import { Event } from '../../../base/common/event.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { createDecorator } from '../../instantiation/common/instantiation.js';

export const ILayoutService = createDecorator<ILayoutService>('layoutService');

export interface ILayoutOffsetInfo {

	/**
	 * Generic top offset
	 */
	readonly top: number;

	/**
	 * Quick pick specific top offset.
	 */
	readonly quickPickTop: number;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 26: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 26: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

export interface ILayoutService {

	readonly _serviceBrand: undefined;

	/**
	 * An event that is emitted when the main container is layed out.
	 */
	readonly onDidLayoutMainContainer: Event<IDimension>;

	/**
	 * An event that is emitted when any container is layed out.
	 */
	readonly onDidLayoutContainer: Event<{ readonly container: HTMLElement; readonly dimension: IDimension }>;

	/**
	 * An event that is emitted when the active container is layed out.
	 */
	readonly onDidLayoutActiveContainer: Event<IDimension>;

	/**
	 * An event that is emitted when a new container is added. This
	 * can happen in multi-window environments.
	 */
	readonly onDidAddContainer: Event<{ readonly container: HTMLElement; readonly disposables: DisposableStore }>;

	/**
	 * An event that is emitted when the active container changes.
	 */
	readonly onDidChangeActiveContainer: Event<void>;

	/**
	 * The dimensions of the main container.
	 */
	readonly mainContainerDimension: IDimension;

	/**
	 * The dimensions of the active container.
	 */
	readonly activeContainerDimension: IDimension;

	/**
	 * Main container of the application.
	 */
	readonly mainContainer: HTMLElement;

	/**
	 * Active container of the application. When multiple windows are opened, will return
	 * the container of the active, focused window.
	 */
	readonly activeContainer: HTMLElement;

	/**
	 * All the containers of the application. There can be one container per window.
	 */
	readonly containers: Iterable<HTMLElement>;

	/**
	 * Get the container for the given window.
	 */
	getContainer(window: Window): HTMLElement;

	/**
	 * Ensures that the styles for the container associated
	 * to the window have loaded. For the main window, this
	 * will resolve instantly, but for floating windows, this
	 * will resolve once the styles have been loaded and helps
	 * for when certain layout assumptions are made.
	 */
	whenContainerStylesLoaded(window: Window): Promise<void> | undefined;

	/**
	 * An offset to use for positioning elements inside the main container.
	 */
	readonly mainContainerOffset: ILayoutOffsetInfo;

	/**
	 * An offset to use for positioning elements inside the container.
	 */
	readonly activeContainerOffset: ILayoutOffsetInfo;

	/**
	 * Focus the primary component of the active container.
	 */
	focus(): void;
}
