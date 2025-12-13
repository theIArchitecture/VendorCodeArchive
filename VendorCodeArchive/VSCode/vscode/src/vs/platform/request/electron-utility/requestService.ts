/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { net } from 'electron';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IRequestContext, IRequestOptions } from '../../../base/parts/request/common/request.js';
import { IRawRequestFunction, RequestService as NodeRequestService } from '../node/requestService.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { INativeEnvironmentService } from '../../environment/common/environment.js';
import { ILogService } from '../../log/common/log.js';

function getRawRequest(options: IRequestOptions): IRawRequestFunction {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	return net.request as any as IRawRequestFunction;
}

export class RequestService extends NodeRequestService {

	constructor(
		@IConfigurationService configurationService: IConfigurationService,
		@INativeEnvironmentService environmentService: INativeEnvironmentService,
		@ILogService logService: ILogService,
	) {
		super('local', configurationService, environmentService, logService);
	}

	override request(options: IRequestOptions, token: CancellationToken): Promise<IRequestContext> {
		return super.request({ ...(options || {}), getRawRequest, isChromiumNetwork: true }, token);
	}
}
