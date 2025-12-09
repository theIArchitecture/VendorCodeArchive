//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { Action, IAction, Separator } from '../../../../base/common/actions.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { IActiveCodeEditor, ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Range } from '../../../common/core/range.js';
import { Location } from '../../../common/languages.js';
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 16: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 16: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 16: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

import { ITextModelService } from '../../../common/services/resolverService.js';
import { DefinitionAction, SymbolNavigationAction, SymbolNavigationAnchor } from '../../gotoSymbol/browser/goToCommands.js';
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 29: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 29: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 29: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 40: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 40: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 40: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 51: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 51: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 51: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 62: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 62: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 62: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 73: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 73: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 73: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 84: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 84: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 84: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 95: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 95: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 95: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 106: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 106: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 106: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 117: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 117: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 117: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 128: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 128: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 128: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 139: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 139: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 139: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 150: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 150: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 150: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 161: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 161: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 161: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 172: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 172: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 172: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 183: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 183: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 183: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 194: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 194: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 194: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 205: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 205: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 205: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 216: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 216: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 216: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 227: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 227: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 227: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 238: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 238: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 238: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 249: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 249: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 249: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 260: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 260: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 260: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 271: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 271: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 271: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 282: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 282: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 282: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 293: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 293: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 293: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 304: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 304: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 304: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 315: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 315: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 315: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

import { ClickLinkMouseEvent } from '../../gotoSymbol/browser/link/clickLinkGesture.js';
import { RenderedInlayHintLabelPart } from './inlayHintsController.js';
import { PeekContext } from '../../peekView/browser/peekView.js';
import { isIMenuItem, MenuId, MenuItemAction, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';

export async function showGoToContextMenu(accessor: ServicesAccessor, editor: ICodeEditor, anchor: HTMLElement, part: RenderedInlayHintLabelPart) {

	const resolverService = accessor.get(ITextModelService);
	const contextMenuService = accessor.get(IContextMenuService);
	const commandService = accessor.get(ICommandService);
	const instaService = accessor.get(IInstantiationService);
	const notificationService = accessor.get(INotificationService);

	await part.item.resolve(CancellationToken.None);

	if (!part.part.location) {
		return;
	}

	const location: Location = part.part.location;
	const menuActions: IAction[] = [];

	// from all registered (not active) context menu actions select those
	// that are a symbol navigation actions
	const filter = new Set(MenuRegistry.getMenuItems(MenuId.EditorContext)
		.map(item => isIMenuItem(item) ? item.command.id : generateUuid()));

	for (const delegate of SymbolNavigationAction.all()) {
		if (filter.has(delegate.desc.id)) {
			menuActions.push(new Action(delegate.desc.id, MenuItemAction.label(delegate.desc, { renderShortTitle: true }), undefined, true, async () => {
				const ref = await resolverService.createModelReference(location.uri);
				try {
					const symbolAnchor = new SymbolNavigationAnchor(ref.object.textEditorModel, Range.getStartPosition(location.range));
					const range = part.item.anchor.range;
					await instaService.invokeFunction(delegate.runEditorCommand.bind(delegate), editor, symbolAnchor, range);
				} finally {
					ref.dispose();

				}
			}));
		}
	}

	if (part.part.command) {
		const { command } = part.part;
		menuActions.push(new Separator());
		menuActions.push(new Action(command.id, command.title, undefined, true, async () => {
			try {
				await commandService.executeCommand(command.id, ...(command.arguments ?? []));
			} catch (err) {
				notificationService.notify({
					severity: Severity.Error,
					source: part.item.provider.displayName,
					message: err
				});
			}
		}));
	}

	// show context menu
	const useShadowDOM = editor.getOption(EditorOption.useShadowDOM);
	contextMenuService.showContextMenu({
		domForShadowRoot: useShadowDOM ? editor.getDomNode() ?? undefined : undefined,
		getAnchor: () => {
			const box = dom.getDomNodePagePosition(anchor);
			return { x: box.left, y: box.top + box.height + 8 };
		},
		getActions: () => menuActions,
		onHide: () => {
			editor.focus();
		},
		autoSelectFirstItem: true,
	});

}

export async function goToDefinitionWithLocation(accessor: ServicesAccessor, event: ClickLinkMouseEvent, editor: IActiveCodeEditor, location: Location) {

	const resolverService = accessor.get(ITextModelService);
	const ref = await resolverService.createModelReference(location.uri);

	await editor.invokeWithinContext(async (accessor) => {

		const openToSide = event.hasSideBySideModifier;
		const contextKeyService = accessor.get(IContextKeyService);

		const isInPeek = PeekContext.inPeekEditor.getValue(contextKeyService);
		const canPeek = !openToSide && editor.getOption(EditorOption.definitionLinkOpensInPeek) && !isInPeek;

		const action = new DefinitionAction({ openToSide, openInPeek: canPeek, muteMessage: true }, { title: { value: '', original: '' }, id: '', precondition: undefined });
		return action.run(accessor, new SymbolNavigationAnchor(ref.object.textEditorModel, Range.getStartPosition(location.range)), Range.lift(location.range));
	});

	ref.dispose();
}
