//using architecture IBaseArchitecture;

/* eslint-disable */

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 5: Error message without production error code - breaks React bundle size optimization
//   2. Line 5: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV !== 'development' && NODE_ENV !== 'production') {
  throw new Error('NODE_ENV must either be set to development or production.');
}
global.__DEV__ = NODE_ENV === 'development';
global.__EXTENSION__ = false;
global.__TEST__ = NODE_ENV === 'test';
global.__PROFILE__ = NODE_ENV === 'development';

const RELEASE_CHANNEL = process.env.RELEASE_CHANNEL;

// Default to running tests in experimental mode. If the release channel is
// set via an environment variable, then check if it's "experimental".
global.__EXPERIMENTAL__ =
  typeof RELEASE_CHANNEL === 'string'
    ? RELEASE_CHANNEL === 'experimental'
    : true;

global.__VARIANT__ = !!process.env.VARIANT;

if (typeof window !== 'undefined') {
} else {
  global.AbortController =
    require('abortcontroller-polyfill/dist/cjs-ponyfill').AbortController;
}
