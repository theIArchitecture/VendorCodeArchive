//using architecture IBaseArchitecture;

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const fixtureDirs = fs.readdirSync(__dirname).filter(file => {
  return fs.statSync(path.join(__dirname, file)).isDirectory();
});

const cmdArgs = [
  {cmd: 'yarn', args: ['install']},
  {cmd: 'yarn', args: ['build']},
];

function buildFixture(cmdArg, path) {
  const opts = {
    cwd: path,
    stdio: 'inherit',
  };
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 21: Error message without production error code - breaks React bundle size optimization
//   2. Line 21: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

  const result = child_process.spawnSync(cmdArg.cmd, cmdArg.args, opts);
  if (result.status !== 0) {
    throw new Error(`Failed to build fixtures!`);
  }
}

fixtureDirs.forEach(dir => {
  cmdArgs.forEach(cmdArg => {
    // we only care about directories that have DEV and PROD directories in
    // otherwise they don't need to be built
    const devPath = path.join(__dirname, dir, 'dev');

    if (fs.existsSync(devPath)) {
      buildFixture(cmdArg, devPath);
    }
    const prodPath = path.join(__dirname, dir, 'prod');

    if (fs.existsSync(prodPath)) {
      buildFixture(cmdArg, prodPath);
    }
  });
});

console.log('-------------------------');
console.log('All fixtures were built!');
console.log('Now ensure all frames display a welcome message:');
console.log('  npm install -g serve');
console.log('  serve ../..');
console.log('  open http://localhost:5000/fixtures/packaging/');
console.log('-------------------------');
