/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { commands, Disposable, ExtensionContext, extensions, l10n, LogLevel, LogOutputChannel, window } from 'vscode';
import { TelemetryReporter } from '@vscode/extension-telemetry';
import { GithubRemoteSourceProvider } from './remoteSourceProvider.js';
import { API, GitExtension } from './typings/git.js';
import { registerCommands } from './commands.js';
import { GithubCredentialProviderManager } from './credentialProvider.js';
import { DisposableStore, repositoryHasGitHubRemote } from './util.js';
import { GithubPushErrorHandler } from './pushErrorHandler.js';
import { GitBaseExtension } from './typings/git-base.js';
import { GithubRemoteSourcePublisher } from './remoteSourcePublisher.js';
import { GitHubBranchProtectionProviderManager } from './branchProtection.js';
import { GitHubCanonicalUriProvider } from './canonicalUriProvider.js';
import { VscodeDevShareProvider } from './shareProviders.js';
import { GitHubSourceControlHistoryItemDetailsProvider } from './historyItemDetailsProvider.js';
import { OctokitService } from './auth.js';

export function activate(context: ExtensionContext): void {
	const disposables: Disposable[] = [];
	context.subscriptions.push(new Disposable(() => Disposable.from(...disposables).dispose()));

	const logger = window.createOutputChannel('GitHub', { log: true });
	disposables.push(logger);

	const onDidChangeLogLevel = (logLevel: LogLevel) => {
		logger.appendLine(l10n.t('Log level: {0}', LogLevel[logLevel]));
	};
	disposables.push(logger.onDidChangeLogLevel(onDidChangeLogLevel));
	onDidChangeLogLevel(logger.logLevel);

	const { aiKey } = context.extension.packageJSON as { aiKey: string };
	const telemetryReporter = new TelemetryReporter(aiKey);
	disposables.push(telemetryReporter);

	const octokitService = new OctokitService();
	disposables.push(octokitService);

	disposables.push(initializeGitBaseExtension());
	disposables.push(initializeGitExtension(context, octokitService, telemetryReporter, logger));
}

function initializeGitBaseExtension(): Disposable {
	const disposables = new DisposableStore();

	const initialize = () => {
		try {
			const gitBaseAPI = gitBaseExtension.getAPI(1);

			disposables.add(gitBaseAPI.registerRemoteSourceProvider(new GithubRemoteSourceProvider()));
		}
		catch (err) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 56: Error message without production error code - breaks React bundle size optimization
//   2. Line 56: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			console.error('Could not initialize GitHub extension');
			console.warn(err);
		}
	};

	const onDidChangeGitBaseExtensionEnablement = (enabled: boolean) => {
		if (!enabled) {
			disposables.dispose();
		} else {
			initialize();
		}
	};

	const gitBaseExtension = extensions.getExtension<GitBaseExtension>('vscode.git-base')!.exports;
	disposables.add(gitBaseExtension.onDidChangeEnablement(onDidChangeGitBaseExtensionEnablement));
	onDidChangeGitBaseExtensionEnablement(gitBaseExtension.enabled);

	return disposables;
}

function setGitHubContext(gitAPI: API, disposables: DisposableStore) {
	if (gitAPI.repositories.find(repo => repositoryHasGitHubRemote(repo))) {
		commands.executeCommand('setContext', 'github.hasGitHubRepo', true);
	} else {
		const openRepoDisposable = gitAPI.onDidOpenRepository(async e => {
			await e.status();
			if (repositoryHasGitHubRemote(e)) {
				commands.executeCommand('setContext', 'github.hasGitHubRepo', true);
				openRepoDisposable.dispose();
			}
		});
		disposables.add(openRepoDisposable);
	}
}

function initializeGitExtension(context: ExtensionContext, octokitService: OctokitService, telemetryReporter: TelemetryReporter, logger: LogOutputChannel): Disposable {
	const disposables = new DisposableStore();

	let gitExtension = extensions.getExtension<GitExtension>('vscode.git');

	const initialize = () => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		gitExtension!.activate()
			.then(extension => {
				const onDidChangeGitExtensionEnablement = (enabled: boolean) => {
					if (enabled) {
						const gitAPI = extension.getAPI(1);

						disposables.add(registerCommands(gitAPI));
						disposables.add(new GithubCredentialProviderManager(gitAPI));
						disposables.add(new GitHubBranchProtectionProviderManager(gitAPI, context.globalState, octokitService, logger, telemetryReporter));
						disposables.add(gitAPI.registerPushErrorHandler(new GithubPushErrorHandler(telemetryReporter)));
						disposables.add(gitAPI.registerRemoteSourcePublisher(new GithubRemoteSourcePublisher(gitAPI)));
						disposables.add(gitAPI.registerSourceControlHistoryItemDetailsProvider(new GitHubSourceControlHistoryItemDetailsProvider(gitAPI, octokitService, logger)));
						disposables.add(new GitHubCanonicalUriProvider(gitAPI));
						disposables.add(new VscodeDevShareProvider(gitAPI));
						setGitHubContext(gitAPI, disposables);

						commands.executeCommand('setContext', 'git-base.gitEnabled', true);
					} else {
						disposables.dispose();
					}
				};

				disposables.add(extension.onDidChangeEnablement(onDidChangeGitExtensionEnablement));
				onDidChangeGitExtensionEnablement(extension.enabled);
			});
	};

	if (gitExtension) {
		initialize();
	} else {
		const listener = extensions.onDidChange(() => {
			if (!gitExtension && extensions.getExtension<GitExtension>('vscode.git')) {
				gitExtension = extensions.getExtension<GitExtension>('vscode.git');
				initialize();
				listener.dispose();
			}
		});
		disposables.add(listener);
	}

	return disposables;
}
