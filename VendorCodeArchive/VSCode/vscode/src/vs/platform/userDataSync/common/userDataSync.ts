//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../base/common/arrays.js';
import { VSBufferReadableStream } from '../../../base/common/buffer.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { Event } from '../../../base/common/event.js';
import { FormattingOptions } from '../../../base/common/jsonFormatter.js';
import { IJSONSchema } from '../../../base/common/jsonSchema.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { IExtUri } from '../../../base/common/resources.js';
import { isObject, isString } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { IHeaders } from '../../../base/parts/request/common/request.js';
import { localize } from '../../../nls.js';
import { allSettings, ConfigurationScope, Extensions as ConfigurationExtensions, IConfigurationRegistry, IRegisteredConfigurationPropertySchema, getAllConfigurationProperties, parseScope } from '../../configuration/common/configurationRegistry.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { EXTENSION_IDENTIFIER_PATTERN, IExtensionIdentifier } from '../../extensionManagement/common/extensionManagement.js';
import { IExtensionManifest } from '../../extensions/common/extensions.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { Extensions as JSONExtensions, IJSONContributionRegistry } from '../../jsonschemas/common/jsonContributionRegistry.js';
import { ILogService } from '../../log/common/log.js';
import { Registry } from '../../registry/common/platform.js';
import { IUserDataProfile, UseDefaultProfileFlags } from '../../userDataProfile/common/userDataProfile.js';
import { IUserDataSyncMachine } from './userDataSyncMachines.js';

export function getDisallowedIgnoredSettings(): string[] {
	const allSettings = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).getConfigurationProperties();
	return Object.keys(allSettings).filter(setting => !!allSettings[setting].disallowSyncIgnore);
}

export function getDefaultIgnoredSettings(excludeExtensions: boolean = false): string[] {
	const allSettings = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).getConfigurationProperties();
	const ignoredSettings = getIgnoredSettings(allSettings, excludeExtensions);
	const disallowedSettings = getDisallowedIgnoredSettings();
	return distinct([...ignoredSettings, ...disallowedSettings]);
}

export function getIgnoredSettingsForExtension(manifest: IExtensionManifest): string[] {
	if (!manifest.contributes?.configuration) {
		return [];
	}
	const configurations = Array.isArray(manifest.contributes.configuration) ? manifest.contributes.configuration : [manifest.contributes.configuration];
	if (!configurations.length) {
		return [];
	}
	const properties = getAllConfigurationProperties(configurations);
	return getIgnoredSettings(properties, false);
}

function getIgnoredSettings(properties: IStringDictionary<IRegisteredConfigurationPropertySchema>, excludeExtensions: boolean): string[] {
	const ignoredSettings = new Set<string>();
	for (const key in properties) {
		if (excludeExtensions && !!properties[key].source) {
			continue;
		}
		const scope = isString(properties[key].scope) ? parseScope(properties[key].scope) : properties[key].scope;
		if (properties[key].ignoreSync
			|| scope === ConfigurationScope.MACHINE
			|| scope === ConfigurationScope.MACHINE_OVERRIDABLE
		) {
			ignoredSettings.add(key);
		}
	}
	return [...ignoredSettings.values()];
}

export const USER_DATA_SYNC_CONFIGURATION_SCOPE = 'settingsSync';

export interface IUserDataSyncConfiguration {
	keybindingsPerPlatform?: boolean;
	ignoredExtensions?: string[];
	ignoredSettings?: string[];
}

export const CONFIG_SYNC_KEYBINDINGS_PER_PLATFORM = 'settingsSync.keybindingsPerPlatform';

