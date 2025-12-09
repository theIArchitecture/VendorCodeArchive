//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { URI, UriComponents } from '../../../../../../base/common/uri.js';
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 10: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 10: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 10: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

import { localize } from '../../../../../../nls.js';
import { Action2, registerAction2 } from '../../../../../../platform/actions/common/actions.js';
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 23: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 23: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 23: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 34: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 34: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 34: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 45: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 45: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 45: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 56: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 56: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 56: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 67: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 67: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 67: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 78: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 78: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 78: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 89: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 89: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 89: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 100: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 100: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 100: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 111: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 111: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 111: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 122: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 122: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 122: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 133: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 133: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 133: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 144: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 144: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 144: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 155: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 155: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 155: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 166: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 166: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 166: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 177: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 177: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 177: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 188: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 188: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 188: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 199: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 199: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 199: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 210: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 210: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 210: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 221: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 221: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 221: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 232: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 232: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 232: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 243: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 243: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 243: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 254: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 254: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 254: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 265: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 265: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 265: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 276: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 276: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 276: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 287: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 287: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 287: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

import { IClipboardService } from '../../../../../../platform/clipboard/common/clipboardService.js';
import { ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { contextMenuArg } from './notebookVariablesView.js';
import { INotebookKernelService, VariablesResult } from '../../../common/notebookKernelService.js';
import { INotebookService } from '../../../common/notebookService.js';

export const COPY_NOTEBOOK_VARIABLE_VALUE_ID = 'workbench.debug.viewlet.action.copyWorkspaceVariableValue';
export const COPY_NOTEBOOK_VARIABLE_VALUE_LABEL = localize('copyWorkspaceVariableValue', "Copy Value");
registerAction2(class extends Action2 {
	constructor() {
		super({
			id: COPY_NOTEBOOK_VARIABLE_VALUE_ID,
			title: COPY_NOTEBOOK_VARIABLE_VALUE_LABEL,
			f1: false,
		});
	}

	run(accessor: ServicesAccessor, context: contextMenuArg): void {
		const clipboardService = accessor.get(IClipboardService);

		if (context.value) {
			clipboardService.writeText(context.value);
		}
	}
});


registerAction2(class extends Action2 {
	constructor() {
		super({
			id: '_executeNotebookVariableProvider',
			title: localize('executeNotebookVariableProvider', "Execute Notebook Variable Provider"),
			f1: false,
		});
	}

	async run(accessor: ServicesAccessor, resource: UriComponents | undefined): Promise<VariablesResult[]> {
		if (!resource) {
			return [];
		}

		const uri = URI.revive(resource);
		const notebookKernelService = accessor.get(INotebookKernelService);
		const notebookService = accessor.get(INotebookService);
		const notebookTextModel = notebookService.getNotebookTextModel(uri);

		if (!notebookTextModel) {
			return [];
		}

		const selectedKernel = notebookKernelService.getMatchingKernel(notebookTextModel).selected;
		if (selectedKernel && selectedKernel.hasVariableProvider) {
			const variables = selectedKernel.provideVariables(notebookTextModel.uri, undefined, 'named', 0, CancellationToken.None);
			return await variables
				.map(variable => { return variable; })
				.toPromise();
		}

		return [];
	}
});
