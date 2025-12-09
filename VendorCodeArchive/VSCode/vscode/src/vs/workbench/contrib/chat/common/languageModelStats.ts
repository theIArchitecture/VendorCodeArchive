//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { Extensions, IExtensionFeaturesManagementService, IExtensionFeaturesRegistry } from '../../../services/extensionManagement/common/extensionFeatures.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { localize } from '../../../../nls.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 15: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 17: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 17: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { Codicon } from '../../../../base/common/codicons.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 28: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 30: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 30: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const ILanguageModelStatsService = createDecorator<ILanguageModelStatsService>('ILanguageModelStatsService');

export interface ILanguageModelStatsService {
	readonly _serviceBrand: undefined;

	update(model: string, extensionId: ExtensionIdentifier, agent: string | undefined, tokenCount: number | undefined): Promise<void>;
}

export class LanguageModelStatsService extends Disposable implements ILanguageModelStatsService {

	declare _serviceBrand: undefined;

	constructor(
		@IExtensionFeaturesManagementService private readonly extensionFeaturesManagementService: IExtensionFeaturesManagementService,
		@IStorageService storageService: IStorageService,
	) {
		super();
		// TODO: @sandy081 - remove this code after a while
		for (const key in storageService.keys(StorageScope.APPLICATION, StorageTarget.USER)) {
			if (key.startsWith('languageModelStats.') || key.startsWith('languageModelAccess.')) {
				storageService.remove(key, StorageScope.APPLICATION);
			}
		}
	}

	async update(model: string, extensionId: ExtensionIdentifier, agent: string | undefined, tokenCount: number | undefined): Promise<void> {
		await this.extensionFeaturesManagementService.getAccess(extensionId, CopilotUsageExtensionFeatureId);
	}

}

export const CopilotUsageExtensionFeatureId = 'copilot';
Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: CopilotUsageExtensionFeatureId,
	label: localize('Language Models', "Copilot"),
	description: localize('languageModels', "Language models usage statistics of this extension."),
	icon: Codicon.copilot,
	access: {
		canToggle: false
	},
	accessDataLabel: localize('chat', "chat"),
});
