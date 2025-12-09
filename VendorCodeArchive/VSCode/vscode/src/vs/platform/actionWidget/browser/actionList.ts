//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as dom from '../../../base/browser/dom.js';
import { KeybindingLabel } from '../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { IListEvent, IListMouseEvent, IListRenderer, IListVirtualDelegate } from '../../../base/browser/ui/list/list.js';
import { IListAccessibilityProvider, List } from '../../../base/browser/ui/list/listWidget.js';
import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { Codicon } from '../../../base/common/codicons.js';
import { ResolvedKeybinding } from '../../../base/common/keybindings.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { OS } from '../../../base/common/platform.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import './actionWidget.css';
import { localize } from '../../../nls.js';
import { IContextViewService } from '../../contextview/browser/contextView.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { defaultListStyles } from '../../theme/browser/defaultStyles.js';
import { asCssVariable } from '../../theme/common/colorRegistry.js';
import { ILayoutService } from '../../layout/browser/layoutService.js';

export const acceptSelectedActionCommand = 'acceptSelectedCodeAction';
export const previewSelectedActionCommand = 'previewSelectedCodeAction';

export interface IActionListDelegate<T> {
	onHide(didCancel?: boolean): void;
	onSelect(action: T, preview?: boolean): void;
	onHover?(action: T, cancellationToken: CancellationToken): Promise<{ canPreview: boolean } | void>;
	onFocus?(action: T | undefined): void;
}

export interface IActionListItem<T> {
	readonly item?: T;
	readonly kind: ActionListItemKind;
	readonly group?: { kind?: any; icon?: ThemeIcon; title: string };
	readonly disabled?: boolean;
	readonly label?: string;
	readonly description?: string;
	readonly keybinding?: ResolvedKeybinding;
	canPreview?: boolean | undefined;
	readonly hideIcon?: boolean;
	readonly tooltip?: string;
}

interface IActionMenuTemplateData {
	readonly container: HTMLElement;
	readonly icon: HTMLElement;
	readonly text: HTMLElement;
	readonly description?: HTMLElement;
	readonly keybinding: KeybindingLabel;
}

export const enum ActionListItemKind {
	Action = 'action',
	Header = 'header',
	Separator = 'separator'
}

interface IHeaderTemplateData {
	readonly container: HTMLElement;
	readonly text: HTMLElement;
}

class HeaderRenderer<T> implements IListRenderer<IActionListItem<T>, IHeaderTemplateData> {

	get templateId(): string { return ActionListItemKind.Header; }

	renderTemplate(container: HTMLElement): IHeaderTemplateData {
		container.classList.add('group-header');

		const text = document.createElement('span');
		container.append(text);

		return { container, text };
	}

	renderElement(element: IActionListItem<T>, _index: number, templateData: IHeaderTemplateData): void {
		templateData.text.textContent = element.group?.title ?? element.label ?? '';
	}

	disposeTemplate(_templateData: IHeaderTemplateData): void {
		// noop
	}
}

interface ISeparatorTemplateData {
	readonly container: HTMLElement;
	readonly text: HTMLElement;
}

class SeparatorRenderer<T> implements IListRenderer<IActionListItem<T>, ISeparatorTemplateData> {

	get templateId(): string { return ActionListItemKind.Separator; }

	renderTemplate(container: HTMLElement): ISeparatorTemplateData {
		container.classList.add('separator');

		const text = document.createElement('span');
		container.append(text);

		return { container, text };
	}

	renderElement(element: IActionListItem<T>, _index: number, templateData: ISeparatorTemplateData): void {
		templateData.text.textContent = element.label ?? '';
	}

	disposeTemplate(_templateData: ISeparatorTemplateData): void {
		// noop
	}
}

class ActionItemRenderer<T> implements IListRenderer<IActionListItem<T>, IActionMenuTemplateData> {

	get templateId(): string { return ActionListItemKind.Action; }

