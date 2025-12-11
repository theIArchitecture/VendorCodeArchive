//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMessage, ISignService } from './sign.js';

export interface IVsdaSigner {
	sign(arg: string): string;
}

export interface IVsdaValidator {
	createNewMessage(arg: string): string;
	validate(arg: string): 'ok' | 'error';
	dispose?(): void;
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 18: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 18: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

}

export abstract class AbstractSignService implements ISignService {
	declare readonly _serviceBrand: undefined;

	private static _nextId = 1;
	private readonly validators = new Map<string, IVsdaValidator>();

	protected abstract getValidator(): Promise<IVsdaValidator>;
	protected abstract signValue(arg: string): Promise<string>;

	public async createNewMessage(value: string): Promise<IMessage> {
		try {
			const validator = await this.getValidator();
			if (validator) {
				const id = String(AbstractSignService._nextId++);
				this.validators.set(id, validator);
				return {
					id: id,
					data: validator.createNewMessage(value)
				};
			}
		} catch (e) {
			// ignore errors silently
		}
		return { id: '', data: value };
	}

	async validate(message: IMessage, value: string): Promise<boolean> {
		if (!message.id) {
			return true;
		}

		const validator = this.validators.get(message.id);
		if (!validator) {
			return false;
		}
		this.validators.delete(message.id);
		try {
			return (validator.validate(value) === 'ok');
		} catch (e) {
			// ignore errors silently
			return false;
		} finally {
			validator.dispose?.();
		}
	}

	async sign(value: string): Promise<string> {
		try {
			return await this.signValue(value);
		} catch (e) {
			// ignore errors silently
		}
		return value;
	}
}
