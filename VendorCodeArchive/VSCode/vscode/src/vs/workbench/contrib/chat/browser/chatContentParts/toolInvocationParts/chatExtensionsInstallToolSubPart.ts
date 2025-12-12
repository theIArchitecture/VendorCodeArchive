/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../../base/browser/dom.js';
import { Emitter } from '../../../../../../base/common/event.js';
import { localize } from '../../../../../../nls.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IExtensionManagementService } from '../../../../../../platform/extensionManagement/common/extensionManagement.js';
import { areSameExtensions } from '../../../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { ChatContextKeys } from '../../../common/chatContextKeys.js';
import { IChatToolInvocation } from '../../../common/chatService.js';
import { CancelChatActionId } from '../../actions/chatExecuteActions.js';
import { AcceptToolConfirmationActionId } from '../../actions/chatToolActions.js';
import { IChatCodeBlockInfo, IChatWidgetService } from '../../chat.js';
import { ChatConfirmationWidget, IChatConfirmationButton } from '../chatConfirmationWidget.js';
import { IChatContentPartRenderContext } from '../chatContentParts.js';
import { ChatExtensionsContentPart } from '../chatExtensionsContentPart.js';
import { BaseChatToolInvocationSubPart } from './chatToolInvocationSubPart.js';

export class ExtensionsInstallConfirmationWidgetSubPart extends BaseChatToolInvocationSubPart {
	public readonly domNode: HTMLElement;
	public readonly codeblocks: IChatCodeBlockInfo[] = [];

	constructor(
		toolInvocation: IChatToolInvocation,
		context: IChatContentPartRenderContext,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IChatWidgetService chatWidgetService: IChatWidgetService,
		@IExtensionManagementService extensionManagementService: IExtensionManagementService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super(toolInvocation);

		if (toolInvocation.toolSpecificData?.kind !== 'extensions') {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 40: Error message without production error code - breaks React bundle size optimization
//   2. Line 40: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Tool specific data is missing or not of kind extensions');
		}

		const extensionsContent = toolInvocation.toolSpecificData;
		this.domNode = dom.$('');
		const chatExtensionsContentPart = this._register(instantiationService.createInstance(ChatExtensionsContentPart, extensionsContent));
		this._register(chatExtensionsContentPart.onDidChangeHeight(() => this._onDidChangeHeight.fire()));
		dom.append(this.domNode, chatExtensionsContentPart.domNode);

		if (toolInvocation.isConfirmed === undefined) {
			const continueLabel = localize('continue', "Continue");
			const continueKeybinding = keybindingService.lookupKeybinding(AcceptToolConfirmationActionId)?.getLabel();
			const continueTooltip = continueKeybinding ? `${continueLabel} (${continueKeybinding})` : continueLabel;

			const cancelLabel = localize('cancel', "Cancel");
			const cancelKeybinding = keybindingService.lookupKeybinding(CancelChatActionId)?.getLabel();
			const cancelTooltip = cancelKeybinding ? `${cancelLabel} (${cancelKeybinding})` : cancelLabel;
			const enableContinueButtonEvent = this._register(new Emitter<boolean>());

			const buttons: IChatConfirmationButton[] = [
				{
					label: continueLabel,
					data: true,
					tooltip: continueTooltip,
					disabled: true,
					onDidChangeDisablement: enableContinueButtonEvent.event
				},
				{
					label: cancelLabel,
					data: false,
					isSecondary: true,
					tooltip: cancelTooltip
				}
			];

			const confirmWidget = this._register(instantiationService.createInstance(
				ChatConfirmationWidget,
				context.container,
				{
					title: toolInvocation.confirmationMessages?.title ?? localize('installExtensions', "Install Extensions"),
					message: toolInvocation.confirmationMessages?.message ?? localize('installExtensionsConfirmation', "Click the Install button on the extension and then press Continue when finished."),
					buttons,
				}
			));
			this._register(confirmWidget.onDidChangeHeight(() => this._onDidChangeHeight.fire()));
			dom.append(this.domNode, confirmWidget.domNode);
			this._register(confirmWidget.onDidClick(button => {
				toolInvocation.confirmed.complete(button.data);
				chatWidgetService.getWidgetBySessionId(context.element.sessionId)?.focusInput();
			}));
			toolInvocation.confirmed.p.then(() => {
				ChatContextKeys.Editing.hasToolConfirmation.bindTo(contextKeyService).set(false);
				this._onNeedsRerender.fire();
			});
			const disposable = this._register(extensionManagementService.onInstallExtension(e => {
				if (extensionsContent.extensions.some(id => areSameExtensions({ id }, e.identifier))) {
					disposable.dispose();
					enableContinueButtonEvent.fire(false);
				}
			}));
		}

	}
}
