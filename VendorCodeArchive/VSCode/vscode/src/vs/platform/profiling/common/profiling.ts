/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { basename, isAbsolute, join } from '../../../base/common/path.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export interface IV8Profile {
	nodes: IV8ProfileNode[];
	samples?: number[];
	timeDeltas?: number[];
	startTime: number;
	endTime: number;
}

export interface IV8ProfileNode {
	id: number;
	hitCount?: number;
	children?: number[];
	callFrame: IV8CallFrame;
	deoptReason?: string;
	positionTicks?: { line: number; ticks: number }[];
}

export interface IV8CallFrame {
	url: string;
	scriptId: string;
	functionName: string;
	lineNumber: number;
	columnNumber: number;
}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 34: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 36: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 36: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IV8InspectProfilingService = createDecorator<IV8InspectProfilingService>('IV8InspectProfilingService');

export interface IV8InspectProfilingService {

	_serviceBrand: undefined;

	startProfiling(options: { host: string; port: number }): Promise<string>;

	stopProfiling(sessionId: string): Promise<IV8Profile>;
}


export namespace Utils {

	export function isValidProfile(profile: IV8Profile): profile is Required<IV8Profile> {
		return Boolean(profile.samples && profile.timeDeltas);
	}

	export function rewriteAbsolutePaths(profile: IV8Profile, replace: string = 'noAbsolutePaths') {
		for (const node of profile.nodes) {
			if (node.callFrame && node.callFrame.url) {
				if (isAbsolute(node.callFrame.url) || /^\w[\w\d+.-]*:\/\/\/?/.test(node.callFrame.url)) {
					node.callFrame.url = join(replace, basename(node.callFrame.url));
				}
			}
		}
		return profile;
	}
}
