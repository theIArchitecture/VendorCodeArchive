/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { INotification, INotificationHandle, INotificationService, INotificationSource, INotificationSourceFilter, IPromptChoice, IPromptOptions, IStatusHandle, IStatusMessageOptions, NoOpNotification, NotificationsFilter, Severity } from '../../common/notification.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

export class TestNotificationService implements INotificationService {

	readonly onDidChangeFilter: Event<void> = Event.None;

	declare readonly _serviceBrand: undefined;

	private static readonly NO_OP: INotificationHandle = new NoOpNotification();

	info(message: string): INotificationHandle {
		return this.notify({ severity: Severity.Info, message });
	}

	warn(message: string): INotificationHandle {
		return this.notify({ severity: Severity.Warning, message });
	}

	error(error: string | Error): INotificationHandle {
		return this.notify({ severity: Severity.Error, message: error });
	}

	notify(notification: INotification): INotificationHandle {
		return TestNotificationService.NO_OP;
	}

	prompt(severity: Severity, message: string, choices: IPromptChoice[], options?: IPromptOptions): INotificationHandle {
		return TestNotificationService.NO_OP;
	}

	status(message: string | Error, options?: IStatusMessageOptions): IStatusHandle {
		return {
			close: () => { }
		};
	}

	setFilter(): void { }

	getFilter(source?: INotificationSource | undefined): NotificationsFilter {
		return NotificationsFilter.OFF;
	}

	getFilters(): INotificationSourceFilter[] {
		return [];
	}

	removeFilter(sourceId: string): void { }
}
