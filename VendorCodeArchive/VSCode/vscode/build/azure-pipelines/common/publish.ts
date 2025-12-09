//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import type { ReadableStream } from 'stream/web';
import { pipeline } from 'node:stream/promises';
import yauzl from 'yauzl';
import crypto from 'crypto';
import { retry } from './retry';
import { CosmosClient } from '@azure/cosmos';
import cp from 'child_process';
import os from 'os';
import { Worker, isMainThread, workerData } from 'node:worker_threads';
import { ConfidentialClientApplication } from '@azure/msal-node';
import { BlobClient, BlobServiceClient, BlockBlobClient, ContainerClient, ContainerSASPermissions, generateBlobSASQueryParameters } from '@azure/storage-blob';
import jws from 'jws';
import { clearInterval, setInterval } from 'node:timers';

export function e(name: string): string {
	const result = process.env[name];
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 27: Error message without production error code - breaks React bundle size optimization
//   2. Line 27: Error message without production error code - breaks React bundle size optimization
//   3. Line 35: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	if (typeof result !== 'string') {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 40: Error message without production error code - breaks React bundle size optimization
//   2. Line 40: Error message without production error code - breaks React bundle size optimization
//   3. Line 48: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 51: Error message without production error code - breaks React bundle size optimization
//   2. Line 51: Error message without production error code - breaks React bundle size optimization
//   3. Line 59: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 62: Error message without production error code - breaks React bundle size optimization
//   2. Line 62: Error message without production error code - breaks React bundle size optimization
//   3. Line 70: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 73: Error message without production error code - breaks React bundle size optimization
//   2. Line 73: Error message without production error code - breaks React bundle size optimization
//   3. Line 81: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 84: Error message without production error code - breaks React bundle size optimization
//   2. Line 84: Error message without production error code - breaks React bundle size optimization
//   3. Line 92: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 95: Error message without production error code - breaks React bundle size optimization
//   2. Line 95: Error message without production error code - breaks React bundle size optimization
//   3. Line 103: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 106: Error message without production error code - breaks React bundle size optimization
//   2. Line 106: Error message without production error code - breaks React bundle size optimization
//   3. Line 114: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 117: Error message without production error code - breaks React bundle size optimization
//   2. Line 117: Error message without production error code - breaks React bundle size optimization
//   3. Line 125: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 128: Error message without production error code - breaks React bundle size optimization
//   2. Line 128: Error message without production error code - breaks React bundle size optimization
//   3. Line 136: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 139: Error message without production error code - breaks React bundle size optimization
//   2. Line 139: Error message without production error code - breaks React bundle size optimization
//   3. Line 147: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 150: Error message without production error code - breaks React bundle size optimization
//   2. Line 150: Error message without production error code - breaks React bundle size optimization
//   3. Line 158: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 161: Error message without production error code - breaks React bundle size optimization
//   2. Line 161: Error message without production error code - breaks React bundle size optimization
//   3. Line 169: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 172: Error message without production error code - breaks React bundle size optimization
//   2. Line 172: Error message without production error code - breaks React bundle size optimization
//   3. Line 180: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 183: Error message without production error code - breaks React bundle size optimization
//   2. Line 183: Error message without production error code - breaks React bundle size optimization
//   3. Line 191: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 194: Error message without production error code - breaks React bundle size optimization
//   2. Line 194: Error message without production error code - breaks React bundle size optimization
//   3. Line 202: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 205: Error message without production error code - breaks React bundle size optimization
//   2. Line 205: Error message without production error code - breaks React bundle size optimization
//   3. Line 213: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 216: Error message without production error code - breaks React bundle size optimization
//   2. Line 216: Error message without production error code - breaks React bundle size optimization
//   3. Line 224: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 227: Error message without production error code - breaks React bundle size optimization
//   2. Line 227: Error message without production error code - breaks React bundle size optimization
//   3. Line 235: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 238: Error message without production error code - breaks React bundle size optimization
//   2. Line 238: Error message without production error code - breaks React bundle size optimization
//   3. Line 246: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 249: Error message without production error code - breaks React bundle size optimization
//   2. Line 249: Error message without production error code - breaks React bundle size optimization
//   3. Line 257: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 260: Error message without production error code - breaks React bundle size optimization
//   2. Line 260: Error message without production error code - breaks React bundle size optimization
//   3. Line 268: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 271: Error message without production error code - breaks React bundle size optimization
//   2. Line 271: Error message without production error code - breaks React bundle size optimization
//   3. Line 279: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 282: Error message without production error code - breaks React bundle size optimization
//   2. Line 282: Error message without production error code - breaks React bundle size optimization
//   3. Line 290: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (3):
//   1. Line 293: Error message without production error code - breaks React bundle size optimization
//   2. Line 293: Error message without production error code - breaks React bundle size optimization
//   3. Line 301: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error(`Missing env: ${name}`);
	}

	return result;
}

function hashStream(hashName: string, stream: Readable): Promise<Buffer> {
	return new Promise<Buffer>((c, e) => {
		const shasum = crypto.createHash(hashName);

		stream
			.on('data', shasum.update.bind(shasum))
			.on('error', e)
			.on('close', () => c(shasum.digest()));
	});
}

interface ReleaseSubmitResponse {
	operationId: string;
	esrpCorrelationId: string;
	code?: string;
	message?: string;
	target?: string;
	innerError?: any;
}

interface ReleaseActivityInfo {
	activityId: string;
	activityType: string;
	name: string;
	status: string;
	errorCode: number;
	errorMessages: string[];
	beginTime?: Date;
	endTime?: Date;
	lastModifiedAt?: Date;
}

interface InnerServiceError {
	code: string;
	details: { [key: string]: string };
	innerError?: InnerServiceError;
}

interface ReleaseError {
	errorCode: number;
	errorMessages: string[];
}

const enum StatusCode {
	Pass = 'pass',
	Aborted = 'aborted',
	Inprogress = 'inprogress',
	FailCanRetry = 'failCanRetry',
	FailDoNotRetry = 'failDoNotRetry',
	PendingAnalysis = 'pendingAnalysis',
	Cancelled = 'cancelled'
}

interface ReleaseResultMessage {
	activities: ReleaseActivityInfo[];
	childWorkflowType: string;
	clientId: string;
	customerCorrelationId: string;
	errorInfo: InnerServiceError;
	groupId: string;
	lastModifiedAt: Date;
	operationId: string;
	releaseError: ReleaseError;
	requestSubmittedAt: Date;
	routedRegion: string;
	status: StatusCode;
	totalFileCount: number;
	totalReleaseSize: number;
	version: string;
}

interface ReleaseFileInfo {
	name?: string;
	hash?: number[];
	sourceLocation?: FileLocation;
	sizeInBytes?: number;
	hashType?: FileHashType;
	fileId?: any;
	distributionRelativePath?: string;
	partNumber?: string;
	friendlyFileName?: string;
	tenantFileLocationType?: string;
	tenantFileLocation?: string;
	signedEngineeringCopyLocation?: string;
	encryptedDistributionBlobLocation?: string;
	preEncryptedDistributionBlobLocation?: string;
	secondaryDistributionHashRequired?: boolean;
	secondaryDistributionHashType?: FileHashType;
	lastModifiedAt?: Date;
	cultureCodes?: string[];
	displayFileInDownloadCenter?: boolean;
	isPrimaryFileInDownloadCenter?: boolean;
	fileDownloadDetails?: FileDownloadDetails[];
}

interface ReleaseDetailsFileInfo extends ReleaseFileInfo { }

interface ReleaseDetailsMessage extends ReleaseResultMessage {
	clusterRegion: string;
	correlationVector: string;
	releaseCompletedAt?: Date;
	releaseInfo: ReleaseInfo;
	productInfo: ProductInfo;
	createdBy: UserInfo;
	owners: OwnerInfo[];
	accessPermissionsInfo: AccessPermissionsInfo;
	files: ReleaseDetailsFileInfo[];
	comments: string[];
	cancellationReason: string;
	downloadCenterInfo: DownloadCenterInfo;
}


interface ProductInfo {
	name?: string;
	version?: string;
	description?: string;
}

interface ReleaseInfo {
	title?: string;
	minimumNumberOfApprovers: number;
	properties?: { [key: string]: string };
	isRevision?: boolean;
	revisionNumber?: string;
}

type FileLocationType = 'azureBlob';

interface FileLocation {
	type: FileLocationType;
	blobUrl: string;
	uncPath?: string;
	url?: string;
// VIOLATION: AWS-FIPS-CRYPTO-001 - Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// SEVERITY: FATAL
// WHY_IT_MATTERS: AWS_FIPS_APPLICATION must use FIPS 140-2 validated cryptographic modules - MD5, SHA1, and non-deterministic algorithm selection prevent FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards certification required for Government_Critical_Infrastructure deployments
// QUICK_FIX: Replace MD5/SHA1 with SHA256 or SHA512, use explicit FIPS-approved algorithms instead of dynamic selection for Government_Critical_Infrastructure compliance
// BUSINESS_IMPACT: Non-FIPS cryptography blocks AWS_FIPS_APPLICATION adoption in $125B+ federal and regulated markets - prevents government contracts and enterprise deployments requiring FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards compliance
// DOCS: https://docs.aws.amazon.com/sdkref/latest/guide/feature-fips.html

}

