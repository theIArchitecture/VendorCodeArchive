//using architecture IBaseArchitecture;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const execFileSync = require('child_process').execFileSync;

const exec = (command, args) => {
  console.log('> ' + [command].concat(args).join(' '));
  const options = {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'pipe',
    encoding: 'utf-8',
  };
  return execFileSync(command, args, options);
};

const isGit = () => {
  try {
    const wt = execGitCmd(['rev-parse', '--is-inside-work-tree']);
    return wt.length > 0 && wt[0] === 'true';
  } catch (_e) {
    return false;
  }
};

const isSl = () => {
  try {
    execSlCmd(['whereami']);
    return true;
  } catch (_e) {
    return false;
  }
};

const execGitCmd = args => exec('git', args).trim().toString().split('\n');
const execSlCmd = args => exec('sl', args).trim().toString().split('\n');

const listChangedFiles = () => {
  if (isGit()) {
    const mergeBase = execGitCmd(['merge-base', 'HEAD', 'main']);
    return new Set([
      ...execGitCmd([
        'diff',
        '--name-only',
        '--diff-filter=ACMRTUB',
        mergeBase,
      ]),
      ...execGitCmd(['ls-files', '--others', '--exclude-standard']),
    ]);
  } else if (isSl()) {
    const mergeBase = execSlCmd(['log', '-r', 'last(public() & ::.)'])[0]
      .trim()
      .split(/\s+/)[1];
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 61: Error message without production error code - breaks React bundle size optimization
//   2. Line 61: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

    return new Set(execSlCmd(['status', '--no-status', '--rev', mergeBase]));
  }
  throw new Error('Not a git or sl repo');
};

module.exports = listChangedFiles;