export function registerConfiguration(): IDisposable {
	const ignoredSettingsSchemaId = 'vscode://schemas/ignoredSettings';
	const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
	configurationRegistry.registerConfiguration({
		id: 'settingsSync',
		order: 30,
		title: localize('settings sync', "Settings Sync"),
		type: 'object',
		properties: {
			[CONFIG_SYNC_KEYBINDINGS_PER_PLATFORM]: {
				type: 'boolean',
				description: localize('settingsSync.keybindingsPerPlatform', "Synchronize keybindings for each platform."),
				default: true,
				scope: ConfigurationScope.APPLICATION,
				tags: ['sync', 'usesOnlineServices']
			},
			'settingsSync.ignoredExtensions': {
				'type': 'array',
				markdownDescription: localize('settingsSync.ignoredExtensions', "List of extensions to be ignored while synchronizing. The identifier of an extension is always `${publisher}.${name}`. For example: `vscode.csharp`."),
				items: [{
					type: 'string',
					pattern: EXTENSION_IDENTIFIER_PATTERN,
					errorMessage: localize('app.extension.identifier.errorMessage', "Expected format '${publisher}.${name}'. Example: 'vscode.csharp'.")
				}],
				'default': [],
				'scope': ConfigurationScope.APPLICATION,
				uniqueItems: true,
				disallowSyncIgnore: true,
				tags: ['sync', 'usesOnlineServices']
			},
			'settingsSync.ignoredSettings': {
				'type': 'array',
				description: localize('settingsSync.ignoredSettings', "Configure settings to be ignored while synchronizing."),
				'default': [],
				'scope': ConfigurationScope.APPLICATION,
				$ref: ignoredSettingsSchemaId,
				additionalProperties: true,
				uniqueItems: true,
				disallowSyncIgnore: true,
				tags: ['sync', 'usesOnlineServices']
			}
		}
	});
	const jsonRegistry = Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);
	const registerIgnoredSettingsSchema = () => {
		const disallowedIgnoredSettings = getDisallowedIgnoredSettings();
		const defaultIgnoredSettings = getDefaultIgnoredSettings();
		const settings = Object.keys(allSettings.properties).filter(setting => !defaultIgnoredSettings.includes(setting));
		const ignoredSettings = defaultIgnoredSettings.filter(setting => !disallowedIgnoredSettings.includes(setting));
		const ignoredSettingsSchema: IJSONSchema = {
			items: {
				type: 'string',
				enum: [...settings, ...ignoredSettings.map(setting => `-${setting}`)]
			},
		};
		jsonRegistry.registerSchema(ignoredSettingsSchemaId, ignoredSettingsSchema);
	};
	return configurationRegistry.onDidUpdateConfiguration(() => registerIgnoredSettingsSchema());
}

// #region User Data Sync Store

export const NON_EXISTING_RESOURCE_REF = '0';

export interface IUserData {
	ref: string;
	content: string | null;
}

export type IAuthenticationProvider = { id: string; scopes: string[] };

export interface IUserDataSyncStore {
	readonly url: URI;
	readonly type: UserDataSyncStoreType;
	readonly defaultUrl: URI;
	readonly stableUrl: URI;
	readonly insidersUrl: URI;
	readonly canSwitch: boolean;
	readonly authenticationProviders: IAuthenticationProvider[];
}

export function isAuthenticationProvider(thing: any): thing is IAuthenticationProvider {
	return thing
		&& isObject(thing)
		&& isString(thing.id)
		&& Array.isArray(thing.scopes);
}

export const enum SyncResource {
	Settings = 'settings',
	Keybindings = 'keybindings',
	Snippets = 'snippets',
	Prompts = 'prompts',
	Tasks = 'tasks',
	Mcp = 'mcp',
	Extensions = 'extensions',
	GlobalState = 'globalState',
	Profiles = 'profiles',
	WorkspaceState = 'workspaceState',
}
export const ALL_SYNC_RESOURCES: SyncResource[] = [SyncResource.Settings, SyncResource.Keybindings, SyncResource.Snippets, SyncResource.Prompts, SyncResource.Tasks, SyncResource.Extensions, SyncResource.GlobalState, SyncResource.Profiles, SyncResource.Mcp];

export function getPathSegments(collection: string | undefined, ...paths: string[]): string[] {
	return collection ? [collection, ...paths] : paths;
}

export function getLastSyncResourceUri(collection: string | undefined, syncResource: SyncResource, environmentService: IEnvironmentService, extUri: IExtUri): URI {
	return extUri.joinPath(environmentService.userDataSyncHome, ...getPathSegments(collection, syncResource, `lastSync${syncResource}.json`));
}

export type IUserDataResourceManifest = Record<ServerResource, string>;

export interface IUserDataCollectionManifest {
	[collectionId: string]: {
		readonly latest?: IUserDataResourceManifest;
	};
}

export interface IUserDataManifest {
	readonly latest?: IUserDataResourceManifest;
	readonly session: string;
	readonly ref: string;
	readonly collections?: IUserDataCollectionManifest;
}