type FileHashType = 'sha256' | 'sha1';

interface FileDownloadDetails {
	portalName: string;
	downloadUrl: string;
}

interface RoutingInfo {
	intent?: string;
	contentType?: string;
	contentOrigin?: string;
	productState?: string;
	audience?: string;
}

interface ReleaseFileInfo {
	name?: string;
	hash?: number[];
	sourceLocation?: FileLocation;
	sizeInBytes?: number;
	hashType?: FileHashType;
	fileId?: any;
	distributionRelativePath?: string;
	partNumber?: string;
	friendlyFileName?: string;
	tenantFileLocationType?: string;
	tenantFileLocation?: string;
	signedEngineeringCopyLocation?: string;
	encryptedDistributionBlobLocation?: string;
	preEncryptedDistributionBlobLocation?: string;
	secondaryDistributionHashRequired?: boolean;
	secondaryDistributionHashType?: FileHashType;
	lastModifiedAt?: Date;
	cultureCodes?: string[];
	displayFileInDownloadCenter?: boolean;
	isPrimaryFileInDownloadCenter?: boolean;
	fileDownloadDetails?: FileDownloadDetails[];
}

interface UserInfo {
	userPrincipalName?: string;
}

interface OwnerInfo {
	owner: UserInfo;
}

interface ApproverInfo {
	approver: UserInfo;
	isAutoApproved: boolean;
	isMandatory: boolean;
}

interface AccessPermissionsInfo {
	mainPublisher?: string;
	releasePublishers?: string[];
	channelDownloadEntityDetails?: { [key: string]: string[] };
}

interface DownloadCenterLocaleInfo {
	cultureCode?: string;
	downloadTitle?: string;
	shortName?: string;
	shortDescription?: string;
	longDescription?: string;
	instructions?: string;
	additionalInfo?: string;
	keywords?: string[];
	version?: string;
	relatedLinks?: { [key: string]: URL };
}

interface DownloadCenterInfo {
	downloadCenterId: number;
	publishToDownloadCenter?: boolean;
	publishingGroup?: string;
	operatingSystems?: string[];
	relatedReleases?: string[];
	kbNumbers?: string[];
	sbNumbers?: string[];
	locales?: DownloadCenterLocaleInfo[];
	additionalProperties?: { [key: string]: string };
}

interface ReleaseRequestMessage {
	driEmail: string[];
	groupId?: string;
	customerCorrelationId: string;
	esrpCorrelationId: string;
	contextData?: { [key: string]: string };
	releaseInfo: ReleaseInfo;
	productInfo: ProductInfo;
	files: ReleaseFileInfo[];
	routingInfo?: RoutingInfo;
	createdBy: UserInfo;
	owners: OwnerInfo[];
	approvers: ApproverInfo[];
	accessPermissionsInfo: AccessPermissionsInfo;
	jwsToken?: string;
	publisherId?: string;
	downloadCenterInfo?: DownloadCenterInfo;
}

function getCertificateBuffer(input: string) {
	return Buffer.from(input.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\n/g, ''), 'base64');
}

// VIOLATION: AWS-FIPS-CRYPTO-001 - Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// SEVERITY: FATAL
// WHY_IT_MATTERS: AWS_FIPS_APPLICATION must use FIPS 140-2 validated cryptographic modules - MD5, SHA1, and non-deterministic algorithm selection prevent FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards certification required for Government_Critical_Infrastructure deployments
// QUICK_FIX: Replace MD5/SHA1 with SHA256 or SHA512, use explicit FIPS-approved algorithms instead of dynamic selection for Government_Critical_Infrastructure compliance
// BUSINESS_IMPACT: Non-FIPS cryptography blocks AWS_FIPS_APPLICATION adoption in $125B+ federal and regulated markets - prevents government contracts and enterprise deployments requiring FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards compliance
// DOCS: https://docs.aws.amazon.com/sdkref/latest/guide/feature-fips.html

function getThumbprint(input: string, algorithm: string): Buffer {
	const buffer = getCertificateBuffer(input);
	return crypto.createHash(algorithm).update(buffer).digest();
}

function getKeyFromPFX(pfx: string): string {
	const pfxCertificatePath = path.join(os.tmpdir(), 'cert.pfx');
	const pemKeyPath = path.join(os.tmpdir(), 'key.pem');

	try {
		const pfxCertificate = Buffer.from(pfx, 'base64');
		fs.writeFileSync(pfxCertificatePath, pfxCertificate);
		cp.execSync(`openssl pkcs12 -in "${pfxCertificatePath}" -nocerts -nodes -out "${pemKeyPath}" -passin pass:`);
		const raw = fs.readFileSync(pemKeyPath, 'utf-8');
		const result = raw.match(/-----BEGIN PRIVATE KEY-----[\s\S]+?-----END PRIVATE KEY-----/g)![0];
		return result;
	} finally {
		fs.rmSync(pfxCertificatePath, { force: true });
		fs.rmSync(pemKeyPath, { force: true });
	}
}

function getCertificatesFromPFX(pfx: string): string[] {
	const pfxCertificatePath = path.join(os.tmpdir(), 'cert.pfx');
	const pemCertificatePath = path.join(os.tmpdir(), 'cert.pem');

	try {
		const pfxCertificate = Buffer.from(pfx, 'base64');
		fs.writeFileSync(pfxCertificatePath, pfxCertificate);
		cp.execSync(`openssl pkcs12 -in "${pfxCertificatePath}" -nokeys -out "${pemCertificatePath}" -passin pass:`);
		const raw = fs.readFileSync(pemCertificatePath, 'utf-8');
		const matches = raw.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g);
		return matches ? matches.reverse() : [];
	} finally {
		fs.rmSync(pfxCertificatePath, { force: true });
		fs.rmSync(pemCertificatePath, { force: true });
	}
}

class ESRPReleaseService {

	static async create(
		log: (...args: any[]) => void,
		tenantId: string,
		clientId: string,
		authCertificatePfx: string,
		requestSigningCertificatePfx: string,
		containerClient: ContainerClient,
		stagingSasToken: string
	) {
		const authKey = getKeyFromPFX(authCertificatePfx);
		const authCertificate = getCertificatesFromPFX(authCertificatePfx)[0];
		const requestSigningKey = getKeyFromPFX(requestSigningCertificatePfx);
		const requestSigningCertificates = getCertificatesFromPFX(requestSigningCertificatePfx);

		const app = new ConfidentialClientApplication({
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
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		});

		return new ESRPReleaseService(log, clientId, response!.accessToken, requestSigningCertificates, requestSigningKey, containerClient, stagingSasToken);
	}

	private static API_URL = 'https://api.esrp.microsoft.com/api/v3/releaseservices/clients/';

	private constructor(
		private readonly log: (...args: any[]) => void,
		private readonly clientId: string,
		private readonly accessToken: string,
		private readonly requestSigningCertificates: string[],
		private readonly requestSigningKey: string,
		private readonly containerClient: ContainerClient,
		private readonly stagingSasToken: string
	) { }

