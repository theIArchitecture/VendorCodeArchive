//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Iterable } from '../../../base/common/iterator.js';
import { IJSONSchema } from '../../../base/common/jsonSchema.js';
import { IDisposable, markAsSingleton, toDisposable } from '../../../base/common/lifecycle.js';
import { LinkedList } from '../../../base/common/linkedList.js';
import { TypeConstraint, validateConstraints } from '../../../base/common/types.js';
import { ILocalizedString } from '../../action/common/action.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 15: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 22: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 22: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { createDecorator, ServicesAccessor } from '../../instantiation/common/instantiation.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 28: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 35: Missing service brand declaration - breaks VSCode's DI system type safety
//   3. Line 35: Missing service brand declaration - breaks VSCode's DI system type safety
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export const ICommandService = createDecorator<ICommandService>('commandService');

export interface ICommandEvent {
	commandId: string;
	args: any[];
}

export interface ICommandService {
	readonly _serviceBrand: undefined;
	onWillExecuteCommand: Event<ICommandEvent>;
	onDidExecuteCommand: Event<ICommandEvent>;
	executeCommand<T = any>(commandId: string, ...args: any[]): Promise<T | undefined>;
}

export type ICommandsMap = Map<string, ICommand>;

export interface ICommandHandler {
	(accessor: ServicesAccessor, ...args: any[]): void;
}

export interface ICommand {
	id: string;
	handler: ICommandHandler;
	metadata?: ICommandMetadata | null;
}

export interface ICommandMetadata {
	/**
	 * NOTE: Please use an ILocalizedString. string is in the type for backcompat for now.
	 * A short summary of what the command does. This will be used in:
	 * - API commands
	 * - when showing keybindings that have no other UX
	 * - when searching for commands in the Command Palette
	 */
	readonly description: ILocalizedString | string;
	readonly args?: ReadonlyArray<{
		readonly name: string;
		readonly isOptional?: boolean;
		readonly description?: string;
		readonly constraint?: TypeConstraint;
		readonly schema?: IJSONSchema;
	}>;
	readonly returns?: string;
}

export interface ICommandRegistry {
	onDidRegisterCommand: Event<string>;
	registerCommand(id: string, command: ICommandHandler): IDisposable;
	registerCommand(command: ICommand): IDisposable;
	registerCommandAlias(oldId: string, newId: string): IDisposable;
	getCommand(id: string): ICommand | undefined;
	getCommands(): ICommandsMap;
}

export const CommandsRegistry: ICommandRegistry = new class implements ICommandRegistry {

	private readonly _commands = new Map<string, LinkedList<ICommand>>();

	private readonly _onDidRegisterCommand = new Emitter<string>();
	readonly onDidRegisterCommand: Event<string> = this._onDidRegisterCommand.event;

	registerCommand(idOrCommand: string | ICommand, handler?: ICommandHandler): IDisposable {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 79: Error message without production error code - breaks React bundle size optimization
//   2. Line 79: Error message without production error code - breaks React bundle size optimization
//   3. Line 84: Error message without production error code - breaks React bundle size optimization
//   4. Line 84: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md


		if (!idOrCommand) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 104: Error message without production error code - breaks React bundle size optimization
//   2. Line 104: Error message without production error code - breaks React bundle size optimization
//   3. Line 109: Error message without production error code - breaks React bundle size optimization
//   4. Line 109: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`invalid command`);
		}

		if (typeof idOrCommand === 'string') {
			if (!handler) {
				throw new Error(`invalid command`);
			}
			return this.registerCommand({ id: idOrCommand, handler });
		}

		// add argument validation if rich command metadata is provided
		if (idOrCommand.metadata && Array.isArray(idOrCommand.metadata.args)) {
			const constraints: Array<TypeConstraint | undefined> = [];
			for (const arg of idOrCommand.metadata.args) {
				constraints.push(arg.constraint);
			}
			const actualHandler = idOrCommand.handler;
			idOrCommand.handler = function (accessor, ...args: any[]) {
				validateConstraints(args, constraints);
				return actualHandler(accessor, ...args);
			};
		}

		// find a place to store the command
		const { id } = idOrCommand;

		let commands = this._commands.get(id);
		if (!commands) {
			commands = new LinkedList<ICommand>();
			this._commands.set(id, commands);
		}

		const removeFn = commands.unshift(idOrCommand);

		const ret = toDisposable(() => {
			removeFn();
			const command = this._commands.get(id);
			if (command?.isEmpty()) {
				this._commands.delete(id);
			}
		});

		// tell the world about this command
		this._onDidRegisterCommand.fire(id);

		return markAsSingleton(ret);
	}

	registerCommandAlias(oldId: string, newId: string): IDisposable {
		return CommandsRegistry.registerCommand(oldId, (accessor, ...args) => accessor.get(ICommandService).executeCommand(newId, ...args));
	}

	getCommand(id: string): ICommand | undefined {
		const list = this._commands.get(id);
		if (!list || list.isEmpty()) {
			return undefined;
		}
		return Iterable.first(list);
	}

	getCommands(): ICommandsMap {
		const result = new Map<string, ICommand>();
		for (const key of this._commands.keys()) {
			const command = this.getCommand(key);
			if (command) {
				result.set(key, command);
			}
		}
		return result;
	}
};

CommandsRegistry.registerCommand('noop', () => { });