export function isUserDataManifest(thing: any): thing is IUserDataManifest {
	return thing
		&& isString(thing.session)
		&& isString(thing.ref)
		&& (isObject(thing.latest) || thing.latest === undefined)
		&& (isObject(thing.collections) || thing.collections === undefined);
}

export interface IUserDataSyncActivityData {
	resources?: {
		[resourceId: string]: { created: number; content: string }[];
	};
	collections?: {
		[collectionId: string]: {
			resources?: {
				[resourceId: string]: { created: number; content: string }[];
			} | undefined;
		};
	};
}

export interface IUserDataSyncLatestData {
	resources?: IStringDictionary<IUserData>;
	collections?: {
		[collectionId: string]: {
			resources?: IStringDictionary<IUserData>;
		};
	};
}

export interface IResourceRefHandle {
	ref: string;
	created: number;
}

export type ServerResource = SyncResource | 'machines' | 'editSessions' | 'workspaceState';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 243: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 244: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 244: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 252: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 253: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 253: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export type UserDataSyncStoreType = 'insiders' | 'stable';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 259: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 260: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 260: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 268: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 269: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 269: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 273: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 274: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 274: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 282: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 283: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 283: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 287: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 288: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 288: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 296: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 297: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 297: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 301: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 302: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 302: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 310: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 311: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 311: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 315: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 316: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 316: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 324: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 325: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 325: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 329: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 330: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 330: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 338: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 339: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 339: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 343: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 344: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 344: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 352: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 353: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 353: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 357: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 358: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 358: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 366: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 367: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 367: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 371: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 372: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 372: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 380: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 381: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 381: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 385: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 386: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 386: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 394: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 395: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 395: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 399: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 400: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 400: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 408: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 409: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 409: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 413: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 414: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 414: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 422: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 423: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 423: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 427: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 428: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 428: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 436: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 437: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 437: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 441: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 442: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 442: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 450: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 451: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 451: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 455: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 456: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 456: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 464: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 465: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 465: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 469: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 470: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 470: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 478: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 479: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 479: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 483: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 484: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 484: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 492: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 493: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 493: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 497: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 498: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 498: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 506: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 507: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 507: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 511: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 512: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 512: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 520: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 521: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 521: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 525: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 526: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 526: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 534: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 535: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 535: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 539: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 540: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 540: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 548: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 549: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 549: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 553: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 554: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 554: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 562: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 563: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 563: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 567: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 568: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 568: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 576: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 577: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 577: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 581: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 582: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 582: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 590: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 591: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 591: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 595: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 596: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 596: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 604: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 605: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 605: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 609: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 610: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 610: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 618: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 619: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 619: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 623: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 624: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 624: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 632: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 633: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 633: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 637: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 638: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 638: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 646: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 647: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 647: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IUserDataSyncStoreManagementService = createDecorator<IUserDataSyncStoreManagementService>('IUserDataSyncStoreManagementService');
export interface IUserDataSyncStoreManagementService {
	readonly _serviceBrand: undefined;
	readonly onDidChangeUserDataSyncStore: Event<void>;
	readonly userDataSyncStore: IUserDataSyncStore | undefined;
	switch(type: UserDataSyncStoreType): Promise<void>;
	getPreviousUserDataSyncStore(): Promise<IUserDataSyncStore | undefined>;
}

export const IUserDataSyncStoreService = createDecorator<IUserDataSyncStoreService>('IUserDataSyncStoreService');
export interface IUserDataSyncStoreService {
	readonly _serviceBrand: undefined;
	readonly onDidChangeDonotMakeRequestsUntil: Event<void>;
	readonly donotMakeRequestsUntil: Date | undefined;

	readonly onTokenFailed: Event<UserDataSyncErrorCode>;
	readonly onTokenSucceed: Event<void>;
	setAuthToken(token: string, type: string): void;

	manifest(oldValue: IUserDataManifest | null, headers?: IHeaders): Promise<IUserDataManifest | null>;
	readResource(resource: ServerResource, oldValue: IUserData | null, collection?: string, headers?: IHeaders): Promise<IUserData>;
	writeResource(resource: ServerResource, content: string, ref: string | null, collection?: string, headers?: IHeaders): Promise<string>;
	deleteResource(resource: ServerResource, ref: string | null, collection?: string): Promise<void>;
	getAllResourceRefs(resource: ServerResource, collection?: string): Promise<IResourceRefHandle[]>;
	resolveResourceContent(resource: ServerResource, ref: string, collection?: string, headers?: IHeaders): Promise<string | null>;