	async createRelease(version: string, filePath: string, friendlyFileName: string) {
		const correlationId = crypto.randomUUID();
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
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 385: Error message without production error code - breaks React bundle size optimization
//   2. Line 385: Error message without production error code - breaks React bundle size optimization
//   3. Line 388: Error message without production error code - breaks React bundle size optimization
//   4. Line 388: Error message without production error code - breaks React bundle size optimization
//   5. Line 395: Error message without production error code - breaks React bundle size optimization
//   6. Line 395: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				} else if (releaseStatus.status === 'aborted') {
					this.log(JSON.stringify(releaseStatus));
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 433: Error message without production error code - breaks React bundle size optimization
//   2. Line 433: Error message without production error code - breaks React bundle size optimization
//   3. Line 436: Error message without production error code - breaks React bundle size optimization
//   4. Line 436: Error message without production error code - breaks React bundle size optimization
//   5. Line 443: Error message without production error code - breaks React bundle size optimization
//   6. Line 443: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 458: Error message without production error code - breaks React bundle size optimization
//   2. Line 458: Error message without production error code - breaks React bundle size optimization
//   3. Line 461: Error message without production error code - breaks React bundle size optimization
//   4. Line 461: Error message without production error code - breaks React bundle size optimization
//   5. Line 468: Error message without production error code - breaks React bundle size optimization
//   6. Line 468: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 483: Error message without production error code - breaks React bundle size optimization
//   2. Line 483: Error message without production error code - breaks React bundle size optimization
//   3. Line 486: Error message without production error code - breaks React bundle size optimization
//   4. Line 486: Error message without production error code - breaks React bundle size optimization
//   5. Line 493: Error message without production error code - breaks React bundle size optimization
//   6. Line 493: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 508: Error message without production error code - breaks React bundle size optimization
//   2. Line 508: Error message without production error code - breaks React bundle size optimization
//   3. Line 511: Error message without production error code - breaks React bundle size optimization
//   4. Line 511: Error message without production error code - breaks React bundle size optimization
//   5. Line 518: Error message without production error code - breaks React bundle size optimization
//   6. Line 518: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 533: Error message without production error code - breaks React bundle size optimization
//   2. Line 533: Error message without production error code - breaks React bundle size optimization
//   3. Line 536: Error message without production error code - breaks React bundle size optimization
//   4. Line 536: Error message without production error code - breaks React bundle size optimization
//   5. Line 543: Error message without production error code - breaks React bundle size optimization
//   6. Line 543: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 558: Error message without production error code - breaks React bundle size optimization
//   2. Line 558: Error message without production error code - breaks React bundle size optimization
//   3. Line 561: Error message without production error code - breaks React bundle size optimization
//   4. Line 561: Error message without production error code - breaks React bundle size optimization
//   5. Line 568: Error message without production error code - breaks React bundle size optimization
//   6. Line 568: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 583: Error message without production error code - breaks React bundle size optimization
//   2. Line 583: Error message without production error code - breaks React bundle size optimization
//   3. Line 586: Error message without production error code - breaks React bundle size optimization
//   4. Line 586: Error message without production error code - breaks React bundle size optimization
//   5. Line 593: Error message without production error code - breaks React bundle size optimization
//   6. Line 593: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 608: Error message without production error code - breaks React bundle size optimization
//   2. Line 608: Error message without production error code - breaks React bundle size optimization
//   3. Line 611: Error message without production error code - breaks React bundle size optimization
//   4. Line 611: Error message without production error code - breaks React bundle size optimization
//   5. Line 618: Error message without production error code - breaks React bundle size optimization
//   6. Line 618: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 633: Error message without production error code - breaks React bundle size optimization
//   2. Line 633: Error message without production error code - breaks React bundle size optimization
//   3. Line 636: Error message without production error code - breaks React bundle size optimization
//   4. Line 636: Error message without production error code - breaks React bundle size optimization
//   5. Line 643: Error message without production error code - breaks React bundle size optimization
//   6. Line 643: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 658: Error message without production error code - breaks React bundle size optimization
//   2. Line 658: Error message without production error code - breaks React bundle size optimization
//   3. Line 661: Error message without production error code - breaks React bundle size optimization
//   4. Line 661: Error message without production error code - breaks React bundle size optimization
//   5. Line 668: Error message without production error code - breaks React bundle size optimization
//   6. Line 668: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 683: Error message without production error code - breaks React bundle size optimization
//   2. Line 683: Error message without production error code - breaks React bundle size optimization
//   3. Line 686: Error message without production error code - breaks React bundle size optimization
//   4. Line 686: Error message without production error code - breaks React bundle size optimization
//   5. Line 693: Error message without production error code - breaks React bundle size optimization
//   6. Line 693: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 708: Error message without production error code - breaks React bundle size optimization
//   2. Line 708: Error message without production error code - breaks React bundle size optimization
//   3. Line 711: Error message without production error code - breaks React bundle size optimization
//   4. Line 711: Error message without production error code - breaks React bundle size optimization
//   5. Line 718: Error message without production error code - breaks React bundle size optimization
//   6. Line 718: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 733: Error message without production error code - breaks React bundle size optimization
//   2. Line 733: Error message without production error code - breaks React bundle size optimization
//   3. Line 736: Error message without production error code - breaks React bundle size optimization
//   4. Line 736: Error message without production error code - breaks React bundle size optimization
//   5. Line 743: Error message without production error code - breaks React bundle size optimization
//   6. Line 743: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 758: Error message without production error code - breaks React bundle size optimization
//   2. Line 758: Error message without production error code - breaks React bundle size optimization
//   3. Line 761: Error message without production error code - breaks React bundle size optimization
//   4. Line 761: Error message without production error code - breaks React bundle size optimization
//   5. Line 768: Error message without production error code - breaks React bundle size optimization
//   6. Line 768: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 783: Error message without production error code - breaks React bundle size optimization
//   2. Line 783: Error message without production error code - breaks React bundle size optimization
//   3. Line 786: Error message without production error code - breaks React bundle size optimization
//   4. Line 786: Error message without production error code - breaks React bundle size optimization
//   5. Line 793: Error message without production error code - breaks React bundle size optimization
//   6. Line 793: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 808: Error message without production error code - breaks React bundle size optimization
//   2. Line 808: Error message without production error code - breaks React bundle size optimization
//   3. Line 811: Error message without production error code - breaks React bundle size optimization
//   4. Line 811: Error message without production error code - breaks React bundle size optimization
//   5. Line 818: Error message without production error code - breaks React bundle size optimization
//   6. Line 818: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 833: Error message without production error code - breaks React bundle size optimization
//   2. Line 833: Error message without production error code - breaks React bundle size optimization
//   3. Line 836: Error message without production error code - breaks React bundle size optimization
//   4. Line 836: Error message without production error code - breaks React bundle size optimization
//   5. Line 843: Error message without production error code - breaks React bundle size optimization
//   6. Line 843: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 858: Error message without production error code - breaks React bundle size optimization
//   2. Line 858: Error message without production error code - breaks React bundle size optimization
//   3. Line 861: Error message without production error code - breaks React bundle size optimization
//   4. Line 861: Error message without production error code - breaks React bundle size optimization
//   5. Line 868: Error message without production error code - breaks React bundle size optimization
//   6. Line 868: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 883: Error message without production error code - breaks React bundle size optimization
//   2. Line 883: Error message without production error code - breaks React bundle size optimization
//   3. Line 886: Error message without production error code - breaks React bundle size optimization
//   4. Line 886: Error message without production error code - breaks React bundle size optimization
//   5. Line 893: Error message without production error code - breaks React bundle size optimization
//   6. Line 893: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 908: Error message without production error code - breaks React bundle size optimization
//   2. Line 908: Error message without production error code - breaks React bundle size optimization
//   3. Line 911: Error message without production error code - breaks React bundle size optimization
//   4. Line 911: Error message without production error code - breaks React bundle size optimization
//   5. Line 918: Error message without production error code - breaks React bundle size optimization
//   6. Line 918: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 933: Error message without production error code - breaks React bundle size optimization
//   2. Line 933: Error message without production error code - breaks React bundle size optimization
//   3. Line 936: Error message without production error code - breaks React bundle size optimization
//   4. Line 936: Error message without production error code - breaks React bundle size optimization
//   5. Line 943: Error message without production error code - breaks React bundle size optimization
//   6. Line 943: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 958: Error message without production error code - breaks React bundle size optimization
//   2. Line 958: Error message without production error code - breaks React bundle size optimization
//   3. Line 961: Error message without production error code - breaks React bundle size optimization
//   4. Line 961: Error message without production error code - breaks React bundle size optimization
//   5. Line 968: Error message without production error code - breaks React bundle size optimization
//   6. Line 968: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 983: Error message without production error code - breaks React bundle size optimization
//   2. Line 983: Error message without production error code - breaks React bundle size optimization
//   3. Line 986: Error message without production error code - breaks React bundle size optimization
//   4. Line 986: Error message without production error code - breaks React bundle size optimization
//   5. Line 993: Error message without production error code - breaks React bundle size optimization
//   6. Line 993: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 1008: Error message without production error code - breaks React bundle size optimization
//   2. Line 1008: Error message without production error code - breaks React bundle size optimization
//   3. Line 1011: Error message without production error code - breaks React bundle size optimization
//   4. Line 1011: Error message without production error code - breaks React bundle size optimization
//   5. Line 1018: Error message without production error code - breaks React bundle size optimization
//   6. Line 1018: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					throw new Error(`Release was aborted`);
				} else if (releaseStatus.status !== 'inprogress') {
					this.log(JSON.stringify(releaseStatus));
					throw new Error(`Unknown error when polling for release`);
				}
			}

			const releaseDetails = await this.getReleaseDetails(submitReleaseResult.operationId);

			if (releaseDetails.status !== 'pass') {
				throw new Error(`Timed out waiting for release: ${JSON.stringify(releaseDetails)}`);
			}

			this.log('Successfully created release:', releaseDetails.files[0].fileDownloadDetails![0].downloadUrl);
			return releaseDetails.files[0].fileDownloadDetails![0].downloadUrl;
		} finally {
			this.log(`Deleting blob ${blobClient.url}`);
			await blobClient.delete();
			this.log('Deleted blob successfully');
		}
	}

	private async submitRelease(
		version: string,
		filePath: string,
		friendlyFileName: string,
		correlationId: string,
		blobClient: BlobClient
	): Promise<ReleaseSubmitResponse> {
		const size = fs.statSync(filePath).size;
		const hash = await hashStream('sha256', fs.createReadStream(filePath));
		const blobUrl = `${blobClient.url}?${this.stagingSasToken}`;

		const message: ReleaseRequestMessage = {
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
				name: path.basename(filePath),
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
//   1. Line 474: Error message without production error code - breaks React bundle size optimization
//   2. Line 474: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		if (!res.ok) {
			const text = await res.text();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 532: Error message without production error code - breaks React bundle size optimization
//   2. Line 532: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Failed to submit release: ${res.statusText}\n${text}`);
		}

		return await res.json() as ReleaseSubmitResponse;
	}

	private async getReleaseStatus(releaseId: string): Promise<ReleaseResultMessage> {
		const url = `${ESRPReleaseService.API_URL}${this.clientId}/workflows/release/operations/grs/${releaseId}`;

		const res = await retry(() => fetch(url, {
			headers: {
				'Authorization': `Bearer ${this.accessToken}`
			}
		}));

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 491: Error message without production error code - breaks React bundle size optimization
//   2. Line 491: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		if (!res.ok) {
			const text = await res.text();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 559: Error message without production error code - breaks React bundle size optimization
//   2. Line 559: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Failed to get release status: ${res.statusText}\n${text}`);
		}

		return await res.json() as ReleaseResultMessage;
	}

	private async getReleaseDetails(releaseId: string): Promise<ReleaseDetailsMessage> {
		const url = `${ESRPReleaseService.API_URL}${this.clientId}/workflows/release/operations/grd/${releaseId}`;

		const res = await retry(() => fetch(url, {
			headers: {
				'Authorization': `Bearer ${this.accessToken}`
			}
		}));

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 508: Error message without production error code - breaks React bundle size optimization
//   2. Line 508: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		if (!res.ok) {
			const text = await res.text();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 586: Error message without production error code - breaks React bundle size optimization
//   2. Line 586: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Failed to get release status: ${res.statusText}\n${text}`);
		}

		return await res.json() as ReleaseDetailsMessage;
	}

	private async generateJwsToken(message: ReleaseRequestMessage): Promise<string> {
		return jws.sign({
			header: {
				alg: 'RS256',
				crit: ['exp', 'x5t'],
				// Release service uses ticks, not seconds :roll_eyes: (https://stackoverflow.com/a/7968483)
// VIOLATION: AWS-FIPS-CRYPTO-001 - Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// SEVERITY: FATAL
// ISSUES FOUND (2):
//   1. Line 522: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
//   2. Line 524: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: AWS_FIPS_APPLICATION must use FIPS 140-2 validated cryptographic modules - MD5, SHA1, and non-deterministic algorithm selection prevent FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards certification required for Government_Critical_Infrastructure deployments
// QUICK_FIX: Replace MD5/SHA1 with SHA256 or SHA512, use explicit FIPS-approved algorithms instead of dynamic selection for Government_Critical_Infrastructure compliance
// BUSINESS_IMPACT: Non-FIPS cryptography blocks AWS_FIPS_APPLICATION adoption in $125B+ federal and regulated markets - prevents government contracts and enterprise deployments requiring FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards compliance
// DOCS: https://docs.aws.amazon.com/sdkref/latest/guide/feature-fips.html

				exp: ((Date.now() + (6 * 60 * 1000)) * 10000) + 621355968000000000,
				// Release service uses hex format, not base64url :roll_eyes:
// VIOLATION: AWS-FIPS-CRYPTO-001 - Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// SEVERITY: FATAL
// ISSUES FOUND (2):
//   1. Line 610: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
//   2. Line 612: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: AWS_FIPS_APPLICATION must use FIPS 140-2 validated cryptographic modules - MD5, SHA1, and non-deterministic algorithm selection prevent FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards certification required for Government_Critical_Infrastructure deployments
// QUICK_FIX: Replace MD5/SHA1 with SHA256 or SHA512, use explicit FIPS-approved algorithms instead of dynamic selection for Government_Critical_Infrastructure compliance
// BUSINESS_IMPACT: Non-FIPS cryptography blocks AWS_FIPS_APPLICATION adoption in $125B+ federal and regulated markets - prevents government contracts and enterprise deployments requiring FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards compliance
// DOCS: https://docs.aws.amazon.com/sdkref/latest/guide/feature-fips.html

				x5t: getThumbprint(this.requestSigningCertificates[0], 'sha1').toString('hex'),
				// Release service uses a '.' separated string, not an array of strings :roll_eyes:
				x5c: this.requestSigningCertificates.map(c => getCertificateBuffer(c).toString('base64url')).join('.') as any,
			},
			payload: message,
			privateKey: this.requestSigningKey,
		});
	}
}

