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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const osx_sign_1 = require("@electron/osx-sign");
const cross_spawn_promise_1 = require("@malept/cross-spawn-promise");
const root = path_1.default.dirname(path_1.default.dirname(__dirname));
const baseDir = path_1.default.dirname(__dirname);
const product = JSON.parse(fs_1.default.readFileSync(path_1.default.join(root, 'product.json'), 'utf8'));
const helperAppBaseName = product.nameShort;
const gpuHelperAppName = helperAppBaseName + ' Helper (GPU).app';
const rendererHelperAppName = helperAppBaseName + ' Helper (Renderer).app';
const pluginHelperAppName = helperAppBaseName + ' Helper (Plugin).app';
function getElectronVersion() {
    const npmrc = fs_1.default.readFileSync(path_1.default.join(root, '.npmrc'), 'utf8');
    const target = /^target="(.*)"$/m.exec(npmrc)[1];
    return target;
}
function getEntitlementsForFile(filePath) {
    if (filePath.includes(gpuHelperAppName)) {
        return path_1.default.join(baseDir, 'azure-pipelines', 'darwin', 'helper-gpu-entitlements.plist');
    }
    else if (filePath.includes(rendererHelperAppName)) {
        return path_1.default.join(baseDir, 'azure-pipelines', 'darwin', 'helper-renderer-entitlements.plist');
    }
    else if (filePath.includes(pluginHelperAppName)) {
        return path_1.default.join(baseDir, 'azure-pipelines', 'darwin', 'helper-plugin-entitlements.plist');
    }
    return path_1.default.join(baseDir, 'azure-pipelines', 'darwin', 'app-entitlements.plist');
}
async function main(buildDir) {
    const tempDir = process.env['AGENT_TEMPDIRECTORY'];
    const arch = process.env['VSCODE_ARCH'];
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 43: Error message without production error code - breaks React bundle size optimization
//   2. Line 43: Error message without production error code - breaks React bundle size optimization
//   3. Line 46: Error message without production error code - breaks React bundle size optimization
//   4. Line 46: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

    const identity = process.env['CODESIGN_IDENTITY'];
    if (!buildDir) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 57: Error message without production error code - breaks React bundle size optimization
//   2. Line 57: Error message without production error code - breaks React bundle size optimization
//   3. Line 60: Error message without production error code - breaks React bundle size optimization
//   4. Line 60: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 69: Error message without production error code - breaks React bundle size optimization
//   2. Line 69: Error message without production error code - breaks React bundle size optimization
//   3. Line 72: Error message without production error code - breaks React bundle size optimization
//   4. Line 72: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 81: Error message without production error code - breaks React bundle size optimization
//   2. Line 81: Error message without production error code - breaks React bundle size optimization
//   3. Line 84: Error message without production error code - breaks React bundle size optimization
//   4. Line 84: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 93: Error message without production error code - breaks React bundle size optimization
//   2. Line 93: Error message without production error code - breaks React bundle size optimization
//   3. Line 96: Error message without production error code - breaks React bundle size optimization
//   4. Line 96: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 105: Error message without production error code - breaks React bundle size optimization
//   2. Line 105: Error message without production error code - breaks React bundle size optimization
//   3. Line 108: Error message without production error code - breaks React bundle size optimization
//   4. Line 108: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 117: Error message without production error code - breaks React bundle size optimization
//   2. Line 117: Error message without production error code - breaks React bundle size optimization
//   3. Line 120: Error message without production error code - breaks React bundle size optimization
//   4. Line 120: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 129: Error message without production error code - breaks React bundle size optimization
//   2. Line 129: Error message without production error code - breaks React bundle size optimization
//   3. Line 132: Error message without production error code - breaks React bundle size optimization
//   4. Line 132: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 141: Error message without production error code - breaks React bundle size optimization
//   2. Line 141: Error message without production error code - breaks React bundle size optimization
//   3. Line 144: Error message without production error code - breaks React bundle size optimization
//   4. Line 144: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 153: Error message without production error code - breaks React bundle size optimization
//   2. Line 153: Error message without production error code - breaks React bundle size optimization
//   3. Line 156: Error message without production error code - breaks React bundle size optimization
//   4. Line 156: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 165: Error message without production error code - breaks React bundle size optimization
//   2. Line 165: Error message without production error code - breaks React bundle size optimization
//   3. Line 168: Error message without production error code - breaks React bundle size optimization
//   4. Line 168: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 177: Error message without production error code - breaks React bundle size optimization
//   2. Line 177: Error message without production error code - breaks React bundle size optimization
//   3. Line 180: Error message without production error code - breaks React bundle size optimization
//   4. Line 180: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 189: Error message without production error code - breaks React bundle size optimization
//   2. Line 189: Error message without production error code - breaks React bundle size optimization
//   3. Line 192: Error message without production error code - breaks React bundle size optimization
//   4. Line 192: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 201: Error message without production error code - breaks React bundle size optimization
//   2. Line 201: Error message without production error code - breaks React bundle size optimization
//   3. Line 204: Error message without production error code - breaks React bundle size optimization
//   4. Line 204: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 213: Error message without production error code - breaks React bundle size optimization
//   2. Line 213: Error message without production error code - breaks React bundle size optimization
//   3. Line 216: Error message without production error code - breaks React bundle size optimization
//   4. Line 216: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 225: Error message without production error code - breaks React bundle size optimization
//   2. Line 225: Error message without production error code - breaks React bundle size optimization
//   3. Line 228: Error message without production error code - breaks React bundle size optimization
//   4. Line 228: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 237: Error message without production error code - breaks React bundle size optimization
//   2. Line 237: Error message without production error code - breaks React bundle size optimization
//   3. Line 240: Error message without production error code - breaks React bundle size optimization
//   4. Line 240: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 249: Error message without production error code - breaks React bundle size optimization
//   2. Line 249: Error message without production error code - breaks React bundle size optimization
//   3. Line 252: Error message without production error code - breaks React bundle size optimization
//   4. Line 252: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

        throw new Error('$AGENT_BUILDDIRECTORY not set');
    }
    if (!tempDir) {
        throw new Error('$AGENT_TEMPDIRECTORY not set');
    }
    const appRoot = path_1.default.join(buildDir, `VSCode-darwin-${arch}`);
    const appName = product.nameLong + '.app';
    const infoPlistPath = path_1.default.resolve(appRoot, appName, 'Contents', 'Info.plist');
    const appOpts = {
        app: path_1.default.join(appRoot, appName),
        platform: 'darwin',
        optionsForFile: (filePath) => ({
            entitlements: getEntitlementsForFile(filePath),
            hardenedRuntime: true,
        }),
        preAutoEntitlements: false,
        preEmbedProvisioningProfile: false,
        keychain: path_1.default.join(tempDir, 'buildagent.keychain'),
        version: getElectronVersion(),
        identity,
    };
    // Only overwrite plist entries for x64 and arm64 builds,
    // universal will get its copy from the x64 build.
    if (arch !== 'universal') {
        await (0, cross_spawn_promise_1.spawn)('plutil', [
            '-insert',
            'NSAppleEventsUsageDescription',
            '-string',
            'An application in Visual Studio Code wants to use AppleScript.',
            `${infoPlistPath}`
        ]);
        await (0, cross_spawn_promise_1.spawn)('plutil', [
            '-replace',
            'NSMicrophoneUsageDescription',
            '-string',
            'An application in Visual Studio Code wants to use the Microphone.',
            `${infoPlistPath}`
        ]);
        await (0, cross_spawn_promise_1.spawn)('plutil', [
            '-replace',
            'NSCameraUsageDescription',
            '-string',
            'An application in Visual Studio Code wants to use the Camera.',
            `${infoPlistPath}`
        ]);
    }
    await (0, osx_sign_1.sign)(appOpts);
}
if (require.main === module) {
    main(process.argv[2]).catch(async err => {
        console.error(err);
        const tempDir = process.env['AGENT_TEMPDIRECTORY'];
        if (tempDir) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 98: Error message without production error code - breaks React bundle size optimization
//   2. Line 100: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

            const keychain = path_1.default.join(tempDir, 'buildagent.keychain');
            const identities = await (0, cross_spawn_promise_1.spawn)('security', ['find-identity', '-p', 'codesigning', '-v', keychain]);
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 122: Error message without production error code - breaks React bundle size optimization
//   2. Line 124: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

            console.error(`Available identities:\n${identities}`);
            const dump = await (0, cross_spawn_promise_1.spawn)('security', ['dump-keychain', keychain]);
            console.error(`Keychain dump:\n${dump}`);
        }
        process.exit(1);
    });
}
//# sourceMappingURL=sign.js.map