	getAllCollections(headers?: IHeaders): Promise<string[]>;
	createCollection(headers?: IHeaders): Promise<string>;
	deleteCollection(collection?: string, headers?: IHeaders): Promise<void>;

	getLatestData(headers?: IHeaders): Promise<IUserDataSyncLatestData | null>;
	getActivityData(): Promise<VSBufferReadableStream>;

	clear(): Promise<void>;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 279: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 280: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 280: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 306: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 307: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 307: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 331: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 332: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 332: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 356: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 357: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 357: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 381: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 382: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 382: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 406: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 407: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 407: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 431: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 432: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 432: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 456: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 457: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 457: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 481: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 482: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 482: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 506: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 507: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 507: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 531: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 532: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 532: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 556: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 557: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 557: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 581: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 582: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 582: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 606: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 607: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 607: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 631: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 632: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 632: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 656: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 657: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 657: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 681: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 682: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 682: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 706: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 707: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 707: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 731: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 732: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 732: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 756: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 757: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 757: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 781: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 782: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 782: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 806: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 807: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 807: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 831: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 832: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 832: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 856: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 857: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 857: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 881: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 882: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 882: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 906: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 907: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 907: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 931: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 932: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 932: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 956: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 957: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 957: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 981: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 982: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 982: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IUserDataSyncLocalStoreService = createDecorator<IUserDataSyncLocalStoreService>('IUserDataSyncLocalStoreService');
export interface IUserDataSyncLocalStoreService {
	readonly _serviceBrand: undefined;
	writeResource(resource: ServerResource, content: string, cTime: Date, collection?: string, root?: URI): Promise<void>;
	getAllResourceRefs(resource: ServerResource, collection?: string, root?: URI): Promise<IResourceRefHandle[]>;
	resolveResourceContent(resource: ServerResource, ref: string, collection?: string, root?: URI): Promise<string | null>;
}

//#endregion

// #region User Data Sync Headers

export const HEADER_OPERATION_ID = 'x-operation-id';
export const HEADER_EXECUTION_ID = 'X-Execution-Id';

export function createSyncHeaders(executionId: string): IHeaders {
	const headers: IHeaders = {};
	headers[HEADER_EXECUTION_ID] = executionId;
	return headers;
}

//#endregion

// #region User Data Sync Error

export const enum UserDataSyncErrorCode {
	// Client Errors (>= 400 )
	Unauthorized = 'Unauthorized', /* 401 */
	Forbidden = 'Forbidden', /* 403 */
	NotFound = 'NotFound', /* 404 */
	MethodNotFound = 'MethodNotFound', /* 405 */
	Conflict = 'Conflict', /* 409 */
	Gone = 'Gone', /* 410 */
	PreconditionFailed = 'PreconditionFailed', /* 412 */
	TooLarge = 'TooLarge', /* 413 */
	UpgradeRequired = 'UpgradeRequired', /* 426 */
	PreconditionRequired = 'PreconditionRequired', /* 428 */
	TooManyRequests = 'RemoteTooManyRequests', /* 429 */
	TooManyRequestsAndRetryAfter = 'TooManyRequestsAndRetryAfter', /* 429 + Retry-After */

	// Local Errors
	RequestFailed = 'RequestFailed',
	RequestCanceled = 'RequestCanceled',
	RequestTimeout = 'RequestTimeout',
	RequestProtocolNotSupported = 'RequestProtocolNotSupported',
	RequestPathNotEscaped = 'RequestPathNotEscaped',
	RequestHeadersNotObject = 'RequestHeadersNotObject',
	NoCollection = 'NoCollection',
	NoRef = 'NoRef',
	EmptyResponse = 'EmptyResponse',
	TurnedOff = 'TurnedOff',
	SessionExpired = 'SessionExpired',
	ServiceChanged = 'ServiceChanged',
	DefaultServiceChanged = 'DefaultServiceChanged',
	LocalTooManyProfiles = 'LocalTooManyProfiles',
	LocalTooManyRequests = 'LocalTooManyRequests',
	LocalPreconditionFailed = 'LocalPreconditionFailed',
	LocalInvalidContent = 'LocalInvalidContent',
	LocalError = 'LocalError',
	IncompatibleLocalContent = 'IncompatibleLocalContent',
	IncompatibleRemoteContent = 'IncompatibleRemoteContent',

	Unknown = 'Unknown',
}

export class UserDataSyncError extends Error {

