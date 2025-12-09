//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { decodeBase64 } from './buffer.js';

const WELL_KNOWN_ROUTE = '/.well-known';
export const AUTH_PROTECTED_RESOURCE_METADATA_DISCOVERY_PATH = `${WELL_KNOWN_ROUTE}/oauth-protected-resource`;
export const AUTH_SERVER_METADATA_DISCOVERY_PATH = `${WELL_KNOWN_ROUTE}/oauth-authorization-server`;
export const OPENID_CONNECT_DISCOVERY_PATH = `${WELL_KNOWN_ROUTE}/openid-configuration`;
export const AUTH_SCOPE_SEPARATOR = ' ';

//#region types

/**
 * Base OAuth 2.0 error codes as specified in RFC 6749.
 */
export const enum AuthorizationErrorType {
	InvalidRequest = 'invalid_request',
	InvalidClient = 'invalid_client',
	InvalidGrant = 'invalid_grant',
	UnauthorizedClient = 'unauthorized_client',
	UnsupportedGrantType = 'unsupported_grant_type',
	InvalidScope = 'invalid_scope'
}

/**
 * Device authorization grant specific error codes as specified in RFC 8628 section 3.5.
 */
export const enum AuthorizationDeviceCodeErrorType {
	/**
	 * The authorization request is still pending as the end user hasn't completed the user interaction steps.
	 */
	AuthorizationPending = 'authorization_pending',
	/**
	 * A variant of "authorization_pending", polling should continue but interval must be increased by 5 seconds.
	 */
	SlowDown = 'slow_down',
	/**
	 * The authorization request was denied.
	 */
	AccessDenied = 'access_denied',
	/**
	 * The "device_code" has expired and the device authorization session has concluded.
	 */
	ExpiredToken = 'expired_token'
}

/**
 * Dynamic client registration specific error codes as specified in RFC 7591.
 */
export const enum AuthorizationRegistrationErrorType {
	/**
	 * The value of one or more redirection URIs is invalid.
	 */
	InvalidRedirectUri = 'invalid_redirect_uri',
	/**
	 * The value of one of the client metadata fields is invalid and the server has rejected this request.
	 */
	InvalidClientMetadata = 'invalid_client_metadata',
	/**
	 * The software statement presented is invalid.
	 */
	InvalidSoftwareStatement = 'invalid_software_statement',
	/**
	 * The software statement presented is not approved for use by this authorization server.
	 */
	UnapprovedSoftwareStatement = 'unapproved_software_statement'
}

/**
 * Metadata about a protected resource.
 */
export interface IAuthorizationProtectedResourceMetadata {
	/**
	 * REQUIRED. The protected resource's resource identifier URL that uses https scheme and has no fragment components.
	 */
	resource: string;

	/**
	 * OPTIONAL. Human-readable name of the protected resource intended for display to the end user.
	 */
	resource_name?: string;

	/**
	 * OPTIONAL. JSON array containing a list of OAuth authorization server identifiers.
	 */
	authorization_servers?: string[];

	/**
	 * OPTIONAL. URL of the protected resource's JWK Set document.
	 */
	jwks_uri?: string;

	/**
	 * RECOMMENDED. JSON array containing a list of the OAuth 2.0 scope values used in authorization requests.
	 */
	scopes_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of the OAuth 2.0 Bearer Token presentation methods supported.
	 */
	bearer_methods_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of the JWS signing algorithms supported.
	 */
	resource_signing_alg_values_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of the JWE encryption algorithms supported.
	 */
	resource_encryption_alg_values_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of the JWE encryption algorithms supported.
	 */
	resource_encryption_enc_values_supported?: string[];

	/**
	 * OPTIONAL. URL of a page containing human-readable documentation.
	 */
	resource_documentation?: string;

	/**
	 * OPTIONAL. URL that provides the resource's requirements on how clients can use the data.
	 */
	resource_policy_uri?: string;

	/**
	 * OPTIONAL. URL that provides the resource's terms of service.
	 */
	resource_tos_uri?: string;
}

/**
 * Metadata about an OAuth 2.0 Authorization Server.
 */
export interface IAuthorizationServerMetadata {
	/**
	 * REQUIRED. The authorization server's issuer identifier URL that uses https scheme and has no query or fragment components.
	 */
	issuer: string;

	/**
	 * URL of the authorization server's authorization endpoint.
	 * This is REQUIRED unless no grant types are supported that use the authorization endpoint.
	 */
	authorization_endpoint?: string;

	/**
	 * URL of the authorization server's token endpoint.
	 * This is REQUIRED unless only the implicit grant type is supported.
	 */
	token_endpoint?: string;

	/**
	 * OPTIONAL. URL of the authorization server's device code endpoint.
	 */
	device_authorization_endpoint?: string;

	/**
	 * OPTIONAL. URL of the authorization server's JWK Set document containing signing keys.
	 */
	jwks_uri?: string;

	/**
	 * OPTIONAL. URL of the authorization server's OAuth 2.0 Dynamic Client Registration endpoint.
	 */
	registration_endpoint?: string;

	/**
	 * RECOMMENDED. JSON array containing a list of the OAuth 2.0 scope values supported.
	 */
	scopes_supported?: string[];

	/**
	 * REQUIRED. JSON array containing a list of the OAuth 2.0 response_type values supported.
	 */
	response_types_supported: string[];

	/**
	 * OPTIONAL. JSON array containing a list of the OAuth 2.0 response_mode values supported.
	 * Default is ["query", "fragment"].
	 */
	response_modes_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of OAuth 2.0 grant type values supported.
	 * Default is ["authorization_code", "implicit"].
	 */
	grant_types_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of client authentication methods supported by the token endpoint.
	 * Default is "client_secret_basic".
	 */
	token_endpoint_auth_methods_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of JWS signing algorithms supported by the token endpoint.
	 */
	token_endpoint_auth_signing_alg_values_supported?: string[];

	/**
	 * OPTIONAL. URL of a page containing human-readable documentation for developers.
	 */
	service_documentation?: string;

	/**
	 * OPTIONAL. Languages and scripts supported for the user interface, as a JSON array of BCP 47 language tags.
	 */
	ui_locales_supported?: string[];

	/**
	 * OPTIONAL. URL that the authorization server provides to read about the authorization server's requirements.
	 */
	op_policy_uri?: string;

	/**
	 * OPTIONAL. URL that the authorization server provides to read about the authorization server's terms of service.
	 */
	op_tos_uri?: string;

