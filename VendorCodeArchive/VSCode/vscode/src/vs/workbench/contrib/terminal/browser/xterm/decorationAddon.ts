//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IDecoration, ITerminalAddon, Terminal } from '@xterm/xterm';
import * as dom from '../../../../../base/browser/dom.js';
import { IAction, Separator } from '../../../../../base/common/actions.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Disposable, DisposableMap, DisposableStore, IDisposable, dispose, toDisposable } from '../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 14: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 14: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 14: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

import { localize } from '../../../../../nls.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 27: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 27: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 27: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 38: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 38: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 38: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 49: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 49: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 49: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 60: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 60: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 60: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 71: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 71: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 71: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 82: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 82: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 82: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 93: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 93: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 93: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 104: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 104: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 104: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 115: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 115: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 115: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 126: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 126: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 126: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 137: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 137: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 137: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 148: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 148: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 148: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 159: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 159: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 159: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 170: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 170: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 170: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 181: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 181: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 181: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 192: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 192: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 192: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 203: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 203: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 203: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 214: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 214: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 214: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { INotificationService, Severity } from '../../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IQuickInputService, IQuickPickItem } from '../../../../../platform/quickinput/common/quickInput.js';
import { CommandInvalidationReason, ICommandDetectionCapability, IMarkProperties, ITerminalCapabilityStore, ITerminalCommand, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { TerminalSettingId, type IDecorationAddon } from '../../../../../platform/terminal/common/terminal.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { terminalDecorationError, terminalDecorationIncomplete, terminalDecorationMark, terminalDecorationSuccess } from '../terminalIcons.js';
import { DecorationSelector, getTerminalDecorationHoverContent, updateLayout } from './decorationStyles.js';
import { TERMINAL_COMMAND_DECORATION_DEFAULT_BACKGROUND_COLOR, TERMINAL_COMMAND_DECORATION_ERROR_BACKGROUND_COLOR, TERMINAL_COMMAND_DECORATION_SUCCESS_BACKGROUND_COLOR } from '../../common/terminalColorRegistry.js';
import { ILifecycleService } from '../../../../services/lifecycle/common/lifecycle.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';

interface IDisposableDecoration { decoration: IDecoration; disposables: IDisposable[]; exitCode?: number; markProperties?: IMarkProperties }

export class DecorationAddon extends Disposable implements ITerminalAddon, IDecorationAddon {
	protected _terminal: Terminal | undefined;
	private _capabilityDisposables: DisposableMap<TerminalCapability> = this._register(new DisposableMap());
	private _decorations: Map<number, IDisposableDecoration> = new Map();
	private _placeholderDecoration: IDecoration | undefined;
	private _showGutterDecorations?: boolean;
	private _showOverviewRulerDecorations?: boolean;
	private readonly _registeredMenuItems: Map<ITerminalCommand, IAction[]> = new Map();

	private readonly _onDidRequestRunCommand = this._register(new Emitter<{ command: ITerminalCommand; noNewLine?: boolean }>());
	readonly onDidRequestRunCommand = this._onDidRequestRunCommand.event;
	private readonly _onDidRequestCopyAsHtml = this._register(new Emitter<{ command: ITerminalCommand }>());
	readonly onDidRequestCopyAsHtml = this._onDidRequestCopyAsHtml.event;

	constructor(
		private readonly _capabilities: ITerminalCapabilityStore,
		@IClipboardService private readonly _clipboardService: IClipboardService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IThemeService private readonly _themeService: IThemeService,
		@IOpenerService private readonly _openerService: IOpenerService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@ICommandService private readonly _commandService: ICommandService,
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IHoverService private readonly _hoverService: IHoverService
	) {
		super();
		this._register(toDisposable(() => this._dispose()));
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalSettingId.FontSize) || e.affectsConfiguration(TerminalSettingId.LineHeight)) {
				this.refreshLayouts();
			} else if (e.affectsConfiguration('workbench.colorCustomizations')) {
				this._refreshStyles(true);
			} else if (e.affectsConfiguration(TerminalSettingId.ShellIntegrationDecorationsEnabled)) {
				this._removeCapabilityDisposables(TerminalCapability.CommandDetection);
				this._updateDecorationVisibility();
			}
		}));
		this._register(this._themeService.onDidColorThemeChange(() => this._refreshStyles(true)));
		this._updateDecorationVisibility();
		this._register(this._capabilities.onDidAddCapabilityType(c => this._createCapabilityDisposables(c)));
		this._register(this._capabilities.onDidRemoveCapabilityType(c => this._removeCapabilityDisposables(c)));
		this._register(lifecycleService.onWillShutdown(() => this._disposeAllDecorations()));
	}

	private _createCapabilityDisposables(c: TerminalCapability): void {
		const capability = this._capabilities.get(c);
		if (!capability || this._capabilityDisposables.has(c)) {
			return;
		}
		const store = new DisposableStore();
		switch (capability.type) {
			case TerminalCapability.BufferMarkDetection:
				store.add(capability.onMarkAdded(mark => this.registerMarkDecoration(mark)));
				break;
			case TerminalCapability.CommandDetection: {
				const disposables = this._getCommandDetectionListeners(capability);
				for (const d of disposables) {
					store.add(d);
				}
				break;
			}
		}
		this._capabilityDisposables.set(c, store);
	}

	private _removeCapabilityDisposables(c: TerminalCapability): void {
		this._capabilityDisposables.deleteAndDispose(c);
	}

	registerMarkDecoration(mark: IMarkProperties): IDecoration | undefined {
		if (!this._terminal || (!this._showGutterDecorations && !this._showOverviewRulerDecorations)) {
			return undefined;
		}
		if (mark.hidden) {
			return undefined;
		}
		return this.registerCommandDecoration(undefined, undefined, mark);
	}

	private _updateDecorationVisibility(): void {
		const showDecorations = this._configurationService.getValue(TerminalSettingId.ShellIntegrationDecorationsEnabled);
		this._showGutterDecorations = (showDecorations === 'both' || showDecorations === 'gutter');
		this._showOverviewRulerDecorations = (showDecorations === 'both' || showDecorations === 'overviewRuler');
		this._disposeAllDecorations();
		if (this._showGutterDecorations || this._showOverviewRulerDecorations) {
			this._attachToCommandCapability();
			this._updateGutterDecorationVisibility();
		}
		const currentCommand = this._capabilities.get(TerminalCapability.CommandDetection)?.executingCommandObject;
		if (currentCommand) {
			this.registerCommandDecoration(currentCommand, true);
		}
	}

	private _disposeAllDecorations(): void {
		this._placeholderDecoration?.dispose();
		for (const value of this._decorations.values()) {
			value.decoration.dispose();
			dispose(value.disposables);
		}
	}

	private _updateGutterDecorationVisibility(): void {
		const commandDecorationElements = this._terminal?.element?.querySelectorAll(DecorationSelector.CommandDecoration);
		if (commandDecorationElements) {
			for (const commandDecorationElement of commandDecorationElements) {
				this._updateCommandDecorationVisibility(commandDecorationElement);
			}
		}
	}

	private _updateCommandDecorationVisibility(commandDecorationElement: Element): void {
		if (this._showGutterDecorations) {
			commandDecorationElement.classList.remove(DecorationSelector.Hide);
		} else {
			commandDecorationElement.classList.add(DecorationSelector.Hide);
		}
	}

	public refreshLayouts(): void {
		updateLayout(this._configurationService, this._placeholderDecoration?.element);
		for (const decoration of this._decorations) {
			updateLayout(this._configurationService, decoration[1].decoration.element);
		}
	}

	private _refreshStyles(refreshOverviewRulerColors?: boolean): void {
		if (refreshOverviewRulerColors) {
			for (const decoration of this._decorations.values()) {
				const color = this._getDecorationCssColor(decoration)?.toString() ?? '';
				if (decoration.decoration.options?.overviewRulerOptions) {
					decoration.decoration.options.overviewRulerOptions.color = color;
				} else if (decoration.decoration.options) {
					decoration.decoration.options.overviewRulerOptions = { color };
				}
			}
		}
		this._updateClasses(this._placeholderDecoration?.element);
		for (const decoration of this._decorations.values()) {
			this._updateClasses(decoration.decoration.element, decoration.exitCode, decoration.markProperties);
		}
	}

	private _dispose(): void {
		for (const disposable of this._capabilityDisposables.values()) {
			dispose(disposable);
		}
		this.clearDecorations();
	}

	private _clearPlaceholder(): void {
		this._placeholderDecoration?.dispose();
		this._placeholderDecoration = undefined;
	}

	public clearDecorations(): void {
		this._placeholderDecoration?.marker.dispose();
		this._clearPlaceholder();
		this._disposeAllDecorations();
		this._decorations.clear();
	}

	private _attachToCommandCapability(): void {
		if (this._capabilities.has(TerminalCapability.CommandDetection)) {
			const capability = this._capabilities.get(TerminalCapability.CommandDetection)!;
			const disposables = this._getCommandDetectionListeners(capability);
			const store = new DisposableStore();
			for (const d of disposables) {
				store.add(d);
			}
			this._capabilityDisposables.set(TerminalCapability.CommandDetection, store);
		}
	}

	private _getCommandDetectionListeners(capability: ICommandDetectionCapability): IDisposable[] {
		this._removeCapabilityDisposables(TerminalCapability.CommandDetection);

		const commandDetectionListeners = [];
		// Command started
		if (capability.executingCommandObject?.marker) {
			this.registerCommandDecoration(capability.executingCommandObject, true);
		}
		commandDetectionListeners.push(capability.onCommandStarted(command => this.registerCommandDecoration(command, true)));
		// Command finished
		for (const command of capability.commands) {
			this.registerCommandDecoration(command);
		}
		commandDetectionListeners.push(capability.onCommandFinished(command => {
			const buffer = this._terminal?.buffer?.active;
			const marker = command.promptStartMarker;

			// Edge case: Handle case where tsc watch commands clears buffer, but decoration of that tsc command re-appears
			const shouldRegisterDecoration = (
				command.exitCode === undefined ||
				// Only register decoration if the cursor is at or below the promptStart marker.
				(buffer && marker && buffer.baseY + buffer.cursorY >= marker.line)
			);

			if (shouldRegisterDecoration) {
				this.registerCommandDecoration(command);
			}

			if (command.exitCode) {
				this._accessibilitySignalService.playSignal(AccessibilitySignal.terminalCommandFailed);
			} else {
				this._accessibilitySignalService.playSignal(AccessibilitySignal.terminalCommandSucceeded);
			}
		}));
		// Command invalidated
		commandDetectionListeners.push(capability.onCommandInvalidated(commands => {
			for (const command of commands) {
				const id = command.marker?.id;
				if (id) {
					const match = this._decorations.get(id);
					if (match) {
						match.decoration.dispose();
						dispose(match.disposables);
					}
				}
			}
		}));
		// Current command invalidated
		commandDetectionListeners.push(capability.onCurrentCommandInvalidated((request) => {
			if (request.reason === CommandInvalidationReason.NoProblemsReported) {
				const lastDecoration = Array.from(this._decorations.entries())[this._decorations.size - 1];
				lastDecoration?.[1].decoration.dispose();
			} else if (request.reason === CommandInvalidationReason.Windows) {
				this._clearPlaceholder();
			}
		}));
		return commandDetectionListeners;
	}

	activate(terminal: Terminal): void {
		this._terminal = terminal;
		this._attachToCommandCapability();
	}

	registerCommandDecoration(command?: ITerminalCommand, beforeCommandExecution?: boolean, markProperties?: IMarkProperties): IDecoration | undefined {
		if (!this._terminal || (beforeCommandExecution && !command) || (!this._showGutterDecorations && !this._showOverviewRulerDecorations)) {
			return undefined;
		}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 280: Error message without production error code - breaks React bundle size optimization
//   2. Line 280: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const marker = command?.marker || markProperties?.marker;
		if (!marker) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 303: Error message without production error code - breaks React bundle size optimization
//   2. Line 303: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`cannot add a decoration for a command ${JSON.stringify(command)} with no marker`);
		}
		this._clearPlaceholder();
		const color = this._getDecorationCssColor(command)?.toString() ?? '';
		const decoration = this._terminal.registerDecoration({
			marker,
			overviewRulerOptions: this._showOverviewRulerDecorations ? (beforeCommandExecution
				? { color, position: 'left' }
				: { color, position: command?.exitCode ? 'right' : 'left' }) : undefined
		});
		if (!decoration) {
			return undefined;
		}
		if (beforeCommandExecution) {
			this._placeholderDecoration = decoration;
		}
		decoration.onRender(element => {
			if (element.classList.contains(DecorationSelector.OverviewRuler)) {
				return;
			}
			if (!this._decorations.get(decoration.marker.id)) {
				decoration.onDispose(() => this._decorations.delete(decoration.marker.id));
				this._decorations.set(decoration.marker.id,
					{
						decoration,
						disposables: this._createDisposables(element, command, markProperties),
						exitCode: command?.exitCode,
						markProperties: command?.markProperties
					});
			}
			if (!element.classList.contains(DecorationSelector.Codicon) || command?.marker?.line === 0) {
				// first render or buffer was cleared
				updateLayout(this._configurationService, element);
				this._updateClasses(element, command?.exitCode, command?.markProperties || markProperties);
			}
		});
		return decoration;
	}

	registerMenuItems(command: ITerminalCommand, items: IAction[]): IDisposable {
		const existingItems = this._registeredMenuItems.get(command);
		if (existingItems) {
			existingItems.push(...items);
		} else {
			this._registeredMenuItems.set(command, [...items]);
		}
		return toDisposable(() => {
			const commandItems = this._registeredMenuItems.get(command);
			if (commandItems) {
				for (const item of items.values()) {
					const index = commandItems.indexOf(item);
					if (index !== -1) {
						commandItems.splice(index, 1);
					}
				}
			}
		});
	}

	private _createDisposables(element: HTMLElement, command?: ITerminalCommand, markProperties?: IMarkProperties): IDisposable[] {
		if (command?.exitCode === undefined && !command?.markProperties) {
			return [];
		} else if (command?.markProperties || markProperties) {
			return [this._createHover(element, command || markProperties, markProperties?.hoverMessage)];
		}
		return [...this._createContextMenu(element, command), this._createHover(element, command)];
	}

	private _createHover(element: HTMLElement, command: ITerminalCommand | undefined, hoverMessage?: string) {
		return this._hoverService.setupDelayedHover(element, () => ({
			content: new MarkdownString(getTerminalDecorationHoverContent(command, hoverMessage))
		}));
	}

	private _updateClasses(element?: HTMLElement, exitCode?: number, markProperties?: IMarkProperties): void {
		if (!element) {
			return;
		}
		for (const classes of element.classList) {
			element.classList.remove(classes);
		}
		element.classList.add(DecorationSelector.CommandDecoration, DecorationSelector.Codicon, DecorationSelector.XtermDecoration);

		if (markProperties) {
			element.classList.add(DecorationSelector.DefaultColor, ...ThemeIcon.asClassNameArray(terminalDecorationMark));
			if (!markProperties.hoverMessage) {
				//disable the mouse pointer
				element.classList.add(DecorationSelector.Default);
			}
		} else {
			// command decoration
			this._updateCommandDecorationVisibility(element);
			if (exitCode === undefined) {
				element.classList.add(DecorationSelector.DefaultColor, DecorationSelector.Default);
				element.classList.add(...ThemeIcon.asClassNameArray(terminalDecorationIncomplete));
			} else if (exitCode) {
				element.classList.add(DecorationSelector.ErrorColor);
				element.classList.add(...ThemeIcon.asClassNameArray(terminalDecorationError));
			} else {
				element.classList.add(...ThemeIcon.asClassNameArray(terminalDecorationSuccess));
			}
		}
	}

	private _createContextMenu(element: HTMLElement, command: ITerminalCommand): IDisposable[] {
		// When the xterm Decoration gets disposed of, its element gets removed from the dom
		// along with its listeners
		return [
			dom.addDisposableListener(element, dom.EventType.MOUSE_DOWN, async (e) => {
				e.stopImmediatePropagation();
			}),
			dom.addDisposableListener(element, dom.EventType.CLICK, async (e) => {
				e.stopImmediatePropagation();
				const actions = await this._getCommandActions(command);
				this._contextMenuService.showContextMenu({ getAnchor: () => element, getActions: () => actions });
			}),
			dom.addDisposableListener(element, dom.EventType.CONTEXT_MENU, async (e) => {
				e.stopImmediatePropagation();
				const actions = this._getContextMenuActions();
				this._contextMenuService.showContextMenu({ getAnchor: () => element, getActions: () => actions });
			}),
		];
	}
	private _getContextMenuActions(): IAction[] {
		const label = localize('workbench.action.terminal.toggleVisibility', "Toggle Visibility");
		return [
			{
				class: undefined, tooltip: label, id: 'terminal.toggleVisibility', label, enabled: true,
				run: async () => {
					this._showToggleVisibilityQuickPick();
				}
			}
		];
	}

	private async _getCommandActions(command: ITerminalCommand): Promise<IAction[]> {
		const actions: IAction[] = [];
		const registeredMenuItems = this._registeredMenuItems.get(command);
		if (registeredMenuItems?.length) {
			actions.push(...registeredMenuItems, new Separator());
		}
		if (command.command !== '') {
			const labelRun = localize("terminal.rerunCommand", 'Rerun Command');
			actions.push({
				class: undefined, tooltip: labelRun, id: 'terminal.rerunCommand', label: labelRun, enabled: true,
				run: async () => {
					if (command.command === '') {
						return;
					}
					if (!command.isTrusted) {
						const shouldRun = await new Promise<boolean>(r => {
							this._notificationService.prompt(Severity.Info, localize('rerun', 'Do you want to run the command: {0}', command.command), [{
								label: localize('yes', 'Yes'),
								run: () => r(true)
							}, {
								label: localize('no', 'No'),
								run: () => r(false)
							}]);
						});
						if (!shouldRun) {
							return;
						}
					}
					this._onDidRequestRunCommand.fire({ command });
				}
			});
			// The second section is the clipboard section
			actions.push(new Separator());
			const labelCopy = localize("terminal.copyCommand", 'Copy Command');
			actions.push({
				class: undefined, tooltip: labelCopy, id: 'terminal.copyCommand', label: labelCopy, enabled: true,
				run: () => this._clipboardService.writeText(command.command)
			});
		}
		if (command.hasOutput()) {
			const labelCopyCommandAndOutput = localize("terminal.copyCommandAndOutput", 'Copy Command and Output');
			actions.push({
				class: undefined, tooltip: labelCopyCommandAndOutput, id: 'terminal.copyCommandAndOutput', label: labelCopyCommandAndOutput, enabled: true,
				run: () => {
					const output = command.getOutput();
					if (typeof output === 'string') {
						this._clipboardService.writeText(`${command.command !== '' ? command.command + '\n' : ''}${output}`);
					}
				}
			});
			const labelText = localize("terminal.copyOutput", 'Copy Output');
			actions.push({
				class: undefined, tooltip: labelText, id: 'terminal.copyOutput', label: labelText, enabled: true,
				run: () => {
					const text = command.getOutput();
					if (typeof text === 'string') {
						this._clipboardService.writeText(text);
					}
				}
			});
			const labelHtml = localize("terminal.copyOutputAsHtml", 'Copy Output as HTML');
			actions.push({
				class: undefined, tooltip: labelHtml, id: 'terminal.copyOutputAsHtml', label: labelHtml, enabled: true,
				run: () => this._onDidRequestCopyAsHtml.fire({ command })
			});
		}
		if (actions.length > 0) {
			actions.push(new Separator());
		}
		const labelRunRecent = localize('workbench.action.terminal.runRecentCommand', "Run Recent Command");
		actions.push({
			class: undefined, tooltip: labelRunRecent, id: 'workbench.action.terminal.runRecentCommand', label: labelRunRecent, enabled: true,
			run: () => this._commandService.executeCommand('workbench.action.terminal.runRecentCommand')
		});
		const labelGoToRecent = localize('workbench.action.terminal.goToRecentDirectory', "Go To Recent Directory");
		actions.push({
			class: undefined, tooltip: labelRunRecent, id: 'workbench.action.terminal.goToRecentDirectory', label: labelGoToRecent, enabled: true,
			run: () => this._commandService.executeCommand('workbench.action.terminal.goToRecentDirectory')
		});

		actions.push(new Separator());

		const labelAbout = localize("terminal.learnShellIntegration", 'Learn About Shell Integration');
		actions.push({
			class: undefined, tooltip: labelAbout, id: 'terminal.learnShellIntegration', label: labelAbout, enabled: true,
			run: () => this._openerService.open('https://code.visualstudio.com/docs/terminal/shell-integration')
		});
		return actions;
	}

	private _showToggleVisibilityQuickPick() {
		const quickPick = this._register(this._quickInputService.createQuickPick());
		quickPick.hideInput = true;
		quickPick.hideCheckAll = true;
		quickPick.canSelectMany = true;
		quickPick.title = localize('toggleVisibility', 'Toggle visibility');
		const configValue = this._configurationService.getValue(TerminalSettingId.ShellIntegrationDecorationsEnabled);
		const gutterIcon: IQuickPickItem = {
			label: localize('gutter', 'Gutter command decorations'),
			picked: configValue !== 'never' && configValue !== 'overviewRuler'
		};
		const overviewRulerIcon: IQuickPickItem = {
			label: localize('overviewRuler', 'Overview ruler command decorations'),
			picked: configValue !== 'never' && configValue !== 'gutter'
		};
		quickPick.items = [gutterIcon, overviewRulerIcon];
		const selectedItems: IQuickPickItem[] = [];
		if (configValue !== 'never') {
			if (configValue !== 'gutter') {
				selectedItems.push(gutterIcon);
			}
			if (configValue !== 'overviewRuler') {
				selectedItems.push(overviewRulerIcon);
			}
		}
		quickPick.selectedItems = selectedItems;
		this._register(quickPick.onDidChangeSelection(async e => {
			let newValue: 'both' | 'gutter' | 'overviewRuler' | 'never' = 'never';
			if (e.includes(gutterIcon)) {
				if (e.includes(overviewRulerIcon)) {
					newValue = 'both';
				} else {
					newValue = 'gutter';
				}
			} else if (e.includes(overviewRulerIcon)) {
				newValue = 'overviewRuler';
			}
			await this._configurationService.updateValue(TerminalSettingId.ShellIntegrationDecorationsEnabled, newValue);
		}));
		quickPick.ok = false;
		quickPick.show();
	}

	private _getDecorationCssColor(decorationOrCommand?: IDisposableDecoration | ITerminalCommand): string | undefined {
		let colorId: string;
		if (decorationOrCommand?.exitCode === undefined) {
			colorId = TERMINAL_COMMAND_DECORATION_DEFAULT_BACKGROUND_COLOR;
		} else {
			colorId = decorationOrCommand.exitCode ? TERMINAL_COMMAND_DECORATION_ERROR_BACKGROUND_COLOR : TERMINAL_COMMAND_DECORATION_SUCCESS_BACKGROUND_COLOR;
		}
		return this._themeService.getColorTheme().getColor(colorId)?.toString();
	}
}
