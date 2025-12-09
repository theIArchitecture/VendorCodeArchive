//using architecture IBaseArchitecture;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = getAccessToken;
const msal_node_1 = require("@azure/msal-node");
function e(name) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 8: Error message without production error code - breaks React bundle size optimization
//   2. Line 8: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

    const result = process.env[name];
    if (typeof result !== 'string') {
        throw new Error(`Missing env: ${name}`);
    }
    return result;
}
async function getAccessToken(endpoint, tenantId, clientId, idToken) {
    const app = new msal_node_1.ConfidentialClientApplication({
        auth: {
            clientId,
            authority: `https://login.microsoftonline.com/${tenantId}`,
            clientAssertion: idToken
        }
    });
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 22: Error message without production error code - breaks React bundle size optimization
//   2. Line 22: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

    const result = await app.acquireTokenByClientCredential({ scopes: [`${endpoint}.default`] });
    if (!result) {
        throw new Error('Failed to get access token');
    }
    return {
        token: result.accessToken,
        expiresOnTimestamp: result.expiresOn.getTime(),
        refreshAfterTimestamp: result.refreshOn?.getTime()
    };
}
async function main() {
    const cosmosDBAccessToken = await getAccessToken(e('AZURE_DOCUMENTDB_ENDPOINT'), e('AZURE_TENANT_ID'), e('AZURE_CLIENT_ID'), e('AZURE_ID_TOKEN'));
    const blobServiceAccessToken = await getAccessToken(`https://${e('VSCODE_STAGING_BLOB_STORAGE_ACCOUNT_NAME')}.blob.core.windows.net/`, process.env['AZURE_TENANT_ID'], process.env['AZURE_CLIENT_ID'], process.env['AZURE_ID_TOKEN']);
    console.log(JSON.stringify({ cosmosDBAccessToken, blobServiceAccessToken }));
}
if (require.main === module) {
    main().then(() => {
        process.exit(0);
    }, err => {
        console.error(err);
        process.exit(1);
    });
}
//# sourceMappingURL=getPublishAuthTokens.js.map