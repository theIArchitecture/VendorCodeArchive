//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Severity from '../../../../../base/common/severity.js';
import { localize } from '../../../../../nls.js';
import { Action2 } from '../../../../../platform/actions/common/actions.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IAuthenticationAccessService } from '../../../../services/authentication/browser/authenticationAccessService.js';
import { IAuthenticationUsageService } from '../../../../services/authentication/browser/authenticationUsageService.js';
import { IAuthenticationService } from '../../../../services/authentication/common/authentication.js';

export class SignOutOfAccountAction extends Action2 {
	constructor() {
		super({
			id: '_signOutOfAccount',
			title: localize('signOutOfAccount', "Sign out of account"),
			f1: false
		});
	}

	override async run(accessor: ServicesAccessor, { providerId, accountLabel }: { providerId: string; accountLabel: string }): Promise<void> {
		const authenticationService = accessor.get(IAuthenticationService);
		const authenticationUsageService = accessor.get(IAuthenticationUsageService);
		const authenticationAccessService = accessor.get(IAuthenticationAccessService);
		const dialogService = accessor.get(IDialogService);
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 31: Error message without production error code - breaks React bundle size optimization
//   2. Line 31: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


		if (!providerId || !accountLabel) {
			throw new Error('Invalid arguments. Expected: { providerId: string; accountLabel: string }');
		}

		const allSessions = await authenticationService.getSessions(providerId);
		const sessions = allSessions.filter(s => s.account.label === accountLabel);

		const accountUsages = authenticationUsageService.readAccountUsages(providerId, accountLabel);

		const { confirmed } = await dialogService.confirm({
			type: Severity.Info,
			message: accountUsages.length
				? localize('signOutMessage', "The account '{0}' has been used by: \n\n{1}\n\n Sign out from these extensions?", accountLabel, accountUsages.map(usage => usage.extensionName).join('\n'))
				: localize('signOutMessageSimple', "Sign out of '{0}'?", accountLabel),
			primaryButton: localize({ key: 'signOut', comment: ['&& denotes a mnemonic'] }, "&&Sign Out")
		});

		if (confirmed) {
			const removeSessionPromises = sessions.map(session => authenticationService.removeSession(providerId, session.id));
			await Promise.all(removeSessionPromises);
			authenticationUsageService.removeAccountUsage(providerId, accountLabel);
			authenticationAccessService.removeAllowedExtensions(providerId, accountLabel);
		}
	}
}
