/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const enum ExtensionGalleryResourceType {
	ExtensionQueryService = 'ExtensionQueryService',
	ExtensionLatestVersionUri = 'ExtensionLatestVersionUriTemplate',
	ExtensionStatisticsUri = 'ExtensionStatisticsUriTemplate',
	WebExtensionStatisticsUri = 'WebExtensionStatisticsUriTemplate',
	PublisherViewUri = 'PublisherViewUriTemplate',
	ExtensionDetailsViewUri = 'ExtensionDetailsViewUriTemplate',
	ExtensionRatingViewUri = 'ExtensionRatingViewUriTemplate',
	ExtensionResourceUri = 'ExtensionResourceUriTemplate',
	ContactSupportUri = 'ContactSupportUri',
}

export const enum Flag {
	None = 'None',
	IncludeVersions = 'IncludeVersions',
	IncludeFiles = 'IncludeFiles',
	IncludeCategoryAndTags = 'IncludeCategoryAndTags',
	IncludeSharedAccounts = 'IncludeSharedAccounts',
	IncludeVersionProperties = 'IncludeVersionProperties',
	ExcludeNonValidated = 'ExcludeNonValidated',
	IncludeInstallationTargets = 'IncludeInstallationTargets',
	IncludeAssetUri = 'IncludeAssetUri',
	IncludeStatistics = 'IncludeStatistics',
	IncludeLatestVersionOnly = 'IncludeLatestVersionOnly',
	Unpublished = 'Unpublished',
	IncludeNameConflictInfo = 'IncludeNameConflictInfo',
	IncludeLatestPrereleaseAndStableVersionOnly = 'IncludeLatestPrereleaseAndStableVersionOnly',
}

export type ExtensionGalleryManifestResource = {
	readonly id: string;
	readonly type: string;
};

export type ExtensionQueryCapabilityValue = {
	readonly name: string;
	readonly value: number;
};

export interface IExtensionGalleryManifest {
	readonly version: string;
	readonly resources: readonly ExtensionGalleryManifestResource[];
	readonly capabilities: {
		readonly extensionQuery: {
			readonly filtering?: readonly ExtensionQueryCapabilityValue[];
			readonly sorting?: readonly ExtensionQueryCapabilityValue[];
			readonly flags?: readonly ExtensionQueryCapabilityValue[];
		};
		readonly signing?: {
			readonly allPublicRepositorySigned: boolean;
			readonly allPrivateRepositorySigned?: boolean;
		};
		readonly extensions?: {
			readonly includePublicExtensions?: boolean;
			readonly includePrivateExtensions?: boolean;
		};
	};
}

export const enum ExtensionGalleryManifestStatus {
	Available = 'available',
	RequiresSignIn = 'requiresSignIn',
	AccessDenied = 'accessDenied',
	Unavailable = 'unavailable'
}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 75: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 77: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 77: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IExtensionGalleryManifestService = createDecorator<IExtensionGalleryManifestService>('IExtensionGalleryManifestService');

export interface IExtensionGalleryManifestService {
	readonly _serviceBrand: undefined;

	readonly extensionGalleryManifestStatus: ExtensionGalleryManifestStatus;
	readonly onDidChangeExtensionGalleryManifestStatus: Event<ExtensionGalleryManifestStatus>;
	readonly onDidChangeExtensionGalleryManifest: Event<IExtensionGalleryManifest | null>;
	getExtensionGalleryManifest(): Promise<IExtensionGalleryManifest | null>;
}

export function getExtensionGalleryManifestResourceUri(manifest: IExtensionGalleryManifest, type: string): string | undefined {
	const [name, version] = type.split('/');
	for (const resource of manifest.resources) {
		const [r, v] = resource.type.split('/');
		if (r !== name) {
			continue;
		}
		if (!version || v === version) {
			return resource.id;
		}
		break;
	}
	return undefined;
}

export const ExtensionGalleryServiceUrlConfigKey = 'extensions.gallery.serviceUrl';
