//using architecture IBaseArchitecture;

'use strict';

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const tsOptions = {
  module: ts.ModuleKind.CommonJS,
  jsx: ts.JsxEmit.React,
};

function formatErrorMessage(error) {
  if (error.file) {
    const message = ts.flattenDiagnosticMessageText(error.messageText, '\n');
    return (
      error.file.fileName +
      '(' +
      error.file.getLineAndCharacterOfPosition(error.start).line +
      '): ' +
      message
    );
  } else {
    return ts.flattenDiagnosticMessageText(error.messageText, '\n');
  }
}

function compile(content, contentFilename) {
  let output = null;
  const compilerHost = {
    fileExists(filename) {
      return ts.sys.fileExists(filename);
    },
    getCanonicalFileName(filename) {
      return filename;
    },
    getCurrentDirectory() {
      return '';
    },
    getDefaultLibFileName: () => 'lib.d.ts',
    getNewLine: () => ts.sys.newLine,
    getSourceFile(filename, languageVersion) {
      let source;
      const libRegex = /lib\.(.+\.)?d\.ts$/;
      const jestRegex = /jest\.d\.ts/;
      const reactRegex =
        /(?:React|ReactDOM|ReactDOMClient|ReactInternalAct|PropTypes)(?:\.d)?\.ts$/;

      // `path.normalize` is used to turn forward slashes in
      // the file path into backslashes on Windows.
      filename = path.normalize(filename);
      if (filename.match(libRegex)) {
        source = fs
          .readFileSync(require.resolve('typescript/lib/' + filename))
          .toString();
      } else if (filename.match(jestRegex)) {
        source = fs.readFileSync(path.join(__dirname, 'jest.d.ts')).toString();
      } else if (filename === contentFilename) {
        source = content;
      } else if (reactRegex.test(filename)) {
        // TypeScript will look for the .d.ts files in each ancestor directory,
        // so there may not be a file at the referenced path as it climbs the
        // hierarchy.
        try {
          source = fs.readFileSync(filename).toString();
        } catch (e) {
          if (e.code === 'ENOENT') {
            return undefined;
          }
          throw e;
        }
      } else {
        throw new Error('Unexpected filename ' + filename);
      }
      return ts.createSourceFile(filename, source, 'ES5', '0');
    },
    readFile(filename) {
      return ts.sys.readFile(filename);
    },
    useCaseSensitiveFileNames() {
      return ts.sys.useCaseSensitiveFileNames;
    },
    writeFile(name, text, writeByteOrderMark) {
      if (output === null) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 86: Error message without production error code - breaks React bundle size optimization
//   2. Line 86: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

        output = text;
      } else {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 98: Error message without production error code - breaks React bundle size optimization
//   2. Line 98: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

        throw new Error('Expected only one dependency.');
      }
    },
  };
  const program = ts.createProgram(
    ['lib.d.ts', 'jest.d.ts', contentFilename],
    tsOptions,
    compilerHost
  );
  const emitResult = program.emit();
  const errors = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);
  if (errors.length) {
    throw new Error(errors.map(formatErrorMessage).join('\n'));
  }
  return output;
}

module.exports = {
  compile: compile,
};
