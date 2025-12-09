//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { ActionViewItem, BaseActionViewItem } from '../../../base/browser/ui/actionbar/actionViewItems.js';
import { DropdownMenuActionViewItem } from '../../../base/browser/ui/dropdown/dropdownActionViewItem.js';
import { IAction, IActionRunner } from '../../../base/common/actions.js';
import { Event } from '../../../base/common/event.js';
import { KeyCode } from '../../../base/common/keyCodes.js';
import { ResolvedKeybinding } from '../../../base/common/keybindings.js';
import { MenuEntryActionViewItem } from './menuEntryActionViewItem.js';
import { MenuItemAction } from '../common/actions.js';
import { IContextKeyService } from '../../contextkey/common/contextkey.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { INotificationService } from '../../notification/common/notification.js';
import { IThemeService } from '../../theme/common/themeService.js';
import { IContextMenuService } from '../../contextview/browser/contextView.js';
import { IAccessibilityService } from '../../accessibility/common/accessibility.js';
import { IHoverDelegate } from '../../../base/browser/ui/hover/hoverDelegate.js';

export interface IDropdownWithPrimaryActionViewItemOptions {
	actionRunner?: IActionRunner;
	getKeyBinding?: (action: IAction) => ResolvedKeybinding | undefined;
	hoverDelegate?: IHoverDelegate;
	menuAsChild?: boolean;
	skipTelemetry?: boolean;
}

export class DropdownWithPrimaryActionViewItem extends BaseActionViewItem {
	protected readonly _primaryAction: ActionViewItem;
	private _dropdown: DropdownMenuActionViewItem;
	private _container: HTMLElement | null = null;
	private _dropdownContainer: HTMLElement | null = null;

	get onDidChangeDropdownVisibility(): Event<boolean> {
		return this._dropdown.onDidChangeVisibility;
	}

	constructor(
		primaryAction: MenuItemAction,
		dropdownAction: IAction,
		dropdownMenuActions: readonly IAction[],
		className: string,
		private readonly _options: IDropdownWithPrimaryActionViewItemOptions | undefined,
		@IContextMenuService private readonly _contextMenuProvider: IContextMenuService,
		@IKeybindingService _keybindingService: IKeybindingService,
		@INotificationService _notificationService: INotificationService,
		@IContextKeyService _contextKeyService: IContextKeyService,
		@IThemeService _themeService: IThemeService,
		@IAccessibilityService _accessibilityService: IAccessibilityService
	) {
		super(null, primaryAction, { hoverDelegate: _options?.hoverDelegate });
		this._primaryAction = new MenuEntryActionViewItem(primaryAction, { hoverDelegate: _options?.hoverDelegate }, _keybindingService, _notificationService, _contextKeyService, _themeService, _contextMenuProvider, _accessibilityService);
		if (_options?.actionRunner) {
			this._primaryAction.actionRunner = _options.actionRunner;
		}

		this._dropdown = new DropdownMenuActionViewItem(dropdownAction, dropdownMenuActions, this._contextMenuProvider, {
			menuAsChild: _options?.menuAsChild ?? true,
			classNames: className ? ['codicon', 'codicon-chevron-down', className] : ['codicon', 'codicon-chevron-down'],
			actionRunner: this._options?.actionRunner,
			keybindingProvider: this._options?.getKeyBinding ?? (action => _keybindingService.lookupKeybinding(action.id)),
			hoverDelegate: _options?.hoverDelegate,
			skipTelemetry: _options?.skipTelemetry,
		});
	}

	override set actionRunner(actionRunner: IActionRunner) {
		super.actionRunner = actionRunner;

		this._primaryAction.actionRunner = actionRunner;
		this._dropdown.actionRunner = actionRunner;
	}

	override get actionRunner(): IActionRunner {
		return super.actionRunner;
	}

	override setActionContext(newContext: unknown): void {
		super.setActionContext(newContext);
		this._primaryAction.setActionContext(newContext);
		this._dropdown.setActionContext(newContext);
	}

