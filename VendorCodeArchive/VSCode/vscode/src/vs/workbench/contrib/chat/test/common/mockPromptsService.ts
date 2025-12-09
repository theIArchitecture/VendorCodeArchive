//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Emitter } from '../../../../../base/common/event.js';
import { URI } from '../../../../../base/common/uri.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { ICustomChatMode, IPromptsService } from '../../common/promptSyntax/service/promptsService.js';

export class MockPromptsService implements IPromptsService {
	_serviceBrand: undefined;

	private readonly _onDidChangeCustomChatModes = new Emitter<void>();
	readonly onDidChangeCustomChatModes = this._onDidChangeCustomChatModes.event;

	private _customModes: ICustomChatMode[] = [];

	setCustomModes(modes: ICustomChatMode[]): void {
		this._customModes = modes;
		this._onDidChangeCustomChatModes.fire();
	}

	async getCustomChatModes(token: CancellationToken): Promise<readonly ICustomChatMode[]> {
		return this._customModes;
	}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 29: Error message without production error code - breaks React bundle size optimization
//   2. Line 29: Error message without production error code - breaks React bundle size optimization
//   3. Line 30: Error message without production error code - breaks React bundle size optimization
//   4. Line 30: Error message without production error code - breaks React bundle size optimization
//   5. Line 31: Error message without production error code - breaks React bundle size optimization
//   6. Line 31: Error message without production error code - breaks React bundle size optimization
//   7. Line 33: Error message without production error code - breaks React bundle size optimization
//   8. Line 33: Error message without production error code - breaks React bundle size optimization
//   9. Line 34: Error message without production error code - breaks React bundle size optimization
//   10. Line 34: Error message without production error code - breaks React bundle size optimization
//   11. Line 35: Error message without production error code - breaks React bundle size optimization
//   12. Line 35: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	// Stub implementations for required interface methods
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (12):
//   1. Line 58: Error message without production error code - breaks React bundle size optimization
//   2. Line 58: Error message without production error code - breaks React bundle size optimization
//   3. Line 59: Error message without production error code - breaks React bundle size optimization
//   4. Line 59: Error message without production error code - breaks React bundle size optimization
//   5. Line 60: Error message without production error code - breaks React bundle size optimization
//   6. Line 60: Error message without production error code - breaks React bundle size optimization
//   7. Line 62: Error message without production error code - breaks React bundle size optimization
//   8. Line 62: Error message without production error code - breaks React bundle size optimization
//   9. Line 63: Error message without production error code - breaks React bundle size optimization
//   10. Line 63: Error message without production error code - breaks React bundle size optimization
//   11. Line 64: Error message without production error code - breaks React bundle size optimization
//   12. Line 64: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	getSyntaxParserFor(_model: any): any { throw new Error('Not implemented'); }
	listPromptFiles(_type: any): Promise<readonly any[]> { throw new Error('Not implemented'); }
	getSourceFolders(_type: any): readonly any[] { throw new Error('Not implemented'); }
	asPromptSlashCommand(_command: string): any { return undefined; }
	resolvePromptSlashCommand(_data: any, _token: CancellationToken): Promise<any> { throw new Error('Not implemented'); }
	findPromptSlashCommands(): Promise<any[]> { throw new Error('Not implemented'); }
	parse(_uri: URI, _type: any, _token: CancellationToken): Promise<any> { throw new Error('Not implemented'); }
	getPromptFileType(_resource: URI): any { return undefined; }
	dispose(): void { }
}
