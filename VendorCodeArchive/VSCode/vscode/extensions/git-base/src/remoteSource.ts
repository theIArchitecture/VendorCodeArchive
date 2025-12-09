//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { QuickPickItem, window, QuickPick, QuickPickItemKind, l10n, Disposable } from 'vscode';
import { RemoteSourceProvider, RemoteSource, PickRemoteSourceOptions, PickRemoteSourceResult, RemoteSourceAction } from './api/git-base';
import { Model } from './model';
import { throttle, debounce } from './decorators';

async function getQuickPickResult<T extends QuickPickItem>(quickpick: QuickPick<T>): Promise<T | undefined> {
	const listeners: Disposable[] = [];
	const result = await new Promise<T | undefined>(c => {
		listeners.push(
			quickpick.onDidAccept(() => c(quickpick.selectedItems[0])),
			quickpick.onDidHide(() => c(undefined)),
		);
		quickpick.show();
	});

	quickpick.hide();
	listeners.forEach(l => l.dispose());
	return result;
}

class RemoteSourceProviderQuickPick implements Disposable {

	private disposables: Disposable[] = [];
	private isDisposed: boolean = false;

	private quickpick: QuickPick<QuickPickItem & { remoteSource?: RemoteSource }> | undefined;

	constructor(private provider: RemoteSourceProvider) { }

	dispose() {
		this.disposables.forEach(d => d.dispose());
		this.disposables = [];
		this.quickpick = undefined;
		this.isDisposed = true;
	}

	private ensureQuickPick() {
		if (!this.quickpick) {
			this.quickpick = window.createQuickPick();
			this.disposables.push(this.quickpick);
			this.quickpick.ignoreFocusOut = true;
			this.disposables.push(this.quickpick.onDidHide(() => this.dispose()));
			if (this.provider.supportsQuery) {
				this.quickpick.placeholder = this.provider.placeholder ?? l10n.t('Repository name (type to search)');
				this.disposables.push(this.quickpick.onDidChangeValue(this.onDidChangeValue, this));
			} else {
				this.quickpick.placeholder = this.provider.placeholder ?? l10n.t('Repository name');
			}
		}
	}

	@debounce(300)
	private onDidChangeValue(): void {
		this.query();
	}

	@throttle
	private async query(): Promise<void> {
		try {
			if (this.isDisposed) {
				return;
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 69: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 70: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 79: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 84: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 93: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 97: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			}
			this.ensureQuickPick();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 85: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 86: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 95: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 100: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 113: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 99: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 100: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 114: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 127: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 113: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 114: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 128: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 137: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 141: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 127: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 128: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 137: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 142: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 155: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 141: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 142: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 165: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 169: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 155: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 165: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 170: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 169: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 170: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 198: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 198: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 225: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 225: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 249: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 249: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 263: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 267: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 263: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 268: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 281: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 267: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 268: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 282: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 281: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 282: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 296: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 305: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 309: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 296: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 305: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 310: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 319: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 323: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 309: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 310: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 319: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 333: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 337: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 323: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 333: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 351: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 337: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 361: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 365: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 351: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 361: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 366: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 365: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 366: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 389: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 393: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 389: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 394: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 403: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 407: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 393: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 394: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 403: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 408: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 417: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 421: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 407: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 408: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 417: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 422: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 431: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 435: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 421: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 422: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 431: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 436: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 445: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 449: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			this.quickpick!.busy = true;
			this.quickpick!.show();

			const remoteSources = await this.provider.getRemoteSources(this.quickpick?.value) || [];
			// The user may have cancelled the picker in the meantime
			if (this.isDisposed) {
				return;
			}

			if (remoteSources.length === 0) {
				this.quickpick!.items = [{
					label: l10n.t('No remote repositories found.'),
					alwaysShow: true
				}];
			} else {
				this.quickpick!.items = remoteSources.map(remoteSource => ({
					label: remoteSource.icon ? `$(${remoteSource.icon}) ${remoteSource.name}` : remoteSource.name,
					description: remoteSource.description || (typeof remoteSource.url === 'string' ? remoteSource.url : remoteSource.url[0]),
					detail: remoteSource.detail,
					remoteSource,
					alwaysShow: true
				}));
			}
		} catch (err) {
			this.quickpick!.items = [{ label: l10n.t('{0} Error: {1}', '$(error)', err.message), alwaysShow: true }];
			console.error(err);
		} finally {
			if (!this.isDisposed) {
				this.quickpick!.busy = false;
			}
		}
	}