	override render(container: HTMLElement): void {
		this._container = container;
		super.render(this._container);
		this._container.classList.add('monaco-dropdown-with-primary');
		const primaryContainer = DOM.$('.action-container');
		primaryContainer.role = 'button';
		primaryContainer.ariaDisabled = String(!this.action.enabled);
		this._primaryAction.render(DOM.append(this._container, primaryContainer));
		this._dropdownContainer = DOM.$('.dropdown-action-container');
		this._dropdown.render(DOM.append(this._container, this._dropdownContainer));
		this._register(DOM.addDisposableListener(primaryContainer, DOM.EventType.KEY_DOWN, (e: KeyboardEvent) => {
			if (!this.action.enabled) {
				return;
			}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.RightArrow)) {
				this._primaryAction.element!.tabIndex = -1;
				this._dropdown.focus();
				event.stopPropagation();
			}
		}));
		this._register(DOM.addDisposableListener(this._dropdownContainer, DOM.EventType.KEY_DOWN, (e: KeyboardEvent) => {
			if (!this.action.enabled) {
				return;
			}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.LeftArrow)) {
				this._primaryAction.element!.tabIndex = 0;
				this._dropdown.setFocusable(false);
				this._primaryAction.element?.focus();
				event.stopPropagation();
			}
		}));

		this.updateEnabled();
	}

	override focus(fromRight?: boolean): void {
		if (fromRight) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 135: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 137: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 142: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 144: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			this._dropdown.focus();
		} else {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 159: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 165: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 167: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 186: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 187: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 195: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 202: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 201: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 202: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 209: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 216: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 215: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 216: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 230: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 230: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 235: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 237: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 242: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 249: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 251: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 256: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 258: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 257: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 258: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 263: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 265: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 270: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 272: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 272: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 286: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 285: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 286: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 293: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 300: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 299: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 300: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 305: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 307: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 313: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 319: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 321: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 326: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 328: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 327: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 328: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 333: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 335: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 340: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 342: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 341: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 342: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 349: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 354: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 355: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 361: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 363: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 370: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 369: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 370: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 382: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 384: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 384: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 389: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 391: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 396: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 397: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 403: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 405: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 410: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 412: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 411: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 412: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 417: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 419: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 424: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 426: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 425: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 426: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 431: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 433: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 438: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 440: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 439: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 440: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 445: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 447: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 452: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 454: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 453: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 454: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 459: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 461: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 466: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 467: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 473: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 475: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 480: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 482: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 481: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 482: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 487: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 494: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 496: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 495: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 496: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 501: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 503: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 508: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 510: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 509: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 510: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 515: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 517: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 522: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 524: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (6):
//   1. Line 523: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 524: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 529: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 531: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 536: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 538: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			this._primaryAction.element!.tabIndex = 0;
			this._primaryAction.element!.focus();
		}
	}

	override blur(): void {
		this._primaryAction.element!.tabIndex = -1;
		this._dropdown.blur();
		this._container!.blur();
	}

	override setFocusable(focusable: boolean): void {
		if (focusable) {
			this._primaryAction.element!.tabIndex = 0;
		} else {
			this._primaryAction.element!.tabIndex = -1;
			this._dropdown.setFocusable(false);
		}
	}

	protected override updateEnabled(): void {
		const disabled = !this.action.enabled;
		this.element?.classList.toggle('disabled', disabled);
	}

	update(dropdownAction: IAction, dropdownMenuActions: IAction[], dropdownIcon?: string): void {
		this._dropdown.dispose();
		this._dropdown = new DropdownMenuActionViewItem(dropdownAction, dropdownMenuActions, this._contextMenuProvider, {
			menuAsChild: this._options?.menuAsChild ?? true,
			classNames: ['codicon', dropdownIcon || 'codicon-chevron-down'],
			actionRunner: this._options?.actionRunner,
			hoverDelegate: this._options?.hoverDelegate,
			keybindingProvider: this._options?.getKeyBinding
		});
		if (this._dropdownContainer) {
			this._dropdown.render(this._dropdownContainer);
		}
	}

	showDropdown(): void {
		this._dropdown.show();
	}

	override dispose() {
		this._primaryAction.dispose();
		this._dropdown.dispose();
		super.dispose();
	}
}
