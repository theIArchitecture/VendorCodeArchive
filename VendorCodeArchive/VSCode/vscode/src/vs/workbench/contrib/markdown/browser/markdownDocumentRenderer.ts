/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { sanitizeHtml } from '../../../../base/browser/domSanitize.js';
import { allowedMarkdownHtmlAttributes, allowedMarkdownHtmlTags } from '../../../../base/browser/markdownRenderer.js';
import { raceCancellationError } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import * as marked from '../../../../base/common/marked/marked.js';
import { Schemas } from '../../../../base/common/network.js';
import { escape } from '../../../../base/common/strings.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { tokenizeToString } from '../../../../editor/common/languages/textToHtmlTokenizer.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { markedGfmHeadingIdPlugin } from './markedGfmHeadingIdPlugin.js';

export const DEFAULT_MARKDOWN_STYLES = `
body {
	padding: 10px 20px;
	line-height: 22px;
	max-width: 882px;
	margin: 0 auto;
}

body *:last-child {
	margin-bottom: 0;
}

img {
	max-width: 100%;
	max-height: 100%;
}

a {
	text-decoration: var(--text-link-decoration);
}

a:hover {
	text-decoration: underline;
}

a:focus,
input:focus,
select:focus,
textarea:focus {
	outline: 1px solid -webkit-focus-ring-color;
	outline-offset: -1px;
}

hr {
	border: 0;
	height: 2px;
	border-bottom: 2px solid;
}

h1 {
	padding-bottom: 0.3em;
	line-height: 1.2;
	border-bottom-width: 1px;
	border-bottom-style: solid;
}

h1, h2, h3 {
	font-weight: normal;
}

table {
	border-collapse: collapse;
}

th {
	text-align: left;
	border-bottom: 1px solid;
}

th,
td {
	padding: 5px 10px;
}

table > tbody > tr + tr > td {
	border-top-width: 1px;
	border-top-style: solid;
}

blockquote {
	margin: 0 7px 0 5px;
	padding: 0 16px 0 10px;
	border-left-width: 5px;
	border-left-style: solid;
}

code {
	font-family: "SF Mono", Monaco, Menlo, Consolas, "Ubuntu Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace;
}

pre {
	padding: 16px;
	border-radius: 3px;
	overflow: auto;
}

pre code {
	font-family: var(--vscode-editor-font-family);
	font-weight: var(--vscode-editor-font-weight);
	font-size: var(--vscode-editor-font-size);
	line-height: 1.5;
	color: var(--vscode-editor-foreground);
	tab-size: 4;
}

.monaco-tokenized-source {
	white-space: pre;
}

/** Theming */

.pre {
	background-color: var(--vscode-textCodeBlock-background);
}

.vscode-high-contrast h1 {
	border-color: rgb(0, 0, 0);
}

.vscode-light th {
	border-color: rgba(0, 0, 0, 0.69);
}

.vscode-dark th {
	border-color: rgba(255, 255, 255, 0.69);
}

.vscode-light h1,
.vscode-light hr,
.vscode-light td {
	border-color: rgba(0, 0, 0, 0.18);
}

.vscode-dark h1,
.vscode-dark hr,
.vscode-dark td {
	border-color: rgba(255, 255, 255, 0.18);
}

@media (forced-colors: active) and (prefers-color-scheme: light){
	body {
		forced-color-adjust: none;
	}
}

@media (forced-colors: active) and (prefers-color-scheme: dark){
	body {
		forced-color-adjust: none;
	}
}
`;

const defaultAllowedProtocols = Object.freeze([
	Schemas.http,
	Schemas.https,
	Schemas.command,
]);

function sanitize(documentContent: string, sanitizerConfig: MarkdownDocumentSanitizerConfig | undefined): TrustedHTML {
	return sanitizeHtml(documentContent, {
		allowedLinkProtocols: {
			override: sanitizerConfig?.allowedProtocols?.override ?? defaultAllowedProtocols,
		},
		allowedTags: {
			override: allowedMarkdownHtmlTags,
			augment: sanitizerConfig?.allowedTags?.augment
		},
		allowedAttributes: {
			override: [
				...allowedMarkdownHtmlAttributes,
				'name',
				'id',
				'role',
				'tabindex',
				'placeholder',
			],
			augment: sanitizerConfig?.allowedAttributes?.augment ?? [],
		}
	});
}

