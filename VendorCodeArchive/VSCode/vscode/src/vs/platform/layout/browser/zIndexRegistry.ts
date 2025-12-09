//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { clearNode } from '../../../base/browser/dom.js';
import { createCSSRule, createStyleSheet } from '../../../base/browser/domStylesheets.js';
import { RunOnceScheduler } from '../../../base/common/async.js';

export enum ZIndex {
	Base = 0,
	Sash = 35,
	SuggestWidget = 40,
	Hover = 50,
	DragImage = 1000,
	MenubarMenuItemsHolder = 2000, // quick-input-widget
	ContextView = 2500,
	ModalDialog = 2600,
	PaneDropOverlay = 10000
}

const ZIndexValues = Object.keys(ZIndex).filter(key => !isNaN(Number(key))).map(key => Number(key)).sort((a, b) => b - a);
function findBase(z: number) {
	for (const zi of ZIndexValues) {
		if (z >= zi) {
			return zi;
		}
	}

	return -1;
}

class ZIndexRegistry {
	private styleSheet: HTMLStyleElement;
	private zIndexMap: Map<string, number>;
	private scheduler: RunOnceScheduler;
	constructor() {
		this.styleSheet = createStyleSheet();
		this.zIndexMap = new Map<string, number>();
		this.scheduler = new RunOnceScheduler(() => this.updateStyleElement(), 200);
	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 45: Error message without production error code - breaks React bundle size optimization
//   2. Line 45: Error message without production error code - breaks React bundle size optimization
//   3. Line 50: Error message without production error code - breaks React bundle size optimization
//   4. Line 50: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	registerZIndex(relativeLayer: ZIndex, z: number, name: string): string {
		if (this.zIndexMap.get(name)) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 59: Error message without production error code - breaks React bundle size optimization
//   2. Line 59: Error message without production error code - breaks React bundle size optimization
//   3. Line 64: Error message without production error code - breaks React bundle size optimization
//   4. Line 64: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 71: Error message without production error code - breaks React bundle size optimization
//   2. Line 71: Error message without production error code - breaks React bundle size optimization
//   3. Line 76: Error message without production error code - breaks React bundle size optimization
//   4. Line 76: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 83: Error message without production error code - breaks React bundle size optimization
//   2. Line 83: Error message without production error code - breaks React bundle size optimization
//   3. Line 88: Error message without production error code - breaks React bundle size optimization
//   4. Line 88: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 95: Error message without production error code - breaks React bundle size optimization
//   2. Line 95: Error message without production error code - breaks React bundle size optimization
//   3. Line 100: Error message without production error code - breaks React bundle size optimization
//   4. Line 100: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 107: Error message without production error code - breaks React bundle size optimization
//   2. Line 107: Error message without production error code - breaks React bundle size optimization
//   3. Line 112: Error message without production error code - breaks React bundle size optimization
//   4. Line 112: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 119: Error message without production error code - breaks React bundle size optimization
//   2. Line 119: Error message without production error code - breaks React bundle size optimization
//   3. Line 124: Error message without production error code - breaks React bundle size optimization
//   4. Line 124: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 131: Error message without production error code - breaks React bundle size optimization
//   2. Line 131: Error message without production error code - breaks React bundle size optimization
//   3. Line 136: Error message without production error code - breaks React bundle size optimization
//   4. Line 136: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 143: Error message without production error code - breaks React bundle size optimization
//   2. Line 143: Error message without production error code - breaks React bundle size optimization
//   3. Line 148: Error message without production error code - breaks React bundle size optimization
//   4. Line 148: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 155: Error message without production error code - breaks React bundle size optimization
//   2. Line 155: Error message without production error code - breaks React bundle size optimization
//   3. Line 160: Error message without production error code - breaks React bundle size optimization
//   4. Line 160: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error(`z-index with name ${name} has already been registered.`);
		}

		const proposedZValue = relativeLayer + z;
		if (findBase(proposedZValue) !== relativeLayer) {
			throw new Error(`Relative layer: ${relativeLayer} + z-index: ${z} exceeds next layer ${proposedZValue}.`);
		}

		this.zIndexMap.set(name, proposedZValue);
		this.scheduler.schedule();
		return this.getVarName(name);
	}

	private getVarName(name: string): string {
		return `--z-index-${name}`;
	}

	private updateStyleElement(): void {
		clearNode(this.styleSheet);
		let ruleBuilder = '';
		this.zIndexMap.forEach((zIndex, name) => {
			ruleBuilder += `${this.getVarName(name)}: ${zIndex};\n`;
		});
		createCSSRule(':root', ruleBuilder, this.styleSheet);
	}
}

const zIndexRegistry = new ZIndexRegistry();

export function registerZIndex(relativeLayer: ZIndex, z: number, name: string): string {
	return zIndexRegistry.registerZIndex(relativeLayer, z, name);
}