	constructor(
		private readonly _supportsPreview: boolean,
		@IKeybindingService private readonly _keybindingService: IKeybindingService
	) { }

	renderTemplate(container: HTMLElement): IActionMenuTemplateData {
		container.classList.add(this.templateId);

		const icon = document.createElement('div');
		icon.className = 'icon';
		container.append(icon);

		const text = document.createElement('span');
		text.className = 'title';
		container.append(text);

		const description = document.createElement('span');
		description.className = 'description';
		container.append(description);

		const keybinding = new KeybindingLabel(container, OS);

		return { container, icon, text, description, keybinding };
	}

	renderElement(element: IActionListItem<T>, _index: number, data: IActionMenuTemplateData): void {
		if (element.group?.icon) {
			data.icon.className = ThemeIcon.asClassName(element.group.icon);
			if (element.group.icon.color) {
				data.icon.style.color = asCssVariable(element.group.icon.color.id);
			}
		} else {
			data.icon.className = ThemeIcon.asClassName(Codicon.lightBulb);
			data.icon.style.color = 'var(--vscode-editorLightBulb-foreground)';
		}

		if (!element.item || !element.label) {
			return;
		}

		dom.setVisibility(!element.hideIcon, data.icon);

		data.text.textContent = stripNewlines(element.label);

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 164: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 165: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 166: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 168: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 169: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		// if there is a keybinding, prioritize over description for now
		if (element.keybinding) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 182: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 183: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 185: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 186: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 189: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 196: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 198: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 201: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 203: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 204: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 213: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 215: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 216: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 218: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 219: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 227: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 230: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 231: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 233: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 234: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 241: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 242: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 245: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 248: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 249: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 256: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 257: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 258: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 261: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 263: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 264: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 272: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 273: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 275: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 276: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 278: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 286: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 287: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 288: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 290: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 293: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 294: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 301: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 302: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 303: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 305: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 306: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 308: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 309: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 316: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 317: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 318: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 320: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 321: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 323: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 332: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 333: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 335: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 339: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 346: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 350: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 351: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 353: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 354: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 361: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 362: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 363: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 365: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 366: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 369: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 376: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 378: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 381: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 384: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 391: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 392: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 393: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 395: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 396: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 399: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 406: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 407: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 408: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 410: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 411: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 413: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 414: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 421: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 422: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 423: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 425: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 426: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 428: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 429: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 436: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 437: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 438: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 440: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 441: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 443: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 444: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 451: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 452: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 453: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 455: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 458: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 459: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 466: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 467: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 470: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 471: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 473: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 474: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (7):
//   1. Line 481: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 482: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 483: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 485: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 486: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 488: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			data.description!.textContent = element.keybinding.getLabel();
			data.description!.style.display = 'inline';
			data.description!.style.letterSpacing = '0.5px';
		} else if (element.description) {
			data.description!.textContent = stripNewlines(element.description);
			data.description!.style.display = 'inline';
		} else {
			data.description!.textContent = '';
			data.description!.style.display = 'none';
		}

		const actionTitle = this._keybindingService.lookupKeybinding(acceptSelectedActionCommand)?.getLabel();
		const previewTitle = this._keybindingService.lookupKeybinding(previewSelectedActionCommand)?.getLabel();
		data.container.classList.toggle('option-disabled', element.disabled);
		if (element.tooltip) {
			data.container.title = element.tooltip;
		} else if (element.disabled) {
			data.container.title = element.label;
		} else if (actionTitle && previewTitle) {
			if (this._supportsPreview && element.canPreview) {
				data.container.title = localize({ key: 'label-preview', comment: ['placeholders are keybindings, e.g "F2 to Apply, Shift+F2 to Preview"'] }, "{0} to Apply, {1} to Preview", actionTitle, previewTitle);
			} else {
				data.container.title = localize({ key: 'label', comment: ['placeholder is a keybinding, e.g "F2 to Apply"'] }, "{0} to Apply", actionTitle);
			}
		} else {
			data.container.title = '';
		}
	}

	disposeTemplate(templateData: IActionMenuTemplateData): void {
		templateData.keybinding.dispose();
	}
}