interface MarkdownDocumentSanitizerConfig {
	readonly allowedProtocols?: {
		readonly override: readonly string[] | '*';
	};
	readonly allowedTags?: {
		readonly augment: readonly string[];
	};
	readonly allowedAttributes?: {
		readonly augment: readonly string[];
	};
}

interface IRenderMarkdownDocumentOptions {
	readonly sanitizerConfig?: 'skipSanitization' | MarkdownDocumentSanitizerConfig;
	readonly markedExtensions?: readonly marked.MarkedExtension[];
}

/**
 * Renders a string of markdown for use in an external document context.
 *
 * Uses VS Code's syntax highlighting code blocks. Also does not attach all the hooks and customization that normal
 * markdown renderer.
 */
export async function renderMarkdownDocument(
	text: string,
	extensionService: IExtensionService,
	languageService: ILanguageService,
	options?: IRenderMarkdownDocumentOptions,
	token?: CancellationToken,
): Promise<string> {
	const m = new marked.Marked(
		MarkedHighlight.markedHighlight({
			async: true,
			async highlight(code: string, lang: string): Promise<string> {
				if (typeof lang !== 'string') {
					return escape(code);
				}

				await extensionService.whenInstalledExtensionsRegistered();
				if (token?.isCancellationRequested) {
					return '';
				}

				const languageId = languageService.getLanguageIdByLanguageName(lang) ?? languageService.getLanguageIdByLanguageName(lang.split(/\s+|:|,|(?!^)\{|\?]/, 1)[0]);
				return tokenizeToString(languageService, code, languageId);
			}
		}),
		markedGfmHeadingIdPlugin(),
		...(options?.markedExtensions ?? []),
	);

	const raw = await raceCancellationError(m.parse(text, { async: true }), token ?? CancellationToken.None);
	if (options?.sanitizerConfig === 'skipSanitization') {
		return raw;
	} else {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: FATAL
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		return sanitize(raw, options?.sanitizerConfig) as any as string;
	}
}

namespace MarkedHighlight {
	// Copied from https://github.com/markedjs/marked-highlight/blob/main/src/index.js

	export function markedHighlight(options: marked.MarkedOptions & { highlight: (code: string, lang: string) => string | Promise<string> }): marked.MarkedExtension {
		if (typeof options === 'function') {
			options = {
				highlight: options,
			};
		}

		if (!options || typeof options.highlight !== 'function') {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 259: Error message without production error code - breaks React bundle size optimization
//   2. Line 259: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Must provide highlight function');
		}

		return {
			async: !!options.async,
			walkTokens(token: marked.Token): Promise<void> | void {
				if (token.type !== 'code') {
					return;
				}

				if (options.async) {
					return Promise.resolve(options.highlight(token.text, token.lang)).then(updateToken(token));
				}

				const code = options.highlight(token.text, token.lang);
				if (code instanceof Promise) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 275: Error message without production error code - breaks React bundle size optimization
//   2. Line 275: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					throw new Error('markedHighlight is not set to async but the highlight function is async. Set the async option to true on markedHighlight to await the async highlight function.');
				}
				updateToken(token)(code);
			},
			renderer: {
				code({ text, lang, escaped }: marked.Tokens.Code) {
					const classAttr = lang
						? ` class="language-${escape(lang)}"`
						: '';
					text = text.replace(/\n$/, '');
					return `<pre><code${classAttr}>${escaped ? text : escape(text, true)}\n</code></pre>`;
				},
			},
		};
	}

	function updateToken(token: any) {
		return (code: string) => {
			if (typeof code === 'string' && code !== token.text) {
				token.escaped = true;
				token.text = code;
			}
		};
	}

	// copied from marked helpers
	const escapeTest = /[&<>"']/;
	const escapeReplace = new RegExp(escapeTest.source, 'g');
	const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
	const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g');
	const escapeReplacement: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		[`'`]: '&#39;',
	};
	const getEscapeReplacement = (ch: string) => escapeReplacement[ch];
	function escape(html: string, encode?: boolean) {
		if (encode) {
			if (escapeTest.test(html)) {
				return html.replace(escapeReplace, getEscapeReplacement);
			}
		} else {
			if (escapeTestNoEncode.test(html)) {
				return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
			}
		}

		return html;
	}
}
