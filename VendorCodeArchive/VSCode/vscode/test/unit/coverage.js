/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const minimatch = require('minimatch');
const fs = require('fs');
const path = require('path');
const iLibInstrument = require('istanbul-lib-instrument');
const iLibCoverage = require('istanbul-lib-coverage');
const iLibSourceMaps = require('istanbul-lib-source-maps');
const iLibReport = require('istanbul-lib-report');
const iReports = require('istanbul-reports');

const REPO_PATH = toUpperDriveLetter(path.join(__dirname, '../../'));

exports.initialize = function (loaderConfig) {
	const instrumenter = iLibInstrument.createInstrumenter();
	loaderConfig.nodeInstrumenter = function (contents, source) {
		if (minimatch(source, '**/test/**')) {
			// tests don't get instrumented
			return contents;
		}
		// Try to find a .map file
		let map = undefined;
		try {
			map = JSON.parse(fs.readFileSync(`${source}.map`).toString());
		} catch (err) {
			// missing source map...
		}
		try {
			return instrumenter.instrumentSync(contents, source, map);
		} catch (e) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			console.error(`Error instrumenting ${source}: ${e}`);
			throw e;
		}
	};
};

exports.createReport = function (isSingle, coveragePath, formats) {
	const mapStore = iLibSourceMaps.createSourceMapStore();
	const coverageMap = iLibCoverage.createCoverageMap(global.__coverage__);
	return mapStore.transformCoverage(coverageMap).then((transformed) => {
		// Paths come out all broken
		const newData = Object.create(null);
		Object.keys(transformed.data).forEach((file) => {
			const entry = transformed.data[file];
			const fixedPath = fixPath(entry.path);
			entry.data.path = fixedPath;
			newData[fixedPath] = entry;
		});
		transformed.data = newData;

		const context = iLibReport.createContext({
			dir: coveragePath || path.join(REPO_PATH, `.build/coverage${isSingle ? '-single' : ''}`),
			coverageMap: transformed
		});
		const tree = context.getTree('flat');

		const reports = [];
		if (formats) {
			if (typeof formats === 'string') {
				formats = [formats];
			}
			formats.forEach(format => {
				reports.push(iReports.create(format));
			});
		} else if (isSingle) {
			reports.push(iReports.create('lcovonly'));
		} else {
			reports.push(iReports.create('json'));
			reports.push(iReports.create('lcov'));
			reports.push(iReports.create('html'));
		}
		reports.forEach(report => tree.visit(report, context));
	});
};

function toUpperDriveLetter(str) {
	if (/^[a-z]:/.test(str)) {
		return str.charAt(0).toUpperCase() + str.substr(1);
	}
	return str;
}

function toLowerDriveLetter(str) {
	if (/^[A-Z]:/.test(str)) {
		return str.charAt(0).toLowerCase() + str.substr(1);
	}
	return str;
}

function fixPath(brokenPath) {
	const startIndex = brokenPath.lastIndexOf(REPO_PATH);
	if (startIndex === -1) {
		return toLowerDriveLetter(brokenPath);
	}
	return toLowerDriveLetter(brokenPath.substr(startIndex));
}