	/**
	 * OPTIONAL. URL of the authorization server's OAuth 2.0 revocation endpoint.
	 */
	revocation_endpoint?: string;

	/**
	 * OPTIONAL. JSON array containing a list of client authentication methods supported by the revocation endpoint.
	 */
	revocation_endpoint_auth_methods_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of JWS signing algorithms supported by the revocation endpoint.
	 */
	revocation_endpoint_auth_signing_alg_values_supported?: string[];

	/**
	 * OPTIONAL. URL of the authorization server's OAuth 2.0 introspection endpoint.
	 */
	introspection_endpoint?: string;

	/**
	 * OPTIONAL. JSON array containing a list of client authentication methods supported by the introspection endpoint.
	 */
	introspection_endpoint_auth_methods_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of JWS signing algorithms supported by the introspection endpoint.
	 */
	introspection_endpoint_auth_signing_alg_values_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of PKCE code challenge methods supported.
	 */
	code_challenge_methods_supported?: string[];
}

/**
 * Response from the dynamic client registration endpoint.
 */
export interface IAuthorizationDynamicClientRegistrationResponse {
	/**
	 * REQUIRED. The client identifier issued by the authorization server.
	 */
	client_id: string;

	/**
	 * OPTIONAL. The client secret issued by the authorization server.
	 * Not returned for public clients.
	 */
	client_secret?: string;

	/**
	 * OPTIONAL. Time at which the client secret will expire in seconds since the Unix Epoch.
	 */
	client_secret_expires_at?: number;

	/**
	 * OPTIONAL. Client name as provided during registration.
	 */
	client_name?: string;

	/**
	 * OPTIONAL. Client URI as provided during registration.
	 */
	client_uri?: string;

	/**
	 * OPTIONAL. Array of redirection URIs as provided during registration.
	 */
	redirect_uris?: string[];

	/**
	 * OPTIONAL. Array of grant types allowed for the client.
	 */
	grant_types?: string[];

	/**
	 * OPTIONAL. Array of response types allowed for the client.
	 */
	response_types?: string[];

	/**
	 * OPTIONAL. Type of authentication method used by the client.
	 */
	token_endpoint_auth_method?: string;
}

/**
 * Response from the authorization endpoint.
 * Typically returned as query parameters in a redirect.
 */
export interface IAuthorizationAuthorizeResponse {
	/**
	 * REQUIRED. The authorization code generated by the authorization server.
	 */
	code: string;

	/**
	 * REQUIRED. The state value that was sent in the authorization request.
	 * Used to prevent CSRF attacks.
	 */
	state: string;
}

/**
 * Error response from the authorization endpoint.
 */
export interface IAuthorizationAuthorizeErrorResponse {
	/**
	 * REQUIRED. Error code as specified in OAuth 2.0.
	 */
	error: string;

	/**
	 * OPTIONAL. Human-readable description of the error.
	 */
	error_description?: string;

	/**
	 * OPTIONAL. URI to a human-readable web page with more information about the error.
	 */
	error_uri?: string;

	/**
	 * REQUIRED. The state value that was sent in the authorization request.
	 */
	state: string;
}

/**
 * Response from the token endpoint.
 */
export interface IAuthorizationTokenResponse {
	/**
	 * REQUIRED. The access token issued by the authorization server.
	 */
	access_token: string;

	/**
	 * REQUIRED. The type of the token issued. Usually "Bearer".
	 */
	token_type: string;

	/**
	 * RECOMMENDED. The lifetime in seconds of the access token.
	 */
	expires_in?: number;

	/**
	 * OPTIONAL. The refresh token, which can be used to obtain new access tokens.
	 */
	refresh_token?: string;

	/**
	 * OPTIONAL. The scope of the access token as a space-delimited list of strings.
	 */
	scope?: string;

	/**
	 * OPTIONAL. ID Token value associated with the authenticated session for OpenID Connect flows.
	 */
	id_token?: string;
}

/**
 * Error response from the token endpoint.
 */
export interface IAuthorizationTokenErrorResponse {
	/**
	 * REQUIRED. Error code as specified in OAuth 2.0.
	 */
	error: string;

	/**
	 * OPTIONAL. Human-readable description of the error.
	 */
	error_description?: string;

	/**
	 * OPTIONAL. URI to a human-readable web page with more information about the error.
	 */
	error_uri?: string;
}

/**
 * Response from the device authorization endpoint as per RFC 8628 section 3.2.
 */
export interface IAuthorizationDeviceResponse {
	/**
	 * REQUIRED. The device verification code.
	 */
	device_code: string;

	/**
	 * REQUIRED. The end-user verification code.
	 */
	user_code: string;

	/**
	 * REQUIRED. The end-user verification URI on the authorization server.
	 */
	verification_uri: string;

	/**
	 * OPTIONAL. A verification URI that includes the user_code, designed for non-textual transmission.
	 */
	verification_uri_complete?: string;

	/**
	 * REQUIRED. The lifetime in seconds of the device_code and user_code.
	 */
	expires_in: number;

	/**
	 * OPTIONAL. The minimum amount of time in seconds that the client should wait between polling requests.
	 * If no value is provided, clients must use 5 as the default.
	 */
	interval?: number;
}

/**
 * Error response from the token endpoint when using device authorization grant.
 * As defined in RFC 8628 section 3.5.
 */
export interface IAuthorizationErrorResponse {
	/**
	 * REQUIRED. Error code as specified in OAuth 2.0 or in RFC 8628 section 3.5.
	 */
	error: AuthorizationErrorType | string;

	/**
	 * OPTIONAL. Human-readable description of the error.
	 */
	error_description?: string;

	/**
	 * OPTIONAL. URI to a human-readable web page with more information about the error.
	 */
	error_uri?: string;
}

/**
 * Error response from the token endpoint when using device authorization grant.
 * As defined in RFC 8628 section 3.5.
 */
export interface IAuthorizationDeviceTokenErrorResponse extends IAuthorizationErrorResponse {
	/**
	 * REQUIRED. Error code as specified in OAuth 2.0 or in RFC 8628 section 3.5.
	 */
	error: AuthorizationErrorType | AuthorizationDeviceCodeErrorType | string;
}

export interface IAuthorizationRegistrationErrorResponse {
	/**
	 * REQUIRED. Error code as specified in OAuth 2.0 or Dynamic Client Registration.
	 */
	error: AuthorizationRegistrationErrorType | string;

