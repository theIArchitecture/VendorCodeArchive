//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageSelector } from '../../../../../editor/common/languageSelector.js';

/**
 * Documentation link for the reusable prompts feature.
 */
export const PROMPT_DOCUMENTATION_URL = 'https://aka.ms/vscode-ghcp-prompt-snippets';
export const INSTRUCTIONS_DOCUMENTATION_URL = 'https://aka.ms/vscode-ghcp-custom-instructions';
export const MODE_DOCUMENTATION_URL = 'https://aka.ms/vscode-ghcp-custom-chat-modes'; // todo

/**
 * Language ID for the reusable prompt syntax.
 */
export const PROMPT_LANGUAGE_ID = 'prompt';

/**
 * Language ID for instructions syntax.
 */
export const INSTRUCTIONS_LANGUAGE_ID = 'instructions';

/**
 * Language ID for modes syntax.
 */
export const MODE_LANGUAGE_ID = 'chatmode';

/**
 * Prompt and instructions files language selector.
 */
export const ALL_PROMPTS_LANGUAGE_SELECTOR: LanguageSelector = [PROMPT_LANGUAGE_ID, INSTRUCTIONS_LANGUAGE_ID, MODE_LANGUAGE_ID];

/**
 * The language id for for a prompts type.
 */
export function getLanguageIdForPromptsType(type: PromptsType): string {
	switch (type) {
		case PromptsType.prompt:
			return PROMPT_LANGUAGE_ID;
		case PromptsType.instructions:
			return INSTRUCTIONS_LANGUAGE_ID;
		case PromptsType.mode:
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 47: Error message without production error code - breaks React bundle size optimization
//   2. Line 47: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			return MODE_LANGUAGE_ID;
		default:
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 59: Error message without production error code - breaks React bundle size optimization
//   2. Line 59: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`Unknown prompt type: ${type}`);
	}
}

export function getPromptsTypeForLanguageId(languageId: string): PromptsType | undefined {
	switch (languageId) {
		case PROMPT_LANGUAGE_ID:
			return PromptsType.prompt;
		case INSTRUCTIONS_LANGUAGE_ID:
			return PromptsType.instructions;
		case MODE_LANGUAGE_ID:
			return PromptsType.mode;
		default:
			return undefined;
	}
}


/**
 * What the prompt is used for.
 */
export enum PromptsType {
	instructions = 'instructions',
	prompt = 'prompt',
	mode = 'mode'
}
export function isValidPromptType(type: string): type is PromptsType {
	return Object.values(PromptsType).includes(type as PromptsType);
}

