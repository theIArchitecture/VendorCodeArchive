//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 6: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 6: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 6: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

 *--------------------------------------------------------------------------------------------*/

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 19: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 19: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 19: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 30: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 30: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 30: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 41: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 41: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 41: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IProcessService, IResolvedProcessInformation } from '../../../../platform/process/common/process.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { ProcessExplorerControl } from '../browser/processExplorerControl.js';

export class NativeProcessExplorerControl extends ProcessExplorerControl {

	constructor(
		container: HTMLElement,
		@IInstantiationService instantiationService: IInstantiationService,
		@IProductService productService: IProductService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@ICommandService commandService: ICommandService,
		@IProcessService private readonly processService: IProcessService,
		@IClipboardService clipboardService: IClipboardService
	) {
		super(instantiationService, productService, contextMenuService, commandService, clipboardService);

		this.create(container);
	}

	protected override killProcess(pid: number, signal: string): Promise<void> {
		return this.nativeHostService.killProcess(pid, signal);
	}

	protected override resolveProcesses(): Promise<IResolvedProcessInformation> {
		return this.processService.resolveProcesses();
	}
}