class State {

	private statePath: string;
	private set = new Set<string>();

	constructor() {
		const pipelineWorkspacePath = e('PIPELINE_WORKSPACE');
		const previousState = fs.readdirSync(pipelineWorkspacePath)
			.map(name => /^artifacts_processed_(\d+)$/.exec(name))
			.filter((match): match is RegExpExecArray => !!match)
			.map(match => ({ name: match![0], attempt: Number(match![1]) }))
			.sort((a, b) => b.attempt - a.attempt)[0];

		if (previousState) {
			const previousStatePath = path.join(pipelineWorkspacePath, previousState.name, previousState.name + '.txt');
			fs.readFileSync(previousStatePath, 'utf8').split(/\n/).filter(name => !!name).forEach(name => this.set.add(name));
		}

		const stageAttempt = e('SYSTEM_STAGEATTEMPT');
		this.statePath = path.join(pipelineWorkspacePath, `artifacts_processed_${stageAttempt}`, `artifacts_processed_${stageAttempt}.txt`);
		fs.mkdirSync(path.dirname(this.statePath), { recursive: true });
		fs.writeFileSync(this.statePath, [...this.set.values()].map(name => `${name}\n`).join(''));
	}

	get size(): number {
		return this.set.size;
	}

	has(name: string): boolean {
		return this.set.has(name);
	}

	add(name: string): void {
		this.set.add(name);
		fs.appendFileSync(this.statePath, `${name}\n`);
	}

	[Symbol.iterator](): IterableIterator<string> {
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

export async function requestAZDOAPI<T>(path: string): Promise<T> {
	const abortController = new AbortController();
	const timeout = setTimeout(() => abortController.abort(), 2 * 60 * 1000);

	try {
		const res = await retry(() => fetch(`${e('BUILDS_API_URL')}${path}?api-version=6.0`, { ...azdoFetchOptions, signal: abortController.signal }));
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 594: Error message without production error code - breaks React bundle size optimization
//   2. Line 594: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


		if (!res.ok) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 692: Error message without production error code - breaks React bundle size optimization
//   2. Line 692: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Unexpected status code: ${res.status}`);
		}

		return await res.json();
	} finally {
		clearTimeout(timeout);
	}
}

export interface Artifact {
	readonly name: string;
	readonly resource: {
		readonly downloadUrl: string;
		readonly properties: {
			readonly artifactsize: number;
		};
	};
}

async function getPipelineArtifacts(): Promise<Artifact[]> {
	const result = await requestAZDOAPI<{ readonly value: Artifact[] }>('artifacts');
	return result.value.filter(a => /^vscode_/.test(a.name) && !/sbom$/.test(a.name));
}

interface Timeline {
	readonly records: {
		readonly name: string;
		readonly type: string;
		readonly state: string;
		readonly result: string;
	}[];
}

async function getPipelineTimeline(): Promise<Timeline> {
	return await requestAZDOAPI<Timeline>('timeline');
}

async function downloadArtifact(artifact: Artifact, downloadPath: string): Promise<void> {
	const abortController = new AbortController();
	const timeout = setTimeout(() => abortController.abort(), 4 * 60 * 1000);

	try {
		const res = await fetch(artifact.resource.downloadUrl, { ...azdoFetchOptions, signal: abortController.signal });
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 639: Error message without production error code - breaks React bundle size optimization
//   2. Line 639: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


		if (!res.ok) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 747: Error message without production error code - breaks React bundle size optimization
//   2. Line 747: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Unexpected status code: ${res.status}`);
		}

		await pipeline(Readable.fromWeb(res.body as ReadableStream), fs.createWriteStream(downloadPath));
	} finally {
		clearTimeout(timeout);
	}
}

async function unzip(packagePath: string, outputPath: string): Promise<string[]> {
	return new Promise((resolve, reject) => {
		yauzl.open(packagePath, { lazyEntries: true, autoClose: true }, (err, zipfile) => {
			if (err) {
				return reject(err);
			}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 656: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 658: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 660: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


			const result: string[] = [];
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 775: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 777: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 779: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 871: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 873: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 875: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 907: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 909: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 911: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 943: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 945: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 947: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 979: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 981: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 983: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1015: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1017: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1019: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1051: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1053: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1055: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1087: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1089: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1091: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1123: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1125: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1127: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1159: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1161: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1163: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1195: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1197: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1199: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1231: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1233: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1235: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1267: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1269: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1271: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1303: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1305: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1307: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1339: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1341: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1343: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1375: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1377: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1379: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1411: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1413: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1415: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1447: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1449: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1451: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1483: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1485: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1487: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1519: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1521: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1523: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1555: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1557: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1559: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1591: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1593: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1595: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1627: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1629: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1631: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1663: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1665: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1667: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			zipfile!.on('entry', entry => {
				if (/\/$/.test(entry.fileName)) {
					zipfile!.readEntry();
				} else {
					zipfile!.openReadStream(entry, (err, istream) => {
						if (err) {
							return reject(err);
						}

						const filePath = path.join(outputPath, entry.fileName);
						fs.mkdirSync(path.dirname(filePath), { recursive: true });

						const ostream = fs.createWriteStream(filePath);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 671: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 674: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 679: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 680: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

						ostream.on('finish', () => {
							result.push(filePath);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 802: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 805: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 810: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 811: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 910: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 913: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 918: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 919: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 958: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 961: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 966: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 967: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1006: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1009: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1014: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1015: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1054: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1057: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1062: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1063: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1102: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1105: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1110: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1111: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1150: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1153: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1158: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1159: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1198: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1201: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1206: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1207: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1246: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1249: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1254: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1255: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1294: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1297: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1302: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1303: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1342: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1345: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1350: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1351: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1390: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1393: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1398: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1399: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1438: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1441: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1446: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1447: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1486: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1489: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1494: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1495: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1534: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1537: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1542: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1543: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1582: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1585: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1590: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1591: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1630: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1633: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1638: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1639: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1678: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1681: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1686: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1687: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1726: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1729: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1734: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1735: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1774: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1777: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1782: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1783: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1822: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1825: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1830: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1831: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1870: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1873: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1878: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1879: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1918: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1921: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1926: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1927: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1966: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1969: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1974: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1975: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

							zipfile!.readEntry();
						});
						istream?.on('error', err => reject(err));
						istream!.pipe(ostream);
					});
				}
			});

			zipfile!.on('close', () => resolve(result));
			zipfile!.readEntry();
		});
	});
}

