//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { Event } from '../../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../../base/common/map.js';
import { ReadableStreamEvents } from '../../../../../../base/common/stream.js';
import { URI } from '../../../../../../base/common/uri.js';
import { FileSystemProviderCapabilities, FileType, IFileChange, IFileDeleteOptions, IFileOpenOptions, IFileOverwriteOptions, IFileReadStreamOptions, IFileService, IFileSystemProvider, IFileWriteOptions, IStat, IWatchOptions } from '../../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchContribution } from '../../../../../common/contributions.js';
import { INotebookService } from '../../../../notebook/common/notebookService.js';
import { IChatEditingService } from '../../../common/chatEditingService.js';
import { ChatEditingNotebookSnapshotScheme, deserializeSnapshot } from './chatEditingModifiedNotebookSnapshot.js';


export class ChatEditingNotebookFileSystemProviderContrib extends Disposable implements IWorkbenchContribution {
	static ID = 'chatEditingNotebookFileSystemProviderContribution';
	constructor(
		@IFileService private readonly fileService: IFileService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {

		super();
		const fileSystemProvider = instantiationService.createInstance(ChatEditingNotebookFileSystemProvider);
		this._register(this.fileService.registerProvider(ChatEditingNotebookSnapshotScheme, fileSystemProvider));
	}
}

type ChatEditingSnapshotNotebookContentQueryData = { sessionId: string; requestId: string | undefined; undoStop: string | undefined; viewType: string };

export class ChatEditingNotebookFileSystemProvider implements IFileSystemProvider {
	private static registeredFiles = new ResourceMap<VSBuffer>();
	public readonly capabilities: FileSystemProviderCapabilities = FileSystemProviderCapabilities.Readonly | FileSystemProviderCapabilities.FileAtomicRead | FileSystemProviderCapabilities.FileReadWrite;
	public static registerFile(resource: URI, buffer: VSBuffer): IDisposable {
		ChatEditingNotebookFileSystemProvider.registeredFiles.set(resource, buffer);
		return {
			dispose() {
				if (ChatEditingNotebookFileSystemProvider.registeredFiles.get(resource) === buffer) {
					ChatEditingNotebookFileSystemProvider.registeredFiles.delete(resource);
				}
			}
		};
	}

	constructor(
		@IChatEditingService private readonly _chatEditingService: IChatEditingService,
		@INotebookService private readonly notebookService: INotebookService) { }
	readonly onDidChangeCapabilities = Event.None;
	readonly onDidChangeFile: Event<readonly IFileChange[]> = Event.None;
	watch(_resource: URI, _opts: IWatchOptions): IDisposable {
		return Disposable.None;
	}
	async stat(_resource: URI): Promise<IStat> {
		return {
			type: FileType.File,
			ctime: 0,
			mtime: 0,
			size: 0
		};
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 67: Error message without production error code - breaks React bundle size optimization
//   2. Line 67: Error message without production error code - breaks React bundle size optimization
//   3. Line 70: Error message without production error code - breaks React bundle size optimization
//   4. Line 70: Error message without production error code - breaks React bundle size optimization
//   5. Line 73: Error message without production error code - breaks React bundle size optimization
//   6. Line 73: Error message without production error code - breaks React bundle size optimization
//   7. Line 76: Error message without production error code - breaks React bundle size optimization
//   8. Line 76: Error message without production error code - breaks React bundle size optimization
//   9. Line 79: Error message without production error code - breaks React bundle size optimization
//   10. Line 79: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	}
	mkdir(_resource: URI): Promise<void> {
		throw new Error('Method not implemented1.');
	}
	readdir(_resource: URI): Promise<[string, FileType][]> {
		throw new Error('Method not implemented2.');
	}
	delete(_resource: URI, _opts: IFileDeleteOptions): Promise<void> {
		throw new Error('Method not implemented3.');
	}
	rename(_from: URI, _to: URI, _opts: IFileOverwriteOptions): Promise<void> {
		throw new Error('Method not implemented4.');
	}
	copy?(_from: URI, _to: URI, _opts: IFileOverwriteOptions): Promise<void> {
		throw new Error('Method not implemented5.');
	}
	async readFile(resource: URI): Promise<Uint8Array> {
		const buffer = ChatEditingNotebookFileSystemProvider.registeredFiles.get(resource);
		if (buffer) {
			return buffer.buffer;
		}
		const queryData = JSON.parse(resource.query) as ChatEditingSnapshotNotebookContentQueryData;
		if (!queryData.viewType) {
			throw new Error('File not found, viewType not found');
		}
		const session = this._chatEditingService.getEditingSession(queryData.sessionId);
		if (!session || !queryData.requestId) {
			throw new Error('File not found, session not found');
		}
		const snapshotEntry = session.getSnapshot(queryData.requestId, queryData.undoStop || undefined, resource);
		if (!snapshotEntry) {
			throw new Error('File not found, snapshot not found');
		}

		const { data } = deserializeSnapshot(snapshotEntry.current);
		const { serializer } = await this.notebookService.withNotebookDataProvider(queryData.viewType);
		return serializer.notebookToData(data).then(s => s.buffer);
	}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 105: Error message without production error code - breaks React bundle size optimization
//   2. Line 105: Error message without production error code - breaks React bundle size optimization
//   3. Line 108: Error message without production error code - breaks React bundle size optimization
//   4. Line 108: Error message without production error code - breaks React bundle size optimization
//   5. Line 111: Error message without production error code - breaks React bundle size optimization
//   6. Line 111: Error message without production error code - breaks React bundle size optimization
//   7. Line 114: Error message without production error code - breaks React bundle size optimization
//   8. Line 114: Error message without production error code - breaks React bundle size optimization
//   9. Line 117: Error message without production error code - breaks React bundle size optimization
//   10. Line 117: Error message without production error code - breaks React bundle size optimization
//   11. Line 120: Error message without production error code - breaks React bundle size optimization
//   12. Line 120: Error message without production error code - breaks React bundle size optimization
//   13. Line 123: Error message without production error code - breaks React bundle size optimization
//   14. Line 123: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	writeFile?(__resource: URI, _content: Uint8Array, _opts: IFileWriteOptions): Promise<void> {
		throw new Error('Method not implemented7.');
	}
	readFileStream?(__resource: URI, _opts: IFileReadStreamOptions, _token: CancellationToken): ReadableStreamEvents<Uint8Array> {
		throw new Error('Method not implemented8.');
	}
	open?(__resource: URI, _opts: IFileOpenOptions): Promise<number> {
		throw new Error('Method not implemented9.');
	}
	close?(_fd: number): Promise<void> {
		throw new Error('Method not implemented10.');
	}
	read?(_fd: number, _pos: number, _data: Uint8Array, _offset: number, _length: number): Promise<number> {
		throw new Error('Method not implemented11.');
	}
	write?(_fd: number, _pos: number, _data: Uint8Array, _offset: number, _length: number): Promise<number> {
		throw new Error('Method not implemented12.');
	}
	cloneFile?(_from: URI, __to: URI): Promise<void> {
		throw new Error('Method not implemented13.');
	}
}
