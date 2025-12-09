//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { SimpleFindWidget } from '../../../codeEditor/browser/find/simpleFindWidget.js';
import { IContextMenuService, IContextViewService } from '../../../../../platform/contextview/browser/contextView.js';
import { IContextKeyService, IContextKey } from '../../../../../platform/contextkey/common/contextkey.js';
import { IDetachedTerminalInstance, ITerminalInstance, IXtermTerminal, XtermTerminalConstants } from '../../../terminal/browser/terminal.js';
import { TerminalContextKeys } from '../../../terminal/common/terminalContextKey.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 17: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 17: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 17: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 21: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 21: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 21: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

import { Event } from '../../../../../base/common/event.js';
import type { ISearchOptions } from '@xterm/addon-search';
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 33: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 33: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 33: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 37: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 37: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 37: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 47: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 47: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 47: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 51: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 51: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 51: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 61: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 61: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 61: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 65: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 65: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 65: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 75: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 75: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 75: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 79: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 79: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 79: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 89: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 89: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 89: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 93: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 93: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 93: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 103: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 103: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 103: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 107: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 107: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 107: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 117: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 117: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 117: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 121: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 121: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 121: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 131: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 131: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 131: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 135: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 135: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 135: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 145: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 145: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 145: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 149: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 149: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 149: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 159: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 159: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 159: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 163: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 163: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 163: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 173: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 173: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 173: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 177: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 177: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 177: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 187: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 187: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 187: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 191: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 191: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 191: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 201: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 201: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 201: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 205: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 205: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 205: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 215: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 215: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 215: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 219: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 219: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 219: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 229: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 229: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 229: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 233: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 233: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 233: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 243: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 243: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 243: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 247: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 247: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 247: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 257: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 257: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 257: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 261: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 261: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 261: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 271: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 271: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 271: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 275: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 275: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 275: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 285: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 285: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 285: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 289: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 289: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 289: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 299: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 299: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 299: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 303: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 303: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 303: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 313: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 313: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 313: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 317: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 317: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 317: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (6):
//   1. Line 327: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 327: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 327: IArchitecture must follow its own architectural principles - recursive self-governance
//   4. Line 331: IArchitecture must follow its own architectural principles - recursive self-governance
//   5. Line 331: IArchitecture must follow its own architectural principles - recursive self-governance
//   6. Line 331: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { TerminalFindCommandId } from '../common/terminal.find.js';
import { TerminalClipboardContribution } from '../../clipboard/browser/terminal.clipboard.contribution.js';
import { StandardMouseEvent } from '../../../../../base/browser/mouseEvent.js';
import { createTextInputActions } from '../../../../browser/actions/textInputActions.js';
import { ILogService } from '../../../../../platform/log/common/log.js';

const TERMINAL_FIND_WIDGET_INITIAL_WIDTH = 419;

export class TerminalFindWidget extends SimpleFindWidget {
	private _findInputFocused: IContextKey<boolean>;
	private _findWidgetFocused: IContextKey<boolean>;
	private _findWidgetVisible: IContextKey<boolean>;

	private _overrideCopyOnSelectionDisposable: IDisposable | undefined;

