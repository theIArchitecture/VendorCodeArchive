/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { basename, normalize } from '../../../../../base/common/path.js';
import { URI } from '../../../../../base/common/uri.js';
import { IFormatterChangeEvent, ILabelService, ResourceLabelFormatter, Verbosity } from '../../../../../platform/label/common/label.js';
import { IWorkspace, IWorkspaceIdentifier } from '../../../../../platform/workspace/common/workspace.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 13: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 17: Error message without production error code - breaks React bundle size optimization
//   3. Line 17: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export class MockLabelService implements ILabelService {
	_serviceBrand: undefined;

	registerCachedFormatter(formatter: ResourceLabelFormatter): IDisposable {
		throw new Error('Method not implemented.');
	}
	getUriLabel(resource: URI, options?: { relative?: boolean | undefined; noPrefix?: boolean | undefined }): string {
		return normalize(resource.fsPath);
	}
	getUriBasenameLabel(resource: URI): string {
		return basename(resource.fsPath);
	}
	getWorkspaceLabel(workspace: URI | IWorkspaceIdentifier | IWorkspace, options?: { verbose: Verbosity }): string {
		return '';
	}
	getHostLabel(scheme: string, authority?: string): string {
		return '';
	}
	public getHostTooltip(): string | undefined {
		return '';
	}
	getSeparator(scheme: string, authority?: string): '/' | '\\' {
		return '/';
	}
	registerFormatter(formatter: ResourceLabelFormatter): IDisposable {
		return Disposable.None;
	}
	onDidChangeFormatters: Event<IFormatterChangeEvent> = new Emitter<IFormatterChangeEvent>().event;
}