	constructor(
		message: string,
		readonly code: UserDataSyncErrorCode,
		readonly resource?: SyncResource,
		readonly operationId?: string
	) {
		super(message);
		this.name = `${this.code} (UserDataSyncError) syncResource:${this.resource || 'unknown'} operationId:${this.operationId || 'unknown'}`;
	}

}

export class UserDataSyncStoreError extends UserDataSyncError {
	constructor(message: string, readonly url: string, code: UserDataSyncErrorCode, readonly serverCode: number | undefined, operationId: string | undefined) {
		super(message, code, undefined, operationId);
	}
}

export class UserDataAutoSyncError extends UserDataSyncError {
	constructor(message: string, code: UserDataSyncErrorCode) {
		super(message, code);
	}
}

export namespace UserDataSyncError {

	export function toUserDataSyncError(error: Error): UserDataSyncError {
		if (error instanceof UserDataSyncError) {
			return error;
		}
		const match = /^(.+) \(UserDataSyncError\) syncResource:(.+) operationId:(.+)$/.exec(error.name);
		if (match && match[1]) {
			const syncResource = match[2] === 'unknown' ? undefined : match[2] as SyncResource;
			const operationId = match[3] === 'unknown' ? undefined : match[3];
			return new UserDataSyncError(error.message, <UserDataSyncErrorCode>match[1], syncResource, operationId);
		}
		return new UserDataSyncError(error.message, UserDataSyncErrorCode.Unknown);
	}

}

//#endregion

// #region User Data Synchroniser

export interface ISyncUserDataProfile {
	readonly id: string;
	readonly collection: string;
	readonly name: string;
	readonly icon?: string;
	readonly useDefaultFlags?: UseDefaultProfileFlags;
}

export type ISyncExtension = ILocalSyncExtension | IRemoteSyncExtension;

export interface ILocalSyncExtension {
	identifier: IExtensionIdentifier;
	pinned: boolean;
	version: string;
	preRelease: boolean;
	disabled?: boolean;
	installed?: boolean;
	isApplicationScoped?: boolean;
	state?: IStringDictionary<any>;
}

export interface IRemoteSyncExtension {
	identifier: IExtensionIdentifier;
	version: string;
	pinned?: boolean;
	preRelease?: boolean;
	disabled?: boolean;
	installed?: boolean;
	isApplicationScoped?: boolean;
	state?: IStringDictionary<any>;
}

export interface IStorageValue {
	version: number;
	value: string;
}

export interface IGlobalState {
	storage: IStringDictionary<IStorageValue>;
}

export interface IWorkspaceState {
	folders: IWorkspaceStateFolder[];
	storage: IStringDictionary<string>;
	version: number;
}

export interface IWorkspaceStateFolder {
	resourceUri: string;
	workspaceFolderIdentity: string;
}

export const enum SyncStatus {
	Uninitialized = 'uninitialized',
	Idle = 'idle',
	Syncing = 'syncing',
	HasConflicts = 'hasConflicts',
}

export interface ISyncResourceHandle {
	created: number;
	uri: URI;
}

export interface IRemoteUserData {
	ref: string;
	syncData: ISyncData | null;
}

export interface ISyncData {
	version: number;
	machineId?: string;
	content: string;
}

export const enum Change {
	None,
	Added,
	Modified,
	Deleted,
}

export const enum MergeState {
	Preview = 'preview',
	Conflict = 'conflict',
	Accepted = 'accepted',
}

export interface IResourcePreview {
	readonly baseResource: URI;
	readonly remoteResource: URI;
	readonly localResource: URI;
	readonly previewResource: URI;
	readonly acceptedResource: URI;
	readonly localChange: Change;
	readonly remoteChange: Change;
	readonly mergeState: MergeState;
}

export interface IUserDataSyncResource {
	readonly syncResource: SyncResource;
	readonly profile: IUserDataProfile;
}

export interface IUserDataSyncResourceConflicts extends IUserDataSyncResource {
	readonly conflicts: IResourcePreview[];
}

export interface IUserDataSyncResourcePreview extends IUserDataSyncResource {
	readonly isLastSyncFromCurrentMachine: boolean;
	readonly resourcePreviews: IResourcePreview[];
}

export interface IUserDataSyncResourceError extends IUserDataSyncResource {
	readonly error: UserDataSyncError;
}

export interface IUserDataSyncResourceInitializer {
	initialize(userData: IUserData): Promise<void>;
}

export interface IUserDataSynchroniser {

