//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionKind } from '../../../../platform/environment/common/environment.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';

export const enum ExtensionHostKind {
	LocalProcess = 1,
	LocalWebWorker = 2,
	Remote = 3
}

export function extensionHostKindToString(kind: ExtensionHostKind | null): string {
	if (kind === null) {
		return 'None';
	}
	switch (kind) {
		case ExtensionHostKind.LocalProcess: return 'LocalProcess';
		case ExtensionHostKind.LocalWebWorker: return 'LocalWebWorker';
		case ExtensionHostKind.Remote: return 'Remote';
	}
}

export const enum ExtensionRunningPreference {
	None,
	Local,
	Remote
}

export function extensionRunningPreferenceToString(preference: ExtensionRunningPreference) {
	switch (preference) {
		case ExtensionRunningPreference.None:
			return 'None';
		case ExtensionRunningPreference.Local:
			return 'Local';
		case ExtensionRunningPreference.Remote:
			return 'Remote';
	}
}

export interface IExtensionHostKindPicker {
	pickExtensionHostKind(extensionId: ExtensionIdentifier, extensionKinds: ExtensionKind[], isInstalledLocally: boolean, isInstalledRemotely: boolean, preference: ExtensionRunningPreference): ExtensionHostKind | null;
}

export function determineExtensionHostKinds(
	_localExtensions: IExtensionDescription[],
	_remoteExtensions: IExtensionDescription[],
	getExtensionKind: (extensionDescription: IExtensionDescription) => ExtensionKind[],
	pickExtensionHostKind: (extensionId: ExtensionIdentifier, extensionKinds: ExtensionKind[], isInstalledLocally: boolean, isInstalledRemotely: boolean, preference: ExtensionRunningPreference) => ExtensionHostKind | null
): Map<string, ExtensionHostKind | null> {
	const localExtensions = toExtensionWithKind(_localExtensions, getExtensionKind);
	const remoteExtensions = toExtensionWithKind(_remoteExtensions, getExtensionKind);

	const allExtensions = new Map<string, ExtensionInfo>();
	const collectExtension = (ext: ExtensionWithKind) => {
		if (allExtensions.has(ext.key)) {
			return;
		}
		const local = localExtensions.get(ext.key) || null;
		const remote = remoteExtensions.get(ext.key) || null;
		const info = new ExtensionInfo(local, remote);
		allExtensions.set(info.key, info);
	};
	localExtensions.forEach((ext) => collectExtension(ext));
	remoteExtensions.forEach((ext) => collectExtension(ext));

	const extensionHostKinds = new Map<string, ExtensionHostKind | null>();
	allExtensions.forEach((ext) => {
		const isInstalledLocally = Boolean(ext.local);
		const isInstalledRemotely = Boolean(ext.remote);

		const isLocallyUnderDevelopment = Boolean(ext.local && ext.local.isUnderDevelopment);
		const isRemotelyUnderDevelopment = Boolean(ext.remote && ext.remote.isUnderDevelopment);

		let preference = ExtensionRunningPreference.None;
		if (isLocallyUnderDevelopment && !isRemotelyUnderDevelopment) {
			preference = ExtensionRunningPreference.Local;
		} else if (isRemotelyUnderDevelopment && !isLocallyUnderDevelopment) {
			preference = ExtensionRunningPreference.Remote;
		}

		extensionHostKinds.set(ext.key, pickExtensionHostKind(ext.identifier, ext.kind, isInstalledLocally, isInstalledRemotely, preference));
	});

	return extensionHostKinds;
}

function toExtensionWithKind(
	extensions: IExtensionDescription[],
	getExtensionKind: (extensionDescription: IExtensionDescription) => ExtensionKind[]
): Map<string, ExtensionWithKind> {
	const result = new Map<string, ExtensionWithKind>();
	extensions.forEach((desc) => {
		const ext = new ExtensionWithKind(desc, getExtensionKind(desc));
		result.set(ext.key, ext);
	});
	return result;
}

class ExtensionWithKind {

	constructor(
		public readonly desc: IExtensionDescription,
		public readonly kind: ExtensionKind[]
	) { }

	public get key(): string {
		return ExtensionIdentifier.toKey(this.desc.identifier);
	}

	public get isUnderDevelopment(): boolean {
		return this.desc.isUnderDevelopment;
	}
}

class ExtensionInfo {

	constructor(
		public readonly local: ExtensionWithKind | null,
		public readonly remote: ExtensionWithKind | null,
	) { }

	public get key(): string {
		if (this.local) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 136: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 146: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			return this.local.key;
		}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 142: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 149: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 159: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 153: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 170: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 164: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 175: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 182: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 192: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 186: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 203: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 204: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 215: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 225: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 219: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 230: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 237: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 241: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 248: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 258: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 252: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 269: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 263: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 270: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 280: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 274: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 281: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 285: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 292: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 302: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		return this.remote!.key;
	}

	public get identifier(): ExtensionIdentifier {
		if (this.local) {
			return this.local.desc.identifier;
		}
		return this.remote!.desc.identifier;
	}

	public get kind(): ExtensionKind[] {
		// in case of disagreements between extension kinds, it is always
		// better to pick the local extension because it has a much higher
		// chance of being up-to-date
		if (this.local) {
			return this.local.kind;
		}
		return this.remote!.kind;
	}
}
