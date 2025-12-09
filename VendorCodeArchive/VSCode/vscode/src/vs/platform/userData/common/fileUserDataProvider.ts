//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { IFileSystemProviderWithFileReadWriteCapability, IFileChange, IWatchOptions, IStat, IFileOverwriteOptions, FileType, IFileWriteOptions, IFileDeleteOptions, FileSystemProviderCapabilities, IFileSystemProviderWithFileReadStreamCapability, IFileReadStreamOptions, IFileSystemProviderWithFileAtomicReadCapability, hasFileFolderCopyCapability, IFileSystemProviderWithOpenReadWriteCloseCapability, IFileOpenOptions, IFileSystemProviderWithFileAtomicWriteCapability, IFileSystemProviderWithFileAtomicDeleteCapability, IFileSystemProviderWithFileFolderCopyCapability, IFileSystemProviderWithFileCloneCapability, hasFileCloneCapability, IFileAtomicReadOptions, IFileAtomicOptions } from '../../files/common/files.js';
import { URI } from '../../../base/common/uri.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { ReadableStreamEvents } from '../../../base/common/stream.js';
import { ILogService } from '../../log/common/log.js';
import { TernarySearchTree } from '../../../base/common/ternarySearchTree.js';
import { IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { ResourceSet } from '../../../base/common/map.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';

/**
 * This is a wrapper on top of the local filesystem provider which will
 * 	- Convert the user data resources to file system scheme and vice-versa
 *  - Enforces atomic reads for user data
 */
export class FileUserDataProvider extends Disposable implements
	IFileSystemProviderWithFileReadWriteCapability,
	IFileSystemProviderWithOpenReadWriteCloseCapability,
	IFileSystemProviderWithFileReadStreamCapability,
	IFileSystemProviderWithFileFolderCopyCapability,
	IFileSystemProviderWithFileAtomicReadCapability,
	IFileSystemProviderWithFileAtomicWriteCapability,
	IFileSystemProviderWithFileAtomicDeleteCapability,
	IFileSystemProviderWithFileCloneCapability {

	readonly capabilities: FileSystemProviderCapabilities;
	readonly onDidChangeCapabilities: Event<void>;

	private readonly _onDidChangeFile: Emitter<readonly IFileChange[]>;
	readonly onDidChangeFile: Event<readonly IFileChange[]>;

	private readonly watchResources: TernarySearchTree<URI, URI>;
	private readonly atomicReadWriteResources: ResourceSet;

	constructor(
		private readonly fileSystemScheme: string,
		private readonly fileSystemProvider: IFileSystemProviderWithFileReadWriteCapability & IFileSystemProviderWithOpenReadWriteCloseCapability & IFileSystemProviderWithFileReadStreamCapability & IFileSystemProviderWithFileAtomicReadCapability & IFileSystemProviderWithFileAtomicWriteCapability & IFileSystemProviderWithFileAtomicDeleteCapability,
		private readonly userDataScheme: string,
		private readonly userDataProfilesService: IUserDataProfilesService,
		private readonly uriIdentityService: IUriIdentityService,
		private readonly logService: ILogService,
	) {
		super();
		this.capabilities = this.fileSystemProvider.capabilities;
		this.onDidChangeCapabilities = this.fileSystemProvider.onDidChangeCapabilities;
		this._onDidChangeFile = this._register(new Emitter());
		this.onDidChangeFile = this._onDidChangeFile.event;
		this.watchResources = TernarySearchTree.forUris(() => !(this.capabilities & 1024 /* FileSystemProviderCapabilities.PathCaseSensitive */));
		this.atomicReadWriteResources = new ResourceSet((uri) => this.uriIdentityService.extUri.getComparisonKey(this.toFileSystemResource(uri)));
		this.updateAtomicReadWritesResources();
		this._register(userDataProfilesService.onDidChangeProfiles(() => this.updateAtomicReadWritesResources()));
		this._register(this.fileSystemProvider.onDidChangeFile(e => this.handleFileChanges(e)));
	}

	private updateAtomicReadWritesResources(): void {
		this.atomicReadWriteResources.clear();
		for (const profile of this.userDataProfilesService.profiles) {
			this.atomicReadWriteResources.add(profile.settingsResource);
			this.atomicReadWriteResources.add(profile.keybindingsResource);
			this.atomicReadWriteResources.add(profile.tasksResource);
			this.atomicReadWriteResources.add(profile.extensionsResource);
		}
	}

	open(resource: URI, opts: IFileOpenOptions): Promise<number> {
		return this.fileSystemProvider.open(this.toFileSystemResource(resource), opts);
	}

	close(fd: number): Promise<void> {
		return this.fileSystemProvider.close(fd);
	}

	read(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		return this.fileSystemProvider.read(fd, pos, data, offset, length);
	}

	write(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		return this.fileSystemProvider.write(fd, pos, data, offset, length);
	}

	watch(resource: URI, opts: IWatchOptions): IDisposable {
		this.watchResources.set(resource, resource);
		const disposable = this.fileSystemProvider.watch(this.toFileSystemResource(resource), opts);
		return toDisposable(() => {
			this.watchResources.delete(resource);
			disposable.dispose();
		});
	}

	stat(resource: URI): Promise<IStat> {
		return this.fileSystemProvider.stat(this.toFileSystemResource(resource));
	}

	mkdir(resource: URI): Promise<void> {
		return this.fileSystemProvider.mkdir(this.toFileSystemResource(resource));
	}

	rename(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> {
		return this.fileSystemProvider.rename(this.toFileSystemResource(from), this.toFileSystemResource(to), opts);
	}

	readFile(resource: URI, opts?: IFileAtomicReadOptions): Promise<Uint8Array> {
		return this.fileSystemProvider.readFile(this.toFileSystemResource(resource), opts);
	}

	readFileStream(resource: URI, opts: IFileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array> {
		return this.fileSystemProvider.readFileStream(this.toFileSystemResource(resource), opts, token);
	}

	readdir(resource: URI): Promise<[string, FileType][]> {
		return this.fileSystemProvider.readdir(this.toFileSystemResource(resource));
	}

	enforceAtomicReadFile(resource: URI): boolean {
		return this.atomicReadWriteResources.has(resource);
	}

	writeFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void> {
		return this.fileSystemProvider.writeFile(this.toFileSystemResource(resource), content, opts);
	}

	enforceAtomicWriteFile(resource: URI): IFileAtomicOptions | false {
		if (this.atomicReadWriteResources.has(resource)) {
			return { postfix: '.vsctmp' };
		}

		return false;
	}

	delete(resource: URI, opts: IFileDeleteOptions): Promise<void> {
		return this.fileSystemProvider.delete(this.toFileSystemResource(resource), opts);
	}

	copy(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> {
		if (hasFileFolderCopyCapability(this.fileSystemProvider)) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 144: Error message without production error code - breaks React bundle size optimization
//   2. Line 144: Error message without production error code - breaks React bundle size optimization
//   3. Line 151: Error message without production error code - breaks React bundle size optimization
//   4. Line 151: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			return this.fileSystemProvider.copy(this.toFileSystemResource(from), this.toFileSystemResource(to), opts);
		}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 158: Error message without production error code - breaks React bundle size optimization
//   2. Line 158: Error message without production error code - breaks React bundle size optimization
//   3. Line 165: Error message without production error code - breaks React bundle size optimization
//   4. Line 165: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 170: Error message without production error code - breaks React bundle size optimization
//   2. Line 170: Error message without production error code - breaks React bundle size optimization
//   3. Line 177: Error message without production error code - breaks React bundle size optimization
//   4. Line 177: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 182: Error message without production error code - breaks React bundle size optimization
//   2. Line 182: Error message without production error code - breaks React bundle size optimization
//   3. Line 189: Error message without production error code - breaks React bundle size optimization
//   4. Line 189: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 194: Error message without production error code - breaks React bundle size optimization
//   2. Line 194: Error message without production error code - breaks React bundle size optimization
//   3. Line 201: Error message without production error code - breaks React bundle size optimization
//   4. Line 201: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 206: Error message without production error code - breaks React bundle size optimization
//   2. Line 206: Error message without production error code - breaks React bundle size optimization
//   3. Line 213: Error message without production error code - breaks React bundle size optimization
//   4. Line 213: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 218: Error message without production error code - breaks React bundle size optimization
//   2. Line 218: Error message without production error code - breaks React bundle size optimization
//   3. Line 225: Error message without production error code - breaks React bundle size optimization
//   4. Line 225: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 230: Error message without production error code - breaks React bundle size optimization
//   2. Line 230: Error message without production error code - breaks React bundle size optimization
//   3. Line 237: Error message without production error code - breaks React bundle size optimization
//   4. Line 237: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 242: Error message without production error code - breaks React bundle size optimization
//   2. Line 242: Error message without production error code - breaks React bundle size optimization
//   3. Line 249: Error message without production error code - breaks React bundle size optimization
//   4. Line 249: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('copy not supported');
	}

	cloneFile(from: URI, to: URI): Promise<void> {
		if (hasFileCloneCapability(this.fileSystemProvider)) {
			return this.fileSystemProvider.cloneFile(this.toFileSystemResource(from), this.toFileSystemResource(to));
		}
		throw new Error('clone not supported');
	}

	private handleFileChanges(changes: readonly IFileChange[]): void {
		const userDataChanges: IFileChange[] = [];
		for (const change of changes) {
			if (change.resource.scheme !== this.fileSystemScheme) {
				continue; // only interested in file schemes
			}

			const userDataResource = this.toUserDataResource(change.resource);
			if (this.watchResources.findSubstr(userDataResource)) {
				userDataChanges.push({
					resource: userDataResource,
					type: change.type,
					cId: change.cId
				});
			}
		}
		if (userDataChanges.length) {
			this.logService.debug('User data changed');
			this._onDidChangeFile.fire(userDataChanges);
		}
	}

	private toFileSystemResource(userDataResource: URI): URI {
		return userDataResource.with({ scheme: this.fileSystemScheme });
	}

	private toUserDataResource(fileSystemResource: URI): URI {
		return fileSystemResource.with({ scheme: this.userDataScheme });
	}

}
