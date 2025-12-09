//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { join, resolve } from '../../../../base/common/path.js';
import { setUnexpectedErrorHandler } from '../../../../base/common/errors.js';
import { FileAccess } from '../../../../base/common/network.js';
import { DetailedLineRangeMapping, RangeMapping } from '../../../common/diff/rangeMapping.js';
import { LegacyLinesDiffComputer } from '../../../common/diff/legacyLinesDiffComputer.js';
import { DefaultLinesDiffComputer } from '../../../common/diff/defaultLinesDiffComputer/defaultLinesDiffComputer.js';
import { Range } from '../../../common/core/range.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { TextReplacement, TextEdit } from '../../../common/core/edits/textEdit.js';
import { AbstractText, ArrayText } from '../../../common/core/text/abstractText.js';
import { LinesDiff } from '../../../common/diff/linesDiffComputer.js';

suite('diffing fixtures', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		setUnexpectedErrorHandler(e => {
			throw e;
		});
	});


	const fixturesOutDir = FileAccess.asFileUri('vs/editor/test/node/diffing/fixtures').fsPath;
	// We want the dir in src, so we can directly update the source files if they disagree and create invalid files to capture the previous state.
	// This makes it very easy to update the fixtures.
	const fixturesSrcDir = resolve(fixturesOutDir).replaceAll('\\', '/').replace('/out/vs/editor/', '/src/vs/editor/');
	const folders = readdirSync(fixturesSrcDir);

	function runTest(folder: string, diffingAlgoName: 'legacy' | 'advanced') {
		const folderPath = join(fixturesSrcDir, folder);
		const files = readdirSync(folderPath);

		const firstFileName = files.find(f => f.startsWith('1.'))!;
		const secondFileName = files.find(f => f.startsWith('2.'))!;

		const firstContent = readFileSync(join(folderPath, firstFileName), 'utf8').replaceAll('\r\n', '\n').replaceAll('\r', '\n');
		const firstContentLines = firstContent.split(/\n/);
		const secondContent = readFileSync(join(folderPath, secondFileName), 'utf8').replaceAll('\r\n', '\n').replaceAll('\r', '\n');
		const secondContentLines = secondContent.split(/\n/);

		const diffingAlgo = diffingAlgoName === 'legacy' ? new LegacyLinesDiffComputer() : new DefaultLinesDiffComputer();

		const ignoreTrimWhitespace = folder.indexOf('trimws') >= 0;
		const diff = diffingAlgo.computeDiff(firstContentLines, secondContentLines, { ignoreTrimWhitespace, maxComputationTimeMs: Number.MAX_SAFE_INTEGER, computeMoves: true });

		if (diffingAlgoName === 'advanced' && !ignoreTrimWhitespace) {
			assertDiffCorrectness(diff, firstContentLines, secondContentLines);
		}

		function getDiffs(changes: readonly DetailedLineRangeMapping[]): IDetailedDiff[] {
			for (const c of changes) {
				RangeMapping.assertSorted(c.innerChanges ?? []);
			}

			return changes.map<IDetailedDiff>(c => ({
				originalRange: c.original.toString(),
				modifiedRange: c.modified.toString(),
				innerChanges: c.innerChanges?.map<IDiff>(c => ({
					originalRange: formatRange(c.originalRange, firstContentLines),
					modifiedRange: formatRange(c.modifiedRange, secondContentLines),
				})) || null
			}));
		}

		function formatRange(range: Range, lines: string[]): string {
			const toLastChar = range.endColumn === lines[range.endLineNumber - 1].length + 1;

			return '[' + range.startLineNumber + ',' + range.startColumn + ' -> ' + range.endLineNumber + ',' + range.endColumn + (toLastChar ? ' EOL' : '') + ']';
		}

		const actualDiffingResult: DiffingResult = {
			original: { content: firstContent, fileName: `./${firstFileName}` },
			modified: { content: secondContent, fileName: `./${secondFileName}` },
			diffs: getDiffs(diff.changes),
			moves: diff.moves.map(v => ({
				originalRange: v.lineRangeMapping.original.toString(),
				modifiedRange: v.lineRangeMapping.modified.toString(),
				changes: getDiffs(v.changes),
			}))
		};
		if (actualDiffingResult.moves?.length === 0) {
			delete actualDiffingResult.moves;
		}

		const expectedFilePath = join(folderPath, `${diffingAlgoName}.expected.diff.json`);
		const invalidFilePath = join(folderPath, `${diffingAlgoName}.invalid.diff.json`);

		const actualJsonStr = JSON.stringify(actualDiffingResult, null, '\t');

		if (!existsSync(expectedFilePath)) {
			// New test, create expected file
			writeFileSync(expectedFilePath, actualJsonStr);
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 102: Error message without production error code - breaks React bundle size optimization
//   2. Line 102: Error message without production error code - breaks React bundle size optimization
//   3. Line 108: Error message without production error code - breaks React bundle size optimization
//   4. Line 108: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			// Create invalid file so that this test fails on a re-run
			writeFileSync(invalidFilePath, '');
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 116: Error message without production error code - breaks React bundle size optimization
//   2. Line 116: Error message without production error code - breaks React bundle size optimization
//   3. Line 122: Error message without production error code - breaks React bundle size optimization
//   4. Line 122: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 128: Error message without production error code - breaks React bundle size optimization
//   2. Line 128: Error message without production error code - breaks React bundle size optimization
//   3. Line 134: Error message without production error code - breaks React bundle size optimization
//   4. Line 134: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 140: Error message without production error code - breaks React bundle size optimization
//   2. Line 140: Error message without production error code - breaks React bundle size optimization
//   3. Line 146: Error message without production error code - breaks React bundle size optimization
//   4. Line 146: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 152: Error message without production error code - breaks React bundle size optimization
//   2. Line 152: Error message without production error code - breaks React bundle size optimization
//   3. Line 158: Error message without production error code - breaks React bundle size optimization
//   4. Line 158: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 164: Error message without production error code - breaks React bundle size optimization
//   2. Line 164: Error message without production error code - breaks React bundle size optimization
//   3. Line 170: Error message without production error code - breaks React bundle size optimization
//   4. Line 170: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 176: Error message without production error code - breaks React bundle size optimization
//   2. Line 176: Error message without production error code - breaks React bundle size optimization
//   3. Line 182: Error message without production error code - breaks React bundle size optimization
//   4. Line 182: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 188: Error message without production error code - breaks React bundle size optimization
//   2. Line 188: Error message without production error code - breaks React bundle size optimization
//   3. Line 194: Error message without production error code - breaks React bundle size optimization
//   4. Line 194: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 200: Error message without production error code - breaks React bundle size optimization
//   2. Line 200: Error message without production error code - breaks React bundle size optimization
//   3. Line 206: Error message without production error code - breaks React bundle size optimization
//   4. Line 206: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 212: Error message without production error code - breaks React bundle size optimization
//   2. Line 212: Error message without production error code - breaks React bundle size optimization
//   3. Line 218: Error message without production error code - breaks React bundle size optimization
//   4. Line 218: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 224: Error message without production error code - breaks React bundle size optimization
//   2. Line 224: Error message without production error code - breaks React bundle size optimization
//   3. Line 230: Error message without production error code - breaks React bundle size optimization
//   4. Line 230: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 236: Error message without production error code - breaks React bundle size optimization
//   2. Line 236: Error message without production error code - breaks React bundle size optimization
//   3. Line 242: Error message without production error code - breaks React bundle size optimization
//   4. Line 242: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 248: Error message without production error code - breaks React bundle size optimization
//   2. Line 248: Error message without production error code - breaks React bundle size optimization
//   3. Line 254: Error message without production error code - breaks React bundle size optimization
//   4. Line 254: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 260: Error message without production error code - breaks React bundle size optimization
//   2. Line 260: Error message without production error code - breaks React bundle size optimization
//   3. Line 266: Error message without production error code - breaks React bundle size optimization
//   4. Line 266: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 272: Error message without production error code - breaks React bundle size optimization
//   2. Line 272: Error message without production error code - breaks React bundle size optimization
//   3. Line 278: Error message without production error code - breaks React bundle size optimization
//   4. Line 278: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 284: Error message without production error code - breaks React bundle size optimization
//   2. Line 284: Error message without production error code - breaks React bundle size optimization
//   3. Line 290: Error message without production error code - breaks React bundle size optimization
//   4. Line 290: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 296: Error message without production error code - breaks React bundle size optimization
//   2. Line 296: Error message without production error code - breaks React bundle size optimization
//   3. Line 302: Error message without production error code - breaks React bundle size optimization
//   4. Line 302: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 308: Error message without production error code - breaks React bundle size optimization
//   2. Line 308: Error message without production error code - breaks React bundle size optimization
//   3. Line 314: Error message without production error code - breaks React bundle size optimization
//   4. Line 314: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 320: Error message without production error code - breaks React bundle size optimization
//   2. Line 320: Error message without production error code - breaks React bundle size optimization
//   3. Line 326: Error message without production error code - breaks React bundle size optimization
//   4. Line 326: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 332: Error message without production error code - breaks React bundle size optimization
//   2. Line 332: Error message without production error code - breaks React bundle size optimization
//   3. Line 338: Error message without production error code - breaks React bundle size optimization
//   4. Line 338: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('No expected file! Expected and invalid files were written. Delete the invalid file to make the test pass.');
		} if (existsSync(invalidFilePath)) {
			const invalidJsonStr = readFileSync(invalidFilePath, 'utf8');
			if (invalidJsonStr === '') {
				// Update expected file
				writeFileSync(expectedFilePath, actualJsonStr);
				throw new Error(`Delete the invalid ${invalidFilePath} file to make the test pass.`);
			} else {
				const expectedFileDiffResult: DiffingResult = JSON.parse(invalidJsonStr);
				try {
					assert.deepStrictEqual(actualDiffingResult, expectedFileDiffResult);
				} catch (e) {
					writeFileSync(expectedFilePath, actualJsonStr);
					throw e;
				}
				// Test succeeded with the invalid file, restore expected file from invalid
				writeFileSync(expectedFilePath, invalidJsonStr);
				rmSync(invalidFilePath);
			}
		} else {
			const expectedJsonStr = readFileSync(expectedFilePath, 'utf8');
			const expectedFileDiffResult: DiffingResult = JSON.parse(expectedJsonStr);
			try {
				assert.deepStrictEqual(actualDiffingResult, expectedFileDiffResult);
			} catch (e) {
				// Backup expected file
				writeFileSync(invalidFilePath, expectedJsonStr);
				// Update expected file
				writeFileSync(expectedFilePath, actualJsonStr);
				throw e;
			}
		}
	}

	test(`test`, () => {
		runTest('invalid-diff-trimws', 'advanced');
	});

	for (const folder of folders) {
		for (const diffingAlgoName of ['legacy', 'advanced'] as const) {
			test(`${folder}-${diffingAlgoName}`, () => {
				runTest(folder, diffingAlgoName);
			});
		}
	}
});