class AcceptSelectedEvent extends UIEvent {
	constructor() { super('acceptSelectedAction'); }
}

class PreviewSelectedEvent extends UIEvent {
	constructor() { super('previewSelectedAction'); }
}

function getKeyboardNavigationLabel<T>(item: IActionListItem<T>): string | undefined {
	// Filter out header vs. action vs. separator
	if (item.kind === 'action') {
		return item.label;
	}
	return undefined;
}

export class ActionList<T> extends Disposable {

	public readonly domNode: HTMLElement;

	private readonly _list: List<IActionListItem<T>>;

	private readonly _actionLineHeight = 24;
	private readonly _headerLineHeight = 26;
	private readonly _separatorLineHeight = 8;

	private readonly _allMenuItems: readonly IActionListItem<T>[];

	private readonly cts = this._register(new CancellationTokenSource());

	constructor(
		user: string,
		preview: boolean,
		items: readonly IActionListItem<T>[],
		private readonly _delegate: IActionListDelegate<T>,
		accessibilityProvider: Partial<IListAccessibilityProvider<IActionListItem<T>>> | undefined,
		@IContextViewService private readonly _contextViewService: IContextViewService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@ILayoutService private readonly _layoutService: ILayoutService,
	) {
		super();
		this.domNode = document.createElement('div');
		this.domNode.classList.add('actionList');
		const virtualDelegate: IListVirtualDelegate<IActionListItem<T>> = {
			getHeight: element => {
				switch (element.kind) {
					case ActionListItemKind.Header:
						return this._headerLineHeight;
					case ActionListItemKind.Separator:
						return this._separatorLineHeight;
					default:
						return this._actionLineHeight;
				}
			},
			getTemplateId: element => element.kind
		};


		this._list = this._register(new List(user, this.domNode, virtualDelegate, [
			new ActionItemRenderer<IActionListItem<T>>(preview, this._keybindingService),
			new HeaderRenderer(),
			new SeparatorRenderer(),
		], {
			keyboardSupport: false,
			typeNavigationEnabled: true,
			keyboardNavigationLabelProvider: { getKeyboardNavigationLabel },
			accessibilityProvider: {
				getAriaLabel: element => {
					if (element.kind === ActionListItemKind.Action) {
						let label = element.label ? stripNewlines(element?.label) : '';
						if (element.disabled) {
							label = localize({ key: 'customQuickFixWidget.labels', comment: [`Action widget labels for accessibility.`] }, "{0}, Disabled Reason: {1}", label, element.disabled);
						}
						return label;
					}
					return null;
				},
				getWidgetAriaLabel: () => localize({ key: 'customQuickFixWidget', comment: [`An action widget option`] }, "Action Widget"),
				getRole: (e) => {
					switch (e.kind) {
						case ActionListItemKind.Action:
							return 'option';
						case ActionListItemKind.Separator:
							return 'separator';
						default:
							return 'separator';
					}
				},
				getWidgetRole: () => 'listbox',
				...accessibilityProvider
			},
		}));

		this._list.style(defaultListStyles);

		this._register(this._list.onMouseClick(e => this.onListClick(e)));
		this._register(this._list.onMouseOver(e => this.onListHover(e)));
		this._register(this._list.onDidChangeFocus(() => this.onFocus()));
		this._register(this._list.onDidChangeSelection(e => this.onListSelection(e)));

		this._allMenuItems = items;
		this._list.splice(0, this._list.length, this._allMenuItems);

		if (this._list.length) {
			this.focusNext();
		}
	}

	private focusCondition(element: IActionListItem<unknown>): boolean {
		return !element.disabled && element.kind === ActionListItemKind.Action;
	}