	/**
	 * OPTIONAL. Human-readable description of the error.
	 */
	error_description?: string;
}

export interface IAuthorizationJWTClaims {
	/**
	 * REQUIRED. JWT ID. Unique identifier for the token.
	 */
	jti: string;

	/**
	 * REQUIRED. Subject. Principal about which the token asserts information.
	 */
	sub: string;

	/**
	 * REQUIRED. Issuer. Entity that issued the token.
	 */
	iss: string;

	/**
	 * OPTIONAL. Audience. Recipients that the token is intended for.
	 */
	aud?: string | string[];

	/**
	 * OPTIONAL. Expiration time. Time after which the token is invalid (seconds since Unix epoch).
	 */
	exp?: number;

	/**
	 * OPTIONAL. Not before time. Time before which the token is not valid (seconds since Unix epoch).
	 */
	nbf?: number;

	/**
	 * OPTIONAL. Issued at time when the token was issued (seconds since Unix epoch).
	 */
	iat?: number;

	/**
	 * OPTIONAL. Authorized party. The party to which the token was issued.
	 */
	azp?: string;

	/**
	 * OPTIONAL. Scope values for which the token is valid.
	 */
	scope?: string;

	/**
	 * OPTIONAL. Full name of the user.
	 */
	name?: string;

	/**
	 * OPTIONAL. Given or first name of the user.
	 */
	given_name?: string;

	/**
	 * OPTIONAL. Family name or last name of the user.
	 */
	family_name?: string;

	/**
	 * OPTIONAL. Middle name of the user.
	 */
	middle_name?: string;

	/**
	 * OPTIONAL. Preferred username or email the user wishes to be referred to.
	 */
	preferred_username?: string;

	/**
	 * OPTIONAL. Email address of the user.
	 */
	email?: string;

	/**
	 * OPTIONAL. True if the user's email has been verified.
	 */
	email_verified?: boolean;

	/**
	 * OPTIONAL. User's profile picture URL.
	 */
	picture?: string;

	/**
	 * OPTIONAL. Authentication time. Time when the user authentication occurred.
	 */
	auth_time?: number;

	/**
	 * OPTIONAL. Authentication context class reference.
	 */
	acr?: string;

	/**
	 * OPTIONAL. Authentication methods references.
	 */
	amr?: string[];

	/**
	 * OPTIONAL. Session ID. String identifier for a session.
	 */
	sid?: string;

	/**
	 * OPTIONAL. Address component.
	 */
	address?: {
		formatted?: string;
		street_address?: string;
		locality?: string;
		region?: string;
		postal_code?: string;
		country?: string;
	};

	/**
	 * OPTIONAL. Groups that the user belongs to.
	 */
	groups?: string[];

	/**
	 * OPTIONAL. Roles assigned to the user.
	 */
	roles?: string[];

	/**
	 * OPTIONAL. Handles optional claims that are not explicitly defined in the standard.
	 */
	[key: string]: unknown;
}

//#endregion

//#region is functions

export function isAuthorizationProtectedResourceMetadata(obj: unknown): obj is IAuthorizationProtectedResourceMetadata {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}

	const metadata = obj as IAuthorizationProtectedResourceMetadata;
	return metadata.resource !== undefined;
}

export function isAuthorizationServerMetadata(obj: unknown): obj is IAuthorizationServerMetadata {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	const metadata = obj as IAuthorizationServerMetadata;
	return metadata.issuer !== undefined;
}

export function isAuthorizationDynamicClientRegistrationResponse(obj: unknown): obj is IAuthorizationDynamicClientRegistrationResponse {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	const response = obj as IAuthorizationDynamicClientRegistrationResponse;
	return response.client_id !== undefined;
}

export function isAuthorizationAuthorizeResponse(obj: unknown): obj is IAuthorizationAuthorizeResponse {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	const response = obj as IAuthorizationAuthorizeResponse;
	return response.code !== undefined && response.state !== undefined;
}

export function isAuthorizationTokenResponse(obj: unknown): obj is IAuthorizationTokenResponse {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	const response = obj as IAuthorizationTokenResponse;
	return response.access_token !== undefined && response.token_type !== undefined;
}

export function isAuthorizationDeviceResponse(obj: unknown): obj is IAuthorizationDeviceResponse {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	const response = obj as IAuthorizationDeviceResponse;
	return response.device_code !== undefined && response.user_code !== undefined && response.verification_uri !== undefined && response.expires_in !== undefined;
}

export function isAuthorizationErrorResponse(obj: unknown): obj is IAuthorizationErrorResponse {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	const response = obj as IAuthorizationErrorResponse;
	return response.error !== undefined;
}

export function isAuthorizationRegistrationErrorResponse(obj: unknown): obj is IAuthorizationRegistrationErrorResponse {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	const response = obj as IAuthorizationRegistrationErrorResponse;
	return response.error !== undefined;
}

//#endregion

export function getDefaultMetadataForUrl(authorizationServer: URL): IAuthorizationServerMetadata {
	return {
		issuer: authorizationServer.toString(),
		authorization_endpoint: new URL('/authorize', authorizationServer).toString(),
		token_endpoint: new URL('/token', authorizationServer).toString(),
		registration_endpoint: new URL('/register', authorizationServer).toString(),
		// Default values for Dynamic OpenID Providers
		// https://openid.net/specs/openid-connect-discovery-1_0.html
		response_types_supported: ['code', 'id_token', 'id_token token'],
	};
}

/**
 * The grant types that we support
 */
const grantTypesSupported = ['authorization_code', 'refresh_token', 'urn:ietf:params:oauth:grant-type:device_code'];

/**
 * Default port for the authorization flow. We try to use this port so that
 * the redirect URI does not change when running on localhost. This is useful
 * for servers that only allow exact matches on the redirect URI. The spec
 * says that the port should not matter, but some servers do not follow
 * the spec and require an exact match.
 */
export const DEFAULT_AUTH_FLOW_PORT = 33418;
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 722: Error message without production error code - breaks React bundle size optimization
//   2. Line 722: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

