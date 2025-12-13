/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IProgressIndicator } from '../../../../platform/progress/common/progress.js';
import { IPaneComposite } from '../../../common/panecomposite.js';
import { IView, IViewDescriptor, IViewPaneContainer, ViewContainer, ViewContainerLocation } from '../../../common/views.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 12: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 13: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 13: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IViewsService = createDecorator<IViewsService>('viewsService');
export interface IViewsService {

	readonly _serviceBrand: undefined;

	// View Container APIs
	readonly onDidChangeViewContainerVisibility: Event<{ id: string; visible: boolean; location: ViewContainerLocation }>;
	isViewContainerVisible(id: string): boolean;
	isViewContainerActive(id: string): boolean;
	openViewContainer(id: string, focus?: boolean): Promise<IPaneComposite | null>;
	closeViewContainer(id: string): void;
	getVisibleViewContainer(location: ViewContainerLocation): ViewContainer | null;
	getActiveViewPaneContainerWithId(viewContainerId: string): IViewPaneContainer | null;
	getFocusedView(): IViewDescriptor | null;
	getFocusedViewName(): string;

	// View APIs
	readonly onDidChangeViewVisibility: Event<{ id: string; visible: boolean }>;
	readonly onDidChangeFocusedView: Event<void>;
	isViewVisible(id: string): boolean;
	openView<T extends IView>(id: string, focus?: boolean): Promise<T | null>;
	closeView(id: string): void;
	getActiveViewWithId<T extends IView>(id: string): T | null;
	getViewWithId<T extends IView>(id: string): T | null;
	getViewProgressIndicator(id: string): IProgressIndicator | undefined;
}