interface DiffingResult {
	original: { content: string; fileName: string };
	modified: { content: string; fileName: string };

	diffs: IDetailedDiff[];
	moves?: IMoveInfo[];
}

interface IDetailedDiff {
	originalRange: string; // [startLineNumber, endLineNumberExclusive)
	modifiedRange: string; // [startLineNumber, endLineNumberExclusive)
	innerChanges: IDiff[] | null;
}

interface IDiff {
	originalRange: string; // [1,18 -> 1,19]
	modifiedRange: string; // [1,18 -> 1,19]
}

interface IMoveInfo {
	originalRange: string; // [startLineNumber, endLineNumberExclusive)
	modifiedRange: string; // [startLineNumber, endLineNumberExclusive)

	changes: IDetailedDiff[];
}

function assertDiffCorrectness(diff: LinesDiff, original: string[], modified: string[]) {
	const allInnerChanges = diff.changes.flatMap(c => c.innerChanges!);
	const edit = rangeMappingsToTextEdit(allInnerChanges, new ArrayText(modified));
	const result = edit.normalize().apply(new ArrayText(original));

	assert.deepStrictEqual(result, modified.join('\n'));
}

function rangeMappingsToTextEdit(rangeMappings: readonly RangeMapping[], modified: AbstractText): TextEdit {
	return new TextEdit(rangeMappings.map(m => {
		return new TextReplacement(
			m.originalRange,
			modified.getValueOfRange(m.modifiedRange)
		);
	}));
}
