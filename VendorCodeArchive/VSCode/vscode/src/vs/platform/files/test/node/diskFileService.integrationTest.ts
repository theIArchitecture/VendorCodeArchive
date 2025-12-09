//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { createReadStream, existsSync, readdirSync, readFileSync, statSync, writeFileSync, promises } from 'fs';
import { tmpdir } from 'os';
import { timeout } from '../../../../base/common/async.js';
import { bufferToReadable, bufferToStream, streamToBuffer, streamToBufferReadableStream, VSBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { FileAccess, Schemas } from '../../../../base/common/network.js';
import { basename, dirname, join, posix } from '../../../../base/common/path.js';
import { isLinux, isWindows } from '../../../../base/common/platform.js';
import { joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { Promises } from '../../../../base/node/pfs.js';
import { flakySuite, getRandomTestPath } from '../../../../base/test/node/testUtils.js';
import { etag, IFileAtomicReadOptions, FileOperation, FileOperationError, FileOperationEvent, FileOperationResult, FilePermission, FileSystemProviderCapabilities, hasFileAtomicReadCapability, hasOpenReadWriteCloseCapability, IFileStat, IFileStatWithMetadata, IReadFileOptions, IStat, NotModifiedSinceFileOperationError, TooLargeFileOperationError, IFileAtomicOptions } from '../../common/files.js';
import { FileService } from '../../common/fileService.js';
import { DiskFileSystemProvider } from '../../node/diskFileSystemProvider.js';
import { NullLogService } from '../../../log/common/log.js';

function getByName(root: IFileStat, name: string): IFileStat | undefined {
	if (root.children === undefined) {
		return undefined;
	}

	return root.children.find(child => child.name === name);
}

function toLineByLineReadable(content: string): VSBufferReadable {
	let chunks = content.split('\n');
	chunks = chunks.map((chunk, index) => {
		if (index === 0) {
			return chunk;
		}

		return '\n' + chunk;
	});

	return {
		read(): VSBuffer | null {
			const chunk = chunks.shift();
			if (typeof chunk === 'string') {
				return VSBuffer.fromString(chunk);
			}

			return null;
		}
	};
}

export class TestDiskFileSystemProvider extends DiskFileSystemProvider {

	totalBytesRead: number = 0;

	private invalidStatSize: boolean = false;
	private smallStatSize: boolean = false;
	private readonly: boolean = false;

	private _testCapabilities!: FileSystemProviderCapabilities;
	override get capabilities(): FileSystemProviderCapabilities {
		if (!this._testCapabilities) {
			this._testCapabilities =
				FileSystemProviderCapabilities.FileReadWrite |
				FileSystemProviderCapabilities.FileOpenReadWriteClose |
				FileSystemProviderCapabilities.FileReadStream |
				FileSystemProviderCapabilities.Trash |
				FileSystemProviderCapabilities.FileFolderCopy |
				FileSystemProviderCapabilities.FileWriteUnlock |
				FileSystemProviderCapabilities.FileAtomicRead |
				FileSystemProviderCapabilities.FileAtomicWrite |
				FileSystemProviderCapabilities.FileAtomicDelete |
				FileSystemProviderCapabilities.FileClone |
				FileSystemProviderCapabilities.FileRealpath;

			if (isLinux) {
				this._testCapabilities |= FileSystemProviderCapabilities.PathCaseSensitive;
			}
		}

		return this._testCapabilities;
	}

	override set capabilities(capabilities: FileSystemProviderCapabilities) {
		this._testCapabilities = capabilities;
	}

	setInvalidStatSize(enabled: boolean): void {
		this.invalidStatSize = enabled;
	}

	setSmallStatSize(enabled: boolean): void {
		this.smallStatSize = enabled;
	}

	setReadonly(readonly: boolean): void {
		this.readonly = readonly;
	}

	override async stat(resource: URI): Promise<IStat> {
		const res = await super.stat(resource);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 106: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 108: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		if (this.invalidStatSize) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 119: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 121: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 132: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 134: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 141: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 143: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 145: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 154: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 163: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 165: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 167: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 176: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 185: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 187: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 189: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 196: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 198: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 209: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 220: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 231: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 233: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 242: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 251: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 262: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 264: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 266: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 273: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 275: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 286: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 288: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 297: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 299: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 306: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 308: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 310: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 317: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 319: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 321: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 328: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 330: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 332: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 339: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 341: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 343: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 350: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 354: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 361: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 363: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 365: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 372: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 374: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 376: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 385: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 387: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 394: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 396: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 405: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 407: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 418: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 420: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 429: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 431: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			(res as any).size = String(res.size) as any; // for https://github.com/microsoft/vscode/issues/72909
		} else if (this.smallStatSize) {
			(res as any).size = 1;
		} else if (this.readonly) {
			(res as any).permissions = FilePermission.Readonly;
		}

		return res;
	}

	override async read(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		const bytesRead = await super.read(fd, pos, data, offset, length);

		this.totalBytesRead += bytesRead;

		return bytesRead;
	}

	override async readFile(resource: URI, options?: IFileAtomicReadOptions): Promise<Uint8Array> {
		const res = await super.readFile(resource, options);

		this.totalBytesRead += res.byteLength;

		return res;
	}
}

DiskFileSystemProvider.configureFlushOnWrite(false); // speed up all unit tests by disabling flush on write

flakySuite('Disk File Service', function () {

	const testSchema = 'test';

	let service: FileService;
	let fileProvider: TestDiskFileSystemProvider;
	let testProvider: TestDiskFileSystemProvider;

	let testDir: string;

	const disposables = new DisposableStore();

	setup(async () => {
		const logService = new NullLogService();

		service = disposables.add(new FileService(logService));

		fileProvider = disposables.add(new TestDiskFileSystemProvider(logService));
		disposables.add(service.registerProvider(Schemas.file, fileProvider));

		testProvider = disposables.add(new TestDiskFileSystemProvider(logService));
		disposables.add(service.registerProvider(testSchema, testProvider));

		testDir = getRandomTestPath(tmpdir(), 'vsctests', 'diskfileservice');

		const sourceDir = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/service').fsPath;

		await Promises.copy(sourceDir, testDir, { preserveSymlinks: false });
	});

	teardown(() => {
		disposables.clear();

		return Promises.rm(testDir);
	});

	test('createFolder', async () => {
		let event: FileOperationEvent | undefined;
		disposables.add(service.onDidRunOperation(e => event = e));

		const parent = await service.resolve(URI.file(testDir));

		const newFolderResource = URI.file(join(parent.resource.fsPath, 'newFolder'));

		const newFolder = await service.createFolder(newFolderResource);

		assert.strictEqual(newFolder.name, 'newFolder');
		assert.strictEqual(existsSync(newFolder.resource.fsPath), true);

		assert.ok(event);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 187: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event.resource.fsPath, newFolderResource.fsPath);
		assert.strictEqual(event.operation, FileOperation.CREATE);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event.target!.resource.fsPath, newFolderResource.fsPath);
		assert.strictEqual(event.target!.isDirectory, true);
	});

	test('createFolder: creating multiple folders at once', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const multiFolderPaths = ['a', 'couple', 'of', 'folders'];
		const parent = await service.resolve(URI.file(testDir));

		const newFolderResource = URI.file(join(parent.resource.fsPath, ...multiFolderPaths));

		const newFolder = await service.createFolder(newFolderResource);

		const lastFolderName = multiFolderPaths[multiFolderPaths.length - 1];
		assert.strictEqual(newFolder.name, lastFolderName);
		assert.strictEqual(existsSync(newFolder.resource.fsPath), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 209: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 209: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 245: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 280: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 281: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 281: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 282: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 282: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 304: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 305: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 306: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 306: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 307: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 307: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 329: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 330: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 332: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 332: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 354: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 355: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 357: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 357: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 381: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 381: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 382: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 382: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 404: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 405: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 406: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 406: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 407: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 407: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 429: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 430: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 431: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 431: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 432: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 432: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 454: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 455: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 479: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 480: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 481: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 481: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 482: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 482: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 504: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 505: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 506: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 506: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 507: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 507: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 529: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 530: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 531: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 531: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 532: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 532: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 554: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 555: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 556: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 556: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 557: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 557: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 579: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 580: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 581: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 581: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 582: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 582: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 604: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 605: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 606: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 606: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 607: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 607: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 629: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 630: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 631: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 631: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 632: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 632: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 654: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 655: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 656: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 656: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 657: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 657: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 679: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 680: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 681: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 681: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 682: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 682: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 704: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 705: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 706: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 706: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 707: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 707: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 729: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 730: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 731: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 731: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 732: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 732: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 754: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 755: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 756: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 756: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 757: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 757: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 779: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 780: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 781: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 781: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 782: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 782: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 804: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 805: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 806: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 806: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 807: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 807: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 829: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 830: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 831: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 831: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 832: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 832: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 854: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 855: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 856: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 856: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 857: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 857: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 879: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 880: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 881: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 881: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 882: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 882: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 904: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 905: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 906: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 906: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 907: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 907: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 929: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 930: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 931: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 931: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 932: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 932: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 954: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 955: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 956: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 956: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 957: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 957: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, newFolderResource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.CREATE);
		assert.strictEqual(event!.target!.resource.fsPath, newFolderResource.fsPath);
		assert.strictEqual(event!.target!.isDirectory, true);
	});

	test('exists', async () => {
		let exists = await service.exists(URI.file(testDir));
		assert.strictEqual(exists, true);

		exists = await service.exists(URI.file(testDir + 'something'));
		assert.strictEqual(exists, false);
	});

	test('resolve - file', async () => {
		const resource = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/resolver/index.html');
		const resolved = await service.resolve(resource);

		assert.strictEqual(resolved.name, 'index.html');
		assert.strictEqual(resolved.isFile, true);
		assert.strictEqual(resolved.isDirectory, false);
		assert.strictEqual(resolved.readonly, false);
		assert.strictEqual(resolved.isSymbolicLink, false);
		assert.strictEqual(resolved.resource.toString(), resource.toString());
		assert.strictEqual(resolved.children, undefined);
		assert.ok(resolved.mtime! > 0);
		assert.ok(resolved.ctime! > 0);
		assert.ok(resolved.size! > 0);
	});

	test('resolve - directory', async () => {
		const testsElements = ['examples', 'other', 'index.html', 'site.css'];

		const resource = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/resolver');
		const result = await service.resolve(resource);

		assert.ok(result);
		assert.strictEqual(result.resource.toString(), resource.toString());
		assert.strictEqual(result.name, 'resolver');
		assert.ok(result.children);
		assert.ok(result.children.length > 0);
		assert.ok(result.isDirectory);
		assert.strictEqual(result.readonly, false);
		assert.ok(result.mtime! > 0);
		assert.ok(result.ctime! > 0);
		assert.strictEqual(result.children.length, testsElements.length);

		assert.ok(result.children.every(entry => {
			return testsElements.some(name => {
				return basename(entry.resource.fsPath) === name;
			});
		}));

		result.children.forEach(value => {
			assert.ok(basename(value.resource.fsPath));
			if (['examples', 'other'].indexOf(basename(value.resource.fsPath)) >= 0) {
				assert.ok(value.isDirectory);
				assert.strictEqual(value.mtime, undefined);
				assert.strictEqual(value.ctime, undefined);
			} else if (basename(value.resource.fsPath) === 'index.html') {
				assert.ok(!value.isDirectory);
				assert.ok(!value.children);
				assert.strictEqual(value.mtime, undefined);
				assert.strictEqual(value.ctime, undefined);
			} else if (basename(value.resource.fsPath) === 'site.css') {
				assert.ok(!value.isDirectory);
				assert.ok(!value.children);
				assert.strictEqual(value.mtime, undefined);
				assert.strictEqual(value.ctime, undefined);
			} else {
				assert.fail('Unexpected value ' + basename(value.resource.fsPath));
			}
		});
	});

	test('resolve - directory - with metadata', async () => {
		const testsElements = ['examples', 'other', 'index.html', 'site.css'];

		const result = await service.resolve(FileAccess.asFileUri('vs/platform/files/test/node/fixtures/resolver'), { resolveMetadata: true });

		assert.ok(result);
		assert.strictEqual(result.name, 'resolver');
		assert.ok(result.children);
		assert.ok(result.children.length > 0);
		assert.ok(result.isDirectory);
		assert.ok(result.mtime > 0);
		assert.ok(result.ctime > 0);
		assert.strictEqual(result.children.length, testsElements.length);

		assert.ok(result.children.every(entry => {
			return testsElements.some(name => {
				return basename(entry.resource.fsPath) === name;
			});
		}));

		assert.ok(result.children.every(entry => entry.etag.length > 0));

		result.children.forEach(value => {
			assert.ok(basename(value.resource.fsPath));
			if (['examples', 'other'].indexOf(basename(value.resource.fsPath)) >= 0) {
				assert.ok(value.isDirectory);
				assert.ok(value.mtime > 0);
				assert.ok(value.ctime > 0);
			} else if (basename(value.resource.fsPath) === 'index.html') {
				assert.ok(!value.isDirectory);
				assert.ok(!value.children);
				assert.ok(value.mtime > 0);
				assert.ok(value.ctime > 0);
			} else if (basename(value.resource.fsPath) === 'site.css') {
				assert.ok(!value.isDirectory);
				assert.ok(!value.children);
				assert.ok(value.mtime > 0);
				assert.ok(value.ctime > 0);
			} else {
				assert.fail('Unexpected value ' + basename(value.resource.fsPath));
			}
		});
	});

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 328: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	test('resolve - directory with resolveTo', async () => {
		const resolved = await service.resolve(URI.file(testDir), { resolveTo: [URI.file(join(testDir, 'deep'))] });
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 378: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(resolved.children!.length, 8);

		const deep = (getByName(resolved, 'deep')!);
		assert.strictEqual(deep.children!.length, 4);
	});

	test('resolve - directory - resolveTo single directory', async () => {
		const resolverFixturesPath = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/resolver').fsPath;
		const result = await service.resolve(URI.file(resolverFixturesPath), { resolveTo: [URI.file(join(resolverFixturesPath, 'other/deep'))] });

		assert.ok(result);
		assert.ok(result.children);
		assert.ok(result.children.length > 0);
		assert.ok(result.isDirectory);

		const children = result.children;
		assert.strictEqual(children.length, 4);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 353: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const other = getByName(result, 'other');
		assert.ok(other);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 406: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 410: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 411: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 462: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 466: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 467: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 498: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 502: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 503: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 534: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 538: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 539: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 570: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 574: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 575: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 606: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 610: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 611: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 642: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 646: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 647: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 678: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 682: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 683: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 714: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 718: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 719: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 750: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 754: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 755: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 786: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 790: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 791: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 822: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 826: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 827: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 858: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 862: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 863: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 894: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 898: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 899: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 930: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 934: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 935: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 966: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 970: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 971: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1002: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1006: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1007: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1038: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1042: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1043: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1074: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1078: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1079: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1110: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1114: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1115: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1146: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1150: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1151: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1182: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1186: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1187: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1218: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1222: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1223: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1254: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1258: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1259: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1290: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1294: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1295: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1326: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1330: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1331: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1362: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1366: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1367: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1398: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1402: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1403: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1434: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1438: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1439: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.ok(other.children!.length > 0);

		const deep = getByName(other, 'deep');
		assert.ok(deep);
		assert.ok(deep.children!.length > 0);
		assert.strictEqual(deep.children!.length, 4);
	});

	test('resolve directory - resolveTo multiple directories', () => {
		return testResolveDirectoryWithTarget(false);
	});

	test('resolve directory - resolveTo with a URI that has query parameter (https://github.com/microsoft/vscode/issues/128151)', () => {
		return testResolveDirectoryWithTarget(true);
	});

	async function testResolveDirectoryWithTarget(withQueryParam: boolean): Promise<void> {
		const resolverFixturesPath = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/resolver').fsPath;
		const result = await service.resolve(URI.file(resolverFixturesPath).with({ query: withQueryParam ? 'test' : undefined }), {
			resolveTo: [
				URI.file(join(resolverFixturesPath, 'other/deep')).with({ query: withQueryParam ? 'test' : undefined }),
				URI.file(join(resolverFixturesPath, 'examples')).with({ query: withQueryParam ? 'test' : undefined })
			]
		});

		assert.ok(result);
		assert.ok(result.children);
		assert.ok(result.children.length > 0);
		assert.ok(result.isDirectory);

		const children = result.children;
		assert.strictEqual(children.length, 4);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 387: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 388: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 392: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 393: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const other = getByName(result, 'other');
		assert.ok(other);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 454: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 458: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 459: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 463: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 464: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 523: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 527: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 528: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 532: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 533: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 572: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 576: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 577: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 581: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 582: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 621: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 625: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 626: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 630: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 631: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 670: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 674: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 675: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 679: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 680: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 719: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 723: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 724: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 728: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 729: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 768: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 772: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 773: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 777: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 778: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 817: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 821: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 822: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 826: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 827: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 866: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 870: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 871: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 875: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 876: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 915: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 919: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 920: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 924: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 925: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 964: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 968: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 969: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 973: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 974: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1013: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1017: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1018: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1022: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1023: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1062: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1066: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1067: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1071: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1072: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1111: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1115: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1116: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1120: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1121: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1160: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1164: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1165: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1169: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1170: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1209: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1213: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1214: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1218: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1219: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1258: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1262: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1263: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1267: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1268: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1307: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1311: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1312: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1316: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1317: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1356: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1360: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1361: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1365: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1366: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1405: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1409: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1410: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1414: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1415: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1454: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1458: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1459: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1463: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1464: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1503: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1507: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1508: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1512: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1513: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1552: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1556: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1557: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1561: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1562: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1601: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1605: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1606: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1610: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1611: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1650: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1654: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1655: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1659: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1660: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1699: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1703: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1704: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1708: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1709: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1748: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1752: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1753: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1757: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1758: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1797: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1801: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1802: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1806: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1807: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (5):
//   1. Line 1846: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1850: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1851: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1855: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1856: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.ok(other.children!.length > 0);

		const deep = getByName(other, 'deep');
		assert.ok(deep);
		assert.ok(deep.children!.length > 0);
		assert.strictEqual(deep.children!.length, 4);

		const examples = getByName(result, 'examples');
		assert.ok(examples);
		assert.ok(examples.children!.length > 0);
		assert.strictEqual(examples.children!.length, 4);
	}

	test('resolve directory - resolveSingleChildFolders', async () => {
		const resolverFixturesPath = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/resolver/other').fsPath;
		const result = await service.resolve(URI.file(resolverFixturesPath), { resolveSingleChildDescendants: true });

		assert.ok(result);
		assert.ok(result.children);
		assert.ok(result.children.length > 0);
		assert.ok(result.isDirectory);

		const children = result.children;
		assert.strictEqual(children.length, 1);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 410: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 411: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 421: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 424: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 436: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const deep = getByName(result, 'deep');
		assert.ok(deep);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 495: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 496: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 506: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 509: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 512: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 521: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 578: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 579: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 589: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 592: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 595: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 604: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 641: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 642: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 652: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 655: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 658: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 667: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 704: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 705: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 715: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 718: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 721: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 730: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 767: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 768: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 778: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 781: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 784: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 793: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 830: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 831: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 841: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 844: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 847: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 856: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 893: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 894: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 904: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 907: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 910: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 919: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 956: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 957: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 967: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 970: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 973: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 982: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1019: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1020: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1030: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1033: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1036: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1045: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1082: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1083: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1093: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1096: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1099: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1108: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1145: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1146: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1156: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1159: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1162: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1171: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1208: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1209: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1219: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1222: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1225: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1234: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1271: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1272: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1282: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1285: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1288: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1297: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1334: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1335: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1345: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1348: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1351: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1360: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1397: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1398: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1408: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1411: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1414: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1423: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1460: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1461: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1471: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1474: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1477: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1486: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1523: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1524: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1534: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1537: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1540: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1549: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1586: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1587: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1597: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1600: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1603: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1612: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1649: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1650: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1660: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1663: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1666: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1675: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1712: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1713: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1723: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1726: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1729: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1738: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1775: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1776: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1786: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1789: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1792: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1801: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1838: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1839: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1849: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1852: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1855: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1864: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1901: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1902: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1912: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1915: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1918: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1927: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 1964: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1965: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1975: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1978: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1981: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1990: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2027: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2028: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2038: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2041: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2044: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2053: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2090: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2091: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2101: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2104: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2107: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2116: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2153: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2154: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2164: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2167: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2170: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2179: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2216: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2217: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2227: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2230: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2233: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2242: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 2279: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2280: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2290: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2293: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 2296: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 2305: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.ok(deep.children!.length > 0);
		assert.strictEqual(deep.children!.length, 4);
	});

	test('resolves', async () => {
		const res = await service.resolveAll([
			{ resource: URI.file(testDir), options: { resolveTo: [URI.file(join(testDir, 'deep'))] } },
			{ resource: URI.file(join(testDir, 'deep')) }
		]);

		const r1 = (res[0].stat!);
		assert.strictEqual(r1.children!.length, 8);

		const deep = (getByName(r1, 'deep')!);
		assert.strictEqual(deep.children!.length, 4);

		const r2 = (res[1].stat!);
		assert.strictEqual(r2.children!.length, 4);
		assert.strictEqual(r2.name, 'deep');
	});

	test('resolve / realpath - folder symbolic link', async () => {
		const link = URI.file(join(testDir, 'deep-link'));
		await promises.symlink(join(testDir, 'deep'), link.fsPath, 'junction');

		const resolved = await service.resolve(link);
		assert.strictEqual(resolved.children!.length, 4);
		assert.strictEqual(resolved.isDirectory, true);
		assert.strictEqual(resolved.isSymbolicLink, true);

		const realpath = await service.realpath(link);
		assert.ok(realpath);
		assert.strictEqual(basename(realpath.fsPath), 'deep');
	});

	(isWindows ? test.skip /* windows: cannot create file symbolic link without elevated context */ : test)('resolve - file symbolic link', async () => {
		const link = URI.file(join(testDir, 'lorem.txt-linked'));
		await promises.symlink(join(testDir, 'lorem.txt'), link.fsPath);

		const resolved = await service.resolve(link);
		assert.strictEqual(resolved.isDirectory, false);
		assert.strictEqual(resolved.isSymbolicLink, true);
	});

	test('resolve - symbolic link pointing to nonexistent file does not break', async () => {
		await promises.symlink(join(testDir, 'foo'), join(testDir, 'bar'), 'junction');

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const resolved = await service.resolve(URI.file(testDir));
		assert.strictEqual(resolved.isDirectory, true);
		assert.strictEqual(resolved.children!.length, 9);

		const resolvedLink = resolved.children?.find(child => child.name === 'bar' && child.isSymbolicLink);
		assert.ok(resolvedLink);

		assert.ok(!resolvedLink?.isDirectory);
		assert.ok(!resolvedLink?.isFile);
	});

	test('stat - file', async () => {
		const resource = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/resolver/index.html');
		const resolved = await service.stat(resource);

		assert.strictEqual(resolved.name, 'index.html');
		assert.strictEqual(resolved.isFile, true);
		assert.strictEqual(resolved.isDirectory, false);
		assert.strictEqual(resolved.readonly, false);
		assert.strictEqual(resolved.isSymbolicLink, false);
		assert.strictEqual(resolved.resource.toString(), resource.toString());
		assert.ok(resolved.mtime > 0);
		assert.ok(resolved.ctime > 0);
		assert.ok(resolved.size > 0);
	});

	test('stat - directory', async () => {
		const resource = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/resolver');
		const result = await service.stat(resource);

		assert.ok(result);
		assert.strictEqual(result.resource.toString(), resource.toString());
		assert.strictEqual(result.name, 'resolver');
		assert.ok(result.isDirectory);
		assert.strictEqual(result.readonly, false);
		assert.ok(result.mtime > 0);
		assert.ok(result.ctime > 0);
	});

	test('deleteFile (non recursive)', async () => {
		return testDeleteFile(false, false);
	});

	test('deleteFile (recursive)', async () => {
		return testDeleteFile(false, true);
	});

	(isLinux /* trash is unreliable on Linux */ ? test.skip : test)('deleteFile (useTrash)', async () => {
		return testDeleteFile(true, false);
	});

	async function testDeleteFile(useTrash: boolean, recursive: boolean): Promise<void> {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const resource = URI.file(join(testDir, 'deep', 'conway.js'));
		const source = await service.resolve(resource);

		assert.strictEqual(await service.canDelete(source.resource, { useTrash, recursive }), true);
		await service.del(source.resource, { useTrash, recursive });

		assert.strictEqual(existsSync(source.resource.fsPath), false);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 521: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 522: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 623: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 624: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.DELETE);

		let error: Error | undefined = undefined;
		try {
			await service.del(source.resource, { useTrash, recursive });
		} catch (e) {
			error = e;
		}

		assert.ok(error);
		assert.strictEqual((<FileOperationError>error).fileOperationResult, FileOperationResult.FILE_NOT_FOUND);
	}

	(isWindows ? test.skip /* windows: cannot create file symbolic link without elevated context */ : test)('deleteFile - symbolic link (exists)', async () => {
		const target = URI.file(join(testDir, 'lorem.txt'));
		const link = URI.file(join(testDir, 'lorem.txt-linked'));
		await promises.symlink(target.fsPath, link.fsPath);

		const source = await service.resolve(link);

		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		assert.strictEqual(await service.canDelete(source.resource), true);
		await service.del(source.resource);

		assert.strictEqual(existsSync(source.resource.fsPath), false);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 551: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 552: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 663: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 664: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, link.fsPath);
		assert.strictEqual(event!.operation, FileOperation.DELETE);

		assert.strictEqual(existsSync(target.fsPath), true); // target the link pointed to is never deleted
	});

	(isWindows ? test.skip /* windows: cannot create file symbolic link without elevated context */ : test)('deleteFile - symbolic link (pointing to nonexistent file)', async () => {
		const target = URI.file(join(testDir, 'foo'));
		const link = URI.file(join(testDir, 'bar'));
		await promises.symlink(target.fsPath, link.fsPath);

		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		assert.strictEqual(await service.canDelete(link), true);
		await service.del(link);

		assert.strictEqual(existsSync(link.fsPath), false);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 571: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 572: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 693: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 694: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, link.fsPath);
		assert.strictEqual(event!.operation, FileOperation.DELETE);
	});

	test('deleteFolder (recursive)', async () => {
		return testDeleteFolderRecursive(false, false);
	});

	test('deleteFolder (recursive, atomic)', async () => {
		return testDeleteFolderRecursive(false, { postfix: '.vsctmp' });
	});

	(isLinux /* trash is unreliable on Linux */ ? test.skip : test)('deleteFolder (recursive, useTrash)', async () => {
		return testDeleteFolderRecursive(true, false);
	});

	async function testDeleteFolderRecursive(useTrash: boolean, atomic: IFileAtomicOptions | false): Promise<void> {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const resource = URI.file(join(testDir, 'deep'));
		const source = await service.resolve(resource);

		assert.strictEqual(await service.canDelete(source.resource, { recursive: true, useTrash, atomic }), true);
		await service.del(source.resource, { recursive: true, useTrash, atomic });

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 599: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 600: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(existsSync(source.resource.fsPath), false);
		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 731: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 732: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.DELETE);
	}

	test('deleteFolder (non recursive)', async () => {
		const resource = URI.file(join(testDir, 'deep'));
		const source = await service.resolve(resource);

		assert.ok((await service.canDelete(source.resource)) instanceof Error);

		let error;
		try {
			await service.del(source.resource);
		} catch (e) {
			error = e;
		}

		assert.ok(error);
	});

	test('deleteFolder empty folder (recursive)', () => {
		return testDeleteEmptyFolder(true);
	});

	test('deleteFolder empty folder (non recursive)', () => {
		return testDeleteEmptyFolder(false);
	});

	async function testDeleteEmptyFolder(recursive: boolean): Promise<void> {
		const { resource } = await service.createFolder(URI.file(join(testDir, 'deep', 'empty')));

		await service.del(resource, { recursive });

		assert.strictEqual(await service.exists(resource), false);
	}

	test('move', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = URI.file(join(testDir, 'index.html'));
		const sourceContents = readFileSync(source.fsPath);

		const target = URI.file(join(dirname(source.fsPath), 'other.html'));

		assert.strictEqual(await service.canMove(source, target), true);
		const renamed = await service.move(source, target);

		assert.strictEqual(existsSync(renamed.resource.fsPath), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 650: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 651: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 652: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 652: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(existsSync(source.fsPath), false);
		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 794: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 795: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 796: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 796: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 929: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 930: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 931: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 931: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1004: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1005: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1006: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1006: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1079: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1080: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1081: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1081: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1154: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1155: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1156: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1156: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1229: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1230: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1231: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1231: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1304: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1305: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1306: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1306: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1379: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1380: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1381: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1381: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1454: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1455: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1456: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1456: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1529: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1530: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1531: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1531: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1604: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1605: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1606: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1606: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1679: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1680: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1681: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1681: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1754: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1755: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1756: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1756: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1829: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1830: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1831: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1831: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1904: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1905: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1906: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1906: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1979: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1980: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1981: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1981: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2054: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2055: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2056: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2056: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2129: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2130: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2131: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2131: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2204: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2205: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2206: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2206: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2279: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2280: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2281: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2281: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2354: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2355: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2356: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2356: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2429: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2430: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2431: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2431: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2504: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2505: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2506: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2506: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2579: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2580: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2581: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2581: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2654: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2655: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2656: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2656: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2729: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2730: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2731: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2731: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2804: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2805: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2806: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2806: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2879: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2880: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2881: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2881: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2954: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2955: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2956: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2956: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, source.fsPath);
		assert.strictEqual(event!.operation, FileOperation.MOVE);
		assert.strictEqual(event!.target!.resource.fsPath, renamed.resource.fsPath);

		const targetContents = readFileSync(target.fsPath);

		assert.strictEqual(sourceContents.byteLength, targetContents.byteLength);
		assert.strictEqual(sourceContents.toString(), targetContents.toString());
	});

	test('move - across providers (buffered => buffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testMoveAcrossProviders();
	});

	test('move - across providers (unbuffered => unbuffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testMoveAcrossProviders();
	});

	test('move - across providers (buffered => unbuffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testMoveAcrossProviders();
	});

	test('move - across providers (unbuffered => buffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testMoveAcrossProviders();
	});

	test('move - across providers - large (buffered => buffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testMoveAcrossProviders('lorem.txt');
	});

	test('move - across providers - large (unbuffered => unbuffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testMoveAcrossProviders('lorem.txt');
	});

	test('move - across providers - large (buffered => unbuffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testMoveAcrossProviders('lorem.txt');
	});

	test('move - across providers - large (unbuffered => buffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testMoveAcrossProviders('lorem.txt');
	});

	async function testMoveAcrossProviders(sourceFile = 'index.html'): Promise<void> {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = URI.file(join(testDir, sourceFile));
		const sourceContents = readFileSync(source.fsPath);

		const target = URI.file(join(dirname(source.fsPath), 'other.html')).with({ scheme: testSchema });

		assert.strictEqual(await service.canMove(source, target), true);
		const renamed = await service.move(source, target);

		assert.strictEqual(existsSync(renamed.resource.fsPath), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 731: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 732: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 733: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 733: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(existsSync(source.fsPath), false);
		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 887: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 888: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 889: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 889: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1034: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1035: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1036: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1036: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1121: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1122: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1123: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1123: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1208: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1209: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1210: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1210: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1295: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1296: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1297: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1297: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1382: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1383: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1384: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1384: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1469: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1470: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1471: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1471: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1556: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1557: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1558: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1558: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1643: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1644: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1645: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1645: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1730: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1731: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1732: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1732: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1817: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1818: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1819: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1819: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1904: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1905: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1906: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1906: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1991: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1992: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1993: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1993: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2078: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2079: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2080: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2080: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2165: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2166: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2167: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2167: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2252: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2253: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2254: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2254: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2339: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2340: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2341: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2341: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2426: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2427: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2428: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2428: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2513: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2514: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2515: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2515: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2600: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2601: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2602: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2602: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2687: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2688: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2689: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2689: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2774: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2775: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2776: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2776: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2861: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2862: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2863: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2863: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2948: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2949: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2950: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2950: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3035: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3036: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3037: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3037: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3122: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3123: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3124: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3124: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3209: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3210: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3211: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3211: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3296: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3297: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3298: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3298: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3383: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3384: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3385: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3385: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, source.fsPath);
		assert.strictEqual(event!.operation, FileOperation.COPY);
		assert.strictEqual(event!.target!.resource.fsPath, renamed.resource.fsPath);

		const targetContents = readFileSync(target.fsPath);

		assert.strictEqual(sourceContents.byteLength, targetContents.byteLength);
		assert.strictEqual(sourceContents.toString(), targetContents.toString());
	}

	test('move - multi folder', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const multiFolderPaths = ['a', 'couple', 'of', 'folders'];
		const renameToPath = join(...multiFolderPaths, 'other.html');

		const source = URI.file(join(testDir, 'index.html'));

		assert.strictEqual(await service.canMove(source, URI.file(join(dirname(source.fsPath), renameToPath))), true);
		const renamed = await service.move(source, URI.file(join(dirname(source.fsPath), renameToPath)));

		assert.strictEqual(existsSync(renamed.resource.fsPath), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 756: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 757: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 758: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 758: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(existsSync(source.fsPath), false);
		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 924: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 925: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 926: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 926: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1083: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1084: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1085: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1085: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1182: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1183: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1184: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1184: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1281: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1282: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1283: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1283: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1380: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1381: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1382: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1382: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1479: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1480: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1481: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1481: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1578: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1579: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1580: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1580: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1677: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1678: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1679: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1679: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1776: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1777: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1778: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1778: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1875: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1876: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1877: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1877: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1974: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1975: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1976: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1976: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2073: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2074: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2075: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2075: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2172: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2173: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2174: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2174: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2271: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2272: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2273: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2273: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2370: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2371: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2372: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2372: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2469: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2470: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2471: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2471: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2568: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2569: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2570: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2570: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2667: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2668: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2669: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2669: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2766: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2767: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2768: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2768: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2865: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2866: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2867: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2867: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2964: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2965: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2966: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2966: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3063: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3064: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3065: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3065: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3162: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3163: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3164: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3164: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3261: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3262: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3263: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3263: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3360: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3361: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3362: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3362: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3459: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3460: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3461: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3461: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3558: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3559: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3560: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3560: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3657: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3658: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3659: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3659: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3756: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3757: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3758: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3758: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, source.fsPath);
		assert.strictEqual(event!.operation, FileOperation.MOVE);
		assert.strictEqual(event!.target!.resource.fsPath, renamed.resource.fsPath);
	});

	test('move - directory', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = URI.file(join(testDir, 'deep'));

		assert.strictEqual(await service.canMove(source, URI.file(join(dirname(source.fsPath), 'deeper'))), true);
		const renamed = await service.move(source, URI.file(join(dirname(source.fsPath), 'deeper')));

		assert.strictEqual(existsSync(renamed.resource.fsPath), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 773: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 774: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 775: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 775: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(existsSync(source.fsPath), false);
		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 953: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 954: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 955: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 955: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1124: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1125: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1126: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1126: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1235: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1236: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1237: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1237: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1346: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1347: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1348: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1348: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1457: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1458: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1459: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1459: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1568: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1569: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1570: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1570: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1679: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1680: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1681: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1681: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1790: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1791: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1792: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1792: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1901: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1902: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1903: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1903: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2012: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2013: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2014: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2014: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2123: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2124: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2125: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2125: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2234: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2235: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2236: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2236: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2345: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2346: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2347: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2347: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2456: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2457: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2458: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2458: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2567: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2568: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2569: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2569: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2678: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2679: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2680: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2680: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2789: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2790: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2791: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2791: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2900: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2901: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2902: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2902: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3011: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3012: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3013: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3013: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3122: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3123: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3124: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3124: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3233: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3234: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3235: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3235: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3344: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3345: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3346: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3346: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3455: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3456: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3457: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3457: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3566: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3567: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3568: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3568: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3677: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3678: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3679: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3679: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3788: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3789: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3790: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3790: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3899: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3900: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3901: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3901: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4010: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4011: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4012: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4012: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4121: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4122: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4123: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4123: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, source.fsPath);
		assert.strictEqual(event!.operation, FileOperation.MOVE);
		assert.strictEqual(event!.target!.resource.fsPath, renamed.resource.fsPath);
	});

	test('move - directory - across providers (buffered => buffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testMoveFolderAcrossProviders();
	});

	test('move - directory - across providers (unbuffered => unbuffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testMoveFolderAcrossProviders();
	});

	test('move - directory - across providers (buffered => unbuffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testMoveFolderAcrossProviders();
	});

	test('move - directory - across providers (unbuffered => buffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testMoveFolderAcrossProviders();
	});

	async function testMoveFolderAcrossProviders(): Promise<void> {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = URI.file(join(testDir, 'deep'));
		const sourceChildren = readdirSync(source.fsPath);

		const target = URI.file(join(dirname(source.fsPath), 'deeper')).with({ scheme: testSchema });

		assert.strictEqual(await service.canMove(source, target), true);
		const renamed = await service.move(source, target);

		assert.strictEqual(existsSync(renamed.resource.fsPath), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 821: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 822: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 823: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 823: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(existsSync(source.fsPath), false);
		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1013: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1014: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1015: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1015: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1196: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1197: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1198: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1198: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1319: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1320: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1321: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1321: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1442: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1443: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1444: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1444: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1565: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1566: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1567: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1567: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1688: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1689: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1690: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1690: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1811: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1812: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1813: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1813: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1934: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1935: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1936: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1936: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2057: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2058: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2059: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2059: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2180: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2181: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2182: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2182: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2303: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2304: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2305: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2305: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2426: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2427: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2428: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2428: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2549: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2550: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2551: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2551: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2672: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2673: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2674: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2674: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2795: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2796: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2797: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2797: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2918: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2919: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2920: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2920: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3041: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3042: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3043: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3043: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3164: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3165: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3166: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3166: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3287: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3288: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3289: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3289: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3410: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3411: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3412: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3412: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3533: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3534: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3535: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3535: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3656: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3657: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3658: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3658: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3779: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3780: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3781: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3781: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3902: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3903: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3904: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3904: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4025: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4026: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4027: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4027: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4148: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4149: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4150: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4150: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4271: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4272: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4273: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4273: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4394: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4395: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4396: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4396: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4517: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4518: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4519: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4519: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, source.fsPath);
		assert.strictEqual(event!.operation, FileOperation.COPY);
		assert.strictEqual(event!.target!.resource.fsPath, renamed.resource.fsPath);

		const targetChildren = readdirSync(target.fsPath);
		assert.strictEqual(sourceChildren.length, targetChildren.length);
		for (let i = 0; i < sourceChildren.length; i++) {
			assert.strictEqual(sourceChildren[i], targetChildren[i]);
		}
	}

	test('move - MIX CASE', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		assert.ok(source.size > 0);

		const renamedResource = URI.file(join(dirname(source.resource.fsPath), 'INDEX.html'));
		assert.strictEqual(await service.canMove(source.resource, renamedResource), true);
		let renamed = await service.move(source.resource, renamedResource);

		assert.strictEqual(existsSync(renamedResource.fsPath), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 846: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 847: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 848: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 848: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(basename(renamedResource.fsPath), 'INDEX.html');
		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1050: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1051: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1052: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1052: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1245: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1246: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1247: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1247: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1380: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1381: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1382: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1382: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1515: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1516: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1517: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1517: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1650: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1651: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1652: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1652: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1785: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1786: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1787: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1787: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1920: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1921: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1922: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1922: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2055: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2056: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2057: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2057: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2190: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2191: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2192: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2192: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2325: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2326: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2327: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2327: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2460: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2461: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2462: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2462: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2595: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2596: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2597: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2597: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2730: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2731: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2732: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2732: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2865: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2866: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2867: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2867: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3000: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3001: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3002: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3002: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3135: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3136: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3137: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3137: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3270: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3271: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3272: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3272: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3405: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3406: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3407: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3407: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3540: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3541: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3542: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3542: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3675: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3676: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3677: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3677: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3810: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3811: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3812: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3812: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3945: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3946: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3947: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3947: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4080: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4081: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4082: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4082: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4215: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4216: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4217: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4217: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4350: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4351: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4352: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4352: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4485: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4486: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4487: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4487: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4620: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4621: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4622: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4622: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4755: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4756: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4757: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4757: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4890: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4891: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4892: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4892: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, source.resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.MOVE);
		assert.strictEqual(event!.target!.resource.fsPath, renamedResource.fsPath);

		renamed = await service.resolve(renamedResource, { resolveMetadata: true });
		assert.strictEqual(source.size, renamed.size);
	});

	test('move - same file', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		assert.ok(source.size > 0);

		assert.strictEqual(await service.canMove(source.resource, URI.file(source.resource.fsPath)), true);
		let renamed = await service.move(source.resource, URI.file(source.resource.fsPath));

		assert.strictEqual(existsSync(renamed.resource.fsPath), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 867: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 868: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 869: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 869: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(basename(renamed.resource.fsPath), 'index.html');
		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1083: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1084: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1085: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1085: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1290: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1291: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1292: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1292: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1437: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1438: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1439: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1439: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1584: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1585: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1586: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1586: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1731: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1732: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1733: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1733: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1878: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1879: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1880: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1880: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2025: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2026: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2027: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2027: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2172: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2173: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2174: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2174: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2319: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2320: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2321: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2321: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2466: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2467: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2468: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2468: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2613: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2614: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2615: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2615: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2760: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2761: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2762: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2762: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2907: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2908: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2909: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2909: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3054: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3055: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3056: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3056: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3201: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3202: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3203: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3203: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3348: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3349: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3350: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3350: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3495: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3496: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3497: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3497: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3642: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3643: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3644: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3644: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3789: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3790: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3791: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3791: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3936: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3937: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3938: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3938: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4083: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4084: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4085: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4085: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4230: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4231: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4232: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4232: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4377: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4378: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4379: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4379: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4524: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4525: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4526: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4526: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4671: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4672: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4673: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4673: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4818: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4819: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4820: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4820: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4965: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4966: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4967: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4967: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5112: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5113: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5114: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5114: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5259: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5260: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5261: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5261: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, source.resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.MOVE);
		assert.strictEqual(event!.target!.resource.fsPath, renamed.resource.fsPath);

		renamed = await service.resolve(renamed.resource, { resolveMetadata: true });
		assert.strictEqual(source.size, renamed.size);
	});

	test('move - same file #2', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		assert.ok(source.size > 0);

		const targetParent = URI.file(testDir);
		const target = targetParent.with({ path: posix.join(targetParent.path, posix.basename(source.resource.path)) });

		assert.strictEqual(await service.canMove(source.resource, target), true);
		let renamed = await service.move(source.resource, target);

		assert.strictEqual(existsSync(renamed.resource.fsPath), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 891: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 892: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 893: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 893: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(basename(renamed.resource.fsPath), 'index.html');
		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1119: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1120: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1121: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1121: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1338: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1339: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1340: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1340: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1497: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1498: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1499: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1499: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1656: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1657: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1658: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1658: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1815: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1816: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1817: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1817: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1974: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1975: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1976: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1976: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2133: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2134: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2135: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2135: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2292: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2293: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2294: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2294: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2451: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2452: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2453: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2453: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2610: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2611: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2612: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2612: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2769: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2770: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2771: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2771: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2928: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2929: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2930: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2930: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3087: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3088: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3089: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3089: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3246: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3247: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3248: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3248: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3405: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3406: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3407: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3407: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3564: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3565: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3566: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3566: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3723: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3724: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3725: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3725: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3882: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3883: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3884: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3884: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4041: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4042: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4043: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4043: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4200: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4201: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4202: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4202: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4359: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4360: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4361: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4361: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4518: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4519: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4520: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4520: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4677: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4678: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4679: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4679: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4836: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4837: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4838: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4838: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4995: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4996: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4997: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4997: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5154: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5155: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5156: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5156: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5313: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5314: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5315: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5315: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5472: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5473: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5474: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5474: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5631: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5632: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5633: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5633: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, source.resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.MOVE);
		assert.strictEqual(event!.target!.resource.fsPath, renamed.resource.fsPath);

		renamed = await service.resolve(renamed.resource, { resolveMetadata: true });
		assert.strictEqual(source.size, renamed.size);
	});

	test('move - source parent of target', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		let source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		const originalSize = source.size;
		assert.ok(originalSize > 0);

		assert.ok((await service.canMove(URI.file(testDir), URI.file(join(testDir, 'binary.txt'))) instanceof Error));

		let error;
		try {
			await service.move(URI.file(testDir), URI.file(join(testDir, 'binary.txt')));
		} catch (e) {
			error = e;
		}

		assert.ok(error);
		assert.ok(!event!);

		source = await service.resolve(source.resource, { resolveMetadata: true });
		assert.strictEqual(originalSize, source.size);
	});

	test('move - FILE_MOVE_CONFLICT', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		let source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		const originalSize = source.size;
		assert.ok(originalSize > 0);

		assert.ok((await service.canMove(source.resource, URI.file(join(testDir, 'binary.txt'))) instanceof Error));

		let error;
		try {
			await service.move(source.resource, URI.file(join(testDir, 'binary.txt')));
		} catch (e) {
			error = e;
		}

		assert.strictEqual(error.fileOperationResult, FileOperationResult.FILE_MOVE_CONFLICT);
		assert.ok(!event!);

		source = await service.resolve(source.resource, { resolveMetadata: true });
		assert.strictEqual(originalSize, source.size);
	});

	test('move - overwrite folder with file', async () => {
		let createEvent: FileOperationEvent;
		let moveEvent: FileOperationEvent;
		let deleteEvent: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => {
			if (e.operation === FileOperation.CREATE) {
				createEvent = e;
			} else if (e.operation === FileOperation.DELETE) {
				deleteEvent = e;
			} else if (e.operation === FileOperation.MOVE) {
				moveEvent = e;
			}
		}));

		const parent = await service.resolve(URI.file(testDir));
		const folderResource = URI.file(join(parent.resource.fsPath, 'conway.js'));
		const f = await service.createFolder(folderResource);
		const source = URI.file(join(testDir, 'deep', 'conway.js'));

		assert.strictEqual(await service.canMove(source, f.resource, true), true);
		const moved = await service.move(source, f.resource, true);

		assert.strictEqual(existsSync(moved.resource.fsPath), true);
		assert.ok(statSync(moved.resource.fsPath).isFile);
		assert.ok(createEvent!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 974: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 975: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 975: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 976: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.ok(deleteEvent!);
		assert.ok(moveEvent!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1214: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1215: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1215: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1216: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1445: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1446: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1446: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1447: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1616: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1617: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1617: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1618: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1787: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1788: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1788: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1789: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1958: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1959: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1959: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1960: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2129: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2130: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2130: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2131: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2300: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2301: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2301: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2302: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2471: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2472: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2472: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2473: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2642: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2643: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2643: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2644: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2813: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2814: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2814: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2815: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2984: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2985: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2985: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2986: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3155: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3156: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3156: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3157: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3326: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3327: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3327: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3328: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3497: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3498: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3498: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3499: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3668: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3669: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3669: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3670: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3839: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3840: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3840: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3841: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4010: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4011: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4011: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4012: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4181: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4182: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4182: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4183: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4352: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4353: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4353: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4354: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4523: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4524: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4524: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4525: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4694: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4695: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4695: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4696: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4865: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4866: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4866: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4867: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5036: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5037: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5037: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5038: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5207: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5208: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5208: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5209: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5378: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5379: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5379: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5380: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5549: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5550: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5550: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5551: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5720: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5721: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5721: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5722: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5891: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5892: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5892: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5893: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6062: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6063: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6063: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6064: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(moveEvent!.resource.fsPath, source.fsPath);
		assert.strictEqual(moveEvent!.target!.resource.fsPath, moved.resource.fsPath);
		assert.strictEqual(deleteEvent!.resource.fsPath, folderResource.fsPath);
	});

	test('copy', async () => {
		await doTestCopy();
	});

	test('copy - unbuffered (FileSystemProviderCapabilities.FileReadWrite)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		await doTestCopy();
	});

	test('copy - unbuffered large (FileSystemProviderCapabilities.FileReadWrite)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		await doTestCopy('lorem.txt');
	});

	test('copy - buffered (FileSystemProviderCapabilities.FileOpenReadWriteClose)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		await doTestCopy();
	});

	test('copy - buffered large (FileSystemProviderCapabilities.FileOpenReadWriteClose)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		await doTestCopy('lorem.txt');
	});

	function setCapabilities(provider: TestDiskFileSystemProvider, capabilities: FileSystemProviderCapabilities): void {
		provider.capabilities = capabilities;
		if (isLinux) {
			provider.capabilities |= FileSystemProviderCapabilities.PathCaseSensitive;
		}
	}

	async function doTestCopy(sourceName: string = 'index.html') {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = await service.resolve(URI.file(join(testDir, sourceName)));
		const target = URI.file(join(testDir, 'other.html'));

		assert.strictEqual(await service.canCopy(source.resource, target), true);
		const copied = await service.copy(source.resource, target);

		assert.strictEqual(existsSync(copied.resource.fsPath), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1027: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1028: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1029: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1029: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(existsSync(source.resource.fsPath), true);
		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1279: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1280: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1281: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1281: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1522: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1523: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1524: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1524: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1705: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1706: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1707: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1707: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1888: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1889: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1890: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1890: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2071: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2072: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2073: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2073: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2254: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2255: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2256: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2256: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2437: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2438: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2439: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2439: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2620: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2621: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2622: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2622: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2803: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2804: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2805: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2805: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2986: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2987: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2988: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2988: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3169: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3170: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3171: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3171: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3352: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3353: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3354: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3354: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3535: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3536: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3537: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3537: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3718: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3719: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3720: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3720: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3901: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3902: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3903: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3903: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4084: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4085: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4086: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4086: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4267: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4268: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4269: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4269: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4450: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4451: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4452: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4452: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4633: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4634: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4635: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4635: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4816: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4817: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4818: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4818: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4999: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5000: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5001: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5001: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5182: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5183: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5184: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5184: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5365: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5366: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5367: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5367: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5548: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5549: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5550: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5550: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5731: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5732: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5733: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5733: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5914: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5915: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5916: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5916: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6097: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6098: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6099: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6099: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6280: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6281: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6282: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6282: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6463: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6464: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6465: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6465: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, source.resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.COPY);
		assert.strictEqual(event!.target!.resource.fsPath, copied.resource.fsPath);

		const sourceContents = readFileSync(source.resource.fsPath);
		const targetContents = readFileSync(target.fsPath);

		assert.strictEqual(sourceContents.byteLength, targetContents.byteLength);
		assert.strictEqual(sourceContents.toString(), targetContents.toString());
	}

	test('copy - overwrite folder with file', async () => {
		let createEvent: FileOperationEvent;
		let copyEvent: FileOperationEvent;
		let deleteEvent: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => {
			if (e.operation === FileOperation.CREATE) {
				createEvent = e;
			} else if (e.operation === FileOperation.DELETE) {
				deleteEvent = e;
			} else if (e.operation === FileOperation.COPY) {
				copyEvent = e;
			}
		}));

		const parent = await service.resolve(URI.file(testDir));
		const folderResource = URI.file(join(parent.resource.fsPath, 'conway.js'));
		const f = await service.createFolder(folderResource);
		const source = URI.file(join(testDir, 'deep', 'conway.js'));

		assert.strictEqual(await service.canCopy(source, f.resource, true), true);
		const copied = await service.copy(source, f.resource, true);

		assert.strictEqual(existsSync(copied.resource.fsPath), true);
		assert.ok(statSync(copied.resource.fsPath).isFile);
		assert.ok(createEvent!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1065: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1066: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1066: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1067: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.ok(deleteEvent!);
		assert.ok(copyEvent!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1329: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1330: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1330: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1331: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1584: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1585: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1585: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1586: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1779: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1780: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1780: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1781: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1974: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1975: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1975: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1976: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2169: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2170: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2170: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2171: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2364: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2365: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2365: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2366: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2559: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2560: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2560: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2561: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2754: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2755: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2755: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2756: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2949: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2950: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2950: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2951: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3144: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3145: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3145: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3146: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3339: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3340: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3340: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3341: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3534: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3535: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3535: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3536: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3729: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3730: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3730: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3731: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3924: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3925: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3925: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3926: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4119: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4120: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4120: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4121: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4314: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4315: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4315: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4316: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4509: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4510: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4510: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4511: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4704: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4705: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4705: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4706: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4899: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4900: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4900: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4901: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5094: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5095: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5095: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5096: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5289: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5290: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5290: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5291: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5484: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5485: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5485: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5486: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5679: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5680: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5680: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5681: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5874: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5875: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5875: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5876: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6069: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6070: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6070: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6071: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6264: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6265: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6265: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6266: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6459: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6460: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6460: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6461: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6654: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6655: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6655: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6656: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6849: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6850: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6850: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6851: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(copyEvent!.resource.fsPath, source.fsPath);
		assert.strictEqual(copyEvent!.target!.resource.fsPath, copied.resource.fsPath);
		assert.strictEqual(deleteEvent!.resource.fsPath, folderResource.fsPath);
	});

	test('copy - MIX CASE same target - no overwrite', async () => {
		let source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		const originalSize = source.size;
		assert.ok(originalSize > 0);

		const target = URI.file(join(dirname(source.resource.fsPath), 'INDEX.html'));

		const canCopy = await service.canCopy(source.resource, target);

		let error;
		let copied: IFileStatWithMetadata;
		try {
			copied = await service.copy(source.resource, target);
		} catch (e) {
			error = e;
		}

		if (isLinux) {
			assert.ok(!error);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 1091: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1093: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(canCopy, true);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 1365: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1367: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(existsSync(copied!.resource.fsPath), true);
			assert.ok(readdirSync(testDir).some(f => f === 'INDEX.html'));
			assert.strictEqual(source.size, copied!.size);
		} else {
			assert.ok(error);
			assert.ok(canCopy instanceof Error);

			source = await service.resolve(source.resource, { resolveMetadata: true });
			assert.strictEqual(originalSize, source.size);
		}
	});

	test('copy - MIX CASE same target - overwrite', async () => {
		let source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		const originalSize = source.size;
		assert.ok(originalSize > 0);

		const target = URI.file(join(dirname(source.resource.fsPath), 'INDEX.html'));

		const canCopy = await service.canCopy(source.resource, target, true);

		let error;
		let copied: IFileStatWithMetadata;
		try {
			copied = await service.copy(source.resource, target, true);
		} catch (e) {
			error = e;
		}

		if (isLinux) {
			assert.ok(!error);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 1124: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1126: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(canCopy, true);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 1408: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1410: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.strictEqual(existsSync(copied!.resource.fsPath), true);
			assert.ok(readdirSync(testDir).some(f => f === 'INDEX.html'));
			assert.strictEqual(source.size, copied!.size);
		} else {
			assert.ok(error);
			assert.ok(canCopy instanceof Error);

			source = await service.resolve(source.resource, { resolveMetadata: true });
			assert.strictEqual(originalSize, source.size);
		}
	});

	test('copy - MIX CASE different target - overwrite', async () => {
		const source1 = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		assert.ok(source1.size > 0);

		const renamed = await service.move(source1.resource, URI.file(join(dirname(source1.resource.fsPath), 'CONWAY.js')));
		assert.strictEqual(existsSync(renamed.resource.fsPath), true);
		assert.ok(readdirSync(testDir).some(f => f === 'CONWAY.js'));
		assert.strictEqual(source1.size, renamed.size);

		const source2 = await service.resolve(URI.file(join(testDir, 'deep', 'conway.js')), { resolveMetadata: true });
		const target = URI.file(join(testDir, basename(source2.resource.path)));

		assert.strictEqual(await service.canCopy(source2.resource, target, true), true);
		const res = await service.copy(source2.resource, target, true);
		assert.strictEqual(existsSync(res.resource.fsPath), true);
		assert.ok(readdirSync(testDir).some(f => f === 'conway.js'));
		assert.strictEqual(source2.size, res.size);
	});

	test('copy - same file', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		assert.ok(source.size > 0);

		assert.strictEqual(await service.canCopy(source.resource, URI.file(source.resource.fsPath)), true);
		let copied = await service.copy(source.resource, URI.file(source.resource.fsPath));

		assert.strictEqual(existsSync(copied.resource.fsPath), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1168: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1169: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1170: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1170: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(basename(copied.resource.fsPath), 'index.html');
		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1464: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1465: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1466: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1466: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1751: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1752: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1753: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1753: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1958: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1959: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1960: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1960: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2165: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2166: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2167: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2167: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2372: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2373: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2374: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2374: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2579: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2580: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2581: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2581: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2786: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2787: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2788: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2788: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2993: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2994: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2995: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2995: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3200: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3201: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3202: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3202: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3407: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3408: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3409: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3409: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3614: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3615: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3616: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3616: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3821: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3822: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3823: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3823: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4028: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4029: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4030: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4030: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4235: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4236: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4237: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4237: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4442: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4443: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4444: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4444: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4649: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4650: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4651: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4651: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4856: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4857: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4858: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4858: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5063: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5064: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5065: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5065: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5270: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5271: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5272: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5272: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5477: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5478: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5479: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5479: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5684: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5685: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5686: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5686: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5891: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5892: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5893: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5893: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6098: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6099: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6100: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6100: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6305: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6306: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6307: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6307: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6512: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6513: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6514: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6514: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6719: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6720: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6721: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6721: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6926: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6927: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6928: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6928: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 7133: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 7134: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 7135: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 7135: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 7340: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 7341: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 7342: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 7342: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, source.resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.COPY);
		assert.strictEqual(event!.target!.resource.fsPath, copied.resource.fsPath);

		copied = await service.resolve(source.resource, { resolveMetadata: true });
		assert.strictEqual(source.size, copied.size);
	});

	test('copy - same file #2', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		assert.ok(source.size > 0);

		const targetParent = URI.file(testDir);
		const target = targetParent.with({ path: posix.join(targetParent.path, posix.basename(source.resource.path)) });

		assert.strictEqual(await service.canCopy(source.resource, URI.file(target.fsPath)), true);
		let copied = await service.copy(source.resource, URI.file(target.fsPath));

		assert.strictEqual(existsSync(copied.resource.fsPath), true);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1192: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1193: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1194: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1194: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(basename(copied.resource.fsPath), 'index.html');
		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1500: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1501: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1502: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1502: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1799: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1800: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1801: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1801: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2018: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2019: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2020: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2020: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2237: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2238: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2239: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2239: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2456: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2457: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2458: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2458: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2675: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2676: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2677: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2677: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2894: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2895: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2896: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2896: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3113: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3114: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3115: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3115: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3332: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3333: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3334: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3334: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3551: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3552: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3553: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3553: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3770: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3771: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3772: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3772: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3989: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3990: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3991: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3991: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4208: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4209: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4210: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4210: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4427: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4428: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4429: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4429: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4646: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4647: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4648: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4648: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4865: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4866: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4867: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4867: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5084: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5085: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5086: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5086: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5303: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5304: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5305: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5305: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5522: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5523: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5524: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5524: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5741: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5742: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5743: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5743: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5960: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5961: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5962: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5962: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6179: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6180: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6181: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6181: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6398: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6399: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6400: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6400: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6617: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6618: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6619: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6619: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6836: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6837: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6838: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6838: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 7055: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 7056: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 7057: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 7057: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 7274: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 7275: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 7276: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 7276: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 7493: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 7494: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 7495: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 7495: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 7712: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 7713: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 7714: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 7714: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, source.resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.COPY);
		assert.strictEqual(event!.target!.resource.fsPath, copied.resource.fsPath);

		copied = await service.resolve(source.resource, { resolveMetadata: true });
		assert.strictEqual(source.size, copied.size);
	});

	test('cloneFile - basics', () => {
		return testCloneFile();
	});

	test('cloneFile - via copy capability', () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose | FileSystemProviderCapabilities.FileFolderCopy);

		return testCloneFile();
	});

	test('cloneFile - via pipe', () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testCloneFile();
	});

	async function testCloneFile(): Promise<void> {
		const source1 = URI.file(join(testDir, 'index.html'));
		const source1Size = (await service.resolve(source1, { resolveMetadata: true })).size;

		const source2 = URI.file(join(testDir, 'lorem.txt'));
		const source2Size = (await service.resolve(source2, { resolveMetadata: true })).size;

		const targetParent = URI.file(testDir);

		// same path is a no-op
		await service.cloneFile(source1, source1);

		// simple clone to existing parent folder path
		const target1 = targetParent.with({ path: posix.join(targetParent.path, `${posix.basename(source1.path)}-clone`) });

		await service.cloneFile(source1, URI.file(target1.fsPath));

		assert.strictEqual(existsSync(target1.fsPath), true);
		assert.strictEqual(basename(target1.fsPath), 'index.html-clone');

		let target1Size = (await service.resolve(target1, { resolveMetadata: true })).size;

		assert.strictEqual(source1Size, target1Size);

		// clone to same path overwrites
		await service.cloneFile(source2, URI.file(target1.fsPath));

		target1Size = (await service.resolve(target1, { resolveMetadata: true })).size;

		assert.strictEqual(source2Size, target1Size);
		assert.notStrictEqual(source1Size, target1Size);

		// clone creates missing folders ad-hoc
		const target2 = targetParent.with({ path: posix.join(targetParent.path, 'foo', 'bar', `${posix.basename(source1.path)}-clone`) });

		await service.cloneFile(source1, URI.file(target2.fsPath));

		assert.strictEqual(existsSync(target2.fsPath), true);
		assert.strictEqual(basename(target2.fsPath), 'index.html-clone');

		const target2Size = (await service.resolve(target2, { resolveMetadata: true })).size;

		assert.strictEqual(source1Size, target2Size);
	}

	test('readFile - small file - default', () => {
		return testReadFile(URI.file(join(testDir, 'small.txt')));
	});

	test('readFile - small file - buffered', () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testReadFile(URI.file(join(testDir, 'small.txt')));
	});

	test('readFile - small file - buffered / readonly', () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose | FileSystemProviderCapabilities.Readonly);

		return testReadFile(URI.file(join(testDir, 'small.txt')));
	});

	test('readFile - small file - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testReadFile(URI.file(join(testDir, 'small.txt')));
	});

	test('readFile - small file - unbuffered / readonly', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.Readonly);

		return testReadFile(URI.file(join(testDir, 'small.txt')));
	});

	test('readFile - small file - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testReadFile(URI.file(join(testDir, 'small.txt')));
	});

	test('readFile - small file - streamed / readonly', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream | FileSystemProviderCapabilities.Readonly);

		return testReadFile(URI.file(join(testDir, 'small.txt')));
	});

	test('readFile - large file - default', async () => {
		return testReadFile(URI.file(join(testDir, 'lorem.txt')));
	});

	test('readFile - large file - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testReadFile(URI.file(join(testDir, 'lorem.txt')));
	});

	test('readFile - large file - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testReadFile(URI.file(join(testDir, 'lorem.txt')));
	});

	test('readFile - large file - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testReadFile(URI.file(join(testDir, 'lorem.txt')));
	});

	test('readFile - atomic (emulated on service level)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testReadFile(URI.file(join(testDir, 'lorem.txt')), { atomic: true });
	});

	test('readFile - atomic (natively supported)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite & FileSystemProviderCapabilities.FileAtomicRead);

		return testReadFile(URI.file(join(testDir, 'lorem.txt')), { atomic: true });
	});

	async function testReadFile(resource: URI, options?: IReadFileOptions): Promise<void> {
		const content = await service.readFile(resource, options);

		assert.strictEqual(content.value.toString(), readFileSync(resource.fsPath).toString());
	}

	test('readFileStream - small file - default', () => {
		return testReadFileStream(URI.file(join(testDir, 'small.txt')));
	});

	test('readFileStream - small file - buffered', () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testReadFileStream(URI.file(join(testDir, 'small.txt')));
	});

	test('readFileStream - small file - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testReadFileStream(URI.file(join(testDir, 'small.txt')));
	});

	test('readFileStream - small file - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testReadFileStream(URI.file(join(testDir, 'small.txt')));
	});

	async function testReadFileStream(resource: URI): Promise<void> {
		const content = await service.readFileStream(resource);

		assert.strictEqual((await streamToBuffer(content.value)).toString(), readFileSync(resource.fsPath).toString());
	}

	test('readFile - Files are intermingled #38331 - default', async () => {
		return testFilesNotIntermingled();
	});

	test('readFile - Files are intermingled #38331 - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testFilesNotIntermingled();
	});

	test('readFile - Files are intermingled #38331 - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testFilesNotIntermingled();
	});

	test('readFile - Files are intermingled #38331 - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testFilesNotIntermingled();
	});

	async function testFilesNotIntermingled() {
		const resource1 = URI.file(join(testDir, 'lorem.txt'));
		const resource2 = URI.file(join(testDir, 'some_utf16le.css'));

		// load in sequence and keep data
		const value1 = await service.readFile(resource1);
		const value2 = await service.readFile(resource2);

		// load in parallel in expect the same result
		const result = await Promise.all([
			service.readFile(resource1),
			service.readFile(resource2)
		]);

		assert.strictEqual(result[0].value.toString(), value1.value.toString());
		assert.strictEqual(result[1].value.toString(), value2.value.toString());
	}

	test('readFile - from position (ASCII) - default', async () => {
		return testReadFileFromPositionAscii();
	});

	test('readFile - from position (ASCII) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testReadFileFromPositionAscii();
	});

	test('readFile - from position (ASCII) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testReadFileFromPositionAscii();
	});

	test('readFile - from position (ASCII) - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testReadFileFromPositionAscii();
	});

	async function testReadFileFromPositionAscii() {
		const resource = URI.file(join(testDir, 'small.txt'));

		const contents = await service.readFile(resource, { position: 6 });

		assert.strictEqual(contents.value.toString(), 'File');
	}

	test('readFile - from position (with umlaut) - default', async () => {
		return testReadFileFromPositionUmlaut();
	});

	test('readFile - from position (with umlaut) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testReadFileFromPositionUmlaut();
	});

	test('readFile - from position (with umlaut) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testReadFileFromPositionUmlaut();
	});

	test('readFile - from position (with umlaut) - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testReadFileFromPositionUmlaut();
	});

	async function testReadFileFromPositionUmlaut() {
		const resource = URI.file(join(testDir, 'small_umlaut.txt'));

		const contents = await service.readFile(resource, { position: Buffer.from('Small File with Ü').length });

		assert.strictEqual(contents.value.toString(), 'mlaut');
	}

	test('readFile - 3 bytes (ASCII) - default', async () => {
		return testReadThreeBytesFromFile();
	});

	test('readFile - 3 bytes (ASCII) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testReadThreeBytesFromFile();
	});

	test('readFile - 3 bytes (ASCII) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testReadThreeBytesFromFile();
	});

	test('readFile - 3 bytes (ASCII) - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testReadThreeBytesFromFile();
	});

	async function testReadThreeBytesFromFile() {
		const resource = URI.file(join(testDir, 'small.txt'));

		const contents = await service.readFile(resource, { length: 3 });

		assert.strictEqual(contents.value.toString(), 'Sma');
	}

	test('readFile - 20000 bytes (large) - default', async () => {
		return readLargeFileWithLength(20000);
	});

	test('readFile - 20000 bytes (large) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return readLargeFileWithLength(20000);
	});

	test('readFile - 20000 bytes (large) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return readLargeFileWithLength(20000);
	});

	test('readFile - 20000 bytes (large) - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return readLargeFileWithLength(20000);
	});

	test('readFile - 80000 bytes (large) - default', async () => {
		return readLargeFileWithLength(80000);
	});

	test('readFile - 80000 bytes (large) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return readLargeFileWithLength(80000);
	});

	test('readFile - 80000 bytes (large) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return readLargeFileWithLength(80000);
	});

	test('readFile - 80000 bytes (large) - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return readLargeFileWithLength(80000);
	});

	async function readLargeFileWithLength(length: number) {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		const contents = await service.readFile(resource, { length });

		assert.strictEqual(contents.value.byteLength, length);
	}

	test('readFile - FILE_IS_DIRECTORY', async () => {
		const resource = URI.file(join(testDir, 'deep'));

		let error: FileOperationError | undefined = undefined;
		try {
			await service.readFile(resource);
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.strictEqual(error.fileOperationResult, FileOperationResult.FILE_IS_DIRECTORY);
	});

	(isWindows /* error code does not seem to be supported on windows */ ? test.skip : test)('readFile - FILE_NOT_DIRECTORY', async () => {
		const resource = URI.file(join(testDir, 'lorem.txt', 'file.txt'));

		let error: FileOperationError | undefined = undefined;
		try {
			await service.readFile(resource);
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.strictEqual(error.fileOperationResult, FileOperationResult.FILE_NOT_DIRECTORY);
	});

	test('readFile - FILE_NOT_FOUND', async () => {
		const resource = URI.file(join(testDir, '404.html'));

		let error: FileOperationError | undefined = undefined;
		try {
			await service.readFile(resource);
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.strictEqual(error.fileOperationResult, FileOperationResult.FILE_NOT_FOUND);
	});

	test('readFile - FILE_NOT_MODIFIED_SINCE - default', async () => {
		return testNotModifiedSince();
	});

	test('readFile - FILE_NOT_MODIFIED_SINCE - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testNotModifiedSince();
	});

	test('readFile - FILE_NOT_MODIFIED_SINCE - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testNotModifiedSince();
	});

	test('readFile - FILE_NOT_MODIFIED_SINCE - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testNotModifiedSince();
	});

	async function testNotModifiedSince() {
		const resource = URI.file(join(testDir, 'index.html'));

		const contents = await service.readFile(resource);
		fileProvider.totalBytesRead = 0;

		let error: FileOperationError | undefined = undefined;
		try {
			await service.readFile(resource, { etag: contents.etag });
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.strictEqual(error.fileOperationResult, FileOperationResult.FILE_NOT_MODIFIED_SINCE);
		assert.ok(error instanceof NotModifiedSinceFileOperationError && error.stat);
		assert.strictEqual(fileProvider.totalBytesRead, 0);
	}

	test('readFile - FILE_NOT_MODIFIED_SINCE does not fire wrongly - https://github.com/microsoft/vscode/issues/72909', async () => {
		fileProvider.setInvalidStatSize(true);

		const resource = URI.file(join(testDir, 'index.html'));

		await service.readFile(resource);

		let error: FileOperationError | undefined = undefined;
		try {
			await service.readFile(resource, { etag: undefined });
		} catch (err) {
			error = err;
		}

		assert.ok(!error);
	});

	test('readFile - FILE_TOO_LARGE - default', async () => {
		return testFileTooLarge();
	});

	test('readFile - FILE_TOO_LARGE - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testFileTooLarge();
	});

	test('readFile - FILE_TOO_LARGE - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testFileTooLarge();
	});

	test('readFile - FILE_TOO_LARGE - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testFileTooLarge();
	});

	async function testFileTooLarge() {
		await doTestFileTooLarge(false);

		// Also test when the stat size is wrong
		fileProvider.setSmallStatSize(true);
		return doTestFileTooLarge(true);
	}

	async function doTestFileTooLarge(statSizeWrong: boolean) {
		const resource = URI.file(join(testDir, 'index.html'));

		let error: FileOperationError | undefined = undefined;
		try {
			await service.readFile(resource, { limits: { size: 10 } });
		} catch (err) {
			error = err;
		}

		if (!statSizeWrong) {
			assert.ok(error instanceof TooLargeFileOperationError);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			assert.ok(typeof error.size === 'number');
		}
		assert.strictEqual(error!.fileOperationResult, FileOperationResult.FILE_TOO_LARGE);
	}

	(isWindows ? test.skip /* windows: cannot create file symbolic link without elevated context */ : test)('readFile - dangling symbolic link - https://github.com/microsoft/vscode/issues/116049', async () => {
		const link = URI.file(join(testDir, 'small.js-link'));
		await promises.symlink(join(testDir, 'small.js'), link.fsPath);

		let error: FileOperationError | undefined = undefined;
		try {
			await service.readFile(link);
		} catch (err) {
			error = err;
		}

		assert.ok(error);
	});

	test('createFile', async () => {
		return assertCreateFile(contents => VSBuffer.fromString(contents));
	});

	test('createFile (readable)', async () => {
		return assertCreateFile(contents => bufferToReadable(VSBuffer.fromString(contents)));
	});

	test('createFile (stream)', async () => {
		return assertCreateFile(contents => bufferToStream(VSBuffer.fromString(contents)));
	});

	async function assertCreateFile(converter: (content: string) => VSBuffer | VSBufferReadable | VSBufferReadableStream): Promise<void> {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const contents = 'Hello World';
		const resource = URI.file(join(testDir, 'test.txt'));

		assert.strictEqual(await service.canCreateFile(resource), true);
		const fileStat = await service.createFile(resource, converter(contents));
		assert.strictEqual(fileStat.name, 'test.txt');
		assert.strictEqual(existsSync(fileStat.resource.fsPath), true);
		assert.strictEqual(readFileSync(fileStat.resource.fsPath).toString(), contents);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1738: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1739: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1740: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1740: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2065: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2066: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2067: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2067: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2376: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2377: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2378: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2378: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2607: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2608: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2609: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2609: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2838: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2839: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2840: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2840: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3069: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3070: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3071: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3071: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3300: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3301: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3302: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3302: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3531: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3532: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3533: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3533: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3762: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3763: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3764: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3764: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3993: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3994: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3995: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3995: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4224: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4225: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4226: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4226: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4455: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4456: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4457: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4457: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4686: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4687: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4688: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4688: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4917: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4918: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4919: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4919: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5148: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5149: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5150: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5150: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5379: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5380: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5381: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5381: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5610: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5611: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5612: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5612: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5841: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5842: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5843: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5843: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6072: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6073: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6074: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6074: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6303: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6304: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6305: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6305: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6534: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6535: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6536: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6536: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6765: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6766: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6767: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6767: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6996: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6997: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6998: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6998: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 7227: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 7228: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 7229: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 7229: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 7458: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 7459: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 7460: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 7460: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 7689: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 7690: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 7691: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 7691: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 7920: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 7921: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 7922: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 7922: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 8151: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 8152: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 8153: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 8153: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 8382: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 8383: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 8384: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 8384: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 8613: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 8614: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 8615: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 8615: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.CREATE);
		assert.strictEqual(event!.target!.resource.fsPath, resource.fsPath);
	}

	test('createFile (does not overwrite by default)', async () => {
		const contents = 'Hello World';
		const resource = URI.file(join(testDir, 'test.txt'));

		writeFileSync(resource.fsPath, ''); // create file

		assert.ok((await service.canCreateFile(resource)) instanceof Error);

		let error;
		try {
			await service.createFile(resource, VSBuffer.fromString(contents));
		} catch (err) {
			error = err;
		}

		assert.ok(error);
	});

	test('createFile (allows to overwrite existing)', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const contents = 'Hello World';
		const resource = URI.file(join(testDir, 'test.txt'));

		writeFileSync(resource.fsPath, ''); // create file

		assert.strictEqual(await service.canCreateFile(resource, { overwrite: true }), true);
		const fileStat = await service.createFile(resource, VSBuffer.fromString(contents), { overwrite: true });
		assert.strictEqual(fileStat.name, 'test.txt');
		assert.strictEqual(existsSync(fileStat.resource.fsPath), true);
		assert.strictEqual(readFileSync(fileStat.resource.fsPath).toString(), contents);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1777: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1778: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1779: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1779: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2116: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2117: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2118: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2118: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2439: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2440: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2441: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2441: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2682: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2683: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2684: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2684: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 2925: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2926: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 2927: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 2927: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3168: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3169: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3170: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3170: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3411: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3412: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3413: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3413: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3654: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3655: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3656: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3656: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 3897: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 3898: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 3899: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 3899: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4140: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4141: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4142: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4142: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4383: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4384: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4385: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4385: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4626: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4627: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4628: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4628: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 4869: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 4870: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 4871: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 4871: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5112: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5113: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5114: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5114: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5355: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5356: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5357: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5357: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5598: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5599: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5600: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5600: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 5841: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 5842: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 5843: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 5843: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6084: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6085: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6086: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6086: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6327: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6328: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6329: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6329: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6570: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6571: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6572: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6572: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 6813: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 6814: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 6815: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 6815: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 7056: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 7057: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 7058: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 7058: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 7299: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 7300: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 7301: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 7301: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 7542: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 7543: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 7544: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 7544: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 7785: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 7786: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 7787: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 7787: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 8028: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 8029: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 8030: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 8030: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 8271: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 8272: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 8273: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 8273: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 8514: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 8515: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 8516: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 8516: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 8757: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 8758: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 8759: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 8759: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 9000: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 9001: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 9002: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 9002: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.CREATE);
		assert.strictEqual(event!.target!.resource.fsPath, resource.fsPath);
	});

	test('writeFile - default', async () => {
		return testWriteFile(false);
	});

	test('writeFile - flush on write', async () => {
		DiskFileSystemProvider.configureFlushOnWrite(true);
		try {
			return await testWriteFile(false);
		} finally {
			DiskFileSystemProvider.configureFlushOnWrite(false);
		}
	});

	test('writeFile - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testWriteFile(false);
	});

	test('writeFile - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testWriteFile(false);
	});

	test('writeFile - default (atomic)', async () => {
		return testWriteFile(true);
	});

	test('writeFile - flush on write (atomic)', async () => {
		DiskFileSystemProvider.configureFlushOnWrite(true);
		try {
			return await testWriteFile(true);
		} finally {
			DiskFileSystemProvider.configureFlushOnWrite(false);
		}
	});

	test('writeFile - buffered (atomic)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose | FileSystemProviderCapabilities.FileAtomicWrite);

		let e;
		try {
			await testWriteFile(true);
		} catch (error) {
			e = error;
		}

		assert.ok(e);
	});

	test('writeFile - unbuffered (atomic)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.FileAtomicWrite);

		return testWriteFile(true);
	});

	(isWindows ? test.skip /* windows: cannot create file symbolic link without elevated context */ : test)('writeFile - atomic writing does not break symlinks', async () => {
		const link = URI.file(join(testDir, 'lorem.txt-linked'));
		await promises.symlink(join(testDir, 'lorem.txt'), link.fsPath);

		const content = 'Updates to the lorem file';
		await service.writeFile(link, VSBuffer.fromString(content), { atomic: { postfix: '.vsctmp' } });
		assert.strictEqual(readFileSync(link.fsPath).toString(), content);

		const resolved = await service.resolve(link);
		assert.strictEqual(resolved.isSymbolicLink, true);
	});

	async function testWriteFile(atomic: boolean) {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const resource = URI.file(join(testDir, 'small.txt'));

		const content = readFileSync(resource.fsPath).toString();
		assert.strictEqual(content, 'Small File');

		const newContent = 'Updates to the small file';
		await service.writeFile(resource, VSBuffer.fromString(newContent), { atomic: atomic ? { postfix: '.vsctmp' } : false });
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 1864: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1865: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.ok(event!);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 2213: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 2214: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(event!.resource.fsPath, resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.WRITE);

		assert.strictEqual(readFileSync(resource.fsPath).toString(), newContent);
	}

	test('writeFile (large file) - default', async () => {
		return testWriteFileLarge(false);
	});

	test('writeFile (large file) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testWriteFileLarge(false);
	});

	test('writeFile (large file) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testWriteFileLarge(false);
	});

	test('writeFile (large file) - default (atomic)', async () => {
		return testWriteFileLarge(true);
	});

	test('writeFile (large file) - buffered (atomic)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose | FileSystemProviderCapabilities.FileAtomicWrite);

		let e;
		try {
			await testWriteFileLarge(true);
		} catch (error) {
			e = error;
		}

		assert.ok(e);
	});

	test('writeFile (large file) - unbuffered (atomic)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.FileAtomicWrite);

		return testWriteFileLarge(true);
	});

	async function testWriteFileLarge(atomic: boolean) {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		const content = readFileSync(resource.fsPath);
		const newContent = content.toString() + content.toString();

		const fileStat = await service.writeFile(resource, VSBuffer.fromString(newContent), { atomic: atomic ? { postfix: '.vsctmp' } : false });
		assert.strictEqual(fileStat.name, 'lorem.txt');

		assert.strictEqual(readFileSync(resource.fsPath).toString(), newContent);
	}

	test('writeFile (large file) - unbuffered (atomic) - concurrent writes with multiple services', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.FileAtomicWrite);

		const resource = URI.file(join(testDir, 'lorem.txt'));

		const content = readFileSync(resource.fsPath);
		const newContent = content.toString() + content.toString();

		const promises: Promise<IFileStatWithMetadata>[] = [];
		let suffix = 0;
		for (let i = 0; i < 10; i++) {
			const service = disposables.add(new FileService(new NullLogService()));
			disposables.add(service.registerProvider(Schemas.file, fileProvider));

			promises.push(service.writeFile(resource, VSBuffer.fromString(`${newContent}${++suffix}`), { atomic: { postfix: '.vsctmp' } }));
			await timeout(0);
		}

		await Promise.allSettled(promises);

		assert.strictEqual(readFileSync(resource.fsPath).toString(), `${newContent}${suffix}`);
	});

	test('writeFile - buffered - readonly throws', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose | FileSystemProviderCapabilities.Readonly);

		return testWriteFileReadonlyThrows();
	});

	test('writeFile - unbuffered - readonly throws', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.Readonly);

		return testWriteFileReadonlyThrows();
	});

	async function testWriteFileReadonlyThrows() {
		const resource = URI.file(join(testDir, 'small.txt'));

		const content = readFileSync(resource.fsPath).toString();
		assert.strictEqual(content, 'Small File');

		const newContent = 'Updates to the small file';

		let error: Error;
		try {
			await service.writeFile(resource, VSBuffer.fromString(newContent));
		} catch (err) {
			error = err;
		}

		assert.ok(error!);
	}

	test('writeFile (large file) - multiple parallel writes queue up and atomic read support (via file service)', async () => {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		const content = readFileSync(resource.fsPath);
		const newContent = content.toString() + content.toString();

		const writePromises = Promise.all(['0', '00', '000', '0000', '00000'].map(async offset => {
			const fileStat = await service.writeFile(resource, VSBuffer.fromString(offset + newContent));
			assert.strictEqual(fileStat.name, 'lorem.txt');
		}));

		const readPromises = Promise.all(['0', '00', '000', '0000', '00000'].map(async () => {
			const fileContent = await service.readFile(resource, { atomic: true });
			assert.ok(fileContent.value.byteLength > 0); // `atomic: true` ensures we never read a truncated file
		}));

		await Promise.all([writePromises, readPromises]);
	});

	test('provider - write barrier prevents dirty writes', async () => {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		const content = readFileSync(resource.fsPath);
		const newContent = content.toString() + content.toString();

		const provider = service.getProvider(resource.scheme);
		assert.ok(provider);
		assert.ok(hasOpenReadWriteCloseCapability(provider));

		const writePromises = Promise.all(['0', '00', '000', '0000', '00000'].map(async offset => {
			const content = offset + newContent;
			const contentBuffer = VSBuffer.fromString(content).buffer;

			const fd = await provider.open(resource, { create: true, unlock: false });
			try {
				await provider.write(fd, 0, VSBuffer.fromString(content).buffer, 0, contentBuffer.byteLength);

				// Here since `close` is not called, all other writes are
				// waiting on the barrier to release, so doing a readFile
				// should give us a consistent view of the file contents
				assert.strictEqual((await promises.readFile(resource.fsPath)).toString(), content);
			} finally {
				await provider.close(fd);
			}
		}));

		await Promise.all([writePromises]);
	});

	test('provider - write barrier is partitioned per resource', async () => {
		const resource1 = URI.file(join(testDir, 'lorem.txt'));
		const resource2 = URI.file(join(testDir, 'test.txt'));

		const provider = service.getProvider(resource1.scheme);
		assert.ok(provider);
		assert.ok(hasOpenReadWriteCloseCapability(provider));

		const fd1 = await provider.open(resource1, { create: true, unlock: false });
		const fd2 = await provider.open(resource2, { create: true, unlock: false });

		const newContent = 'Hello World';

		try {
			await provider.write(fd1, 0, VSBuffer.fromString(newContent).buffer, 0, VSBuffer.fromString(newContent).buffer.byteLength);
			assert.strictEqual((await promises.readFile(resource1.fsPath)).toString(), newContent);

			await provider.write(fd2, 0, VSBuffer.fromString(newContent).buffer, 0, VSBuffer.fromString(newContent).buffer.byteLength);
			assert.strictEqual((await promises.readFile(resource2.fsPath)).toString(), newContent);
		} finally {
			await Promise.allSettled([
				await provider.close(fd1),
				await provider.close(fd2)
			]);
		}
	});

	test('provider - write barrier not becoming stale', async () => {
		const newFolder = join(testDir, 'new-folder');
		const newResource = URI.file(join(newFolder, 'lorem.txt'));

		const provider = service.getProvider(newResource.scheme);
		assert.ok(provider);
		assert.ok(hasOpenReadWriteCloseCapability(provider));

		let error: Error | undefined = undefined;
		try {
			await provider.open(newResource, { create: true, unlock: false });
		} catch (e) {
			error = e;
		}

		assert.ok(error); // expected because `new-folder` does not exist

		await promises.mkdir(newFolder);

		const content = readFileSync(URI.file(join(testDir, 'lorem.txt')).fsPath);
		const newContent = content.toString() + content.toString();
		const newContentBuffer = VSBuffer.fromString(newContent).buffer;

		const fd = await provider.open(newResource, { create: true, unlock: false });
		try {
			await provider.write(fd, 0, newContentBuffer, 0, newContentBuffer.byteLength);

			assert.strictEqual((await promises.readFile(newResource.fsPath)).toString(), newContent);
		} finally {
			await provider.close(fd);
		}
	});

	test('provider - atomic reads (write pending when read starts)', async () => {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		const content = readFileSync(resource.fsPath);
		const newContent = content.toString() + content.toString();
		const newContentBuffer = VSBuffer.fromString(newContent).buffer;

		const provider = service.getProvider(resource.scheme);
		assert.ok(provider);
		assert.ok(hasOpenReadWriteCloseCapability(provider));
		assert.ok(hasFileAtomicReadCapability(provider));

		let atomicReadPromise: Promise<Uint8Array> | undefined = undefined;
		const fd = await provider.open(resource, { create: true, unlock: false });
		try {

			// Start reading while write is pending
			atomicReadPromise = provider.readFile(resource, { atomic: true });

			// Simulate a slow write, giving the read
			// a chance to succeed if it were not atomic
			await timeout(20);

			await provider.write(fd, 0, newContentBuffer, 0, newContentBuffer.byteLength);
		} finally {
			await provider.close(fd);
		}

		assert.ok(atomicReadPromise);

		const atomicReadResult = await atomicReadPromise;
		assert.strictEqual(atomicReadResult.byteLength, newContentBuffer.byteLength);
	});

	test('provider - atomic reads (read pending when write starts)', async () => {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		const content = readFileSync(resource.fsPath);
		const newContent = content.toString() + content.toString();
		const newContentBuffer = VSBuffer.fromString(newContent).buffer;

		const provider = service.getProvider(resource.scheme);
		assert.ok(provider);
		assert.ok(hasOpenReadWriteCloseCapability(provider));
		assert.ok(hasFileAtomicReadCapability(provider));

		let atomicReadPromise = provider.readFile(resource, { atomic: true });

		const fdPromise = provider.open(resource, { create: true, unlock: false }).then(async fd => {
			try {
				return await provider.write(fd, 0, newContentBuffer, 0, newContentBuffer.byteLength);
			} finally {
				await provider.close(fd);
			}
		});

		let atomicReadResult = await atomicReadPromise;
		assert.strictEqual(atomicReadResult.byteLength, content.byteLength);

		await fdPromise;

		atomicReadPromise = provider.readFile(resource, { atomic: true });
		atomicReadResult = await atomicReadPromise;
		assert.strictEqual(atomicReadResult.byteLength, newContentBuffer.byteLength);
	});

	test('writeFile (readable) - default', async () => {
		return testWriteFileReadable();
	});

	test('writeFile (readable) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testWriteFileReadable();
	});

	test('writeFile (readable) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testWriteFileReadable();
	});

	async function testWriteFileReadable() {
		const resource = URI.file(join(testDir, 'small.txt'));

		const content = readFileSync(resource.fsPath).toString();
		assert.strictEqual(content, 'Small File');

		const newContent = 'Updates to the small file';
		await service.writeFile(resource, toLineByLineReadable(newContent));

		assert.strictEqual(readFileSync(resource.fsPath).toString(), newContent);
	}

	test('writeFile (large file - readable) - default', async () => {
		return testWriteFileLargeReadable();
	});

	test('writeFile (large file - readable) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testWriteFileLargeReadable();
	});

	test('writeFile (large file - readable) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testWriteFileLargeReadable();
	});

	async function testWriteFileLargeReadable() {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		const content = readFileSync(resource.fsPath);
		const newContent = content.toString() + content.toString();

		const fileStat = await service.writeFile(resource, toLineByLineReadable(newContent));
		assert.strictEqual(fileStat.name, 'lorem.txt');

		assert.strictEqual(readFileSync(resource.fsPath).toString(), newContent);
	}

	test('writeFile (stream) - default', async () => {
		return testWriteFileStream();
	});

	test('writeFile (stream) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testWriteFileStream();
	});

	test('writeFile (stream) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testWriteFileStream();
	});

	async function testWriteFileStream() {
		const source = URI.file(join(testDir, 'small.txt'));
		const target = URI.file(join(testDir, 'small-copy.txt'));

		const fileStat = await service.writeFile(target, streamToBufferReadableStream(createReadStream(source.fsPath)));
		assert.strictEqual(fileStat.name, 'small-copy.txt');

		const targetContents = readFileSync(target.fsPath).toString();
		assert.strictEqual(readFileSync(source.fsPath).toString(), targetContents);
	}

	test('writeFile (large file - stream) - default', async () => {
		return testWriteFileLargeStream();
	});

	test('writeFile (large file - stream) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testWriteFileLargeStream();
	});

	test('writeFile (large file - stream) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testWriteFileLargeStream();
	});

	async function testWriteFileLargeStream() {
		const source = URI.file(join(testDir, 'lorem.txt'));
		const target = URI.file(join(testDir, 'lorem-copy.txt'));

		const fileStat = await service.writeFile(target, streamToBufferReadableStream(createReadStream(source.fsPath)));
		assert.strictEqual(fileStat.name, 'lorem-copy.txt');

		const targetContents = readFileSync(target.fsPath).toString();
		assert.strictEqual(readFileSync(source.fsPath).toString(), targetContents);
	}

	test('writeFile (file is created including parents)', async () => {
		const resource = URI.file(join(testDir, 'other', 'newfile.txt'));

		const content = 'File is created including parent';
		const fileStat = await service.writeFile(resource, VSBuffer.fromString(content));
		assert.strictEqual(fileStat.name, 'newfile.txt');

		assert.strictEqual(readFileSync(resource.fsPath).toString(), content);
	});

	test('writeFile - locked files and unlocking', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.FileWriteUnlock);

		return testLockedFiles(false);
	});

	test('writeFile (stream) - locked files and unlocking', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose | FileSystemProviderCapabilities.FileWriteUnlock);

		return testLockedFiles(false);
	});

	test('writeFile - locked files and unlocking throws error when missing capability', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testLockedFiles(true);
	});

	test('writeFile (stream) - locked files and unlocking throws error when missing capability', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testLockedFiles(true);
	});

	async function testLockedFiles(expectError: boolean) {
		const lockedFile = URI.file(join(testDir, 'my-locked-file'));

		const content = await service.writeFile(lockedFile, VSBuffer.fromString('Locked File'));
		assert.strictEqual(content.locked, false);

		const stats = await promises.stat(lockedFile.fsPath);
		await promises.chmod(lockedFile.fsPath, stats.mode & ~0o200);

		let stat = await service.stat(lockedFile);
		assert.strictEqual(stat.locked, true);

		let error;
		const newContent = 'Updates to locked file';
		try {
			await service.writeFile(lockedFile, VSBuffer.fromString(newContent));
		} catch (e) {
			error = e;
		}

		assert.ok(error);
		error = undefined;

		if (expectError) {
			try {
				await service.writeFile(lockedFile, VSBuffer.fromString(newContent), { unlock: true });
			} catch (e) {
				error = e;
			}

			assert.ok(error);
		} else {
			await service.writeFile(lockedFile, VSBuffer.fromString(newContent), { unlock: true });
			assert.strictEqual(readFileSync(lockedFile.fsPath).toString(), newContent);

			stat = await service.stat(lockedFile);
			assert.strictEqual(stat.locked, false);
		}
	}

	test('writeFile (error when folder is encountered)', async () => {
		const resource = URI.file(testDir);

		let error: Error | undefined = undefined;
		try {
			await service.writeFile(resource, VSBuffer.fromString('File is created including parent'));
		} catch (err) {
			error = err;
		}

		assert.ok(error);
	});

	test('writeFile (no error when providing up to date etag)', async () => {
		const resource = URI.file(join(testDir, 'small.txt'));

		const stat = await service.resolve(resource);

		const content = readFileSync(resource.fsPath).toString();
		assert.strictEqual(content, 'Small File');

		const newContent = 'Updates to the small file';
		await service.writeFile(resource, VSBuffer.fromString(newContent), { etag: stat.etag, mtime: stat.mtime });

		assert.strictEqual(readFileSync(resource.fsPath).toString(), newContent);
	});

	test('writeFile - error when writing to file that has been updated meanwhile', async () => {
		const resource = URI.file(join(testDir, 'small.txt'));

		const stat = await service.resolve(resource);

		const content = readFileSync(resource.fsPath).toString();
		assert.strictEqual(content, 'Small File');

		const newContent = 'Updates to the small file';
		await service.writeFile(resource, VSBuffer.fromString(newContent), { etag: stat.etag, mtime: stat.mtime });

		const newContentLeadingToError = newContent + newContent;

		const fakeMtime = 1000;
		const fakeSize = 1000;

		let error: FileOperationError | undefined = undefined;
		try {
			await service.writeFile(resource, VSBuffer.fromString(newContentLeadingToError), { etag: etag({ mtime: fakeMtime, size: fakeSize }), mtime: fakeMtime });
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.ok(error instanceof FileOperationError);
		assert.strictEqual(error.fileOperationResult, FileOperationResult.FILE_MODIFIED_SINCE);
	});

	test('writeFile - no error when writing to file where size is the same', async () => {
		const resource = URI.file(join(testDir, 'small.txt'));

		const stat = await service.resolve(resource);

		const content = readFileSync(resource.fsPath).toString();
		assert.strictEqual(content, 'Small File');

		const newContent = content; // same content
		await service.writeFile(resource, VSBuffer.fromString(newContent), { etag: stat.etag, mtime: stat.mtime });

		const newContentLeadingToNoError = newContent; // writing the same content should be OK

		const fakeMtime = 1000;
		const actualSize = newContent.length;

		let error: FileOperationError | undefined = undefined;
		try {
			await service.writeFile(resource, VSBuffer.fromString(newContentLeadingToNoError), { etag: etag({ mtime: fakeMtime, size: actualSize }), mtime: fakeMtime });
		} catch (err) {
			error = err;
		}

		assert.ok(!error);
	});

	test('writeFile - no error when writing to file where content is the same', async () => {
		const resource = URI.file(join(testDir, 'small.txt'));

		await service.resolve(resource);

		const content = readFileSync(resource.fsPath).toString();
		assert.strictEqual(content, 'Small File');

		const newContent = content; // same content
		let error: FileOperationError | undefined = undefined;
		try {
			await service.writeFile(resource, VSBuffer.fromString(newContent), { etag: 'anything', mtime: 0 } /* fake it */);
		} catch (err) {
			error = err;
		}

		assert.ok(!error);
	});

	test('writeFile - error when writing to file where content is the same length but different', async () => {
		const resource = URI.file(join(testDir, 'small.txt'));

		await service.resolve(resource);

		const content = readFileSync(resource.fsPath).toString();
		assert.strictEqual(content, 'Small File');

		const newContent = content.split('').reverse().join(''); // reverse content
		let error: FileOperationError | undefined = undefined;
		try {
			await service.writeFile(resource, VSBuffer.fromString(newContent), { etag: 'anything', mtime: 0 } /* fake it */);
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.ok(error instanceof FileOperationError);
		assert.strictEqual(error.fileOperationResult, FileOperationResult.FILE_MODIFIED_SINCE);
	});

	test('writeFile - no error when writing to same nonexistent folder multiple times different new files', async () => {
		const newFolder = URI.file(join(testDir, 'some', 'new', 'folder'));

		const file1 = joinPath(newFolder, 'file-1');
		const file2 = joinPath(newFolder, 'file-2');
		const file3 = joinPath(newFolder, 'file-3');

		// this essentially verifies that the mkdirp logic implemented
		// in the file service is able to receive multiple requests for
		// the same folder and will not throw errors if another racing
		// call succeeded first.
		const newContent = 'Updates to the small file';
		await Promise.all([
			service.writeFile(file1, VSBuffer.fromString(newContent)),
			service.writeFile(file2, VSBuffer.fromString(newContent)),
			service.writeFile(file3, VSBuffer.fromString(newContent))
		]);

		assert.ok(service.exists(file1));
		assert.ok(service.exists(file2));
		assert.ok(service.exists(file3));
	});

	test('writeFile - error when writing to folder that is a file', async () => {
		const existingFile = URI.file(join(testDir, 'my-file'));

		await service.createFile(existingFile);

		const newFile = joinPath(existingFile, 'file-1');

		let error;
		const newContent = 'Updates to the small file';
		try {
			await service.writeFile(newFile, VSBuffer.fromString(newContent));
		} catch (e) {
			error = e;
		}

		assert.ok(error);
	});

	test('read - mixed positions', async () => {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		// read multiple times from position 0
		let buffer = VSBuffer.alloc(1024);
		let fd = await fileProvider.open(resource, { create: false });
		for (let i = 0; i < 3; i++) {
			await fileProvider.read(fd, 0, buffer.buffer, 0, 26);
			assert.strictEqual(buffer.slice(0, 26).toString(), 'Lorem ipsum dolor sit amet');
		}
		await fileProvider.close(fd);

		// read multiple times at various locations
		buffer = VSBuffer.alloc(1024);
		fd = await fileProvider.open(resource, { create: false });

		let posInFile = 0;

		await fileProvider.read(fd, posInFile, buffer.buffer, 0, 26);
		assert.strictEqual(buffer.slice(0, 26).toString(), 'Lorem ipsum dolor sit amet');
		posInFile += 26;

		await fileProvider.read(fd, posInFile, buffer.buffer, 0, 1);
		assert.strictEqual(buffer.slice(0, 1).toString(), ',');
		posInFile += 1;

		await fileProvider.read(fd, posInFile, buffer.buffer, 0, 12);
		assert.strictEqual(buffer.slice(0, 12).toString(), ' consectetur');
		posInFile += 12;

		await fileProvider.read(fd, 98 /* no longer in sequence of posInFile */, buffer.buffer, 0, 9);
		assert.strictEqual(buffer.slice(0, 9).toString(), 'fermentum');

		await fileProvider.read(fd, 27, buffer.buffer, 0, 12);
		assert.strictEqual(buffer.slice(0, 12).toString(), ' consectetur');

		await fileProvider.read(fd, 26, buffer.buffer, 0, 1);
		assert.strictEqual(buffer.slice(0, 1).toString(), ',');

		await fileProvider.read(fd, 0, buffer.buffer, 0, 26);
		assert.strictEqual(buffer.slice(0, 26).toString(), 'Lorem ipsum dolor sit amet');

		await fileProvider.read(fd, posInFile /* back in sequence */, buffer.buffer, 0, 11);
		assert.strictEqual(buffer.slice(0, 11).toString(), ' adipiscing');

		await fileProvider.close(fd);
	});

	test('write - mixed positions', async () => {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		const buffer = VSBuffer.alloc(1024);
		const fdWrite = await fileProvider.open(resource, { create: true, unlock: false });
		const fdRead = await fileProvider.open(resource, { create: false });

		let posInFileWrite = 0;
		let posInFileRead = 0;

		const initialContents = VSBuffer.fromString('Lorem ipsum dolor sit amet');
		await fileProvider.write(fdWrite, posInFileWrite, initialContents.buffer, 0, initialContents.byteLength);
		posInFileWrite += initialContents.byteLength;

		await fileProvider.read(fdRead, posInFileRead, buffer.buffer, 0, 26);
		assert.strictEqual(buffer.slice(0, 26).toString(), 'Lorem ipsum dolor sit amet');
		posInFileRead += 26;

		const contents = VSBuffer.fromString('Hello World');

		await fileProvider.write(fdWrite, posInFileWrite, contents.buffer, 0, contents.byteLength);
		posInFileWrite += contents.byteLength;

		await fileProvider.read(fdRead, posInFileRead, buffer.buffer, 0, contents.byteLength);
		assert.strictEqual(buffer.slice(0, contents.byteLength).toString(), 'Hello World');
		posInFileRead += contents.byteLength;

		await fileProvider.write(fdWrite, 6, contents.buffer, 0, contents.byteLength);

		await fileProvider.read(fdRead, 0, buffer.buffer, 0, 11);
		assert.strictEqual(buffer.slice(0, 11).toString(), 'Lorem Hello');

		await fileProvider.write(fdWrite, posInFileWrite, contents.buffer, 0, contents.byteLength);
		posInFileWrite += contents.byteLength;

		await fileProvider.read(fdRead, posInFileWrite - contents.byteLength, buffer.buffer, 0, contents.byteLength);
		assert.strictEqual(buffer.slice(0, contents.byteLength).toString(), 'Hello World');

		await fileProvider.close(fdWrite);
		await fileProvider.close(fdRead);
	});

	test('readonly - is handled properly for a single resource', async () => {
		fileProvider.setReadonly(true);

		const resource = URI.file(join(testDir, 'index.html'));

		const resolveResult = await service.resolve(resource);
		assert.strictEqual(resolveResult.readonly, true);

		const readResult = await service.readFile(resource);
		assert.strictEqual(readResult.readonly, true);

		let writeFileError: Error | undefined = undefined;
		try {
			await service.writeFile(resource, VSBuffer.fromString('Hello Test'));
		} catch (error) {
			writeFileError = error;
		}
		assert.ok(writeFileError);

		let deleteFileError: Error | undefined = undefined;
		try {
			await service.del(resource);
		} catch (error) {
			deleteFileError = error;
		}
		assert.ok(deleteFileError);
	});
});