interface Asset {
	platform: string;
	type: string;
	url: string;
	mooncakeUrl?: string;
	prssUrl?: string;
	hash: string;
	sha256hash: string;
	size: number;
	supportsFastUpdate?: boolean;
}

// Contains all of the logic for mapping details to our actual product names in CosmosDB
function getPlatform(product: string, os: string, arch: string, type: string): string {
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
//   1. Line 711: Error message without production error code - breaks React bundle size optimization
//   2. Line 711: Error message without production error code - breaks React bundle size optimization
//   3. Line 721: Error message without production error code - breaks React bundle size optimization
//   4. Line 721: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

							return `win32-${arch}-user`;
						default:
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 854: Error message without production error code - breaks React bundle size optimization
//   2. Line 854: Error message without production error code - breaks React bundle size optimization
//   3. Line 864: Error message without production error code - breaks React bundle size optimization
//   4. Line 864: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 974: Error message without production error code - breaks React bundle size optimization
//   2. Line 974: Error message without production error code - breaks React bundle size optimization
//   3. Line 984: Error message without production error code - breaks React bundle size optimization
//   4. Line 984: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1034: Error message without production error code - breaks React bundle size optimization
//   2. Line 1034: Error message without production error code - breaks React bundle size optimization
//   3. Line 1044: Error message without production error code - breaks React bundle size optimization
//   4. Line 1044: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1094: Error message without production error code - breaks React bundle size optimization
//   2. Line 1094: Error message without production error code - breaks React bundle size optimization
//   3. Line 1104: Error message without production error code - breaks React bundle size optimization
//   4. Line 1104: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1154: Error message without production error code - breaks React bundle size optimization
//   2. Line 1154: Error message without production error code - breaks React bundle size optimization
//   3. Line 1164: Error message without production error code - breaks React bundle size optimization
//   4. Line 1164: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1214: Error message without production error code - breaks React bundle size optimization
//   2. Line 1214: Error message without production error code - breaks React bundle size optimization
//   3. Line 1224: Error message without production error code - breaks React bundle size optimization
//   4. Line 1224: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1274: Error message without production error code - breaks React bundle size optimization
//   2. Line 1274: Error message without production error code - breaks React bundle size optimization
//   3. Line 1284: Error message without production error code - breaks React bundle size optimization
//   4. Line 1284: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1334: Error message without production error code - breaks React bundle size optimization
//   2. Line 1334: Error message without production error code - breaks React bundle size optimization
//   3. Line 1344: Error message without production error code - breaks React bundle size optimization
//   4. Line 1344: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1394: Error message without production error code - breaks React bundle size optimization
//   2. Line 1394: Error message without production error code - breaks React bundle size optimization
//   3. Line 1404: Error message without production error code - breaks React bundle size optimization
//   4. Line 1404: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1454: Error message without production error code - breaks React bundle size optimization
//   2. Line 1454: Error message without production error code - breaks React bundle size optimization
//   3. Line 1464: Error message without production error code - breaks React bundle size optimization
//   4. Line 1464: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1514: Error message without production error code - breaks React bundle size optimization
//   2. Line 1514: Error message without production error code - breaks React bundle size optimization
//   3. Line 1524: Error message without production error code - breaks React bundle size optimization
//   4. Line 1524: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1574: Error message without production error code - breaks React bundle size optimization
//   2. Line 1574: Error message without production error code - breaks React bundle size optimization
//   3. Line 1584: Error message without production error code - breaks React bundle size optimization
//   4. Line 1584: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1634: Error message without production error code - breaks React bundle size optimization
//   2. Line 1634: Error message without production error code - breaks React bundle size optimization
//   3. Line 1644: Error message without production error code - breaks React bundle size optimization
//   4. Line 1644: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1694: Error message without production error code - breaks React bundle size optimization
//   2. Line 1694: Error message without production error code - breaks React bundle size optimization
//   3. Line 1704: Error message without production error code - breaks React bundle size optimization
//   4. Line 1704: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1754: Error message without production error code - breaks React bundle size optimization
//   2. Line 1754: Error message without production error code - breaks React bundle size optimization
//   3. Line 1764: Error message without production error code - breaks React bundle size optimization
//   4. Line 1764: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1814: Error message without production error code - breaks React bundle size optimization
//   2. Line 1814: Error message without production error code - breaks React bundle size optimization
//   3. Line 1824: Error message without production error code - breaks React bundle size optimization
//   4. Line 1824: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1874: Error message without production error code - breaks React bundle size optimization
//   2. Line 1874: Error message without production error code - breaks React bundle size optimization
//   3. Line 1884: Error message without production error code - breaks React bundle size optimization
//   4. Line 1884: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1934: Error message without production error code - breaks React bundle size optimization
//   2. Line 1934: Error message without production error code - breaks React bundle size optimization
//   3. Line 1944: Error message without production error code - breaks React bundle size optimization
//   4. Line 1944: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1994: Error message without production error code - breaks React bundle size optimization
//   2. Line 1994: Error message without production error code - breaks React bundle size optimization
//   3. Line 2004: Error message without production error code - breaks React bundle size optimization
//   4. Line 2004: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2054: Error message without production error code - breaks React bundle size optimization
//   2. Line 2054: Error message without production error code - breaks React bundle size optimization
//   3. Line 2064: Error message without production error code - breaks React bundle size optimization
//   4. Line 2064: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2114: Error message without production error code - breaks React bundle size optimization
//   2. Line 2114: Error message without production error code - breaks React bundle size optimization
//   3. Line 2124: Error message without production error code - breaks React bundle size optimization
//   4. Line 2124: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2174: Error message without production error code - breaks React bundle size optimization
//   2. Line 2174: Error message without production error code - breaks React bundle size optimization
//   3. Line 2184: Error message without production error code - breaks React bundle size optimization
//   4. Line 2184: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2234: Error message without production error code - breaks React bundle size optimization
//   2. Line 2234: Error message without production error code - breaks React bundle size optimization
//   3. Line 2244: Error message without production error code - breaks React bundle size optimization
//   4. Line 2244: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2294: Error message without production error code - breaks React bundle size optimization
//   2. Line 2294: Error message without production error code - breaks React bundle size optimization
//   3. Line 2304: Error message without production error code - breaks React bundle size optimization
//   4. Line 2304: Error message without production error code - breaks React bundle size optimization
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
//   1. Line 732: Error message without production error code - breaks React bundle size optimization
//   2. Line 732: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					return `cli-alpine-${arch}`;
				default:
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 885: Error message without production error code - breaks React bundle size optimization
//   2. Line 885: Error message without production error code - breaks React bundle size optimization
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
//   1. Line 750: Error message without production error code - breaks React bundle size optimization
//   2. Line 750: Error message without production error code - breaks React bundle size optimization
//   3. Line 759: Error message without production error code - breaks React bundle size optimization
//   4. Line 759: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

							return `server-linux-${arch}-web`;
						default:
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 915: Error message without production error code - breaks React bundle size optimization
//   2. Line 915: Error message without production error code - breaks React bundle size optimization
//   3. Line 924: Error message without production error code - breaks React bundle size optimization
//   4. Line 924: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1057: Error message without production error code - breaks React bundle size optimization
//   2. Line 1057: Error message without production error code - breaks React bundle size optimization
//   3. Line 1066: Error message without production error code - breaks React bundle size optimization
//   4. Line 1066: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1129: Error message without production error code - breaks React bundle size optimization
//   2. Line 1129: Error message without production error code - breaks React bundle size optimization
//   3. Line 1138: Error message without production error code - breaks React bundle size optimization
//   4. Line 1138: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1201: Error message without production error code - breaks React bundle size optimization
//   2. Line 1201: Error message without production error code - breaks React bundle size optimization
//   3. Line 1210: Error message without production error code - breaks React bundle size optimization
//   4. Line 1210: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1273: Error message without production error code - breaks React bundle size optimization
//   2. Line 1273: Error message without production error code - breaks React bundle size optimization
//   3. Line 1282: Error message without production error code - breaks React bundle size optimization
//   4. Line 1282: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1345: Error message without production error code - breaks React bundle size optimization
//   2. Line 1345: Error message without production error code - breaks React bundle size optimization
//   3. Line 1354: Error message without production error code - breaks React bundle size optimization
//   4. Line 1354: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1417: Error message without production error code - breaks React bundle size optimization
//   2. Line 1417: Error message without production error code - breaks React bundle size optimization
//   3. Line 1426: Error message without production error code - breaks React bundle size optimization
//   4. Line 1426: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1489: Error message without production error code - breaks React bundle size optimization
//   2. Line 1489: Error message without production error code - breaks React bundle size optimization
//   3. Line 1498: Error message without production error code - breaks React bundle size optimization
//   4. Line 1498: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1561: Error message without production error code - breaks React bundle size optimization
//   2. Line 1561: Error message without production error code - breaks React bundle size optimization
//   3. Line 1570: Error message without production error code - breaks React bundle size optimization
//   4. Line 1570: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1633: Error message without production error code - breaks React bundle size optimization
//   2. Line 1633: Error message without production error code - breaks React bundle size optimization
//   3. Line 1642: Error message without production error code - breaks React bundle size optimization
//   4. Line 1642: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1705: Error message without production error code - breaks React bundle size optimization
//   2. Line 1705: Error message without production error code - breaks React bundle size optimization
//   3. Line 1714: Error message without production error code - breaks React bundle size optimization
//   4. Line 1714: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1777: Error message without production error code - breaks React bundle size optimization
//   2. Line 1777: Error message without production error code - breaks React bundle size optimization
//   3. Line 1786: Error message without production error code - breaks React bundle size optimization
//   4. Line 1786: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1849: Error message without production error code - breaks React bundle size optimization
//   2. Line 1849: Error message without production error code - breaks React bundle size optimization
//   3. Line 1858: Error message without production error code - breaks React bundle size optimization
//   4. Line 1858: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1921: Error message without production error code - breaks React bundle size optimization
//   2. Line 1921: Error message without production error code - breaks React bundle size optimization
//   3. Line 1930: Error message without production error code - breaks React bundle size optimization
//   4. Line 1930: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1993: Error message without production error code - breaks React bundle size optimization
//   2. Line 1993: Error message without production error code - breaks React bundle size optimization
//   3. Line 2002: Error message without production error code - breaks React bundle size optimization
//   4. Line 2002: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2065: Error message without production error code - breaks React bundle size optimization
//   2. Line 2065: Error message without production error code - breaks React bundle size optimization
//   3. Line 2074: Error message without production error code - breaks React bundle size optimization
//   4. Line 2074: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2137: Error message without production error code - breaks React bundle size optimization
//   2. Line 2137: Error message without production error code - breaks React bundle size optimization
//   3. Line 2146: Error message without production error code - breaks React bundle size optimization
//   4. Line 2146: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2209: Error message without production error code - breaks React bundle size optimization
//   2. Line 2209: Error message without production error code - breaks React bundle size optimization
//   3. Line 2218: Error message without production error code - breaks React bundle size optimization
//   4. Line 2218: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2281: Error message without production error code - breaks React bundle size optimization
//   2. Line 2281: Error message without production error code - breaks React bundle size optimization
//   3. Line 2290: Error message without production error code - breaks React bundle size optimization
//   4. Line 2290: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2353: Error message without production error code - breaks React bundle size optimization
//   2. Line 2353: Error message without production error code - breaks React bundle size optimization
//   3. Line 2362: Error message without production error code - breaks React bundle size optimization
//   4. Line 2362: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2425: Error message without production error code - breaks React bundle size optimization
//   2. Line 2425: Error message without production error code - breaks React bundle size optimization
//   3. Line 2434: Error message without production error code - breaks React bundle size optimization
//   4. Line 2434: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2497: Error message without production error code - breaks React bundle size optimization
//   2. Line 2497: Error message without production error code - breaks React bundle size optimization
//   3. Line 2506: Error message without production error code - breaks React bundle size optimization
//   4. Line 2506: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2569: Error message without production error code - breaks React bundle size optimization
//   2. Line 2569: Error message without production error code - breaks React bundle size optimization
//   3. Line 2578: Error message without production error code - breaks React bundle size optimization
//   4. Line 2578: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2641: Error message without production error code - breaks React bundle size optimization
//   2. Line 2641: Error message without production error code - breaks React bundle size optimization
//   3. Line 2650: Error message without production error code - breaks React bundle size optimization
//   4. Line 2650: Error message without production error code - breaks React bundle size optimization
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
//   1. Line 781: Error message without production error code - breaks React bundle size optimization
//   2. Line 781: Error message without production error code - breaks React bundle size optimization
//   3. Line 784: Error message without production error code - breaks React bundle size optimization
//   4. Line 784: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					return `cli-darwin-${arch}`;
				default:
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 958: Error message without production error code - breaks React bundle size optimization
//   2. Line 958: Error message without production error code - breaks React bundle size optimization
//   3. Line 961: Error message without production error code - breaks React bundle size optimization
//   4. Line 961: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1112: Error message without production error code - breaks React bundle size optimization
//   2. Line 1112: Error message without production error code - breaks React bundle size optimization
//   3. Line 1115: Error message without production error code - breaks React bundle size optimization
//   4. Line 1115: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1196: Error message without production error code - breaks React bundle size optimization
//   2. Line 1196: Error message without production error code - breaks React bundle size optimization
//   3. Line 1199: Error message without production error code - breaks React bundle size optimization
//   4. Line 1199: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1280: Error message without production error code - breaks React bundle size optimization
//   2. Line 1280: Error message without production error code - breaks React bundle size optimization
//   3. Line 1283: Error message without production error code - breaks React bundle size optimization
//   4. Line 1283: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1364: Error message without production error code - breaks React bundle size optimization
//   2. Line 1364: Error message without production error code - breaks React bundle size optimization
//   3. Line 1367: Error message without production error code - breaks React bundle size optimization
//   4. Line 1367: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1448: Error message without production error code - breaks React bundle size optimization
//   2. Line 1448: Error message without production error code - breaks React bundle size optimization
//   3. Line 1451: Error message without production error code - breaks React bundle size optimization
//   4. Line 1451: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1532: Error message without production error code - breaks React bundle size optimization
//   2. Line 1532: Error message without production error code - breaks React bundle size optimization
//   3. Line 1535: Error message without production error code - breaks React bundle size optimization
//   4. Line 1535: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1616: Error message without production error code - breaks React bundle size optimization
//   2. Line 1616: Error message without production error code - breaks React bundle size optimization
//   3. Line 1619: Error message without production error code - breaks React bundle size optimization
//   4. Line 1619: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1700: Error message without production error code - breaks React bundle size optimization
//   2. Line 1700: Error message without production error code - breaks React bundle size optimization
//   3. Line 1703: Error message without production error code - breaks React bundle size optimization
//   4. Line 1703: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1784: Error message without production error code - breaks React bundle size optimization
//   2. Line 1784: Error message without production error code - breaks React bundle size optimization
//   3. Line 1787: Error message without production error code - breaks React bundle size optimization
//   4. Line 1787: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1868: Error message without production error code - breaks React bundle size optimization
//   2. Line 1868: Error message without production error code - breaks React bundle size optimization
//   3. Line 1871: Error message without production error code - breaks React bundle size optimization
//   4. Line 1871: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1952: Error message without production error code - breaks React bundle size optimization
//   2. Line 1952: Error message without production error code - breaks React bundle size optimization
//   3. Line 1955: Error message without production error code - breaks React bundle size optimization
//   4. Line 1955: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2036: Error message without production error code - breaks React bundle size optimization
//   2. Line 2036: Error message without production error code - breaks React bundle size optimization
//   3. Line 2039: Error message without production error code - breaks React bundle size optimization
//   4. Line 2039: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2120: Error message without production error code - breaks React bundle size optimization
//   2. Line 2120: Error message without production error code - breaks React bundle size optimization
//   3. Line 2123: Error message without production error code - breaks React bundle size optimization
//   4. Line 2123: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2204: Error message without production error code - breaks React bundle size optimization
//   2. Line 2204: Error message without production error code - breaks React bundle size optimization
//   3. Line 2207: Error message without production error code - breaks React bundle size optimization
//   4. Line 2207: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2288: Error message without production error code - breaks React bundle size optimization
//   2. Line 2288: Error message without production error code - breaks React bundle size optimization
//   3. Line 2291: Error message without production error code - breaks React bundle size optimization
//   4. Line 2291: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2372: Error message without production error code - breaks React bundle size optimization
//   2. Line 2372: Error message without production error code - breaks React bundle size optimization
//   3. Line 2375: Error message without production error code - breaks React bundle size optimization
//   4. Line 2375: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2456: Error message without production error code - breaks React bundle size optimization
//   2. Line 2456: Error message without production error code - breaks React bundle size optimization
//   3. Line 2459: Error message without production error code - breaks React bundle size optimization
//   4. Line 2459: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2540: Error message without production error code - breaks React bundle size optimization
//   2. Line 2540: Error message without production error code - breaks React bundle size optimization
//   3. Line 2543: Error message without production error code - breaks React bundle size optimization
//   4. Line 2543: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2624: Error message without production error code - breaks React bundle size optimization
//   2. Line 2624: Error message without production error code - breaks React bundle size optimization
//   3. Line 2627: Error message without production error code - breaks React bundle size optimization
//   4. Line 2627: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2708: Error message without production error code - breaks React bundle size optimization
//   2. Line 2708: Error message without production error code - breaks React bundle size optimization
//   3. Line 2711: Error message without production error code - breaks React bundle size optimization
//   4. Line 2711: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2792: Error message without production error code - breaks React bundle size optimization
//   2. Line 2792: Error message without production error code - breaks React bundle size optimization
//   3. Line 2795: Error message without production error code - breaks React bundle size optimization
//   4. Line 2795: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2876: Error message without production error code - breaks React bundle size optimization
//   2. Line 2876: Error message without production error code - breaks React bundle size optimization
//   3. Line 2879: Error message without production error code - breaks React bundle size optimization
//   4. Line 2879: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2960: Error message without production error code - breaks React bundle size optimization
//   2. Line 2960: Error message without production error code - breaks React bundle size optimization
//   3. Line 2963: Error message without production error code - breaks React bundle size optimization
//   4. Line 2963: Error message without production error code - breaks React bundle size optimization
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
function getRealType(type: string) {
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

async function withLease<T>(client: BlockBlobClient, fn: () => Promise<T>) {
	const lease = client.getBlobLeaseClient();

	for (let i = 0; i < 360; i++) { // Try to get lease for 30 minutes
		try {
			await client.uploadData(new ArrayBuffer()); // blob needs to exist for lease to be acquired
			await lease.acquireLease(60);

			try {
				const abortController = new AbortController();
				const refresher = new Promise<void>((c, e) => {
					abortController.signal.onabort = () => {
						clearInterval(interval);
						c();
					};

					const interval = setInterval(() => {
						lease.renewLease().catch(err => {
							clearInterval(interval);
							e(new Error('Failed to renew lease ' + err));
						});
					}, 30_000);
				});

				const result = await Promise.race([fn(), refresher]);
				abortController.abort();
				return result;
			} finally {
				await lease.releaseLease();
			}
		} catch (err) {
			if (err.statusCode !== 409 && err.statusCode !== 412) {
				throw err;
			}

			await new Promise(c => setTimeout(c, 5000));
		}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 840: Error message without production error code - breaks React bundle size optimization
//   2. Line 840: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 1027: Error message without production error code - breaks React bundle size optimization
//   2. Line 1027: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	throw new Error('Failed to acquire lease on blob after 30 minutes');
}

async function processArtifact(
	artifact: Artifact,
	filePath: string
) {
	const log = (...args: any[]) => console.log(`[${artifact.name}]`, ...args);
	const match = /^vscode_(?<product>[^_]+)_(?<os>[^_]+)(?:_legacy)?_(?<arch>[^_]+)_(?<unprocessedType>[^_]+)$/.exec(artifact.name);
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 851: Error message without production error code - breaks React bundle size optimization
//   2. Line 851: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


	if (!match) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 1048: Error message without production error code - breaks React bundle size optimization
//   2. Line 1048: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error(`Invalid artifact name: ${artifact.name}`);
	}

	const { cosmosDBAccessToken, blobServiceAccessToken } = JSON.parse(e('PUBLISH_AUTH_TOKENS'));
	const quality = e('VSCODE_QUALITY');
	const version = e('BUILD_SOURCEVERSION');
	const friendlyFileName = `${quality}/${version}/${path.basename(filePath)}`;

	const blobServiceClient = new BlobServiceClient(`https://${e('VSCODE_STAGING_BLOB_STORAGE_ACCOUNT_NAME')}.blob.core.windows.net/`, { getToken: async () => blobServiceAccessToken });
	const leasesContainerClient = blobServiceClient.getContainerClient('leases');
	await leasesContainerClient.createIfNotExists();
	const leaseBlobClient = leasesContainerClient.getBlockBlobClient(friendlyFileName);

	log(`Acquiring lease for: ${friendlyFileName}`);

	await withLease(leaseBlobClient, async () => {
		log(`Successfully acquired lease for: ${friendlyFileName}`);

		const url = `${e('PRSS_CDN_URL')}/${friendlyFileName}`;
		const res = await retry(() => fetch(url));

		if (res.status === 200) {
			log(`Already released and provisioned: ${url}`);
		} else {
			const stagingContainerClient = blobServiceClient.getContainerClient('staging');
			await stagingContainerClient.createIfNotExists();

			const now = new Date().valueOf();
			const oneHour = 60 * 60 * 1000;
			const oneHourAgo = new Date(now - oneHour);
			const oneHourFromNow = new Date(now + oneHour);
			const userDelegationKey = await blobServiceClient.getUserDelegationKey(oneHourAgo, oneHourFromNow);
			const sasOptions = { containerName: 'staging', permissions: ContainerSASPermissions.from({ read: true }), startsOn: oneHourAgo, expiresOn: oneHourFromNow };
			const stagingSasToken = generateBlobSASQueryParameters(sasOptions, userDelegationKey, e('VSCODE_STAGING_BLOB_STORAGE_ACCOUNT_NAME')).toString();

			const releaseService = await ESRPReleaseService.create(
				log,
				e('RELEASE_TENANT_ID'),
				e('RELEASE_CLIENT_ID'),
				e('RELEASE_AUTH_CERT'),
				e('RELEASE_REQUEST_SIGNING_CERT'),
				stagingContainerClient,
				stagingSasToken
			);

			await releaseService.createRelease(version, filePath, friendlyFileName);
		}

		const { product, os, arch, unprocessedType } = match.groups!;
		const platform = getPlatform(product, os, arch, unprocessedType);
		const type = getRealType(unprocessedType);
// VIOLATION: AWS-FIPS-CRYPTO-001 - Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// SEVERITY: FATAL
// WHY_IT_MATTERS: AWS_FIPS_APPLICATION must use FIPS 140-2 validated cryptographic modules - MD5, SHA1, and non-deterministic algorithm selection prevent FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards certification required for Government_Critical_Infrastructure deployments
// QUICK_FIX: Replace MD5/SHA1 with SHA256 or SHA512, use explicit FIPS-approved algorithms instead of dynamic selection for Government_Critical_Infrastructure compliance
// BUSINESS_IMPACT: Non-FIPS cryptography blocks AWS_FIPS_APPLICATION adoption in $125B+ federal and regulated markets - prevents government contracts and enterprise deployments requiring FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards compliance
// DOCS: https://docs.aws.amazon.com/sdkref/latest/guide/feature-fips.html

		const size = fs.statSync(filePath).size;
		const stream = fs.createReadStream(filePath);
		const [hash, sha256hash] = await Promise.all([hashStream('sha1', stream), hashStream('sha256', stream)]); // CodeQL [SM04514] Using SHA1 only for legacy reasons, we are actually only respecting SHA256
		const asset: Asset = { platform, type, url, hash: hash.toString('hex'), sha256hash: sha256hash.toString('hex'), size, supportsFastUpdate: true };
		log('Creating asset...');

		const result = await retry(async (attempt) => {
			log(`Creating asset in Cosmos DB (attempt ${attempt})...`);
			const client = new CosmosClient({ endpoint: e('AZURE_DOCUMENTDB_ENDPOINT')!, tokenProvider: () => Promise.resolve(`type=aad&ver=1.0&sig=${cosmosDBAccessToken.token}`) });
			const scripts = client.database('builds').container(quality).scripts;
			const { resource: result } = await scripts.storedProcedure('createAsset').execute<'ok' | 'already exists'>('', [version, asset, true]);
			return result;
		});

		if (result === 'already exists') {
			log('Asset already exists!');
		} else {
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
	if (!isMainThread) {
		const { artifact, artifactFilePath } = workerData;
		await processArtifact(artifact, artifactFilePath);
		return;
	}

	const done = new State();
	const processing = new Set<string>();

	for (const name of done) {
		console.log(`\u2705 ${name}`);
	}

	const stages = new Set<string>(['Compile']);

	if (
		e('VSCODE_BUILD_STAGE_LINUX') === 'True' ||
		e('VSCODE_BUILD_STAGE_ALPINE') === 'True' ||
		e('VSCODE_BUILD_STAGE_MACOS') === 'True' ||
		e('VSCODE_BUILD_STAGE_WINDOWS') === 'True'
	) {
		stages.add('CompileCLI');
	}

	if (e('VSCODE_BUILD_STAGE_WINDOWS') === 'True') { stages.add('Windows'); }
	if (e('VSCODE_BUILD_STAGE_LINUX') === 'True') { stages.add('Linux'); }
	if (e('VSCODE_BUILD_STAGE_ALPINE') === 'True') { stages.add('Alpine'); }
	if (e('VSCODE_BUILD_STAGE_MACOS') === 'True') { stages.add('macOS'); }
	if (e('VSCODE_BUILD_STAGE_WEB') === 'True') { stages.add('Web'); }

	let timeline: Timeline;
	let artifacts: Artifact[];
	let resultPromise = Promise.resolve<PromiseSettledResult<void>[]>([]);
	const operations: { name: string; operation: Promise<void> }[] = [];

	while (true) {
		[timeline, artifacts] = await Promise.all([retry(() => getPipelineTimeline()), retry(() => getPipelineArtifacts())]);
		const stagesCompleted = new Set<string>(timeline.records.filter(r => r.type === 'Stage' && r.state === 'completed' && stages.has(r.name)).map(r => r.name));
		const stagesInProgress = [...stages].filter(s => !stagesCompleted.has(s));
		const artifactsInProgress = artifacts.filter(a => processing.has(a.name));

		if (stagesInProgress.length === 0 && artifacts.length === done.size + processing.size) {
			break;
		} else if (stagesInProgress.length > 0) {
			console.log('Stages in progress:', stagesInProgress.join(', '));
		} else if (artifactsInProgress.length > 0) {
			console.log('Artifacts in progress:', artifactsInProgress.map(a => a.name).join(', '));
		} else {
			console.log(`Waiting for a total of ${artifacts.length}, ${done.size} done, ${processing.size} in progress...`);
		}

		for (const artifact of artifacts) {
			if (done.has(artifact.name) || processing.has(artifact.name)) {
				continue;
			}

			console.log(`[${artifact.name}] Found new artifact`);

			const artifactZipPath = path.join(e('AGENT_TEMPDIRECTORY'), `${artifact.name}.zip`);

			await retry(async (attempt) => {
				const start = Date.now();
				console.log(`[${artifact.name}] Downloading (attempt ${attempt})...`);
				await downloadArtifact(artifact, artifactZipPath);
				const archiveSize = fs.statSync(artifactZipPath).size;
				const downloadDurationS = (Date.now() - start) / 1000;
				const downloadSpeedKBS = Math.round((archiveSize / 1024) / downloadDurationS);
				console.log(`[${artifact.name}] Successfully downloaded after ${Math.floor(downloadDurationS)} seconds(${downloadSpeedKBS} KB/s).`);
			});

			const artifactFilePaths = await unzip(artifactZipPath, e('AGENT_TEMPDIRECTORY'));
			const artifactFilePath = artifactFilePaths.filter(p => !/_manifest/.test(p))[0];

			processing.add(artifact.name);
			const promise = new Promise<void>((resolve, reject) => {
				const worker = new Worker(__filename, { workerData: { artifact, artifactFilePath } });
				worker.on('error', reject);
				worker.on('exit', code => {
					if (code === 0) {
						resolve();
					} else {
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
// ISSUES FOUND (2):
//   1. Line 1052: Error message without production error code - breaks React bundle size optimization
//   2. Line 1052: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	// Fail the job if any of the artifacts failed to publish
	if (results.some(r => r.status === 'rejected')) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 1266: Error message without production error code - breaks React bundle size optimization
//   2. Line 1266: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('Some artifacts failed to publish');
	}

	// Also fail the job if any of the stages did not succeed
	let shouldFail = false;

	for (const stage of stages) {
		const record = timeline.records.find(r => r.name === stage && r.type === 'Stage')!;

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1063: Error message without production error code - breaks React bundle size optimization
//   2. Line 1063: Error message without production error code - breaks React bundle size optimization
//   3. Line 1068: Error message without production error code - breaks React bundle size optimization
//   4. Line 1068: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		if (record.result !== 'succeeded' && record.result !== 'succeededWithIssues') {
			shouldFail = true;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1289: Error message without production error code - breaks React bundle size optimization
//   2. Line 1289: Error message without production error code - breaks React bundle size optimization
//   3. Line 1294: Error message without production error code - breaks React bundle size optimization
//   4. Line 1294: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1485: Error message without production error code - breaks React bundle size optimization
//   2. Line 1485: Error message without production error code - breaks React bundle size optimization
//   3. Line 1490: Error message without production error code - breaks React bundle size optimization
//   4. Line 1490: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1581: Error message without production error code - breaks React bundle size optimization
//   2. Line 1581: Error message without production error code - breaks React bundle size optimization
//   3. Line 1586: Error message without production error code - breaks React bundle size optimization
//   4. Line 1586: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1677: Error message without production error code - breaks React bundle size optimization
//   2. Line 1677: Error message without production error code - breaks React bundle size optimization
//   3. Line 1682: Error message without production error code - breaks React bundle size optimization
//   4. Line 1682: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1773: Error message without production error code - breaks React bundle size optimization
//   2. Line 1773: Error message without production error code - breaks React bundle size optimization
//   3. Line 1778: Error message without production error code - breaks React bundle size optimization
//   4. Line 1778: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1869: Error message without production error code - breaks React bundle size optimization
//   2. Line 1869: Error message without production error code - breaks React bundle size optimization
//   3. Line 1874: Error message without production error code - breaks React bundle size optimization
//   4. Line 1874: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1965: Error message without production error code - breaks React bundle size optimization
//   2. Line 1965: Error message without production error code - breaks React bundle size optimization
//   3. Line 1970: Error message without production error code - breaks React bundle size optimization
//   4. Line 1970: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2061: Error message without production error code - breaks React bundle size optimization
//   2. Line 2061: Error message without production error code - breaks React bundle size optimization
//   3. Line 2066: Error message without production error code - breaks React bundle size optimization
//   4. Line 2066: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2157: Error message without production error code - breaks React bundle size optimization
//   2. Line 2157: Error message without production error code - breaks React bundle size optimization
//   3. Line 2162: Error message without production error code - breaks React bundle size optimization
//   4. Line 2162: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2253: Error message without production error code - breaks React bundle size optimization
//   2. Line 2253: Error message without production error code - breaks React bundle size optimization
//   3. Line 2258: Error message without production error code - breaks React bundle size optimization
//   4. Line 2258: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2349: Error message without production error code - breaks React bundle size optimization
//   2. Line 2349: Error message without production error code - breaks React bundle size optimization
//   3. Line 2354: Error message without production error code - breaks React bundle size optimization
//   4. Line 2354: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2445: Error message without production error code - breaks React bundle size optimization
//   2. Line 2445: Error message without production error code - breaks React bundle size optimization
//   3. Line 2450: Error message without production error code - breaks React bundle size optimization
//   4. Line 2450: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2541: Error message without production error code - breaks React bundle size optimization
//   2. Line 2541: Error message without production error code - breaks React bundle size optimization
//   3. Line 2546: Error message without production error code - breaks React bundle size optimization
//   4. Line 2546: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2637: Error message without production error code - breaks React bundle size optimization
//   2. Line 2637: Error message without production error code - breaks React bundle size optimization
//   3. Line 2642: Error message without production error code - breaks React bundle size optimization
//   4. Line 2642: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2733: Error message without production error code - breaks React bundle size optimization
//   2. Line 2733: Error message without production error code - breaks React bundle size optimization
//   3. Line 2738: Error message without production error code - breaks React bundle size optimization
//   4. Line 2738: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2829: Error message without production error code - breaks React bundle size optimization
//   2. Line 2829: Error message without production error code - breaks React bundle size optimization
//   3. Line 2834: Error message without production error code - breaks React bundle size optimization
//   4. Line 2834: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 2925: Error message without production error code - breaks React bundle size optimization
//   2. Line 2925: Error message without production error code - breaks React bundle size optimization
//   3. Line 2930: Error message without production error code - breaks React bundle size optimization
//   4. Line 2930: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 3021: Error message without production error code - breaks React bundle size optimization
//   2. Line 3021: Error message without production error code - breaks React bundle size optimization
//   3. Line 3026: Error message without production error code - breaks React bundle size optimization
//   4. Line 3026: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 3117: Error message without production error code - breaks React bundle size optimization
//   2. Line 3117: Error message without production error code - breaks React bundle size optimization
//   3. Line 3122: Error message without production error code - breaks React bundle size optimization
//   4. Line 3122: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 3213: Error message without production error code - breaks React bundle size optimization
//   2. Line 3213: Error message without production error code - breaks React bundle size optimization
//   3. Line 3218: Error message without production error code - breaks React bundle size optimization
//   4. Line 3218: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 3309: Error message without production error code - breaks React bundle size optimization
//   2. Line 3309: Error message without production error code - breaks React bundle size optimization
//   3. Line 3314: Error message without production error code - breaks React bundle size optimization
//   4. Line 3314: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 3405: Error message without production error code - breaks React bundle size optimization
//   2. Line 3405: Error message without production error code - breaks React bundle size optimization
//   3. Line 3410: Error message without production error code - breaks React bundle size optimization
//   4. Line 3410: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 3501: Error message without production error code - breaks React bundle size optimization
//   2. Line 3501: Error message without production error code - breaks React bundle size optimization
//   3. Line 3506: Error message without production error code - breaks React bundle size optimization
//   4. Line 3506: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 3597: Error message without production error code - breaks React bundle size optimization
//   2. Line 3597: Error message without production error code - breaks React bundle size optimization
//   3. Line 3602: Error message without production error code - breaks React bundle size optimization
//   4. Line 3602: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

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
