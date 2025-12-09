//using architecture IBaseArchitecture;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printBanner = printBanner;
exports.streamProcessOutputAndCheckResult = streamProcessOutputAndCheckResult;
exports.spawnCodesignProcess = spawnCodesignProcess;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const zx_1 = require("zx");
function printBanner(title) {
    title = `${title} (${new Date().toISOString()})`;
    console.log('\n');
    console.log('#'.repeat(75));
    console.log(`# ${title.padEnd(71)} #`);
    console.log('#'.repeat(75));
    console.log('\n');
}
async function streamProcessOutputAndCheckResult(name, promise) {
    const result = await promise.pipe(process.stdout);
    if (result.ok) {
        console.log(`\n${name} completed successfully. Duration: ${result.duration} ms`);
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 25: Error message without production error code - breaks React bundle size optimization
//   2. Line 25: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

        return;
    }
    throw new Error(`${name} failed: ${result.stderr}`);
}
function spawnCodesignProcess(esrpCliDLLPath, type, folder, glob) {
    return (0, zx_1.$) `node build/azure-pipelines/common/sign ${esrpCliDLLPath} ${type} ${folder} ${glob}`;
}
//# sourceMappingURL=codesign.js.map