	readonly resource: SyncResource;
	readonly status: SyncStatus;
	readonly onDidChangeStatus: Event<SyncStatus>;

	readonly conflicts: IUserDataSyncResourceConflicts;
	readonly onDidChangeConflicts: Event<IUserDataSyncResourceConflicts>;

	readonly onDidChangeLocal: Event<void>;

	sync(refOrUserData: string | IUserData | null, preview: boolean, userDataSyncConfiguration: IUserDataSyncConfiguration, headers: IHeaders): Promise<IUserDataSyncResourcePreview | null>;
	accept(resource: URI, content?: string | null): Promise<IUserDataSyncResourcePreview | null>;
	apply(force: boolean, headers: IHeaders): Promise<IUserDataSyncResourcePreview | null>;
	stop(): Promise<void>;

	hasPreviouslySynced(): Promise<boolean>;
	hasLocalData(): Promise<boolean>;
	resetLocal(): Promise<void>;

	resolveContent(resource: URI): Promise<string | null>;
	replace(content: string): Promise<boolean>;
}

//#endregion

// #region keys synced only in web

export const SYNC_SERVICE_URL_TYPE = 'sync.store.url.type';
export function getEnablementKey(resource: SyncResource) { return `sync.enable.${resource}`; }

// #endregion
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 546: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 547: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 547: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding


// #region User Data Sync Services
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 584: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 585: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 585: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 620: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 621: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 621: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 656: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 657: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 657: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 692: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 693: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 693: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 728: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 729: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 729: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 764: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 765: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 765: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 800: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 801: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 801: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 836: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 837: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 837: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 872: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 873: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 873: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 908: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 909: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 909: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 944: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 945: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 945: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 980: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 981: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 981: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1016: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1017: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1017: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1052: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1053: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1053: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1088: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1089: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1089: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1124: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1125: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1125: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1160: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1161: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1161: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1196: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1197: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1197: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1232: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1233: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1233: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1268: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1269: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1269: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1304: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1305: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1305: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1340: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1341: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1341: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1376: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1377: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1377: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1412: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1413: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1413: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1448: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1449: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1449: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1484: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1485: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1485: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1520: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1521: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1521: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1556: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1557: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1557: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IUserDataSyncEnablementService = createDecorator<IUserDataSyncEnablementService>('IUserDataSyncEnablementService');
export interface IUserDataSyncEnablementService {
	_serviceBrand: any;

	readonly onDidChangeEnablement: Event<boolean>;
	isEnabled(): boolean;
	canToggleEnablement(): boolean;
	setEnablement(enabled: boolean): void;

	readonly onDidChangeResourceEnablement: Event<[SyncResource, boolean]>;
	isResourceEnabled(resource: SyncResource, defaultValue?: boolean): boolean;
	setResourceEnablement(resource: SyncResource, enabled: boolean): void;

	getResourceSyncStateVersion(resource: SyncResource): string | undefined;

	/**
	 * Checks if resource enabled was explicitly configured before,
	 * ignoring its default enablement value used in {@link isResourceEnabled}.
	 */
	isResourceEnablementConfigured(resource: SyncResource): boolean;
}

export interface IUserDataSyncTask {
	readonly manifest: IUserDataManifest | null;
	run(): Promise<void>;
	stop(): Promise<void>;
}

export interface IUserDataManualSyncTask {
	readonly id: string;
	merge(): Promise<void>;
	apply(): Promise<void>;
	stop(): Promise<void>;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 581: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 582: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 582: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 630: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 631: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 631: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 677: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 678: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 678: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 724: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 725: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 725: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 771: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 772: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 772: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 818: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 819: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 819: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 865: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 866: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 866: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 912: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 913: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 913: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 959: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 960: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 960: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1006: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1007: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1007: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1053: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1054: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1054: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1100: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1101: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1101: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1147: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1148: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1148: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1194: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1195: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1195: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1241: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1242: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1242: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1288: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1289: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1289: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1335: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1336: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1336: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1382: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1383: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1383: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1429: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1430: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1430: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1476: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1477: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1477: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1523: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1524: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1524: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1570: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1571: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1571: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1617: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1618: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1618: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1664: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1665: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1665: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1711: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1712: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1712: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1758: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1759: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1759: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1805: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1806: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1806: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1852: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1853: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1853: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1899: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1900: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1900: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IUserDataSyncService = createDecorator<IUserDataSyncService>('IUserDataSyncService');
export interface IUserDataSyncService {
	_serviceBrand: any;