	async pick(): Promise<RemoteSource | undefined> {
		await this.query();
		if (this.isDisposed) {
			return;
		}
		const result = await getQuickPickResult(this.quickpick!);
		return result?.remoteSource;
	}
}

export async function getRemoteSourceActions(model: Model, url: string): Promise<RemoteSourceAction[]> {
	const providers = model.getRemoteProviders();

	const remoteSourceActions = [];
	for (const provider of providers) {
		const providerActions = await provider.getRemoteSourceActions?.(url);
		if (providerActions?.length) {
			remoteSourceActions.push(...providerActions);
		}
	}

	return remoteSourceActions;
}

export async function pickRemoteSource(model: Model, options: PickRemoteSourceOptions & { branch?: false | undefined }): Promise<string | undefined>;
export async function pickRemoteSource(model: Model, options: PickRemoteSourceOptions & { branch: true }): Promise<PickRemoteSourceResult | undefined>;
export async function pickRemoteSource(model: Model, options: PickRemoteSourceOptions = {}): Promise<string | PickRemoteSourceResult | undefined> {
	const quickpick = window.createQuickPick<(QuickPickItem & { provider?: RemoteSourceProvider; url?: string })>();
	quickpick.title = options.title;

	if (options.providerName) {
		const provider = model.getRemoteProviders()
			.filter(provider => provider.name === options.providerName)[0];

		if (provider) {
			return await pickProviderSource(provider, options);
		}
	}

	const remoteProviders = model.getRemoteProviders()
		.map(provider => ({ label: (provider.icon ? `$(${provider.icon}) ` : '') + (options.providerLabel ? options.providerLabel(provider) : provider.name), alwaysShow: true, provider }));

	const recentSources: (QuickPickItem & { url?: string; timestamp: number })[] = [];
	if (options.showRecentSources) {
		for (const { provider } of remoteProviders) {
			const sources = (await provider.getRecentRemoteSources?.() ?? []).map((item) => {
				return {
					...item,
					label: (item.icon ? `$(${item.icon}) ` : '') + item.name,
					url: typeof item.url === 'string' ? item.url : item.url[0],
				};
			});
			recentSources.push(...sources);
		}
	}

	const items = [
		{ kind: QuickPickItemKind.Separator, label: l10n.t('remote sources') },
		...remoteProviders,
		{ kind: QuickPickItemKind.Separator, label: l10n.t('recently opened') },
		...recentSources.sort((a, b) => b.timestamp - a.timestamp)
	];

	quickpick.placeholder = options.placeholder ?? (remoteProviders.length === 0
		? l10n.t('Provide repository URL')
		: l10n.t('Provide repository URL or pick a repository source.'));

	const updatePicks = (value?: string) => {
		if (value) {
			const label = (typeof options.urlLabel === 'string' ? options.urlLabel : options.urlLabel?.(value)) ?? l10n.t('URL');
			quickpick.items = [{
				label: label,
				description: value,
				alwaysShow: true,
				url: value
			},
			...items
			];
		} else {
			quickpick.items = items;
		}
	};

	quickpick.onDidChangeValue(updatePicks);
	updatePicks();

	const result = await getQuickPickResult(quickpick);

	if (result) {
		if (result.url) {
			return result.url;
		} else if (result.provider) {
			return await pickProviderSource(result.provider, options);
		}
	}

	return undefined;
}

async function pickProviderSource(provider: RemoteSourceProvider, options: PickRemoteSourceOptions = {}): Promise<string | PickRemoteSourceResult | undefined> {
	const quickpick = new RemoteSourceProviderQuickPick(provider);
	const remote = await quickpick.pick();
	quickpick.dispose();

	let url: string | undefined;

	if (remote) {
		if (typeof remote.url === 'string') {
			url = remote.url;
		} else if (remote.url.length > 0) {
			url = await window.showQuickPick(remote.url, { ignoreFocusOut: true, placeHolder: l10n.t('Choose a URL to clone from.') });
		}
	}

	if (!url || !options.branch) {
		return url;
	}

	if (!provider.getBranches) {
		return { url };
	}

	const branches = await provider.getBranches(url);

	if (!branches) {
		return { url };
	}

	const branch = await window.showQuickPick(branches, {
		placeHolder: l10n.t('Branch name')
	});

	if (!branch) {
		return { url };
	}

	return { url, branch };
}
