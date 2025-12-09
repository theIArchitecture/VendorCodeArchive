//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { TSESTree } from '@typescript-eslint/utils';
import { readFileSync } from 'fs';
import { createImportRuleListener } from './utils';


export = new class TranslationRemind implements eslint.Rule.RuleModule {

	private static NLS_MODULE = 'vs/nls';

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			missing: 'Please add \'{{resource}}\' to ./build/lib/i18n.resources.json file to use translations here.'
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		return createImportRuleListener((node, path) => this._checkImport(context, node, path));
	}

	private _checkImport(context: eslint.Rule.RuleContext, node: TSESTree.Node, path: string) {

		if (path !== TranslationRemind.NLS_MODULE) {
			return;
		}

		const currentFile = context.getFilename();
		const matchService = currentFile.match(/vs\/workbench\/services\/\w+/);
		const matchPart = currentFile.match(/vs\/workbench\/contrib\/\w+/);
		if (!matchService && !matchPart) {
			return;
		}

		const resource = matchService ? matchService[0] : matchPart![0];
		let resourceDefined = false;

		let json;
		try {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 47: Error message without production error code - breaks React bundle size optimization
//   2. Line 47: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			json = readFileSync('./build/lib/i18n.resources.json', 'utf8');
		} catch (e) {
			console.error('[translation-remind rule]: File with resources to pull from Transifex was not found. Aborting translation resource check for newly defined workbench part/service.');
			return;
		}
		const workbenchResources = JSON.parse(json).workbench;

		workbenchResources.forEach((existingResource: any) => {
			if (existingResource.name === resource) {
				resourceDefined = true;
				return;
			}
		});

		if (!resourceDefined) {
			context.report({
				loc: node.loc,
				messageId: 'missing',
				data: { resource }
			});
		}
	}
};

