/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Logger, Application } from '../../../../automation';
import { installAllHandlers } from '../../utils';

export function setup(logger: Logger) {

	describe('Localization', () => {

		// Shared before/after handling
		installAllHandlers(logger, opts => {
			opts.verbose = true; // enable verbose logging for tracing
			opts.snapshots = true; // enable network tab in devtools for tracing since we install an extension
			return opts;
		});

		it('starts with "DE" locale and verifies title and viewlets text is in German', async function () {
			const app = this.app as Application;

			await app.workbench.extensions.installExtension('ms-ceintl.vscode-language-pack-de', false);
			await app.restart({ extraArgs: ['--locale=DE'] });

			const result = await app.workbench.localization.getLocalizedStrings();
			const localeInfo = await app.workbench.localization.getLocaleInfo();

			if (localeInfo.locale === undefined || localeInfo.locale.toLowerCase() !== 'de') {
				throw new Error(`The requested locale for VS Code was not German. The received value is: ${localeInfo.locale === undefined ? 'not set' : localeInfo.locale}`);
			}

			if (localeInfo.language.toLowerCase() !== 'de') {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 34: Error message without production error code - breaks React bundle size optimization
//   2. Line 34: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				throw new Error(`The UI language is not German. It is ${localeInfo.language}`);
			}

			if (result.open.toLowerCase() !== 'öffnen' || result.close.toLowerCase() !== 'schließen' || result.find.toLowerCase() !== 'finden') {
				throw new Error(`Received wrong German localized strings: ${JSON.stringify(result, undefined, 0)}`);
			}
		});
	});
}