	hide(didCancel?: boolean): void {
		this._delegate.onHide(didCancel);
		this.cts.cancel();
		this._contextViewService.hideContextView();
	}

	layout(minWidth: number): number {
		// Updating list height, depending on how many separators and headers there are.
		const numHeaders = this._allMenuItems.filter(item => item.kind === 'header').length;
		const numSeparators = this._allMenuItems.filter(item => item.kind === 'separator').length;
		const itemsHeight = this._allMenuItems.length * this._actionLineHeight;
		const heightWithHeaders = itemsHeight + numHeaders * this._headerLineHeight - numHeaders * this._actionLineHeight;
		const heightWithSeparators = heightWithHeaders + numSeparators * this._separatorLineHeight - numSeparators * this._actionLineHeight;
		this._list.layout(heightWithSeparators);
		let maxWidth = minWidth;

		if (this._allMenuItems.length >= 50) {
			maxWidth = 380;
		} else {
			// For finding width dynamically (not using resize observer)
			const itemWidths: number[] = this._allMenuItems.map((_, index): number => {
				const element = this.domNode.ownerDocument.getElementById(this._list.getElementID(index));
				if (element) {
					element.style.width = 'auto';
					const width = element.getBoundingClientRect().width;
					element.style.width = '';
					return width;
				}
				return 0;
			});

			// resize observer - can be used in the future since list widget supports dynamic height but not width
			maxWidth = Math.max(...itemWidths, minWidth);
		}

		const maxVhPrecentage = 0.7;
		const height = Math.min(heightWithSeparators, this._layoutService.getContainer(dom.getWindow(this.domNode)).clientHeight * maxVhPrecentage);
		this._list.layout(height, maxWidth);

		this.domNode.style.height = `${height}px`;

		this._list.domFocus();
		return maxWidth;
	}

	focusPrevious() {
		this._list.focusPrevious(1, true, undefined, this.focusCondition);
	}

	focusNext() {
		this._list.focusNext(1, true, undefined, this.focusCondition);
	}

	acceptSelected(preview?: boolean) {
		const focused = this._list.getFocus();
		if (focused.length === 0) {
			return;
		}

		const focusIndex = focused[0];
		const element = this._list.element(focusIndex);
		if (!this.focusCondition(element)) {
			return;
		}

		const event = preview ? new PreviewSelectedEvent() : new AcceptSelectedEvent();
		this._list.setSelection([focusIndex], event);
	}

	private onListSelection(e: IListEvent<IActionListItem<T>>): void {
		if (!e.elements.length) {
			return;
		}

		const element = e.elements[0];
		if (element.item && this.focusCondition(element)) {
			this._delegate.onSelect(element.item, e.browserEvent instanceof PreviewSelectedEvent);
		} else {
			this._list.setSelection([]);
		}
	}

	private onFocus() {
		const focused = this._list.getFocus();
		if (focused.length === 0) {
			return;
		}
		const focusIndex = focused[0];
		const element = this._list.element(focusIndex);
		this._delegate.onFocus?.(element.item);
	}

	private async onListHover(e: IListMouseEvent<IActionListItem<T>>) {
		const element = e.element;
		if (element && element.item && this.focusCondition(element)) {
			if (this._delegate.onHover && !element.disabled && element.kind === ActionListItemKind.Action) {
				const result = await this._delegate.onHover(element.item, this.cts.token);
				element.canPreview = result ? result.canPreview : undefined;
			}
			if (e.index) {
				this._list.splice(e.index, 1, [element]);
			}
		}

		this._list.setFocus(typeof e.index === 'number' ? [e.index] : []);
	}

	private onListClick(e: IListMouseEvent<IActionListItem<T>>): void {
		if (e.element && this.focusCondition(e.element)) {
			this._list.setFocus([]);
		}
	}
}

function stripNewlines(str: string): string {
	return str.replace(/\r\n|\r|\n/g, ' ');
}