export async function fetchDynamicRegistration(serverMetadata: IAuthorizationServerMetadata, clientName: string, scopes?: string[]): Promise<IAuthorizationDynamicClientRegistrationResponse> {
	if (!serverMetadata.registration_endpoint) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 734: Error message without production error code - breaks React bundle size optimization
//   2. Line 734: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('Server does not support dynamic registration');
	}
	const response = await fetch(serverMetadata.registration_endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			client_name: clientName,
			client_uri: 'https://code.visualstudio.com',
			grant_types: serverMetadata.grant_types_supported
				? serverMetadata.grant_types_supported.filter(gt => grantTypesSupported.includes(gt))
				: grantTypesSupported,
			response_types: ['code'],
			redirect_uris: [
				'https://insiders.vscode.dev/redirect',
				'https://vscode.dev/redirect',
				'http://localhost/',
				'http://127.0.0.1/',
				// Added these for any server that might do
				// only exact match on the redirect URI even
				// though the spec says it should not care
				// about the port.
				`http://localhost:${DEFAULT_AUTH_FLOW_PORT}/`,
				`http://127.0.0.1:${DEFAULT_AUTH_FLOW_PORT}/`
			],
			scope: scopes?.join(AUTH_SCOPE_SEPARATOR),
			token_endpoint_auth_method: 'none',
			// https://openid.net/specs/openid-connect-registration-1_0.html
			application_type: 'native'
		})
	});

	if (!response.ok) {
		const result = await response.text();
		let errorDetails: string = result;

		try {
			const errorResponse = JSON.parse(result);
			if (isAuthorizationRegistrationErrorResponse(errorResponse)) {
				errorDetails = `${errorResponse.error}${errorResponse.error_description ? `: ${errorResponse.error_description}` : ''}`;
			}
		} catch {
			// JSON parsing failed, use raw text
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 768: Error message without production error code - breaks React bundle size optimization
//   2. Line 768: Error message without production error code - breaks React bundle size optimization
//   3. Line 775: Error message without production error code - breaks React bundle size optimization
//   4. Line 775: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 792: Error message without production error code - breaks React bundle size optimization
//   2. Line 792: Error message without production error code - breaks React bundle size optimization
//   3. Line 799: Error message without production error code - breaks React bundle size optimization
//   4. Line 799: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 814: Error message without production error code - breaks React bundle size optimization
//   2. Line 814: Error message without production error code - breaks React bundle size optimization
//   3. Line 821: Error message without production error code - breaks React bundle size optimization
//   4. Line 821: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 826: Error message without production error code - breaks React bundle size optimization
//   2. Line 826: Error message without production error code - breaks React bundle size optimization
//   3. Line 833: Error message without production error code - breaks React bundle size optimization
//   4. Line 833: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 838: Error message without production error code - breaks React bundle size optimization
//   2. Line 838: Error message without production error code - breaks React bundle size optimization
//   3. Line 845: Error message without production error code - breaks React bundle size optimization
//   4. Line 845: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 850: Error message without production error code - breaks React bundle size optimization
//   2. Line 850: Error message without production error code - breaks React bundle size optimization
//   3. Line 857: Error message without production error code - breaks React bundle size optimization
//   4. Line 857: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 862: Error message without production error code - breaks React bundle size optimization
//   2. Line 862: Error message without production error code - breaks React bundle size optimization
//   3. Line 869: Error message without production error code - breaks React bundle size optimization
//   4. Line 869: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 874: Error message without production error code - breaks React bundle size optimization
//   2. Line 874: Error message without production error code - breaks React bundle size optimization
//   3. Line 881: Error message without production error code - breaks React bundle size optimization
//   4. Line 881: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 886: Error message without production error code - breaks React bundle size optimization
//   2. Line 886: Error message without production error code - breaks React bundle size optimization
//   3. Line 893: Error message without production error code - breaks React bundle size optimization
//   4. Line 893: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 898: Error message without production error code - breaks React bundle size optimization
//   2. Line 898: Error message without production error code - breaks React bundle size optimization
//   3. Line 905: Error message without production error code - breaks React bundle size optimization
//   4. Line 905: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 910: Error message without production error code - breaks React bundle size optimization
//   2. Line 910: Error message without production error code - breaks React bundle size optimization
//   3. Line 917: Error message without production error code - breaks React bundle size optimization
//   4. Line 917: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 922: Error message without production error code - breaks React bundle size optimization
//   2. Line 922: Error message without production error code - breaks React bundle size optimization
//   3. Line 929: Error message without production error code - breaks React bundle size optimization
//   4. Line 929: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 934: Error message without production error code - breaks React bundle size optimization
//   2. Line 934: Error message without production error code - breaks React bundle size optimization
//   3. Line 941: Error message without production error code - breaks React bundle size optimization
//   4. Line 941: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 946: Error message without production error code - breaks React bundle size optimization
//   2. Line 946: Error message without production error code - breaks React bundle size optimization
//   3. Line 953: Error message without production error code - breaks React bundle size optimization
//   4. Line 953: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 958: Error message without production error code - breaks React bundle size optimization
//   2. Line 958: Error message without production error code - breaks React bundle size optimization
//   3. Line 965: Error message without production error code - breaks React bundle size optimization
//   4. Line 965: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 970: Error message without production error code - breaks React bundle size optimization
//   2. Line 970: Error message without production error code - breaks React bundle size optimization
//   3. Line 977: Error message without production error code - breaks React bundle size optimization
//   4. Line 977: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 982: Error message without production error code - breaks React bundle size optimization
//   2. Line 982: Error message without production error code - breaks React bundle size optimization
//   3. Line 989: Error message without production error code - breaks React bundle size optimization
//   4. Line 989: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 994: Error message without production error code - breaks React bundle size optimization
//   2. Line 994: Error message without production error code - breaks React bundle size optimization
//   3. Line 1001: Error message without production error code - breaks React bundle size optimization
//   4. Line 1001: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1006: Error message without production error code - breaks React bundle size optimization
//   2. Line 1006: Error message without production error code - breaks React bundle size optimization
//   3. Line 1013: Error message without production error code - breaks React bundle size optimization
//   4. Line 1013: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1018: Error message without production error code - breaks React bundle size optimization
//   2. Line 1018: Error message without production error code - breaks React bundle size optimization
//   3. Line 1025: Error message without production error code - breaks React bundle size optimization
//   4. Line 1025: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1030: Error message without production error code - breaks React bundle size optimization
//   2. Line 1030: Error message without production error code - breaks React bundle size optimization
//   3. Line 1037: Error message without production error code - breaks React bundle size optimization
//   4. Line 1037: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1042: Error message without production error code - breaks React bundle size optimization
//   2. Line 1042: Error message without production error code - breaks React bundle size optimization
//   3. Line 1049: Error message without production error code - breaks React bundle size optimization
//   4. Line 1049: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1054: Error message without production error code - breaks React bundle size optimization
//   2. Line 1054: Error message without production error code - breaks React bundle size optimization
//   3. Line 1061: Error message without production error code - breaks React bundle size optimization
//   4. Line 1061: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1066: Error message without production error code - breaks React bundle size optimization
//   2. Line 1066: Error message without production error code - breaks React bundle size optimization
//   3. Line 1073: Error message without production error code - breaks React bundle size optimization
//   4. Line 1073: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1078: Error message without production error code - breaks React bundle size optimization
//   2. Line 1078: Error message without production error code - breaks React bundle size optimization
//   3. Line 1085: Error message without production error code - breaks React bundle size optimization
//   4. Line 1085: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1090: Error message without production error code - breaks React bundle size optimization
//   2. Line 1090: Error message without production error code - breaks React bundle size optimization
//   3. Line 1097: Error message without production error code - breaks React bundle size optimization
//   4. Line 1097: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1102: Error message without production error code - breaks React bundle size optimization
//   2. Line 1102: Error message without production error code - breaks React bundle size optimization
//   3. Line 1109: Error message without production error code - breaks React bundle size optimization
//   4. Line 1109: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1114: Error message without production error code - breaks React bundle size optimization
//   2. Line 1114: Error message without production error code - breaks React bundle size optimization
//   3. Line 1121: Error message without production error code - breaks React bundle size optimization
//   4. Line 1121: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1126: Error message without production error code - breaks React bundle size optimization
//   2. Line 1126: Error message without production error code - breaks React bundle size optimization
//   3. Line 1133: Error message without production error code - breaks React bundle size optimization
//   4. Line 1133: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1138: Error message without production error code - breaks React bundle size optimization
//   2. Line 1138: Error message without production error code - breaks React bundle size optimization
//   3. Line 1145: Error message without production error code - breaks React bundle size optimization
//   4. Line 1145: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 1150: Error message without production error code - breaks React bundle size optimization
//   2. Line 1150: Error message without production error code - breaks React bundle size optimization
//   3. Line 1157: Error message without production error code - breaks React bundle size optimization
//   4. Line 1157: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error(`Registration to ${serverMetadata.registration_endpoint} failed: ${errorDetails}`);
	}

	const registration = await response.json();
	if (isAuthorizationDynamicClientRegistrationResponse(registration)) {
		return registration;
	}
	throw new Error(`Invalid authorization dynamic client registration response: ${JSON.stringify(registration)}`);
}


