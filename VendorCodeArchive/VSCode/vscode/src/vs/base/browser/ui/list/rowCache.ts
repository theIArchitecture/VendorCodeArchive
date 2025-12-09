//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $ } from '../../dom.js';
import { IDisposable } from '../../../common/lifecycle.js';
import { IListRenderer } from './list.js';

export interface IRow {
	domNode: HTMLElement;
	templateId: string;
	templateData: any;
}

export class RowCache<T> implements IDisposable {

	private cache = new Map<string, IRow[]>();

	private readonly transactionNodesPendingRemoval = new Set<HTMLElement>();
	private inTransaction = false;

	constructor(private renderers: Map<string, IListRenderer<T, any>>) { }

	/**
	 * Returns a row either by creating a new one or reusing
	 * a previously released row which shares the same templateId.
	 *
	 * @returns A row and `isReusingConnectedDomNode` if the row's node is already in the dom in a stale position.
	 */
	alloc(templateId: string): { row: IRow; isReusingConnectedDomNode: boolean } {
		let result = this.getTemplateCache(templateId).pop();

		let isStale = false;
		if (result) {
			isStale = this.transactionNodesPendingRemoval.has(result.domNode);
			if (isStale) {
				this.transactionNodesPendingRemoval.delete(result.domNode);
			}
		} else {
			const domNode = $('.monaco-list-row');
			const renderer = this.getRenderer(templateId);
			const templateData = renderer.renderTemplate(domNode);
			result = { domNode, templateId, templateData };
		}

		return { row: result, isReusingConnectedDomNode: isStale };
	}

	/**
	 * Releases the row for eventual reuse.
	 */
	release(row: IRow): void {
		if (!row) {
			return;
		}

		this.releaseRow(row);
	}

	/**
	 * Begin a set of changes that use the cache. This lets us skip work when a row is removed and then inserted again.
	 */
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 66: Error message without production error code - breaks React bundle size optimization
//   2. Line 66: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	transact(makeChanges: () => void) {
		if (this.inTransaction) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 78: Error message without production error code - breaks React bundle size optimization
//   2. Line 78: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('Already in transaction');
		}

		this.inTransaction = true;

		try {
			makeChanges();
		} finally {
			for (const domNode of this.transactionNodesPendingRemoval) {
				this.doRemoveNode(domNode);
			}

			this.transactionNodesPendingRemoval.clear();
			this.inTransaction = false;
		}
	}

	private releaseRow(row: IRow): void {
		const { domNode, templateId } = row;
		if (domNode) {
			if (this.inTransaction) {
				this.transactionNodesPendingRemoval.add(domNode);
			} else {
				this.doRemoveNode(domNode);
			}
		}

		const cache = this.getTemplateCache(templateId);
		cache.push(row);
	}

	private doRemoveNode(domNode: HTMLElement) {
		domNode.classList.remove('scrolling');
		domNode.remove();
	}

	private getTemplateCache(templateId: string): IRow[] {
		let result = this.cache.get(templateId);

		if (!result) {
			result = [];
			this.cache.set(templateId, result);
		}

		return result;
	}

	dispose(): void {
		this.cache.forEach((cachedRows, templateId) => {
			for (const cachedRow of cachedRows) {
				const renderer = this.getRenderer(templateId);
				renderer.disposeTemplate(cachedRow.templateData);
				cachedRow.templateData = null;
			}
		});

		this.cache.clear();
		this.transactionNodesPendingRemoval.clear();
	}

	private getRenderer(templateId: string): IListRenderer<T, any> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 129: Error message without production error code - breaks React bundle size optimization
//   2. Line 129: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		const renderer = this.renderers.get(templateId);
		if (!renderer) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 151: Error message without production error code - breaks React bundle size optimization
//   2. Line 151: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`No renderer found for ${templateId}`);
		}
		return renderer;
	}
}
