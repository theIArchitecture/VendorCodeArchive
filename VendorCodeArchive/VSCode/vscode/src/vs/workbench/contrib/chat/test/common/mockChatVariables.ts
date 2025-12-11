//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IChatVariablesService, IDynamicVariable } from '../../common/chatVariables.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { IToolData, ToolSet } from '../../common/languageModelToolsService.js';

export class MockChatVariablesService implements IChatVariablesService {
	_serviceBrand: undefined;

	getDynamicVariables(sessionId: string): readonly IDynamicVariable[] {
		return [];
	}

	getSelectedTools(sessionId: string): readonly IToolData[] {
		return [];
	}

	getSelectedToolSets(sessionId: string): readonly ToolSet[] {
		return [];
	}
}
