//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/// <reference lib='webworker' />

import ts from 'typescript/lib/tsserverlibrary';
import { URI } from 'vscode-uri';
import { FileWatcherManager } from './fileWatcherManager';
import { Logger, parseLogLevel } from './logging';
import { PathMapper } from './pathMapper';
import { createSys } from './serverHost';
import { findArgument, findArgumentStringArray, hasArgument, parseServerMode } from './util/args';
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

import { StartSessionOptions, startWorkerSession } from './workerSession';

const setSys: (s: ts.System) => void = (ts as any).setSys;

async function initializeSession(
	args: readonly string[],
	extensionUri: URI,
	ports: { tsserver: MessagePort; sync: MessagePort; watcher: MessagePort },
): Promise<void> {
	const logLevel = parseLogLevel(findArgument(args, '--logVerbosity'));
	const logger = new Logger(logLevel);

	const modeOrUnknown = parseServerMode(args);
	const serverMode = typeof modeOrUnknown === 'number' ? modeOrUnknown : undefined;
	const unknownServerMode = typeof modeOrUnknown === 'string' ? modeOrUnknown : undefined;
	logger.tsLogger.info(`Starting TS Server`);
	logger.tsLogger.info(`Version: 0.0.0`);
	logger.tsLogger.info(`Arguments: ${args.join(' ')}`);
	logger.tsLogger.info(`ServerMode: ${serverMode} unknownServerMode: ${unknownServerMode}`);
	const sessionOptions = parseSessionOptions(args, serverMode);

	const enabledExperimentalTypeAcquisition = hasArgument(args, '--enableProjectWideIntelliSenseOnWeb') && hasArgument(args, '--experimentalTypeAcquisition');

	const pathMapper = new PathMapper(extensionUri);
	const watchManager = new FileWatcherManager(ports.watcher, extensionUri, enabledExperimentalTypeAcquisition, pathMapper, logger);

	const { sys, fs } = await createSys(ts, args, ports.sync, logger, watchManager, pathMapper, () => {
		removeEventListener('message', listener);
	});
	setSys(sys);

	const localeStr = findArgument(args, '--locale');
	if (localeStr) {
		ts.validateLocaleAndSetLanguage(localeStr, sys);
	}

	startWorkerSession(ts, sys, fs, sessionOptions, ports.tsserver, pathMapper, logger);
}

function parseSessionOptions(args: readonly string[], serverMode: ts.LanguageServiceMode | undefined): StartSessionOptions {
	return {
		globalPlugins: findArgumentStringArray(args, '--globalPlugins'),
		pluginProbeLocations: findArgumentStringArray(args, '--pluginProbeLocations'),
		allowLocalPluginLoads: hasArgument(args, '--allowLocalPluginLoads'),
		useSingleInferredProject: hasArgument(args, '--useSingleInferredProject'),
		useInferredProjectPerProjectRoot: hasArgument(args, '--useInferredProjectPerProjectRoot'),
		suppressDiagnosticEvents: hasArgument(args, '--suppressDiagnosticEvents'),
		noGetErrOnBackgroundUpdate: hasArgument(args, '--noGetErrOnBackgroundUpdate'),
		serverMode,
		disableAutomaticTypingAcquisition: hasArgument(args, '--disableAutomaticTypingAcquisition'),
	};
}

let hasInitialized = false;
const listener = async (e: any) => {
	if (!hasInitialized) {
		hasInitialized = true;
		if ('args' in e.data) {
			const args = e.data.args;
			const extensionUri = URI.from(e.data.extensionUri);
			const [sync, tsserver, watcher] = e.ports as MessagePort[];
			await initializeSession(args, extensionUri, { sync, tsserver, watcher });
		} else {
			console.error('unexpected message in place of initial message: ' + JSON.stringify(e.data));
		}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 81: Error message without production error code - breaks React bundle size optimization
//   2. Line 81: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		return;
	}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 100: Error message without production error code - breaks React bundle size optimization
//   2. Line 100: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	console.error(`unexpected message on main channel: ${JSON.stringify(e)}`);
};
addEventListener('message', listener);