	readonly status: SyncStatus;
	readonly onDidChangeStatus: Event<SyncStatus>;

	readonly conflicts: IUserDataSyncResourceConflicts[];
	readonly onDidChangeConflicts: Event<IUserDataSyncResourceConflicts[]>;

	readonly onDidChangeLocal: Event<SyncResource>;
	readonly onSyncErrors: Event<IUserDataSyncResourceError[]>;

	readonly lastSyncTime: number | undefined;
	readonly onDidChangeLastSyncTime: Event<number>;

	readonly onDidResetRemote: Event<void>;
	readonly onDidResetLocal: Event<void>;

	createSyncTask(manifest: IUserDataManifest | null, disableCache?: boolean): Promise<IUserDataSyncTask>;
	createManualSyncTask(): Promise<IUserDataManualSyncTask>;
	resolveContent(resource: URI): Promise<string | null>;
	accept(syncResource: IUserDataSyncResource, resource: URI, content: string | null | undefined, apply: boolean | { force: boolean }): Promise<void>;

	reset(): Promise<void>;
	resetRemote(): Promise<void>;
	cleanUpRemoteData(): Promise<void>;
	resetLocal(): Promise<void>;
	hasLocalData(): Promise<boolean>;
	hasPreviouslySynced(): Promise<boolean>;

	replace(syncResourceHandle: ISyncResourceHandle): Promise<void>;

