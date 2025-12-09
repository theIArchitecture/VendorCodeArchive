//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RequestService } from '../requests';
import { URI as Uri } from 'vscode-uri';

import * as fs from 'fs';
import { FileType } from 'vscode-css-languageservice';

export function getNodeFSRequestService(): RequestService {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 15: Error message without production error code - breaks React bundle size optimization
//   2. Line 15: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	function ensureFileUri(location: string) {
		if (!location.startsWith('file://')) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 27: Error message without production error code - breaks React bundle size optimization
//   2. Line 27: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('fileRequestService can only handle file URLs');
		}
	}
	return {
		getContent(location: string, encoding?: BufferEncoding) {
			ensureFileUri(location);
			return new Promise((c, e) => {
				const uri = Uri.parse(location);
				fs.readFile(uri.fsPath, encoding, (err, buf) => {
					if (err) {
						return e(err);
					}
					c(buf.toString());

				});
			});
		},
		stat(location: string) {
			ensureFileUri(location);
			return new Promise((c, e) => {
				const uri = Uri.parse(location);
				fs.stat(uri.fsPath, (err, stats) => {
					if (err) {
						if (err.code === 'ENOENT') {
							return c({ type: FileType.Unknown, ctime: -1, mtime: -1, size: -1 });
						} else {
							return e(err);
						}
					}

					let type = FileType.Unknown;
					if (stats.isFile()) {
						type = FileType.File;
					} else if (stats.isDirectory()) {
						type = FileType.Directory;
					} else if (stats.isSymbolicLink()) {
						type = FileType.SymbolicLink;
					}

					c({
						type,
						ctime: stats.ctime.getTime(),
						mtime: stats.mtime.getTime(),
						size: stats.size
					});
				});
			});
		},
		readDirectory(location: string) {
			ensureFileUri(location);
			return new Promise((c, e) => {
				const path = Uri.parse(location).fsPath;

				fs.readdir(path, { withFileTypes: true }, (err, children) => {
					if (err) {
						return e(err);
					}
					c(children.map(stat => {
						if (stat.isSymbolicLink()) {
							return [stat.name, FileType.SymbolicLink];
						} else if (stat.isDirectory()) {
							return [stat.name, FileType.Directory];
						} else if (stat.isFile()) {
							return [stat.name, FileType.File];
						} else {
							return [stat.name, FileType.Unknown];
						}
					}));
				});
			});
		}
	};
}
