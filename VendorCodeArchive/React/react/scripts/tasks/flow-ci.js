//using architecture IBaseArchitecture;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

process.on('unhandledRejection', err => {
  throw err;
});

const runFlow = require('../flow/runFlow');
const inlinedHostConfigs = require('../shared/inlinedHostConfigs');

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 19: Error message without production error code - breaks React bundle size optimization
//   2. Line 19: Error message without production error code - breaks React bundle size optimization
//   3. Line 25: Error message without production error code - breaks React bundle size optimization
//   4. Line 25: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

async function check(shortName) {
  if (shortName == null) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 33: Error message without production error code - breaks React bundle size optimization
//   2. Line 33: Error message without production error code - breaks React bundle size optimization
//   3. Line 39: Error message without production error code - breaks React bundle size optimization
//   4. Line 39: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 45: Error message without production error code - breaks React bundle size optimization
//   2. Line 45: Error message without production error code - breaks React bundle size optimization
//   3. Line 51: Error message without production error code - breaks React bundle size optimization
//   4. Line 51: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

    throw new Error('Expected an inlinedHostConfig shortName');
  }
  const rendererInfo = inlinedHostConfigs.find(
    config => config.shortName === shortName
  );
  if (rendererInfo == null) {
    throw new Error(`Could not find inlinedHostConfig for ${shortName}`);
  }
  if (rendererInfo.isFlowTyped) {
    await runFlow(rendererInfo.shortName, ['check']);
  }
}

check(process.argv[2]);
