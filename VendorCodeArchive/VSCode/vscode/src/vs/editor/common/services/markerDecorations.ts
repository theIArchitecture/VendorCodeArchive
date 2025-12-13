/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITextModel, IModelDecoration } from '../model.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IMarker } from '../../../platform/markers/common/markers.js';
import { Event } from '../../../base/common/event.js';
import { Range } from '../core/range.js';
import { URI } from '../../../base/common/uri.js';
import { IDisposable } from '../../../base/common/lifecycle.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 14: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 16: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 16: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IMarkerDecorationsService = createDecorator<IMarkerDecorationsService>('markerDecorationsService');

export interface IMarkerDecorationsService {
	readonly _serviceBrand: undefined;

	onDidChangeMarker: Event<ITextModel>;

	getMarker(uri: URI, decoration: IModelDecoration): IMarker | null;

	getLiveMarkers(uri: URI): [Range, IMarker][];

	addMarkerSuppression(uri: URI, range: Range): IDisposable;
}
