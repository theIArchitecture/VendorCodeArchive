//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ApiClient, FileStat, FileType, Requests } from '@vscode/sync-api-client';
import { ClientConnection } from '@vscode/sync-api-common/browser';
import { basename } from 'path';
import type * as ts from 'typescript/lib/tsserverlibrary';
import { FileWatcherManager } from './fileWatcherManager';
import { Logger } from './logging';
import { PathMapper, looksLikeNodeModules, mapUri } from './pathMapper';
import { findArgument, hasArgument } from './util/args';
import { URI } from 'vscode-uri';

type ServerHostWithImport = ts.server.ServerHost & { importPlugin(root: string, moduleName: string): Promise<ts.server.ModuleImportResult> };

function createServerHost(
	ts: typeof import('typescript/lib/tsserverlibrary'),
	logger: Logger,
	apiClient: ApiClient | undefined,
	args: readonly string[],
	watchManager: FileWatcherManager,
	pathMapper: PathMapper,
	enabledExperimentalTypeAcquisition: boolean,
	exit: () => void,
): ServerHostWithImport {
	const currentDirectory = '/';
	const fs = apiClient?.vscode.workspace.fileSystem;
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


	// Internals
	const combinePaths: (path: string, ...paths: (string | undefined)[]) => string = (ts as any).combinePaths;
	const byteOrderMarkIndicator = '\uFEFF';
	const matchFiles: (
		path: string,
		extensions: readonly string[] | undefined,
		excludes: readonly string[] | undefined,
		includes: readonly string[] | undefined,
		useCaseSensitiveFileNames: boolean,
		currentDirectory: string,
		depth: number | undefined,
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 44: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 45: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 48: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 49: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 50: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 51: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		getFileSystemEntries: (path: string) => { files: readonly string[]; directories: readonly string[] },
		realpath: (path: string) => string
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 67: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 68: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 71: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 72: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 73: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 74: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 81: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 82: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 85: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 86: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 87: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 88: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 95: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 96: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 99: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 100: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 101: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 102: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 113: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 114: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 115: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 116: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 124: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 127: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 128: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 137: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 138: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 141: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 142: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 143: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 144: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 155: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 158: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 165: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 166: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 169: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 170: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 180: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 185: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 186: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 194: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 198: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 213: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 225: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 227: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 236: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 241: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 242: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 249: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 250: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 256: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 263: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 264: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 267: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 268: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 269: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 270: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 278: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 281: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 282: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 283: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 292: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 296: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 297: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 305: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 306: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 309: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 310: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 311: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 319: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 320: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 323: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 325: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 326: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 333: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 334: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 337: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 339: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 340: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 351: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 353: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 354: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	) => string[] = (ts as any).matchFiles;
	const generateDjb2Hash = (ts as any).generateDjb2Hash;

	// Legacy web
	const memoize: <T>(callback: () => T) => () => T = (ts as any).memoize;
	const ensureTrailingDirectorySeparator: (path: string) => string = (ts as any).ensureTrailingDirectorySeparator;
	const getDirectoryPath: (path: string) => string = (ts as any).getDirectoryPath;
	const directorySeparator: string = (ts as any).directorySeparator;
	const executingFilePath = findArgument(args, '--executingFilePath') || location + '';
	const getExecutingDirectoryPath = memoize(() => memoize(() => ensureTrailingDirectorySeparator(getDirectoryPath(executingFilePath))));
	const getWebPath = (path: string) => path.startsWith(directorySeparator) ? path.replace(directorySeparator, getExecutingDirectoryPath()) : undefined;

	const textDecoder = new TextDecoder();
	const textEncoder = new TextEncoder();

	return {
		watchFile: watchManager.watchFile.bind(watchManager),
		watchDirectory: watchManager.watchDirectory.bind(watchManager),
		setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): any {
			return setTimeout(callback, ms, ...args);
		},
		clearTimeout(timeoutId: any): void {
			clearTimeout(timeoutId);
		},
		setImmediate(callback: (...args: any[]) => void, ...args: any[]): any {
			return this.setTimeout(callback, 0, ...args);
		},
		clearImmediate(timeoutId: any): void {
			this.clearTimeout(timeoutId);
		},
		importPlugin: async (root, moduleName) => {
			const packageRoot = combinePaths(root, moduleName);

			let packageJson: any | undefined;
			try {
				const packageJsonResponse = await fetch(combinePaths(packageRoot, 'package.json'));
				packageJson = await packageJsonResponse.json();
			} catch (e) {
				return { module: undefined, error: new Error(`Could not load plugin. Could not load 'package.json'.`) };
			}

			const browser = packageJson.browser;
			if (!browser) {
				return { module: undefined, error: new Error(`Could not load plugin. No 'browser' field found in package.json.`) };
			}

			const scriptPath = combinePaths(packageRoot, browser);
			try {
				const { default: module } = await import(/* webpackIgnore: true */ scriptPath);
				return { module, error: undefined };
			} catch (e) {
				return { module: undefined, error: e };
			}
		},
		args: Array.from(args),
		newLine: '\n',
		useCaseSensitiveFileNames: true,
		write: s => {
			apiClient?.vscode.terminal.write(s);
		},
		writeOutputIsTTY() {
			return true;
		},
		readFile(path) {
			logger.logVerbose('fs.readFile', { path });

			if (!fs) {
				const webPath = getWebPath(path);
				if (webPath) {
					const request = new XMLHttpRequest();
					request.open('GET', webPath, /* asynchronous */ false);
					request.send();
					return request.status === 200 ? request.responseText : undefined;
				} else {
					return undefined;
				}
			}

			let uri;
			try {
				uri = pathMapper.toResource(path);
			} catch (e) {
				return undefined;
			}

			let contents: Uint8Array | undefined;
			try {
				// We need to slice the bytes since we can't pass a shared array to text decoder
				contents = fs.readFile(uri);
			} catch (error) {
				if (!enabledExperimentalTypeAcquisition) {
					return undefined;
				}
				try {
					contents = fs.readFile(mapUri(uri, 'vscode-node-modules'));
				} catch (e) {
					return undefined;
				}
			}
			return textDecoder.decode(contents.slice());
		},
		getFileSize(path) {
			logger.logVerbose('fs.getFileSize', { path });

			if (!fs) {
				throw new Error('not supported');
			}

			const uri = pathMapper.toResource(path);
			let ret = 0;
			try {
				ret = fs.stat(uri).size;
			} catch (_error) {
				if (enabledExperimentalTypeAcquisition) {
					try {
						ret = fs.stat(mapUri(uri, 'vscode-node-modules')).size;
					} catch (_error) {
					}
				}
			}
			return ret;
		},
		writeFile(path, data, writeByteOrderMark) {
			logger.logVerbose('fs.writeFile', { path });

			if (!fs) {
				throw new Error('not supported');
			}

			if (writeByteOrderMark) {
				data = byteOrderMarkIndicator + data;
			}

			let uri;
			try {
				uri = pathMapper.toResource(path);
			} catch (e) {
				return;
			}
			const encoded = textEncoder.encode(data);
			try {
				fs.writeFile(uri, encoded);
				const name = basename(uri.path);
				if (uri.scheme !== 'vscode-global-typings' && (name === 'package.json' || name === 'package-lock.json' || name === 'package-lock.kdl')) {
					fs.writeFile(mapUri(uri, 'vscode-node-modules'), encoded);
				}
			} catch (error) {
				console.error('fs.writeFile', { path, error });
			}
		},
		resolvePath(path: string): string {
			return path;
		},
		fileExists(path: string): boolean {
			logger.logVerbose('fs.fileExists', { path });

			if (!fs) {
				const webPath = getWebPath(path);
				if (!webPath) {
					return false;
				}

				const request = new XMLHttpRequest();
				request.open('HEAD', webPath, /* asynchronous */ false);
				request.send();
				return request.status === 200;
			}

			let uri;
			try {
				uri = pathMapper.toResource(path);
			} catch (e) {
				return false;
			}
			let ret = false;
			try {
				ret = fs.stat(uri).type === FileType.File;
			} catch (_error) {
				if (enabledExperimentalTypeAcquisition) {
					try {
						ret = fs.stat(mapUri(uri, 'vscode-node-modules')).type === FileType.File;
					} catch (_error) {
					}
				}
			}
			return ret;
		},
		directoryExists(path: string): boolean {
			logger.logVerbose('fs.directoryExists', { path });

			if (!fs) {
				return false;
			}

			let uri;
			try {
				uri = pathMapper.toResource(path);
			} catch (_error) {
				return false;
			}

			let stat: FileStat | undefined = undefined;
			try {
				stat = fs.stat(uri);
			} catch (_error) {
				if (enabledExperimentalTypeAcquisition) {
					try {
						stat = fs.stat(mapUri(uri, 'vscode-node-modules'));
					} catch (_error) {
					}
				}
			}
			if (stat) {
				if (path.startsWith('/https') && !path.endsWith('.d.ts')) {
					// TODO: Hack, https 'file system' can't actually tell what is a file vs directory
					return stat.type === FileType.File || stat.type === FileType.Directory;
				}

				return stat.type === FileType.Directory;
			} else {
				return false;
			}
		},
		createDirectory(path: string): void {
			logger.logVerbose('fs.createDirectory', { path });
			if (!fs) {
				throw new Error('not supported');
			}

			try {
				fs.createDirectory(pathMapper.toResource(path));
			} catch (error) {
				logger.logNormal('Error fs.createDirectory', { path, error: error + '' });
			}
		},
		getExecutingFilePath(): string {
			return currentDirectory;
		},
		getCurrentDirectory(): string {
			return currentDirectory;
		},
		getDirectories(path: string): string[] {
			logger.logVerbose('fs.getDirectories', { path });

			return getAccessibleFileSystemEntries(path).directories.slice();
		},
		readDirectory(path: string, extensions?: readonly string[], excludes?: readonly string[], includes?: readonly string[], depth?: number): string[] {
			logger.logVerbose('fs.readDirectory', { path });

			return matchFiles(path, extensions, excludes, includes, /*useCaseSensitiveFileNames*/ true, currentDirectory, depth, getAccessibleFileSystemEntries, realpath);
		},
		getModifiedTime(path: string): Date | undefined {
			logger.logVerbose('fs.getModifiedTime', { path });

			if (!fs) {
				throw new Error('not supported');
			}

			const uri = pathMapper.toResource(path);
			let s: FileStat | undefined = undefined;
			try {
				s = fs.stat(uri);
			} catch (_e) {
				if (enabledExperimentalTypeAcquisition) {
					try {
						s = fs.stat(mapUri(uri, 'vscode-node-modules'));
					} catch (_e) {
					}
				}
			}
			return s && new Date(s.mtime);
		},
		deleteFile(path: string): void {
			logger.logVerbose('fs.deleteFile', { path });

			if (!fs) {
				throw new Error('not supported');
			}

			try {
				fs.delete(pathMapper.toResource(path));
			} catch (error) {
				logger.logNormal('Error fs.deleteFile', { path, error: error + '' });
			}
		},
		createHash: generateDjb2Hash,
		/** This must be cryptographically secure.
			The browser implementation, crypto.subtle.digest, is async so not possible to call from tsserver. */
		createSHA256Hash: undefined,
		exit: exit,
		realpath,
		base64decode: input => Buffer.from(input, 'base64').toString('utf8'),
		base64encode: input => Buffer.from(input).toString('base64'),
	};

	// For module resolution only. `node_modules` is also automatically mapped
	// as if all node_modules-like paths are symlinked.
	function realpath(path: string): string {
		if (path.startsWith('/^/')) {
			// In memory file. No mapping needed
			return path;
		}

		const isNm = looksLikeNodeModules(path)
			&& !path.startsWith('/vscode-global-typings/')
			// Handle the case where a local folder has been opened in VS Code
			// In these cases we do not want to use the mapped node_module
			&& !path.startsWith('/file/');

		// skip paths without .. or ./ or /
		if (!isNm && !path.match(/\.\.|\/\.|\.\//)) {
			return path;
		}

		let uri: URI;
		try {
			uri = pathMapper.toResource(path);
		} catch {
			return path;
		}

		if (isNm) {
			uri = mapUri(uri, 'vscode-node-modules');
		}
		const out = [uri.scheme];
		if (uri.authority) { out.push(uri.authority); }
		for (const part of uri.path.split('/')) {
			switch (part) {
				case '':
				case '.':
					break;
				case '..':
					//delete if there is something there to delete
					out.pop();
					break;
				default:
					out.push(part);
			}
		}
		return '/' + out.join('/');
	}

	function getAccessibleFileSystemEntries(path: string): { files: readonly string[]; directories: readonly string[] } {
		if (!fs) {
			throw new Error('not supported');
		}

		const uri = pathMapper.toResource(path || '.');
		let entries: [string, FileType][] = [];
		const files: string[] = [];
		const directories: string[] = [];
		try {
			entries = fs.readDirectory(uri);
		} catch (_e) {
			try {
				entries = fs.readDirectory(mapUri(uri, 'vscode-node-modules'));
			} catch (_e) {
			}
		}
		for (const [entry, type] of entries) {
			// This is necessary because on some file system node fails to exclude
			// '.' and '..'. See https://github.com/nodejs/node/issues/4002
			if (entry === '.' || entry === '..') {
				continue;
			}

			if (type === FileType.File) {
				files.push(entry);
			}
			else if (type === FileType.Directory) {
				directories.push(entry);
			}
		}
		files.sort();
		directories.sort();
		return { files, directories };
	}
}

export async function createSys(
	ts: typeof import('typescript/lib/tsserverlibrary'),
	args: readonly string[],
	fsPort: MessagePort,
	logger: Logger,
	watchManager: FileWatcherManager,
	pathMapper: PathMapper,
	onExit: () => void,
) {
	if (hasArgument(args, '--enableProjectWideIntelliSenseOnWeb')) {
		const enabledExperimentalTypeAcquisition = hasArgument(args, '--experimentalTypeAcquisition');
		const connection = new ClientConnection<Requests>(fsPort);
		await connection.serviceReady();

		const apiClient = new ApiClient(connection);
		const fs = apiClient.vscode.workspace.fileSystem;
		const sys = createServerHost(ts, logger, apiClient, args, watchManager, pathMapper, enabledExperimentalTypeAcquisition, onExit);
		return { sys, fs };
	} else {
		return { sys: createServerHost(ts, logger, undefined, args, watchManager, pathMapper, false, onExit) };
	}
}