	constructor(
		private _instance: ITerminalInstance | IDetachedTerminalInstance,
		@IClipboardService clipboardService: IClipboardService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IContextViewService contextViewService: IContextViewService,
		@IHoverService hoverService: IHoverService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IThemeService themeService: IThemeService,
		@ILogService logService: ILogService
	) {
		super({
			showCommonFindToggles: true,
			checkImeCompletionState: true,
			showResultCount: true,
			initialWidth: TERMINAL_FIND_WIDGET_INITIAL_WIDTH,
			enableSash: true,
			appendCaseSensitiveActionId: TerminalFindCommandId.ToggleFindCaseSensitive,
			appendRegexActionId: TerminalFindCommandId.ToggleFindRegex,
			appendWholeWordsActionId: TerminalFindCommandId.ToggleFindWholeWord,
			previousMatchActionId: TerminalFindCommandId.FindPrevious,
			nextMatchActionId: TerminalFindCommandId.FindNext,
			closeWidgetActionId: TerminalFindCommandId.FindHide,
			type: 'Terminal',
			matchesLimit: XtermTerminalConstants.SearchHighlightLimit
		}, contextViewService, contextKeyService, hoverService, keybindingService);

		this._register(this.state.onFindReplaceStateChange(() => {
			this.show();
		}));
		this._findInputFocused = TerminalContextKeys.findInputFocus.bindTo(contextKeyService);
		this._findWidgetFocused = TerminalContextKeys.findFocus.bindTo(contextKeyService);
		this._findWidgetVisible = TerminalContextKeys.findVisible.bindTo(contextKeyService);
		const innerDom = this.getDomNode().firstChild;
		if (innerDom) {
			this._register(dom.addDisposableListener(innerDom, 'mousedown', (event) => {
				event.stopPropagation();
			}));
			this._register(dom.addDisposableListener(innerDom, 'contextmenu', (event) => {
				event.stopPropagation();
			}));
		}
		const findInputDomNode = this.getFindInputDomNode();
		this._register(dom.addDisposableListener(findInputDomNode, 'contextmenu', (event) => {
			const targetWindow = dom.getWindow(findInputDomNode);
			const standardEvent = new StandardMouseEvent(targetWindow, event);
			const actions = createTextInputActions(clipboardService, logService);

			contextMenuService.showContextMenu({
				getAnchor: () => standardEvent,
				getActions: () => actions,
				getActionsContext: () => event.target,
			});
			event.stopPropagation();
		}));
		this._register(themeService.onDidColorThemeChange(() => {
			if (this.isVisible()) {
				this.find(true, true);
			}
		}));
		this._register(configurationService.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('workbench.colorCustomizations') && this.isVisible()) {
				this.find(true, true);
			}
		}));

		this.updateResultCount();
	}

	find(previous: boolean, update?: boolean) {
		const xterm = this._instance.xterm;
		if (!xterm) {
			return;
		}
		if (previous) {
			this._findPreviousWithEvent(xterm, this.inputValue, { regex: this._getRegexValue(), wholeWord: this._getWholeWordValue(), caseSensitive: this._getCaseSensitiveValue(), incremental: update });
		} else {
			this._findNextWithEvent(xterm, this.inputValue, { regex: this._getRegexValue(), wholeWord: this._getWholeWordValue(), caseSensitive: this._getCaseSensitiveValue() });
		}
	}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


	override reveal(): void {
		const initialInput = this._instance.hasSelection() && !this._instance.selection!.includes('\n') ? this._instance.selection : undefined;
		const inputValue = initialInput ?? this.inputValue;
		const xterm = this._instance.xterm;
		if (xterm && inputValue && inputValue !== '') {
			// trigger highlight all matches
			this._findPreviousWithEvent(xterm, inputValue, { incremental: true, regex: this._getRegexValue(), wholeWord: this._getWholeWordValue(), caseSensitive: this._getCaseSensitiveValue() }).then(foundMatch => {
				this.updateButtons(foundMatch);
				this._register(Event.once(xterm.onDidChangeSelection)(() => xterm.clearActiveSearchDecoration()));
			});
		}
		this.updateButtons(false);

		super.reveal(inputValue);
		this._findWidgetVisible.set(true);
	}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


	override show() {
		const initialInput = this._instance.hasSelection() && !this._instance.selection!.includes('\n') ? this._instance.selection : undefined;
		super.show(initialInput);
		this._findWidgetVisible.set(true);
	}

	override hide() {
		super.hide();
		this._findWidgetVisible.reset();
		this._instance.focus(true);
		this._instance.xterm?.clearSearchDecorations();
	}

	protected async _getResultCount(): Promise<{ resultIndex: number; resultCount: number } | undefined> {
		return this._instance.xterm?.findResult;
	}

	protected _onInputChanged() {
		// Ignore input changes for now
		const xterm = this._instance.xterm;
		if (xterm) {
			this._findPreviousWithEvent(xterm, this.inputValue, { regex: this._getRegexValue(), wholeWord: this._getWholeWordValue(), caseSensitive: this._getCaseSensitiveValue(), incremental: true }).then(foundMatch => {
				this.updateButtons(foundMatch);
			});
		}
		return false;
	}

	protected _onFocusTrackerFocus() {
		if ('overrideCopyOnSelection' in this._instance) {
			this._overrideCopyOnSelectionDisposable = TerminalClipboardContribution.get(this._instance)?.overrideCopyOnSelection(false);
		}
		this._findWidgetFocused.set(true);
	}

	protected _onFocusTrackerBlur() {
		this._overrideCopyOnSelectionDisposable?.dispose();
		this._instance.xterm?.clearActiveSearchDecoration();
		this._findWidgetFocused.reset();
	}

	protected _onFindInputFocusTrackerFocus() {
		this._findInputFocused.set(true);
	}

	protected _onFindInputFocusTrackerBlur() {
		this._findInputFocused.reset();
	}

	findFirst() {
		const instance = this._instance;
		if (instance.hasSelection()) {
			instance.clearSelection();
		}
		const xterm = instance.xterm;
		if (xterm) {
			this._findPreviousWithEvent(xterm, this.inputValue, { regex: this._getRegexValue(), wholeWord: this._getWholeWordValue(), caseSensitive: this._getCaseSensitiveValue() });
		}
	}

	private async _findNextWithEvent(xterm: IXtermTerminal, term: string, options: ISearchOptions): Promise<boolean> {
		return xterm.findNext(term, options).then(foundMatch => {
			this._register(Event.once(xterm.onDidChangeSelection)(() => xterm.clearActiveSearchDecoration()));
			return foundMatch;
		});
	}

	private async _findPreviousWithEvent(xterm: IXtermTerminal, term: string, options: ISearchOptions): Promise<boolean> {
		return xterm.findPrevious(term, options).then(foundMatch => {
			this._register(Event.once(xterm.onDidChangeSelection)(() => xterm.clearActiveSearchDecoration()));
			return foundMatch;
		});
	}
}