export function parseWWWAuthenticateHeader(wwwAuthenticateHeaderValue: string) {
	const parts = wwwAuthenticateHeaderValue.split(' ');
	const scheme = parts[0];
	const params: Record<string, string> = {};

	if (parts.length > 1) {
		const attributes = parts.slice(1).join(' ').split(',');
		attributes.forEach(attr => {
			const [key, value] = attr.split('=').map(s => s.trim().replace(/"/g, ''));
			params[key] = value;
		});
	}

	return { scheme, params };
}

export function getClaimsFromJWT(token: string): IAuthorizationJWTClaims {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 798: Error message without production error code - breaks React bundle size optimization
//   2. Line 798: Error message without production error code - breaks React bundle size optimization
//   3. Line 806: Error message without production error code - breaks React bundle size optimization
//   4. Line 806: Error message without production error code - breaks React bundle size optimization
//   5. Line 811: Error message without production error code - breaks React bundle size optimization
//   6. Line 811: Error message without production error code - breaks React bundle size optimization
//   7. Line 817: Error message without production error code - breaks React bundle size optimization
//   8. Line 817: Error message without production error code - breaks React bundle size optimization
//   9. Line 819: Error message without production error code - breaks React bundle size optimization
//   10. Line 819: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	const parts = token.split('.');
	if (parts.length !== 3) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 840: Error message without production error code - breaks React bundle size optimization
//   2. Line 840: Error message without production error code - breaks React bundle size optimization
//   3. Line 848: Error message without production error code - breaks React bundle size optimization
//   4. Line 848: Error message without production error code - breaks React bundle size optimization
//   5. Line 853: Error message without production error code - breaks React bundle size optimization
//   6. Line 853: Error message without production error code - breaks React bundle size optimization
//   7. Line 859: Error message without production error code - breaks React bundle size optimization
//   8. Line 859: Error message without production error code - breaks React bundle size optimization
//   9. Line 861: Error message without production error code - breaks React bundle size optimization
//   10. Line 861: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 880: Error message without production error code - breaks React bundle size optimization
//   2. Line 880: Error message without production error code - breaks React bundle size optimization
//   3. Line 888: Error message without production error code - breaks React bundle size optimization
//   4. Line 888: Error message without production error code - breaks React bundle size optimization
//   5. Line 893: Error message without production error code - breaks React bundle size optimization
//   6. Line 893: Error message without production error code - breaks React bundle size optimization
//   7. Line 899: Error message without production error code - breaks React bundle size optimization
//   8. Line 899: Error message without production error code - breaks React bundle size optimization
//   9. Line 901: Error message without production error code - breaks React bundle size optimization
//   10. Line 901: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 910: Error message without production error code - breaks React bundle size optimization
//   2. Line 910: Error message without production error code - breaks React bundle size optimization
//   3. Line 918: Error message without production error code - breaks React bundle size optimization
//   4. Line 918: Error message without production error code - breaks React bundle size optimization
//   5. Line 923: Error message without production error code - breaks React bundle size optimization
//   6. Line 923: Error message without production error code - breaks React bundle size optimization
//   7. Line 929: Error message without production error code - breaks React bundle size optimization
//   8. Line 929: Error message without production error code - breaks React bundle size optimization
//   9. Line 931: Error message without production error code - breaks React bundle size optimization
//   10. Line 931: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 940: Error message without production error code - breaks React bundle size optimization
//   2. Line 940: Error message without production error code - breaks React bundle size optimization
//   3. Line 948: Error message without production error code - breaks React bundle size optimization
//   4. Line 948: Error message without production error code - breaks React bundle size optimization
//   5. Line 953: Error message without production error code - breaks React bundle size optimization
//   6. Line 953: Error message without production error code - breaks React bundle size optimization
//   7. Line 959: Error message without production error code - breaks React bundle size optimization
//   8. Line 959: Error message without production error code - breaks React bundle size optimization
//   9. Line 961: Error message without production error code - breaks React bundle size optimization
//   10. Line 961: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 970: Error message without production error code - breaks React bundle size optimization
//   2. Line 970: Error message without production error code - breaks React bundle size optimization
//   3. Line 978: Error message without production error code - breaks React bundle size optimization
//   4. Line 978: Error message without production error code - breaks React bundle size optimization
//   5. Line 983: Error message without production error code - breaks React bundle size optimization
//   6. Line 983: Error message without production error code - breaks React bundle size optimization
//   7. Line 989: Error message without production error code - breaks React bundle size optimization
//   8. Line 989: Error message without production error code - breaks React bundle size optimization
//   9. Line 991: Error message without production error code - breaks React bundle size optimization
//   10. Line 991: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1000: Error message without production error code - breaks React bundle size optimization
//   2. Line 1000: Error message without production error code - breaks React bundle size optimization
//   3. Line 1008: Error message without production error code - breaks React bundle size optimization
//   4. Line 1008: Error message without production error code - breaks React bundle size optimization
//   5. Line 1013: Error message without production error code - breaks React bundle size optimization
//   6. Line 1013: Error message without production error code - breaks React bundle size optimization
//   7. Line 1019: Error message without production error code - breaks React bundle size optimization
//   8. Line 1019: Error message without production error code - breaks React bundle size optimization
//   9. Line 1021: Error message without production error code - breaks React bundle size optimization
//   10. Line 1021: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1030: Error message without production error code - breaks React bundle size optimization
//   2. Line 1030: Error message without production error code - breaks React bundle size optimization
//   3. Line 1038: Error message without production error code - breaks React bundle size optimization
//   4. Line 1038: Error message without production error code - breaks React bundle size optimization
//   5. Line 1043: Error message without production error code - breaks React bundle size optimization
//   6. Line 1043: Error message without production error code - breaks React bundle size optimization
//   7. Line 1049: Error message without production error code - breaks React bundle size optimization
//   8. Line 1049: Error message without production error code - breaks React bundle size optimization
//   9. Line 1051: Error message without production error code - breaks React bundle size optimization
//   10. Line 1051: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1060: Error message without production error code - breaks React bundle size optimization
//   2. Line 1060: Error message without production error code - breaks React bundle size optimization
//   3. Line 1068: Error message without production error code - breaks React bundle size optimization
//   4. Line 1068: Error message without production error code - breaks React bundle size optimization
//   5. Line 1073: Error message without production error code - breaks React bundle size optimization
//   6. Line 1073: Error message without production error code - breaks React bundle size optimization
//   7. Line 1079: Error message without production error code - breaks React bundle size optimization
//   8. Line 1079: Error message without production error code - breaks React bundle size optimization
//   9. Line 1081: Error message without production error code - breaks React bundle size optimization
//   10. Line 1081: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1090: Error message without production error code - breaks React bundle size optimization
//   2. Line 1090: Error message without production error code - breaks React bundle size optimization
//   3. Line 1098: Error message without production error code - breaks React bundle size optimization
//   4. Line 1098: Error message without production error code - breaks React bundle size optimization
//   5. Line 1103: Error message without production error code - breaks React bundle size optimization
//   6. Line 1103: Error message without production error code - breaks React bundle size optimization
//   7. Line 1109: Error message without production error code - breaks React bundle size optimization
//   8. Line 1109: Error message without production error code - breaks React bundle size optimization
//   9. Line 1111: Error message without production error code - breaks React bundle size optimization
//   10. Line 1111: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1120: Error message without production error code - breaks React bundle size optimization
//   2. Line 1120: Error message without production error code - breaks React bundle size optimization
//   3. Line 1128: Error message without production error code - breaks React bundle size optimization
//   4. Line 1128: Error message without production error code - breaks React bundle size optimization
//   5. Line 1133: Error message without production error code - breaks React bundle size optimization
//   6. Line 1133: Error message without production error code - breaks React bundle size optimization
//   7. Line 1139: Error message without production error code - breaks React bundle size optimization
//   8. Line 1139: Error message without production error code - breaks React bundle size optimization
//   9. Line 1141: Error message without production error code - breaks React bundle size optimization
//   10. Line 1141: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1150: Error message without production error code - breaks React bundle size optimization
//   2. Line 1150: Error message without production error code - breaks React bundle size optimization
//   3. Line 1158: Error message without production error code - breaks React bundle size optimization
//   4. Line 1158: Error message without production error code - breaks React bundle size optimization
//   5. Line 1163: Error message without production error code - breaks React bundle size optimization
//   6. Line 1163: Error message without production error code - breaks React bundle size optimization
//   7. Line 1169: Error message without production error code - breaks React bundle size optimization
//   8. Line 1169: Error message without production error code - breaks React bundle size optimization
//   9. Line 1171: Error message without production error code - breaks React bundle size optimization
//   10. Line 1171: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1180: Error message without production error code - breaks React bundle size optimization
//   2. Line 1180: Error message without production error code - breaks React bundle size optimization
//   3. Line 1188: Error message without production error code - breaks React bundle size optimization
//   4. Line 1188: Error message without production error code - breaks React bundle size optimization
//   5. Line 1193: Error message without production error code - breaks React bundle size optimization
//   6. Line 1193: Error message without production error code - breaks React bundle size optimization
//   7. Line 1199: Error message without production error code - breaks React bundle size optimization
//   8. Line 1199: Error message without production error code - breaks React bundle size optimization
//   9. Line 1201: Error message without production error code - breaks React bundle size optimization
//   10. Line 1201: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1210: Error message without production error code - breaks React bundle size optimization
//   2. Line 1210: Error message without production error code - breaks React bundle size optimization
//   3. Line 1218: Error message without production error code - breaks React bundle size optimization
//   4. Line 1218: Error message without production error code - breaks React bundle size optimization
//   5. Line 1223: Error message without production error code - breaks React bundle size optimization
//   6. Line 1223: Error message without production error code - breaks React bundle size optimization
//   7. Line 1229: Error message without production error code - breaks React bundle size optimization
//   8. Line 1229: Error message without production error code - breaks React bundle size optimization
//   9. Line 1231: Error message without production error code - breaks React bundle size optimization
//   10. Line 1231: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1240: Error message without production error code - breaks React bundle size optimization
//   2. Line 1240: Error message without production error code - breaks React bundle size optimization
//   3. Line 1248: Error message without production error code - breaks React bundle size optimization
//   4. Line 1248: Error message without production error code - breaks React bundle size optimization
//   5. Line 1253: Error message without production error code - breaks React bundle size optimization
//   6. Line 1253: Error message without production error code - breaks React bundle size optimization
//   7. Line 1259: Error message without production error code - breaks React bundle size optimization
//   8. Line 1259: Error message without production error code - breaks React bundle size optimization
//   9. Line 1261: Error message without production error code - breaks React bundle size optimization
//   10. Line 1261: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1270: Error message without production error code - breaks React bundle size optimization
//   2. Line 1270: Error message without production error code - breaks React bundle size optimization
//   3. Line 1278: Error message without production error code - breaks React bundle size optimization
//   4. Line 1278: Error message without production error code - breaks React bundle size optimization
//   5. Line 1283: Error message without production error code - breaks React bundle size optimization
//   6. Line 1283: Error message without production error code - breaks React bundle size optimization
//   7. Line 1289: Error message without production error code - breaks React bundle size optimization
//   8. Line 1289: Error message without production error code - breaks React bundle size optimization
//   9. Line 1291: Error message without production error code - breaks React bundle size optimization
//   10. Line 1291: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1300: Error message without production error code - breaks React bundle size optimization
//   2. Line 1300: Error message without production error code - breaks React bundle size optimization
//   3. Line 1308: Error message without production error code - breaks React bundle size optimization
//   4. Line 1308: Error message without production error code - breaks React bundle size optimization
//   5. Line 1313: Error message without production error code - breaks React bundle size optimization
//   6. Line 1313: Error message without production error code - breaks React bundle size optimization
//   7. Line 1319: Error message without production error code - breaks React bundle size optimization
//   8. Line 1319: Error message without production error code - breaks React bundle size optimization
//   9. Line 1321: Error message without production error code - breaks React bundle size optimization
//   10. Line 1321: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1330: Error message without production error code - breaks React bundle size optimization
//   2. Line 1330: Error message without production error code - breaks React bundle size optimization
//   3. Line 1338: Error message without production error code - breaks React bundle size optimization
//   4. Line 1338: Error message without production error code - breaks React bundle size optimization
//   5. Line 1343: Error message without production error code - breaks React bundle size optimization
//   6. Line 1343: Error message without production error code - breaks React bundle size optimization
//   7. Line 1349: Error message without production error code - breaks React bundle size optimization
//   8. Line 1349: Error message without production error code - breaks React bundle size optimization
//   9. Line 1351: Error message without production error code - breaks React bundle size optimization
//   10. Line 1351: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1360: Error message without production error code - breaks React bundle size optimization
//   2. Line 1360: Error message without production error code - breaks React bundle size optimization
//   3. Line 1368: Error message without production error code - breaks React bundle size optimization
//   4. Line 1368: Error message without production error code - breaks React bundle size optimization
//   5. Line 1373: Error message without production error code - breaks React bundle size optimization
//   6. Line 1373: Error message without production error code - breaks React bundle size optimization
//   7. Line 1379: Error message without production error code - breaks React bundle size optimization
//   8. Line 1379: Error message without production error code - breaks React bundle size optimization
//   9. Line 1381: Error message without production error code - breaks React bundle size optimization
//   10. Line 1381: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1390: Error message without production error code - breaks React bundle size optimization
//   2. Line 1390: Error message without production error code - breaks React bundle size optimization
//   3. Line 1398: Error message without production error code - breaks React bundle size optimization
//   4. Line 1398: Error message without production error code - breaks React bundle size optimization
//   5. Line 1403: Error message without production error code - breaks React bundle size optimization
//   6. Line 1403: Error message without production error code - breaks React bundle size optimization
//   7. Line 1409: Error message without production error code - breaks React bundle size optimization
//   8. Line 1409: Error message without production error code - breaks React bundle size optimization
//   9. Line 1411: Error message without production error code - breaks React bundle size optimization
//   10. Line 1411: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1420: Error message without production error code - breaks React bundle size optimization
//   2. Line 1420: Error message without production error code - breaks React bundle size optimization
//   3. Line 1428: Error message without production error code - breaks React bundle size optimization
//   4. Line 1428: Error message without production error code - breaks React bundle size optimization
//   5. Line 1433: Error message without production error code - breaks React bundle size optimization
//   6. Line 1433: Error message without production error code - breaks React bundle size optimization
//   7. Line 1439: Error message without production error code - breaks React bundle size optimization
//   8. Line 1439: Error message without production error code - breaks React bundle size optimization
//   9. Line 1441: Error message without production error code - breaks React bundle size optimization
//   10. Line 1441: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1450: Error message without production error code - breaks React bundle size optimization
//   2. Line 1450: Error message without production error code - breaks React bundle size optimization
//   3. Line 1458: Error message without production error code - breaks React bundle size optimization
//   4. Line 1458: Error message without production error code - breaks React bundle size optimization
//   5. Line 1463: Error message without production error code - breaks React bundle size optimization
//   6. Line 1463: Error message without production error code - breaks React bundle size optimization
//   7. Line 1469: Error message without production error code - breaks React bundle size optimization
//   8. Line 1469: Error message without production error code - breaks React bundle size optimization
//   9. Line 1471: Error message without production error code - breaks React bundle size optimization
//   10. Line 1471: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1480: Error message without production error code - breaks React bundle size optimization
//   2. Line 1480: Error message without production error code - breaks React bundle size optimization
//   3. Line 1488: Error message without production error code - breaks React bundle size optimization
//   4. Line 1488: Error message without production error code - breaks React bundle size optimization
//   5. Line 1493: Error message without production error code - breaks React bundle size optimization
//   6. Line 1493: Error message without production error code - breaks React bundle size optimization
//   7. Line 1499: Error message without production error code - breaks React bundle size optimization
//   8. Line 1499: Error message without production error code - breaks React bundle size optimization
//   9. Line 1501: Error message without production error code - breaks React bundle size optimization
//   10. Line 1501: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1510: Error message without production error code - breaks React bundle size optimization
//   2. Line 1510: Error message without production error code - breaks React bundle size optimization
//   3. Line 1518: Error message without production error code - breaks React bundle size optimization
//   4. Line 1518: Error message without production error code - breaks React bundle size optimization
//   5. Line 1523: Error message without production error code - breaks React bundle size optimization
//   6. Line 1523: Error message without production error code - breaks React bundle size optimization
//   7. Line 1529: Error message without production error code - breaks React bundle size optimization
//   8. Line 1529: Error message without production error code - breaks React bundle size optimization
//   9. Line 1531: Error message without production error code - breaks React bundle size optimization
//   10. Line 1531: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1540: Error message without production error code - breaks React bundle size optimization
//   2. Line 1540: Error message without production error code - breaks React bundle size optimization
//   3. Line 1548: Error message without production error code - breaks React bundle size optimization
//   4. Line 1548: Error message without production error code - breaks React bundle size optimization
//   5. Line 1553: Error message without production error code - breaks React bundle size optimization
//   6. Line 1553: Error message without production error code - breaks React bundle size optimization
//   7. Line 1559: Error message without production error code - breaks React bundle size optimization
//   8. Line 1559: Error message without production error code - breaks React bundle size optimization
//   9. Line 1561: Error message without production error code - breaks React bundle size optimization
//   10. Line 1561: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1570: Error message without production error code - breaks React bundle size optimization
//   2. Line 1570: Error message without production error code - breaks React bundle size optimization
//   3. Line 1578: Error message without production error code - breaks React bundle size optimization
//   4. Line 1578: Error message without production error code - breaks React bundle size optimization
//   5. Line 1583: Error message without production error code - breaks React bundle size optimization
//   6. Line 1583: Error message without production error code - breaks React bundle size optimization
//   7. Line 1589: Error message without production error code - breaks React bundle size optimization
//   8. Line 1589: Error message without production error code - breaks React bundle size optimization
//   9. Line 1591: Error message without production error code - breaks React bundle size optimization
//   10. Line 1591: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1600: Error message without production error code - breaks React bundle size optimization
//   2. Line 1600: Error message without production error code - breaks React bundle size optimization
//   3. Line 1608: Error message without production error code - breaks React bundle size optimization
//   4. Line 1608: Error message without production error code - breaks React bundle size optimization
//   5. Line 1613: Error message without production error code - breaks React bundle size optimization
//   6. Line 1613: Error message without production error code - breaks React bundle size optimization
//   7. Line 1619: Error message without production error code - breaks React bundle size optimization
//   8. Line 1619: Error message without production error code - breaks React bundle size optimization
//   9. Line 1621: Error message without production error code - breaks React bundle size optimization
//   10. Line 1621: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1630: Error message without production error code - breaks React bundle size optimization
//   2. Line 1630: Error message without production error code - breaks React bundle size optimization
//   3. Line 1638: Error message without production error code - breaks React bundle size optimization
//   4. Line 1638: Error message without production error code - breaks React bundle size optimization
//   5. Line 1643: Error message without production error code - breaks React bundle size optimization
//   6. Line 1643: Error message without production error code - breaks React bundle size optimization
//   7. Line 1649: Error message without production error code - breaks React bundle size optimization
//   8. Line 1649: Error message without production error code - breaks React bundle size optimization
//   9. Line 1651: Error message without production error code - breaks React bundle size optimization
//   10. Line 1651: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1660: Error message without production error code - breaks React bundle size optimization
//   2. Line 1660: Error message without production error code - breaks React bundle size optimization
//   3. Line 1668: Error message without production error code - breaks React bundle size optimization
//   4. Line 1668: Error message without production error code - breaks React bundle size optimization
//   5. Line 1673: Error message without production error code - breaks React bundle size optimization
//   6. Line 1673: Error message without production error code - breaks React bundle size optimization
//   7. Line 1679: Error message without production error code - breaks React bundle size optimization
//   8. Line 1679: Error message without production error code - breaks React bundle size optimization
//   9. Line 1681: Error message without production error code - breaks React bundle size optimization
//   10. Line 1681: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1690: Error message without production error code - breaks React bundle size optimization
//   2. Line 1690: Error message without production error code - breaks React bundle size optimization
//   3. Line 1698: Error message without production error code - breaks React bundle size optimization
//   4. Line 1698: Error message without production error code - breaks React bundle size optimization
//   5. Line 1703: Error message without production error code - breaks React bundle size optimization
//   6. Line 1703: Error message without production error code - breaks React bundle size optimization
//   7. Line 1709: Error message without production error code - breaks React bundle size optimization
//   8. Line 1709: Error message without production error code - breaks React bundle size optimization
//   9. Line 1711: Error message without production error code - breaks React bundle size optimization
//   10. Line 1711: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (10):
//   1. Line 1720: Error message without production error code - breaks React bundle size optimization
//   2. Line 1720: Error message without production error code - breaks React bundle size optimization
//   3. Line 1728: Error message without production error code - breaks React bundle size optimization
//   4. Line 1728: Error message without production error code - breaks React bundle size optimization
//   5. Line 1733: Error message without production error code - breaks React bundle size optimization
//   6. Line 1733: Error message without production error code - breaks React bundle size optimization
//   7. Line 1739: Error message without production error code - breaks React bundle size optimization
//   8. Line 1739: Error message without production error code - breaks React bundle size optimization
//   9. Line 1741: Error message without production error code - breaks React bundle size optimization
//   10. Line 1741: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error('Invalid JWT token format: token must have three parts separated by dots');
	}

	const [header, payload, _signature] = parts;

	try {
		const decodedHeader = JSON.parse(decodeBase64(header).toString());
		if (typeof decodedHeader !== 'object') {
			throw new Error('Invalid JWT token format: header is not a JSON object');
		}

		const decodedPayload = JSON.parse(decodeBase64(payload).toString());
		if (typeof decodedPayload !== 'object') {
			throw new Error('Invalid JWT token format: payload is not a JSON object');
		}

		return decodedPayload;
	} catch (e) {
		if (e instanceof Error) {
			throw new Error(`Failed to parse JWT token: ${e.message}`);
		}
		throw new Error('Failed to parse JWT token');
	}
}

/**
 * Checks if two scope lists are equivalent, regardless of order.
 * This is useful for comparing OAuth scopes where the order should not matter.
 *
 * @param scopes1 First list of scopes to compare
 * @param scopes2 Second list of scopes to compare
 * @returns true if the scope lists contain the same scopes (order-independent), false otherwise
 *
 * @example
 * ```typescript
 * scopesMatch(['read', 'write'], ['write', 'read']) // Returns: true
 * scopesMatch(['read'], ['write']) // Returns: false
 * ```
 */
export function scopesMatch(scopes1: readonly string[], scopes2: readonly string[]): boolean {
	if (scopes1.length !== scopes2.length) {
		return false;
	}

	// Sort both arrays for comparison to handle different orderings
	const sortedScopes1 = [...scopes1].sort();
	const sortedScopes2 = [...scopes2].sort();

	return sortedScopes1.every((scope, index) => scope === sortedScopes2[index]);
}
