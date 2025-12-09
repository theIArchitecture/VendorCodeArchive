//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IAuxiliaryTitlebarPart, ITitlebarPart } from '../../../browser/parts/titlebar/titlebarPart.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { IEditorGroupsContainer } from '../../editor/common/editorGroupsService.js';

export const ITitleService = createDecorator<ITitleService>('titleService');

export interface ITitleService extends ITitlebarPart {

	readonly _serviceBrand: undefined;

	/**
	 * Get the status bar part that is rooted in the provided container.
	 */
	getPart(container: HTMLElement): ITitlebarPart;

	/**
	 * Creates a new auxililary title bar part in the provided container.
	 */
	createAuxiliaryTitlebarPart(container: HTMLElement, editorGroupsContainer: IEditorGroupsContainer, instantiationService: IInstantiationService): IAuxiliaryTitlebarPart;
}
