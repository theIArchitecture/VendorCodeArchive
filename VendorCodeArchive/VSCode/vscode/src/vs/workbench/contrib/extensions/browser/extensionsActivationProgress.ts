/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { localize } from '../../../../nls.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { DeferredPromise, timeout } from '../../../../base/common/async.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';

export class ExtensionActivationProgress implements IWorkbenchContribution {

	private readonly _listener: IDisposable;

	constructor(
		@IExtensionService extensionService: IExtensionService,
		@IProgressService progressService: IProgressService,
		@ILogService logService: ILogService,
	) {

		const options = {
			location: ProgressLocation.Window,
			title: localize('activation', "Activating Extensions...")
		};

		let deferred: DeferredPromise<any> | undefined;
		let count = 0;

		this._listener = extensionService.onWillActivateByEvent(e => {
			logService.trace('onWillActivateByEvent: ', e.event);

			if (!deferred) {
				deferred = new DeferredPromise();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 38: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 45: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

				progressService.withProgress(options, _ => deferred!.p);
			}

			count++;

			Promise.race([e.activation, timeout(5000, CancellationToken.None)]).finally(() => {
				if (--count === 0) {
					deferred!.complete(undefined);
					deferred = undefined;
				}
			});
		});
	}

	dispose(): void {
		this._listener.dispose();
	}
}
