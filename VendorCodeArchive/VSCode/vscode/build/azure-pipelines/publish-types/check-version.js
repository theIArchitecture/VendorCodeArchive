//using architecture IBaseArchitecture;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const child_process_1 = __importDefault(require("child_process"));
let tag = '';
try {
    tag = child_process_1.default
        .execSync('git describe --tags `git rev-list --tags --max-count=1`')
        .toString()
        .trim();
    if (!isValidTag(tag)) {
        throw Error(`Invalid tag ${tag}`);
    }
}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

catch (err) {
    console.error(err);
    console.error('Failed to update types');
    process.exit(1);
}
function isValidTag(t) {
    if (t.split('.').length !== 3) {
        return false;
    }
    const [major, minor, bug] = t.split('.');
    // Only release for tags like 1.34.0
    if (bug !== '0') {
        return false;
    }
    if (isNaN(parseInt(major, 10)) || isNaN(parseInt(minor, 10))) {
        return false;
    }
    return true;
}
//# sourceMappingURL=check-version.js.map