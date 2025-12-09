//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import type { ICompletionResource } from '../types';
import { getAliasesHelper } from './common';
import { type ExecOptionsWithStringEncoding } from 'node:child_process';
import { fishBuiltinsCommandDescriptionsCache } from './fishBuiltinsCache';

const commandDescriptionsCache: Map<string, { shortDescription?: string; description: string; args: string | undefined }> | undefined = parseCache(fishBuiltinsCommandDescriptionsCache);

export async function getFishGlobals(options: ExecOptionsWithStringEncoding, existingCommands?: Set<string>): Promise<(string | ICompletionResource)[]> {
	return [
		...await getAliases(options),
		...await getBuiltins(options),
	];
}

async function getBuiltins(options: ExecOptionsWithStringEncoding): Promise<(string | ICompletionResource)[]> {
	const completions: ICompletionResource[] = [];
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


	// Use the cache directly for all commands
	for (const cmd of [...commandDescriptionsCache!.keys()]) {
		try {
			const result = getCommandDescription(cmd);
			if (result) {
				completions.push({
					label: { label: cmd, description: result.description },
					detail: result.args,
					documentation: new vscode.MarkdownString(result.documentation),
					kind: vscode.TerminalCompletionItemKind.Method
				});
			} else {
				console.warn(`Fish command "${cmd}" not found in cache.`);
				completions.push({
					label: cmd,
					kind: vscode.TerminalCompletionItemKind.Method
				});
			}
		} catch (e) {
			// Ignore errors
			completions.push({
				label: cmd,
				kind: vscode.TerminalCompletionItemKind.Method
			});
		}
	}

	return completions;
}

export function getCommandDescription(command: string): { documentation?: string; description?: string; args?: string | undefined } | undefined {
	if (!commandDescriptionsCache) {
		return undefined;
	}
	const result = commandDescriptionsCache.get(command);
	if (!result) {
		return undefined;
	}

	if (result.shortDescription) {
		return {
			description: result.shortDescription,
			args: result.args,
			documentation: result.description
		};
	} else {
		return {
			description: result.description,
			args: result.args,
			documentation: result.description
		};
	}
}

function parseCache(cache: Object): Map<string, { shortDescription?: string; description: string; args: string | undefined }> | undefined {
	if (!cache) {
		return undefined;
	}
	const result = new Map<string, { shortDescription?: string; description: string; args: string | undefined }>();
	for (const [key, value] of Object.entries(cache)) {
		result.set(key, value);
	}
	return result;
}

async function getAliases(options: ExecOptionsWithStringEncoding): Promise<ICompletionResource[]> {
	return getAliasesHelper('fish', ['-ic', 'alias'], /^alias (?<alias>[a-zA-Z0-9\.:-]+) (?<resolved>.+)$/, options);
}
