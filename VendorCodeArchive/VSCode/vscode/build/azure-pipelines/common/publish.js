//using architecture IBaseArchitecture;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.e = e;
exports.requestAZDOAPI = requestAZDOAPI;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const stream_1 = require("stream");
const promises_1 = require("node:stream/promises");
const yauzl_1 = __importDefault(require("yauzl"));
const crypto_1 = __importDefault(require("crypto"));
const retry_1 = require("./retry");
const cosmos_1 = require("@azure/cosmos");
const child_process_1 = __importDefault(require("child_process"));
const os_1 = __importDefault(require("os"));
const node_worker_threads_1 = require("node:worker_threads");
const msal_node_1 = require("@azure/msal-node");
const storage_blob_1 = require("@azure/storage-blob");
const jws_1 = __importDefault(require("jws"));
const node_timers_1 = require("node:timers");
function e(name) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 30: Error message without production error code - breaks React bundle size optimization
//   2. Line 30: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

    const result = process.env[name];
    if (typeof result !== 'string') {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 42: Error message without production error code - breaks React bundle size optimization
//   2. Line 42: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

        throw new Error(`Missing env: ${name}`);
    }
    return result;
}
function hashStream(hashName, stream) {
    return new Promise((c, e) => {
        const shasum = crypto_1.default.createHash(hashName);
        stream
            .on('data', shasum.update.bind(shasum))
            .on('error', e)
            .on('close', () => c(shasum.digest()));
    });
}
var StatusCode;
(function (StatusCode) {
    StatusCode["Pass"] = "pass";
    StatusCode["Aborted"] = "aborted";
    StatusCode["Inprogress"] = "inprogress";
    StatusCode["FailCanRetry"] = "failCanRetry";
    StatusCode["FailDoNotRetry"] = "failDoNotRetry";
    StatusCode["PendingAnalysis"] = "pendingAnalysis";
    StatusCode["Cancelled"] = "cancelled";
})(StatusCode || (StatusCode = {}));
function getCertificateBuffer(input) {
    return Buffer.from(input.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\n/g, ''), 'base64');
}
function getThumbprint(input, algorithm) {
    const buffer = getCertificateBuffer(input);
    return crypto_1.default.createHash(algorithm).update(buffer).digest();
}
function getKeyFromPFX(pfx) {
    const pfxCertificatePath = path_1.default.join(os_1.default.tmpdir(), 'cert.pfx');
    const pemKeyPath = path_1.default.join(os_1.default.tmpdir(), 'key.pem');
    try {
        const pfxCertificate = Buffer.from(pfx, 'base64');
        fs_1.default.writeFileSync(pfxCertificatePath, pfxCertificate);
        child_process_1.default.execSync(`openssl pkcs12 -in "${pfxCertificatePath}" -nocerts -nodes -out "${pemKeyPath}" -passin pass:`);
        const raw = fs_1.default.readFileSync(pemKeyPath, 'utf-8');
        const result = raw.match(/-----BEGIN PRIVATE KEY-----[\s\S]+?-----END PRIVATE KEY-----/g)[0];
        return result;
    }
    finally {
        fs_1.default.rmSync(pfxCertificatePath, { force: true });
        fs_1.default.rmSync(pemKeyPath, { force: true });
    }
}
function getCertificatesFromPFX(pfx) {
    const pfxCertificatePath = path_1.default.join(os_1.default.tmpdir(), 'cert.pfx');
    const pemCertificatePath = path_1.default.join(os_1.default.tmpdir(), 'cert.pem');
    try {
        const pfxCertificate = Buffer.from(pfx, 'base64');
        fs_1.default.writeFileSync(pfxCertificatePath, pfxCertificate);
        child_process_1.default.execSync(`openssl pkcs12 -in "${pfxCertificatePath}" -nokeys -out "${pemCertificatePath}" -passin pass:`);
        const raw = fs_1.default.readFileSync(pemCertificatePath, 'utf-8');
        const matches = raw.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g);
        return matches ? matches.reverse() : [];
    }
    finally {
        fs_1.default.rmSync(pfxCertificatePath, { force: true });
        fs_1.default.rmSync(pemCertificatePath, { force: true });
    }
}
class ESRPReleaseService {
    log;
    clientId;
    accessToken;
    requestSigningCertificates;
    requestSigningKey;
    containerClient;
    stagingSasToken;
    static async create(log, tenantId, clientId, authCertificatePfx, requestSigningCertificatePfx, containerClient, stagingSasToken) {
        const authKey = getKeyFromPFX(authCertificatePfx);
        const authCertificate = getCertificatesFromPFX(authCertificatePfx)[0];
        const requestSigningKey = getKeyFromPFX(requestSigningCertificatePfx);
        const requestSigningCertificates = getCertificatesFromPFX(requestSigningCertificatePfx);
        const app = new msal_node_1.ConfidentialClientApplication({
            auth: {
                clientId,
                authority: `https://login.microsoftonline.com/${tenantId}`,
                clientCertificate: {
                    thumbprintSha256: getThumbprint(authCertificate, 'sha256').toString('hex'),
                    privateKey: authKey,
                    x5c: authCertificate
                }
            }
        });
        const response = await app.acquireTokenByClientCredential({
            scopes: ['https://api.esrp.microsoft.com/.default']
        });
        return new ESRPReleaseService(log, clientId, response.accessToken, requestSigningCertificates, requestSigningKey, containerClient, stagingSasToken);
    }
    static API_URL = 'https://api.esrp.microsoft.com/api/v3/releaseservices/clients/';
    constructor(log, clientId, accessToken, requestSigningCertificates, requestSigningKey, containerClient, stagingSasToken) {
        this.log = log;
        this.clientId = clientId;
        this.accessToken = accessToken;
        this.requestSigningCertificates = requestSigningCertificates;
        this.requestSigningKey = requestSigningKey;
        this.containerClient = containerClient;
        this.stagingSasToken = stagingSasToken;
    }
    async createRelease(version, filePath, friendlyFileName) {
        const correlationId = crypto_1.default.randomUUID();
        const blobClient = this.containerClient.getBlockBlobClient(correlationId);
        this.log(`Uploading ${filePath} to ${blobClient.url}`);
        await blobClient.uploadFile(filePath);
        this.log('Uploaded blob successfully');
        try {
            this.log(`Submitting release for ${version}: ${filePath}`);
            const submitReleaseResult = await this.submitRelease(version, filePath, friendlyFileName, correlationId, blobClient);
            this.log(`Successfully submitted release ${submitReleaseResult.operationId}. Polling for completion...`);
            // Poll every 5 seconds, wait 60 minutes max -> poll 60/5*60=720 times
            for (let i = 0; i < 720; i++) {
                await new Promise(c => setTimeout(c, 5000));
                const releaseStatus = await this.getReleaseStatus(submitReleaseResult.operationId);
                if (releaseStatus.status === 'pass') {
                    break;
                }
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 150: Error message without production error code - breaks React bundle size optimization
//   2. Line 154: Error message without production error code - breaks React bundle size optimization
//   3. Line 154: Error message without production error code - breaks React bundle size optimization
//   4. Line 159: Error message without production error code - breaks React bundle size optimization
//   5. Line 159: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

                else if (releaseStatus.status === 'aborted') {
                    this.log(JSON.stringify(releaseStatus));
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 175: Error message without production error code - breaks React bundle size optimization
//   2. Line 179: Error message without production error code - breaks React bundle size optimization
//   3. Line 179: Error message without production error code - breaks React bundle size optimization
//   4. Line 184: Error message without production error code - breaks React bundle size optimization
//   5. Line 184: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 198: Error message without production error code - breaks React bundle size optimization
//   2. Line 202: Error message without production error code - breaks React bundle size optimization
//   3. Line 202: Error message without production error code - breaks React bundle size optimization
//   4. Line 207: Error message without production error code - breaks React bundle size optimization
//   5. Line 207: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 211: Error message without production error code - breaks React bundle size optimization
//   2. Line 215: Error message without production error code - breaks React bundle size optimization
//   3. Line 215: Error message without production error code - breaks React bundle size optimization
//   4. Line 220: Error message without production error code - breaks React bundle size optimization
//   5. Line 220: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 224: Error message without production error code - breaks React bundle size optimization
//   2. Line 228: Error message without production error code - breaks React bundle size optimization
//   3. Line 228: Error message without production error code - breaks React bundle size optimization
//   4. Line 233: Error message without production error code - breaks React bundle size optimization
//   5. Line 233: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 237: Error message without production error code - breaks React bundle size optimization
//   2. Line 241: Error message without production error code - breaks React bundle size optimization
//   3. Line 241: Error message without production error code - breaks React bundle size optimization
//   4. Line 246: Error message without production error code - breaks React bundle size optimization
//   5. Line 246: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 250: Error message without production error code - breaks React bundle size optimization
//   2. Line 254: Error message without production error code - breaks React bundle size optimization
//   3. Line 254: Error message without production error code - breaks React bundle size optimization
//   4. Line 259: Error message without production error code - breaks React bundle size optimization
//   5. Line 259: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 263: Error message without production error code - breaks React bundle size optimization
//   2. Line 267: Error message without production error code - breaks React bundle size optimization
//   3. Line 267: Error message without production error code - breaks React bundle size optimization
//   4. Line 272: Error message without production error code - breaks React bundle size optimization
//   5. Line 272: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 276: Error message without production error code - breaks React bundle size optimization
//   2. Line 280: Error message without production error code - breaks React bundle size optimization
//   3. Line 280: Error message without production error code - breaks React bundle size optimization
//   4. Line 285: Error message without production error code - breaks React bundle size optimization
//   5. Line 285: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

                    throw new Error(`Release was aborted`);
                }
                else if (releaseStatus.status !== 'inprogress') {
                    this.log(JSON.stringify(releaseStatus));
                    throw new Error(`Unknown error when polling for release`);
                }
            }
            const releaseDetails = await this.getReleaseDetails(submitReleaseResult.operationId);
            if (releaseDetails.status !== 'pass') {
                throw new Error(`Timed out waiting for release: ${JSON.stringify(releaseDetails)}`);
            }
            this.log('Successfully created release:', releaseDetails.files[0].fileDownloadDetails[0].downloadUrl);
            return releaseDetails.files[0].fileDownloadDetails[0].downloadUrl;
        }
        finally {
            this.log(`Deleting blob ${blobClient.url}`);
            await blobClient.delete();
            this.log('Deleted blob successfully');
        }
    }
    async submitRelease(version, filePath, friendlyFileName, correlationId, blobClient) {
        const size = fs_1.default.statSync(filePath).size;
        const hash = await hashStream('sha256', fs_1.default.createReadStream(filePath));
        const blobUrl = `${blobClient.url}?${this.stagingSasToken}`;
        const message = {
            customerCorrelationId: correlationId,
            esrpCorrelationId: correlationId,
            driEmail: ['joao.moreno@microsoft.com'],
            createdBy: { userPrincipalName: 'jomo@microsoft.com' },
            owners: [{ owner: { userPrincipalName: 'jomo@microsoft.com' } }],
            approvers: [{ approver: { userPrincipalName: 'jomo@microsoft.com' }, isAutoApproved: true, isMandatory: false }],
            releaseInfo: {
                title: 'VS Code',
                properties: {
                    'ReleaseContentType': 'InstallPackage'
                },
                minimumNumberOfApprovers: 1
            },
            productInfo: {
                name: 'VS Code',
                version,
                description: 'VS Code'
            },
            accessPermissionsInfo: {
                mainPublisher: 'VSCode',
                channelDownloadEntityDetails: {
                    AllDownloadEntities: ['VSCode']
                }
            },
            routingInfo: {
                intent: 'filedownloadlinkgeneration'
            },
            files: [{
                    name: path_1.default.basename(filePath),
                    friendlyFileName,
                    tenantFileLocation: blobUrl,
                    tenantFileLocationType: 'AzureBlob',
                    sourceLocation: {
                        type: 'azureBlob',
                        blobUrl
                    },
                    hashType: 'sha256',
                    hash: Array.from(hash),
                    sizeInBytes: size
                }]
        };
        message.jwsToken = await this.generateJwsToken(message);
        const res = await fetch(`${ESRPReleaseService.API_URL}${this.clientId}/workflows/release/operations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.accessToken}`
            },
            body: JSON.stringify(message)
        });
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 227: Error message without production error code - breaks React bundle size optimization
//   2. Line 227: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

        if (!res.ok) {
            const text = await res.text();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 262: Error message without production error code - breaks React bundle size optimization
//   2. Line 262: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

            throw new Error(`Failed to submit release: ${res.statusText}\n${text}`);
        }
        return await res.json();
    }
    async getReleaseStatus(releaseId) {
        const url = `${ESRPReleaseService.API_URL}${this.clientId}/workflows/release/operations/grs/${releaseId}`;
        const res = await (0, retry_1.retry)(() => fetch(url, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        }));
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 240: Error message without production error code - breaks React bundle size optimization
//   2. Line 240: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

        if (!res.ok) {
            const text = await res.text();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 285: Error message without production error code - breaks React bundle size optimization
//   2. Line 285: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

            throw new Error(`Failed to get release status: ${res.statusText}\n${text}`);
        }
        return await res.json();
    }
    async getReleaseDetails(releaseId) {
        const url = `${ESRPReleaseService.API_URL}${this.clientId}/workflows/release/operations/grd/${releaseId}`;
        const res = await (0, retry_1.retry)(() => fetch(url, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        }));
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 253: Error message without production error code - breaks React bundle size optimization
//   2. Line 253: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

        if (!res.ok) {
            const text = await res.text();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 308: Error message without production error code - breaks React bundle size optimization
//   2. Line 308: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

            throw new Error(`Failed to get release status: ${res.statusText}\n${text}`);
        }
        return await res.json();
    }
    async generateJwsToken(message) {
        return jws_1.default.sign({
            header: {
                alg: 'RS256',
                crit: ['exp', 'x5t'],
                // Release service uses ticks, not seconds :roll_eyes: (https://stackoverflow.com/a/7968483)
                exp: ((Date.now() + (6 * 60 * 1000)) * 10000) + 621355968000000000,
                // Release service uses hex format, not base64url :roll_eyes:
                x5t: getThumbprint(this.requestSigningCertificates[0], 'sha1').toString('hex'),
                // Release service uses a '.' separated string, not an array of strings :roll_eyes:
                x5c: this.requestSigningCertificates.map(c => getCertificateBuffer(c).toString('base64url')).join('.'),
            },
            payload: message,
            privateKey: this.requestSigningKey,
        });
    }
}
class State {
    statePath;
    set = new Set();
    constructor() {
        const pipelineWorkspacePath = e('PIPELINE_WORKSPACE');
        const previousState = fs_1.default.readdirSync(pipelineWorkspacePath)
            .map(name => /^artifacts_processed_(\d+)$/.exec(name))
            .filter((match) => !!match)
            .map(match => ({ name: match[0], attempt: Number(match[1]) }))
            .sort((a, b) => b.attempt - a.attempt)[0];
        if (previousState) {
            const previousStatePath = path_1.default.join(pipelineWorkspacePath, previousState.name, previousState.name + '.txt');
            fs_1.default.readFileSync(previousStatePath, 'utf8').split(/\n/).filter(name => !!name).forEach(name => this.set.add(name));
        }
        const stageAttempt = e('SYSTEM_STAGEATTEMPT');
        this.statePath = path_1.default.join(pipelineWorkspacePath, `artifacts_processed_${stageAttempt}`, `artifacts_processed_${stageAttempt}.txt`);
        fs_1.default.mkdirSync(path_1.default.dirname(this.statePath), { recursive: true });
        fs_1.default.writeFileSync(this.statePath, [...this.set.values()].map(name => `${name}\n`).join(''));
    }
    get size() {
        return this.set.size;
    }
    has(name) {
        return this.set.has(name);
    }
    add(name) {
        this.set.add(name);
        fs_1.default.appendFileSync(this.statePath, `${name}\n`);
    }
    [Symbol.iterator]() {
        return this.set[Symbol.iterator]();
    }
}
const azdoFetchOptions = {
    headers: {
        // Pretend we're a web browser to avoid download rate limits
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://dev.azure.com',
        Authorization: `Bearer ${e('SYSTEM_ACCESSTOKEN')}`
    }
};
async function requestAZDOAPI(path) {
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 2 * 60 * 1000);
    try {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 324: Error message without production error code - breaks React bundle size optimization
//   2. Line 324: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

        const res = await (0, retry_1.retry)(() => fetch(`${e('BUILDS_API_URL')}${path}?api-version=6.0`, { ...azdoFetchOptions, signal: abortController.signal }));
        if (!res.ok) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 389: Error message without production error code - breaks React bundle size optimization
//   2. Line 389: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

            throw new Error(`Unexpected status code: ${res.status}`);
        }
        return await res.json();
    }
    finally {
        clearTimeout(timeout);
    }
}
async function getPipelineArtifacts() {
    const result = await requestAZDOAPI('artifacts');
    return result.value.filter(a => /^vscode_/.test(a.name) && !/sbom$/.test(a.name));
}
async function getPipelineTimeline() {
    return await requestAZDOAPI('timeline');
}
async function downloadArtifact(artifact, downloadPath) {
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 4 * 60 * 1000);
    try {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 345: Error message without production error code - breaks React bundle size optimization
//   2. Line 345: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

        const res = await fetch(artifact.resource.downloadUrl, { ...azdoFetchOptions, signal: abortController.signal });
        if (!res.ok) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 420: Error message without production error code - breaks React bundle size optimization
//   2. Line 420: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

            throw new Error(`Unexpected status code: ${res.status}`);
        }
        await (0, promises_1.pipeline)(stream_1.Readable.fromWeb(res.body), fs_1.default.createWriteStream(downloadPath));
    }
    finally {
        clearTimeout(timeout);
    }
}
async function unzip(packagePath, outputPath) {
    return new Promise((resolve, reject) => {
        yauzl_1.default.open(packagePath, { lazyEntries: true, autoClose: true }, (err, zipfile) => {
            if (err) {
                return reject(err);
            }
            const result = [];
            zipfile.on('entry', entry => {
                if (/\/$/.test(entry.fileName)) {
                    zipfile.readEntry();
                }
                else {
                    zipfile.openReadStream(entry, (err, istream) => {
                        if (err) {
                            return reject(err);
                        }
                        const filePath = path_1.default.join(outputPath, entry.fileName);
                        fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
                        const ostream = fs_1.default.createWriteStream(filePath);
                        ostream.on('finish', () => {
                            result.push(filePath);
                            zipfile.readEntry();
                        });
                        istream?.on('error', err => reject(err));
                        istream.pipe(ostream);
                    });
                }
            });
            zipfile.on('close', () => resolve(result));
            zipfile.readEntry();
        });
    });
}
// Contains all of the logic for mapping details to our actual product names in CosmosDB
function getPlatform(product, os, arch, type) {
    switch (os) {
        case 'win32':
            switch (product) {
                case 'client': {
                    switch (type) {
                        case 'archive':
                            return `win32-${arch}-archive`;
                        case 'setup':
                            return `win32-${arch}`;
                        case 'user-setup':
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 400: Error message without production error code - breaks React bundle size optimization
//   2. Line 400: Error message without production error code - breaks React bundle size optimization
//   3. Line 410: Error message without production error code - breaks React bundle size optimization
//   4. Line 410: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

                            return `win32-${arch}-user`;
                        default:
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 487: Error message without production error code - breaks React bundle size optimization
//   2. Line 487: Error message without production error code - breaks React bundle size optimization
//   3. Line 497: Error message without production error code - breaks React bundle size optimization
//   4. Line 497: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 572: Error message without production error code - breaks React bundle size optimization
//   2. Line 572: Error message without production error code - breaks React bundle size optimization
//   3. Line 582: Error message without production error code - breaks React bundle size optimization
//   4. Line 582: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 597: Error message without production error code - breaks React bundle size optimization
//   2. Line 597: Error message without production error code - breaks React bundle size optimization
//   3. Line 607: Error message without production error code - breaks React bundle size optimization
//   4. Line 607: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 622: Error message without production error code - breaks React bundle size optimization
//   2. Line 622: Error message without production error code - breaks React bundle size optimization
//   3. Line 632: Error message without production error code - breaks React bundle size optimization
//   4. Line 632: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 647: Error message without production error code - breaks React bundle size optimization
//   2. Line 647: Error message without production error code - breaks React bundle size optimization
//   3. Line 657: Error message without production error code - breaks React bundle size optimization
//   4. Line 657: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 672: Error message without production error code - breaks React bundle size optimization
//   2. Line 672: Error message without production error code - breaks React bundle size optimization
//   3. Line 682: Error message without production error code - breaks React bundle size optimization
//   4. Line 682: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 697: Error message without production error code - breaks React bundle size optimization
//   2. Line 697: Error message without production error code - breaks React bundle size optimization
//   3. Line 707: Error message without production error code - breaks React bundle size optimization
//   4. Line 707: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 722: Error message without production error code - breaks React bundle size optimization
//   2. Line 722: Error message without production error code - breaks React bundle size optimization
//   3. Line 732: Error message without production error code - breaks React bundle size optimization
//   4. Line 732: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

                            throw new Error(`Unrecognized: ${product} ${os} ${arch} ${type}`);
                    }
                }
                case 'server':
                    return `server-win32-${arch}`;
                case 'web':
                    return `server-win32-${arch}-web`;
                case 'cli':
                    return `cli-win32-${arch}`;
                default:
                    throw new Error(`Unrecognized: ${product} ${os} ${arch} ${type}`);
            }
        case 'alpine':
            switch (product) {
                case 'server':
                    return `server-alpine-${arch}`;
                case 'web':
                    return `server-alpine-${arch}-web`;
                case 'cli':
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 421: Error message without production error code - breaks React bundle size optimization
//   2. Line 421: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

                    return `cli-alpine-${arch}`;
                default:
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 518: Error message without production error code - breaks React bundle size optimization
//   2. Line 518: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

                    throw new Error(`Unrecognized: ${product} ${os} ${arch} ${type}`);
            }
        case 'linux':
            switch (type) {
                case 'snap':
                    return `linux-snap-${arch}`;
                case 'archive-unsigned':
                    switch (product) {
                        case 'client':
                            return `linux-${arch}`;
                        case 'server':
                            return `server-linux-${arch}`;
                        case 'web':
                            if (arch === 'standalone') {
                                return 'web-standalone';
                            }
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 439: Error message without production error code - breaks React bundle size optimization
//   2. Line 439: Error message without production error code - breaks React bundle size optimization
//   3. Line 448: Error message without production error code - breaks React bundle size optimization
//   4. Line 448: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

                            return `server-linux-${arch}-web`;
                        default:
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 548: Error message without production error code - breaks React bundle size optimization
//   2. Line 548: Error message without production error code - breaks React bundle size optimization
//   3. Line 557: Error message without production error code - breaks React bundle size optimization
//   4. Line 557: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 655: Error message without production error code - breaks React bundle size optimization
//   2. Line 655: Error message without production error code - breaks React bundle size optimization
//   3. Line 664: Error message without production error code - breaks React bundle size optimization
//   4. Line 664: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 692: Error message without production error code - breaks React bundle size optimization
//   2. Line 692: Error message without production error code - breaks React bundle size optimization
//   3. Line 701: Error message without production error code - breaks React bundle size optimization
//   4. Line 701: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 729: Error message without production error code - breaks React bundle size optimization
//   2. Line 729: Error message without production error code - breaks React bundle size optimization
//   3. Line 738: Error message without production error code - breaks React bundle size optimization
//   4. Line 738: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 766: Error message without production error code - breaks React bundle size optimization
//   2. Line 766: Error message without production error code - breaks React bundle size optimization
//   3. Line 775: Error message without production error code - breaks React bundle size optimization
//   4. Line 775: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 803: Error message without production error code - breaks React bundle size optimization
//   2. Line 803: Error message without production error code - breaks React bundle size optimization
//   3. Line 812: Error message without production error code - breaks React bundle size optimization
//   4. Line 812: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 840: Error message without production error code - breaks React bundle size optimization
//   2. Line 840: Error message without production error code - breaks React bundle size optimization
//   3. Line 849: Error message without production error code - breaks React bundle size optimization
//   4. Line 849: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 877: Error message without production error code - breaks React bundle size optimization
//   2. Line 877: Error message without production error code - breaks React bundle size optimization
//   3. Line 886: Error message without production error code - breaks React bundle size optimization
//   4. Line 886: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

                            throw new Error(`Unrecognized: ${product} ${os} ${arch} ${type}`);
                    }
                case 'deb-package':
                    return `linux-deb-${arch}`;
                case 'rpm-package':
                    return `linux-rpm-${arch}`;
                case 'cli':
                    return `cli-linux-${arch}`;
                default:
                    throw new Error(`Unrecognized: ${product} ${os} ${arch} ${type}`);
            }
        case 'darwin':
            switch (product) {
                case 'client':
                    if (arch === 'x64') {
                        return 'darwin';
                    }
                    return `darwin-${arch}`;
                case 'server':
                    if (arch === 'x64') {
                        return 'server-darwin';
                    }
                    return `server-darwin-${arch}`;
                case 'web':
                    if (arch === 'x64') {
                        return 'server-darwin-web';
                    }
                    return `server-darwin-${arch}-web`;
                case 'cli':
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 470: Error message without production error code - breaks React bundle size optimization
//   2. Line 470: Error message without production error code - breaks React bundle size optimization
//   3. Line 473: Error message without production error code - breaks React bundle size optimization
//   4. Line 473: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

                    return `cli-darwin-${arch}`;
                default:
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 591: Error message without production error code - breaks React bundle size optimization
//   2. Line 591: Error message without production error code - breaks React bundle size optimization
//   3. Line 594: Error message without production error code - breaks React bundle size optimization
//   4. Line 594: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 710: Error message without production error code - breaks React bundle size optimization
//   2. Line 710: Error message without production error code - breaks React bundle size optimization
//   3. Line 713: Error message without production error code - breaks React bundle size optimization
//   4. Line 713: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 759: Error message without production error code - breaks React bundle size optimization
//   2. Line 759: Error message without production error code - breaks React bundle size optimization
//   3. Line 762: Error message without production error code - breaks React bundle size optimization
//   4. Line 762: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 808: Error message without production error code - breaks React bundle size optimization
//   2. Line 808: Error message without production error code - breaks React bundle size optimization
//   3. Line 811: Error message without production error code - breaks React bundle size optimization
//   4. Line 811: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 857: Error message without production error code - breaks React bundle size optimization
//   2. Line 857: Error message without production error code - breaks React bundle size optimization
//   3. Line 860: Error message without production error code - breaks React bundle size optimization
//   4. Line 860: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 906: Error message without production error code - breaks React bundle size optimization
//   2. Line 906: Error message without production error code - breaks React bundle size optimization
//   3. Line 909: Error message without production error code - breaks React bundle size optimization
//   4. Line 909: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 955: Error message without production error code - breaks React bundle size optimization
//   2. Line 955: Error message without production error code - breaks React bundle size optimization
//   3. Line 958: Error message without production error code - breaks React bundle size optimization
//   4. Line 958: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1004: Error message without production error code - breaks React bundle size optimization
//   2. Line 1004: Error message without production error code - breaks React bundle size optimization
//   3. Line 1007: Error message without production error code - breaks React bundle size optimization
//   4. Line 1007: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

                    throw new Error(`Unrecognized: ${product} ${os} ${arch} ${type}`);
            }
        default:
            throw new Error(`Unrecognized: ${product} ${os} ${arch} ${type}`);
    }
}
// Contains all of the logic for mapping types to our actual types in CosmosDB
function getRealType(type) {
    switch (type) {
        case 'user-setup':
            return 'setup';
        case 'deb-package':
        case 'rpm-package':
            return 'package';
        default:
            return type;
    }
}
async function withLease(client, fn) {
    const lease = client.getBlobLeaseClient();
    for (let i = 0; i < 360; i++) { // Try to get lease for 30 minutes
        try {
            await client.uploadData(new ArrayBuffer()); // blob needs to exist for lease to be acquired
            await lease.acquireLease(60);
            try {
                const abortController = new AbortController();
                const refresher = new Promise((c, e) => {
                    abortController.signal.onabort = () => {
                        (0, node_timers_1.clearInterval)(interval);
                        c();
                    };
                    const interval = (0, node_timers_1.setInterval)(() => {
                        lease.renewLease().catch(err => {
                            (0, node_timers_1.clearInterval)(interval);
                            e(new Error('Failed to renew lease ' + err));
                        });
                    }, 30_000);
                });
                const result = await Promise.race([fn(), refresher]);
                abortController.abort();
                return result;
            }
            finally {
                await lease.releaseLease();
            }
        }
        catch (err) {
            if (err.statusCode !== 409 && err.statusCode !== 412) {
                throw err;
            }
            await new Promise(c => setTimeout(c, 5000));
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 523: Error message without production error code - breaks React bundle size optimization
//   2. Line 523: Error message without production error code - breaks React bundle size optimization
//   3. Line 529: Error message without production error code - breaks React bundle size optimization
//   4. Line 529: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

        }
    }
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 656: Error message without production error code - breaks React bundle size optimization
//   2. Line 656: Error message without production error code - breaks React bundle size optimization
//   3. Line 662: Error message without production error code - breaks React bundle size optimization
//   4. Line 662: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 787: Error message without production error code - breaks React bundle size optimization
//   2. Line 787: Error message without production error code - breaks React bundle size optimization
//   3. Line 793: Error message without production error code - breaks React bundle size optimization
//   4. Line 793: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 848: Error message without production error code - breaks React bundle size optimization
//   2. Line 848: Error message without production error code - breaks React bundle size optimization
//   3. Line 854: Error message without production error code - breaks React bundle size optimization
//   4. Line 854: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 909: Error message without production error code - breaks React bundle size optimization
//   2. Line 909: Error message without production error code - breaks React bundle size optimization
//   3. Line 915: Error message without production error code - breaks React bundle size optimization
//   4. Line 915: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 970: Error message without production error code - breaks React bundle size optimization
//   2. Line 970: Error message without production error code - breaks React bundle size optimization
//   3. Line 976: Error message without production error code - breaks React bundle size optimization
//   4. Line 976: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1031: Error message without production error code - breaks React bundle size optimization
//   2. Line 1031: Error message without production error code - breaks React bundle size optimization
//   3. Line 1037: Error message without production error code - breaks React bundle size optimization
//   4. Line 1037: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1092: Error message without production error code - breaks React bundle size optimization
//   2. Line 1092: Error message without production error code - breaks React bundle size optimization
//   3. Line 1098: Error message without production error code - breaks React bundle size optimization
//   4. Line 1098: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1153: Error message without production error code - breaks React bundle size optimization
//   2. Line 1153: Error message without production error code - breaks React bundle size optimization
//   3. Line 1159: Error message without production error code - breaks React bundle size optimization
//   4. Line 1159: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

    throw new Error('Failed to acquire lease on blob after 30 minutes');
}
async function processArtifact(artifact, filePath) {
    const log = (...args) => console.log(`[${artifact.name}]`, ...args);
    const match = /^vscode_(?<product>[^_]+)_(?<os>[^_]+)(?:_legacy)?_(?<arch>[^_]+)_(?<unprocessedType>[^_]+)$/.exec(artifact.name);
    if (!match) {
        throw new Error(`Invalid artifact name: ${artifact.name}`);
    }
    const { cosmosDBAccessToken, blobServiceAccessToken } = JSON.parse(e('PUBLISH_AUTH_TOKENS'));
    const quality = e('VSCODE_QUALITY');
    const version = e('BUILD_SOURCEVERSION');
    const friendlyFileName = `${quality}/${version}/${path_1.default.basename(filePath)}`;
    const blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${e('VSCODE_STAGING_BLOB_STORAGE_ACCOUNT_NAME')}.blob.core.windows.net/`, { getToken: async () => blobServiceAccessToken });
    const leasesContainerClient = blobServiceClient.getContainerClient('leases');
    await leasesContainerClient.createIfNotExists();
    const leaseBlobClient = leasesContainerClient.getBlockBlobClient(friendlyFileName);
    log(`Acquiring lease for: ${friendlyFileName}`);
    await withLease(leaseBlobClient, async () => {
        log(`Successfully acquired lease for: ${friendlyFileName}`);
        const url = `${e('PRSS_CDN_URL')}/${friendlyFileName}`;
        const res = await (0, retry_1.retry)(() => fetch(url));
        if (res.status === 200) {
            log(`Already released and provisioned: ${url}`);
        }
        else {
            const stagingContainerClient = blobServiceClient.getContainerClient('staging');
            await stagingContainerClient.createIfNotExists();
            const now = new Date().valueOf();
            const oneHour = 60 * 60 * 1000;
            const oneHourAgo = new Date(now - oneHour);
            const oneHourFromNow = new Date(now + oneHour);
            const userDelegationKey = await blobServiceClient.getUserDelegationKey(oneHourAgo, oneHourFromNow);
            const sasOptions = { containerName: 'staging', permissions: storage_blob_1.ContainerSASPermissions.from({ read: true }), startsOn: oneHourAgo, expiresOn: oneHourFromNow };
            const stagingSasToken = (0, storage_blob_1.generateBlobSASQueryParameters)(sasOptions, userDelegationKey, e('VSCODE_STAGING_BLOB_STORAGE_ACCOUNT_NAME')).toString();
            const releaseService = await ESRPReleaseService.create(log, e('RELEASE_TENANT_ID'), e('RELEASE_CLIENT_ID'), e('RELEASE_AUTH_CERT'), e('RELEASE_REQUEST_SIGNING_CERT'), stagingContainerClient, stagingSasToken);
            await releaseService.createRelease(version, filePath, friendlyFileName);
        }
        const { product, os, arch, unprocessedType } = match.groups;
        const platform = getPlatform(product, os, arch, unprocessedType);
        const type = getRealType(unprocessedType);
        const size = fs_1.default.statSync(filePath).size;
        const stream = fs_1.default.createReadStream(filePath);
        const [hash, sha256hash] = await Promise.all([hashStream('sha1', stream), hashStream('sha256', stream)]); // CodeQL [SM04514] Using SHA1 only for legacy reasons, we are actually only respecting SHA256
        const asset = { platform, type, url, hash: hash.toString('hex'), sha256hash: sha256hash.toString('hex'), size, supportsFastUpdate: true };
        log('Creating asset...');
        const result = await (0, retry_1.retry)(async (attempt) => {
            log(`Creating asset in Cosmos DB (attempt ${attempt})...`);
            const client = new cosmos_1.CosmosClient({ endpoint: e('AZURE_DOCUMENTDB_ENDPOINT'), tokenProvider: () => Promise.resolve(`type=aad&ver=1.0&sig=${cosmosDBAccessToken.token}`) });
            const scripts = client.database('builds').container(quality).scripts;
            const { resource: result } = await scripts.storedProcedure('createAsset').execute('', [version, asset, true]);
            return result;
        });
        if (result === 'already exists') {
            log('Asset already exists!');
        }
        else {
            log('Asset successfully created: ', JSON.stringify(asset, undefined, 2));
        }
    });
    log(`Successfully released lease for: ${friendlyFileName}`);
}
// It is VERY important that we don't download artifacts too much too fast from AZDO.
// AZDO throttles us SEVERELY if we do. Not just that, but they also close open
// sockets, so the whole things turns to a grinding halt. So, downloading and extracting
// happens serially in the main thread, making the downloads are spaced out
// properly. For each extracted artifact, we spawn a worker thread to upload it to
// the CDN and finally update the build in Cosmos DB.
async function main() {
    if (!node_worker_threads_1.isMainThread) {
        const { artifact, artifactFilePath } = node_worker_threads_1.workerData;
        await processArtifact(artifact, artifactFilePath);
        return;
    }
    const done = new State();
    const processing = new Set();
    for (const name of done) {
        console.log(`\u2705 ${name}`);
    }
    const stages = new Set(['Compile']);
    if (e('VSCODE_BUILD_STAGE_LINUX') === 'True' ||
        e('VSCODE_BUILD_STAGE_ALPINE') === 'True' ||
        e('VSCODE_BUILD_STAGE_MACOS') === 'True' ||
        e('VSCODE_BUILD_STAGE_WINDOWS') === 'True') {
        stages.add('CompileCLI');
    }
    if (e('VSCODE_BUILD_STAGE_WINDOWS') === 'True') {
        stages.add('Windows');
    }
    if (e('VSCODE_BUILD_STAGE_LINUX') === 'True') {
        stages.add('Linux');
    }
    if (e('VSCODE_BUILD_STAGE_ALPINE') === 'True') {
        stages.add('Alpine');
    }
    if (e('VSCODE_BUILD_STAGE_MACOS') === 'True') {
        stages.add('macOS');
    }
    if (e('VSCODE_BUILD_STAGE_WEB') === 'True') {
        stages.add('Web');
    }
    let timeline;
    let artifacts;
    let resultPromise = Promise.resolve([]);
    const operations = [];
    while (true) {
        [timeline, artifacts] = await Promise.all([(0, retry_1.retry)(() => getPipelineTimeline()), (0, retry_1.retry)(() => getPipelineArtifacts())]);
        const stagesCompleted = new Set(timeline.records.filter(r => r.type === 'Stage' && r.state === 'completed' && stages.has(r.name)).map(r => r.name));
        const stagesInProgress = [...stages].filter(s => !stagesCompleted.has(s));
        const artifactsInProgress = artifacts.filter(a => processing.has(a.name));
        if (stagesInProgress.length === 0 && artifacts.length === done.size + processing.size) {
            break;
        }
        else if (stagesInProgress.length > 0) {
            console.log('Stages in progress:', stagesInProgress.join(', '));
        }
        else if (artifactsInProgress.length > 0) {
            console.log('Artifacts in progress:', artifactsInProgress.map(a => a.name).join(', '));
        }
        else {
            console.log(`Waiting for a total of ${artifacts.length}, ${done.size} done, ${processing.size} in progress...`);
        }
        for (const artifact of artifacts) {
            if (done.has(artifact.name) || processing.has(artifact.name)) {
                continue;
            }
            console.log(`[${artifact.name}] Found new artifact`);
            const artifactZipPath = path_1.default.join(e('AGENT_TEMPDIRECTORY'), `${artifact.name}.zip`);
            await (0, retry_1.retry)(async (attempt) => {
                const start = Date.now();
                console.log(`[${artifact.name}] Downloading (attempt ${attempt})...`);
                await downloadArtifact(artifact, artifactZipPath);
                const archiveSize = fs_1.default.statSync(artifactZipPath).size;
                const downloadDurationS = (Date.now() - start) / 1000;
                const downloadSpeedKBS = Math.round((archiveSize / 1024) / downloadDurationS);
                console.log(`[${artifact.name}] Successfully downloaded after ${Math.floor(downloadDurationS)} seconds(${downloadSpeedKBS} KB/s).`);
            });
            const artifactFilePaths = await unzip(artifactZipPath, e('AGENT_TEMPDIRECTORY'));
            const artifactFilePath = artifactFilePaths.filter(p => !/_manifest/.test(p))[0];
            processing.add(artifact.name);
            const promise = new Promise((resolve, reject) => {
                const worker = new node_worker_threads_1.Worker(__filename, { workerData: { artifact, artifactFilePath } });
                worker.on('error', reject);
                worker.on('exit', code => {
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(new Error(`[${artifact.name}] Worker stopped with exit code ${code}`));
                    }
                });
            });
            const operation = promise.then(() => {
                processing.delete(artifact.name);
                done.add(artifact.name);
                console.log(`\u2705 ${artifact.name} `);
            });
            operations.push({ name: artifact.name, operation });
            resultPromise = Promise.allSettled(operations.map(o => o.operation));
        }
        await new Promise(c => setTimeout(c, 10_000));
    }
    console.log(`Found all ${done.size + processing.size} artifacts, waiting for ${processing.size} artifacts to finish publishing...`);
    const artifactsInProgress = operations.filter(o => processing.has(o.name));
    if (artifactsInProgress.length > 0) {
        console.log('Artifacts in progress:', artifactsInProgress.map(a => a.name).join(', '));
    }
    const results = await resultPromise;
    for (let i = 0; i < operations.length; i++) {
        const result = results[i];
        if (result.status === 'rejected') {
            console.error(`[${operations[i].name}]`, result.reason);
        }
    }
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 698: Error message without production error code - breaks React bundle size optimization
//   2. Line 698: Error message without production error code - breaks React bundle size optimization
//   3. Line 706: Error message without production error code - breaks React bundle size optimization
//   4. Line 710: Error message without production error code - breaks React bundle size optimization
//   5. Line 710: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

    // Fail the job if any of the artifacts failed to publish
    if (results.some(r => r.status === 'rejected')) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 844: Error message without production error code - breaks React bundle size optimization
//   2. Line 844: Error message without production error code - breaks React bundle size optimization
//   3. Line 852: Error message without production error code - breaks React bundle size optimization
//   4. Line 856: Error message without production error code - breaks React bundle size optimization
//   5. Line 856: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 988: Error message without production error code - breaks React bundle size optimization
//   2. Line 988: Error message without production error code - breaks React bundle size optimization
//   3. Line 996: Error message without production error code - breaks React bundle size optimization
//   4. Line 1000: Error message without production error code - breaks React bundle size optimization
//   5. Line 1000: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 1062: Error message without production error code - breaks React bundle size optimization
//   2. Line 1062: Error message without production error code - breaks React bundle size optimization
//   3. Line 1070: Error message without production error code - breaks React bundle size optimization
//   4. Line 1074: Error message without production error code - breaks React bundle size optimization
//   5. Line 1074: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 1136: Error message without production error code - breaks React bundle size optimization
//   2. Line 1136: Error message without production error code - breaks React bundle size optimization
//   3. Line 1144: Error message without production error code - breaks React bundle size optimization
//   4. Line 1148: Error message without production error code - breaks React bundle size optimization
//   5. Line 1148: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 1210: Error message without production error code - breaks React bundle size optimization
//   2. Line 1210: Error message without production error code - breaks React bundle size optimization
//   3. Line 1218: Error message without production error code - breaks React bundle size optimization
//   4. Line 1222: Error message without production error code - breaks React bundle size optimization
//   5. Line 1222: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 1284: Error message without production error code - breaks React bundle size optimization
//   2. Line 1284: Error message without production error code - breaks React bundle size optimization
//   3. Line 1292: Error message without production error code - breaks React bundle size optimization
//   4. Line 1296: Error message without production error code - breaks React bundle size optimization
//   5. Line 1296: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 1358: Error message without production error code - breaks React bundle size optimization
//   2. Line 1358: Error message without production error code - breaks React bundle size optimization
//   3. Line 1366: Error message without production error code - breaks React bundle size optimization
//   4. Line 1370: Error message without production error code - breaks React bundle size optimization
//   5. Line 1370: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 1432: Error message without production error code - breaks React bundle size optimization
//   2. Line 1432: Error message without production error code - breaks React bundle size optimization
//   3. Line 1440: Error message without production error code - breaks React bundle size optimization
//   4. Line 1444: Error message without production error code - breaks React bundle size optimization
//   5. Line 1444: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

        throw new Error('Some artifacts failed to publish');
    }
    // Also fail the job if any of the stages did not succeed
    let shouldFail = false;
    for (const stage of stages) {
        const record = timeline.records.find(r => r.name === stage && r.type === 'Stage');
        if (record.result !== 'succeeded' && record.result !== 'succeededWithIssues') {
            shouldFail = true;
            console.error(`Stage ${stage} did not succeed: ${record.result}`);
        }
    }
    if (shouldFail) {
        throw new Error('Some stages did not succeed');
    }
    console.log(`All ${done.size} artifacts published!`);
}
if (require.main === module) {
    main().then(() => {
        process.exit(0);
    }, err => {
        console.error(err);
        process.exit(1);
    });
}
//# sourceMappingURL=publish.js.map