	saveRemoteActivityData(location: URI): Promise<void>;
	extractActivityData(activityDataResource: URI, location: URI): Promise<void>;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 618: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 619: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 619: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 678: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 679: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 679: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 736: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 737: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 737: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 794: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 795: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 795: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 852: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 853: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 853: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 910: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 911: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 911: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 968: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 969: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 969: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1026: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1027: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1027: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1084: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1085: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1085: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1142: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1143: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1143: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1200: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1201: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1201: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1258: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1259: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1259: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1316: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1317: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1317: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1374: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1375: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1375: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1432: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1433: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1433: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1490: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1491: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1491: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1548: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1549: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1549: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1606: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1607: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1607: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1664: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1665: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1665: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1722: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1723: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1723: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1780: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1781: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1781: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1838: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1839: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1839: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1896: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1897: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1897: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1954: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1955: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1955: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2012: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 2013: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 2013: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2070: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 2071: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 2071: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2128: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 2129: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 2129: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2186: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 2187: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 2187: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 2244: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 2245: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 2245: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IUserDataSyncResourceProviderService = createDecorator<IUserDataSyncResourceProviderService>('IUserDataSyncResourceProviderService');
export interface IUserDataSyncResourceProviderService {
	_serviceBrand: any;
	getRemoteSyncedProfiles(): Promise<ISyncUserDataProfile[]>;
	getLocalSyncedProfiles(location?: URI): Promise<ISyncUserDataProfile[]>;
	getRemoteSyncResourceHandles(syncResource: SyncResource, profile?: ISyncUserDataProfile): Promise<ISyncResourceHandle[]>;
	getLocalSyncResourceHandles(syncResource: SyncResource, profile?: ISyncUserDataProfile, location?: URI): Promise<ISyncResourceHandle[]>;
	getAssociatedResources(syncResourceHandle: ISyncResourceHandle): Promise<{ resource: URI; comparableResource: URI }[]>;
	getMachineId(syncResourceHandle: ISyncResourceHandle): Promise<string | undefined>;
	getLocalSyncedMachines(location?: URI): Promise<IUserDataSyncMachine[]>;
	resolveContent(resource: URI): Promise<string | null>;
	resolveUserDataSyncResource(syncResourceHandle: ISyncResourceHandle): IUserDataSyncResource | undefined;
}

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 634: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 635: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 635: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 643: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 644: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 644: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 651: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export type SyncOptions = { immediately?: boolean; skipIfSyncedRecently?: boolean; disableCache?: boolean };

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 709: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 710: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 710: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 718: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 719: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 719: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 726: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 782: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 783: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 783: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 791: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 792: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 792: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 799: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 855: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 856: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 856: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 864: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 865: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 865: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 872: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 928: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 929: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 929: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 937: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 938: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 938: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 945: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 1001: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1002: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1002: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1010: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 1011: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 1011: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 1018: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 1074: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1075: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1075: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1083: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 1084: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 1084: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 1091: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 1147: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1148: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1148: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1156: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 1157: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 1157: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 1164: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 1220: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1221: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1221: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1229: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 1230: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 1230: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 1237: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 1293: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1294: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1294: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1302: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 1303: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 1303: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 1310: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 1366: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1367: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1367: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1375: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 1376: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 1376: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 1383: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 1439: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1440: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1440: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1448: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 1449: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 1449: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 1456: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 1512: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1513: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1513: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1521: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 1522: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 1522: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 1529: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 1585: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1586: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1586: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1594: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 1595: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 1595: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 1602: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 1658: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1659: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1659: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1667: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 1668: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 1668: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 1675: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 1731: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1732: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1732: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1740: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 1741: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 1741: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 1748: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 1804: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1805: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1805: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1813: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 1814: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 1814: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 1821: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 1877: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1878: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1878: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1886: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 1887: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 1887: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 1894: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 1950: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 1951: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 1951: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 1959: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 1960: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 1960: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 1967: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 2023: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 2024: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 2024: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 2032: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 2033: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 2033: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 2040: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 2096: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 2097: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 2097: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 2105: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 2106: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 2106: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 2113: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 2169: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 2170: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 2170: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 2178: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 2179: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 2179: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 2186: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 2242: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 2243: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 2243: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 2251: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 2252: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 2252: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 2259: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 2315: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 2316: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 2316: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 2324: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 2325: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 2325: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 2332: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 2388: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 2389: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 2389: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 2397: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 2398: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 2398: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 2405: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 2461: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 2462: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 2462: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 2470: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 2471: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 2471: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 2478: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 2534: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 2535: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 2535: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 2543: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 2544: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 2544: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 2551: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 2607: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 2608: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 2608: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 2616: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 2617: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 2617: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 2624: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 2680: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 2681: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 2681: Missing service brand declaration - breaks VSCode's DI system type safety
//   4. Line 2689: Missing service brand declaration - breaks VSCode's DI system type safety
//   5. Line 2690: Missing service brand declaration - breaks VSCode's DI system type safety
//   6. Line 2690: Missing service brand declaration - breaks VSCode's DI system type safety
//   7. Line 2697: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const IUserDataAutoSyncService = createDecorator<IUserDataAutoSyncService>('IUserDataAutoSyncService');
export interface IUserDataAutoSyncService {
	_serviceBrand: any;
	readonly onError: Event<UserDataSyncError>;
	turnOn(): Promise<void>;
	turnOff(everywhere: boolean): Promise<void>;
	triggerSync(sources: string[], options?: SyncOptions): Promise<void>;
}

export const IUserDataSyncUtilService = createDecorator<IUserDataSyncUtilService>('IUserDataSyncUtilService');
export interface IUserDataSyncUtilService {
	readonly _serviceBrand: undefined;
	resolveUserBindings(userbindings: string[]): Promise<IStringDictionary<string>>;
	resolveFormattingOptions(resource: URI): Promise<FormattingOptions>;
	resolveDefaultCoreIgnoredSettings(): Promise<string[]>;
}

export const IUserDataSyncLogService = createDecorator<IUserDataSyncLogService>('IUserDataSyncLogService');
export interface IUserDataSyncLogService extends ILogService { }

export interface IConflictSetting {
	key: string;
	localValue: any | undefined;
	remoteValue: any | undefined;
}

//#endregion

export const USER_DATA_SYNC_LOG_ID = 'userDataSync';
export const USER_DATA_SYNC_SCHEME = 'vscode-userdata-sync';
export const PREVIEW_DIR_NAME = 'preview';
