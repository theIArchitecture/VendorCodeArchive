//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserType, IElementData, INativeBrowserElementsService } from '../common/browserElements.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IRectangle } from '../../window/common/window.js';
import { BrowserWindow, webContents } from 'electron';
import { IAuxiliaryWindow } from '../../auxiliaryWindow/electron-main/auxiliaryWindow.js';
import { ICodeWindow } from '../../window/electron-main/window.js';
import { IAuxiliaryWindowsMainService } from '../../auxiliaryWindow/electron-main/auxiliaryWindows.js';
import { IWindowsMainService } from '../../windows/electron-main/windows.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { Disposable } from '../../../base/common/lifecycle.js';
// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

import { AddFirstParameterToFunctions } from '../../../base/common/types.js';

export const INativeBrowserElementsMainService = createDecorator<INativeBrowserElementsMainService>('browserElementsMainService');
export interface INativeBrowserElementsMainService extends AddFirstParameterToFunctions<INativeBrowserElementsService, Promise<unknown> /* only methods, not events */, number | undefined /* window ID */> { }

interface NodeDataResponse {
	outerHTML: string;
	computedStyle: string;
	bounds: IRectangle;
}

export class NativeBrowserElementsMainService extends Disposable implements INativeBrowserElementsMainService {
	_serviceBrand: undefined;

	currentLocalAddress: string | undefined;

	constructor(
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService,
		@IAuxiliaryWindowsMainService private readonly auxiliaryWindowsMainService: IAuxiliaryWindowsMainService,

	) {
		super();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 40: Error message without production error code - breaks React bundle size optimization
//   2. Line 40: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 59: Error message without production error code - breaks React bundle size optimization
//   2. Line 59: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	get windowId(): never { throw new Error('Not implemented in electron-main'); }

	async findWebviewTarget(debuggers: any, windowId: number, browserType: BrowserType): Promise<string | undefined> {
		const { targetInfos } = await debuggers.sendCommand('Target.getTargets');
		let target: typeof targetInfos[number] | undefined = undefined;
		const matchingTarget = targetInfos.find((targetInfo: { url: string }) => {
			try {
				const url = new URL(targetInfo.url);
				if (browserType === BrowserType.LiveServer) {
					return url.searchParams.get('id') && url.searchParams.get('extensionId') === 'ms-vscode.live-server';
				} else if (browserType === BrowserType.SimpleBrowser) {
					return url.searchParams.get('parentId') === windowId.toString() && url.searchParams.get('extensionId') === 'vscode.simple-browser';
				}
				return false;
			} catch (err) {
				return false;
			}
		});

		// search for webview via search parameters
		if (matchingTarget) {
			let resultId: string | undefined;
			let url: URL | undefined;
			try {
				url = new URL(matchingTarget.url);
				resultId = url.searchParams.get('id')!;
			} catch (e) {
				return undefined;
			}

			target = targetInfos.find((targetInfo: { url: string }) => {
				try {
					const url = new URL(targetInfo.url);
					const isLiveServer = browserType === BrowserType.LiveServer && url.searchParams.get('serverWindowId') === resultId;
					const isSimpleBrowser = browserType === BrowserType.SimpleBrowser && url.searchParams.get('id') === resultId && url.searchParams.has('vscodeBrowserReqId');
					if (isLiveServer || isSimpleBrowser) {
						this.currentLocalAddress = url.origin;
						return true;
					}
					return false;
				} catch (e) {
					return false;
				}
			});

			if (target) {
				return target.targetId;
			}
		}

		// fallback: search for webview without parameters based on current origin
		target = targetInfos.find((targetInfo: { url: string }) => {
			try {
				const url = new URL(targetInfo.url);
				return (this.currentLocalAddress === url.origin);
			} catch (e) {
				return false;
			}
		});

		if (!target) {
			return undefined;
		}

		return target.targetId;
	}

	async waitForWebviewTargets(debuggers: any, windowId: number, browserType: BrowserType): Promise<any> {
		const start = Date.now();
		const timeout = 10000;

		while (Date.now() - start < timeout) {
			const targetId = await this.findWebviewTarget(debuggers, windowId, browserType);
			if (targetId) {
				return targetId;
			}

			// Wait for a short period before checking again
			await new Promise(resolve => setTimeout(resolve, 500));
		}

		debuggers.detach();
		return undefined;
	}

	async startDebugSession(windowId: number | undefined, token: CancellationToken, browserType: BrowserType, cancelAndDetachId?: number): Promise<void> {
		const window = this.windowById(windowId);
		if (!window?.win) {
			return undefined;
		}

		// Find the simple browser webview
		const allWebContents = webContents.getAllWebContents();
		const simpleBrowserWebview = allWebContents.find(webContent => webContent.id === window.id);

		if (!simpleBrowserWebview) {
			return undefined;
		}

		const debuggers = simpleBrowserWebview.debugger;
		if (!debuggers.isAttached()) {
			debuggers.attach();
		}

		try {
			const matchingTargetId = await this.waitForWebviewTargets(debuggers, windowId!, browserType);
			if (!matchingTargetId) {
				if (debuggers.isAttached()) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 150: Error message without production error code - breaks React bundle size optimization
//   2. Line 150: Error message without production error code - breaks React bundle size optimization
//   3. Line 157: Error message without production error code - breaks React bundle size optimization
//   4. Line 157: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					debuggers.detach();
				}
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 181: Error message without production error code - breaks React bundle size optimization
//   2. Line 181: Error message without production error code - breaks React bundle size optimization
//   3. Line 188: Error message without production error code - breaks React bundle size optimization
//   4. Line 188: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 203: Error message without production error code - breaks React bundle size optimization
//   2. Line 203: Error message without production error code - breaks React bundle size optimization
//   3. Line 210: Error message without production error code - breaks React bundle size optimization
//   4. Line 210: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 215: Error message without production error code - breaks React bundle size optimization
//   2. Line 215: Error message without production error code - breaks React bundle size optimization
//   3. Line 222: Error message without production error code - breaks React bundle size optimization
//   4. Line 222: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 227: Error message without production error code - breaks React bundle size optimization
//   2. Line 227: Error message without production error code - breaks React bundle size optimization
//   3. Line 234: Error message without production error code - breaks React bundle size optimization
//   4. Line 234: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 239: Error message without production error code - breaks React bundle size optimization
//   2. Line 239: Error message without production error code - breaks React bundle size optimization
//   3. Line 246: Error message without production error code - breaks React bundle size optimization
//   4. Line 246: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 251: Error message without production error code - breaks React bundle size optimization
//   2. Line 251: Error message without production error code - breaks React bundle size optimization
//   3. Line 258: Error message without production error code - breaks React bundle size optimization
//   4. Line 258: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 263: Error message without production error code - breaks React bundle size optimization
//   2. Line 263: Error message without production error code - breaks React bundle size optimization
//   3. Line 270: Error message without production error code - breaks React bundle size optimization
//   4. Line 270: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 275: Error message without production error code - breaks React bundle size optimization
//   2. Line 275: Error message without production error code - breaks React bundle size optimization
//   3. Line 282: Error message without production error code - breaks React bundle size optimization
//   4. Line 282: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 287: Error message without production error code - breaks React bundle size optimization
//   2. Line 287: Error message without production error code - breaks React bundle size optimization
//   3. Line 294: Error message without production error code - breaks React bundle size optimization
//   4. Line 294: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 299: Error message without production error code - breaks React bundle size optimization
//   2. Line 299: Error message without production error code - breaks React bundle size optimization
//   3. Line 306: Error message without production error code - breaks React bundle size optimization
//   4. Line 306: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 311: Error message without production error code - breaks React bundle size optimization
//   2. Line 311: Error message without production error code - breaks React bundle size optimization
//   3. Line 318: Error message without production error code - breaks React bundle size optimization
//   4. Line 318: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 323: Error message without production error code - breaks React bundle size optimization
//   2. Line 323: Error message without production error code - breaks React bundle size optimization
//   3. Line 330: Error message without production error code - breaks React bundle size optimization
//   4. Line 330: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

				throw new Error('No target found');
			}

		} catch (e) {
			if (debuggers.isAttached()) {
				debuggers.detach();
			}
			throw new Error('No target found');
		}

		window.win.webContents.on('ipc-message', async (event, channel, closedCancelAndDetachId) => {
			if (channel === `vscode:cancelCurrentSession${cancelAndDetachId}`) {
				if (cancelAndDetachId !== closedCancelAndDetachId) {
					return;
				}
				if (debuggers.isAttached()) {
					debuggers.detach();
				}
				if (window.win) {
					window.win.webContents.removeAllListeners('ipc-message');
				}
			}
		});
	}

	async finishOverlay(debuggers: any, sessionId: string | undefined): Promise<void> {
		if (debuggers.isAttached() && sessionId) {
			await debuggers.sendCommand('Overlay.setInspectMode', {
				mode: 'none',
				highlightConfig: {
					showInfo: false,
					showStyles: false
				}
			}, sessionId);
			await debuggers.sendCommand('Overlay.hideHighlight', {}, sessionId);
			await debuggers.sendCommand('Overlay.disable', {}, sessionId);
			debuggers.detach();
		}
	}

	async getElementData(windowId: number | undefined, rect: IRectangle, token: CancellationToken, browserType: BrowserType, cancellationId?: number): Promise<IElementData | undefined> {
		const window = this.windowById(windowId);
		if (!window?.win) {
			return undefined;
		}

		// Find the simple browser webview
		const allWebContents = webContents.getAllWebContents();
		const simpleBrowserWebview = allWebContents.find(webContent => webContent.id === window.id);

		if (!simpleBrowserWebview) {
			return undefined;
		}

		const debuggers = simpleBrowserWebview.debugger;
		if (!debuggers.isAttached()) {
			debuggers.attach();
		}

		let targetSessionId: string | undefined = undefined;
		try {
			const targetId = await this.findWebviewTarget(debuggers, windowId!, browserType);
			const { sessionId } = await debuggers.sendCommand('Target.attachToTarget', {
				targetId: targetId,
				flatten: true,
			});

			targetSessionId = sessionId;

			await debuggers.sendCommand('DOM.enable', {}, sessionId);
			await debuggers.sendCommand('CSS.enable', {}, sessionId);
			await debuggers.sendCommand('Overlay.enable', {}, sessionId);
			await debuggers.sendCommand('Debugger.enable', {}, sessionId);
			await debuggers.sendCommand('Runtime.enable', {}, sessionId);

			await debuggers.sendCommand('Runtime.evaluate', {
				expression: `(function() {
							const style = document.createElement('style');
							style.id = '__pseudoBlocker__';
							style.textContent = '*::before, *::after { pointer-events: none !important; }';
							document.head.appendChild(style);
						})();`,
			}, sessionId);

			// slightly changed default CDP debugger inspect colors
			await debuggers.sendCommand('Overlay.setInspectMode', {
				mode: 'searchForNode',
				highlightConfig: {
					showInfo: true,
					showRulers: false,
					showStyles: true,
					showAccessibilityInfo: true,
					showExtensionLines: false,
					contrastAlgorithm: 'aa',
					contentColor: { r: 173, g: 216, b: 255, a: 0.8 },
					paddingColor: { r: 150, g: 200, b: 255, a: 0.5 },
					borderColor: { r: 120, g: 180, b: 255, a: 0.7 },
					marginColor: { r: 200, g: 220, b: 255, a: 0.4 },
					eventTargetColor: { r: 130, g: 160, b: 255, a: 0.8 },
					shapeColor: { r: 130, g: 160, b: 255, a: 0.8 },
					shapeMarginColor: { r: 130, g: 160, b: 255, a: 0.5 },
					gridHighlightConfig: {
						rowGapColor: { r: 140, g: 190, b: 255, a: 0.3 },
						rowHatchColor: { r: 140, g: 190, b: 255, a: 0.7 },
						columnGapColor: { r: 140, g: 190, b: 255, a: 0.3 },
						columnHatchColor: { r: 140, g: 190, b: 255, a: 0.7 },
						rowLineColor: { r: 120, g: 180, b: 255 },
						columnLineColor: { r: 120, g: 180, b: 255 },
						rowLineDash: true,
						columnLineDash: true
					},
					flexContainerHighlightConfig: {
						containerBorder: {
							color: { r: 120, g: 180, b: 255 },
							pattern: 'solid'
						},
						itemSeparator: {
							color: { r: 140, g: 190, b: 255 },
							pattern: 'solid'
						},
						lineSeparator: {
							color: { r: 140, g: 190, b: 255 },
							pattern: 'solid'
						},
						mainDistributedSpace: {
							hatchColor: { r: 140, g: 190, b: 255, a: 0.7 },
							fillColor: { r: 140, g: 190, b: 255, a: 0.4 }
						},
						crossDistributedSpace: {
							hatchColor: { r: 140, g: 190, b: 255, a: 0.7 },
							fillColor: { r: 140, g: 190, b: 255, a: 0.4 }
						},
						rowGapSpace: {
							hatchColor: { r: 140, g: 190, b: 255, a: 0.7 },
							fillColor: { r: 140, g: 190, b: 255, a: 0.4 }
						},
						columnGapSpace: {
							hatchColor: { r: 140, g: 190, b: 255, a: 0.7 },
							fillColor: { r: 140, g: 190, b: 255, a: 0.4 }
						}
					},
					flexItemHighlightConfig: {
						baseSizeBox: {
							hatchColor: { r: 130, g: 170, b: 255, a: 0.6 }
						},
						baseSizeBorder: {
							color: { r: 120, g: 180, b: 255 },
							pattern: 'solid'
						},
						flexibilityArrow: {
							color: { r: 130, g: 190, b: 255 }
						}
					},
				},
			}, sessionId);
		} catch (e) {
			debuggers.detach();
			throw new Error('No target found', e);
		}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 312: Error message without production error code - breaks React bundle size optimization
//   2. Line 312: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		if (!targetSessionId) {
			debuggers.detach();
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 353: Error message without production error code - breaks React bundle size optimization
//   2. Line 353: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

			throw new Error('No target session id found');
		}

		const nodeData = await this.getNodeData(targetSessionId, debuggers, window.win, cancellationId);
		await this.finishOverlay(debuggers, targetSessionId);

		const zoomFactor = simpleBrowserWebview.getZoomFactor();
		const absoluteBounds = {
			x: rect.x + nodeData.bounds.x,
			y: rect.y + nodeData.bounds.y,
			width: nodeData.bounds.width,
			height: nodeData.bounds.height
		};

		const clippedBounds = {
			x: Math.max(absoluteBounds.x, rect.x),
			y: Math.max(absoluteBounds.y, rect.y),
			width: Math.max(0, Math.min(absoluteBounds.x + absoluteBounds.width, rect.x + rect.width) - Math.max(absoluteBounds.x, rect.x)),
			height: Math.max(0, Math.min(absoluteBounds.y + absoluteBounds.height, rect.y + rect.height) - Math.max(absoluteBounds.y, rect.y))
		};

		const scaledBounds = {
			x: clippedBounds.x * zoomFactor,
			y: clippedBounds.y * zoomFactor,
			width: clippedBounds.width * zoomFactor,
			height: clippedBounds.height * zoomFactor
		};

		return { outerHTML: nodeData.outerHTML, computedStyle: nodeData.computedStyle, bounds: scaledBounds };
	}

	async getNodeData(sessionId: string, debuggers: any, window: BrowserWindow, cancellationId?: number): Promise<NodeDataResponse> {
		return new Promise((resolve, reject) => {
			const onMessage = async (event: any, method: string, params: { backendNodeId: number }) => {
				if (method === 'Overlay.inspectNodeRequested') {
					debuggers.off('message', onMessage);
					await debuggers.sendCommand('Runtime.evaluate', {
						expression: `(() => {
										const style = document.getElementById('__pseudoBlocker__');
										if (style) style.remove();
									})();`,
					}, sessionId);

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 357: Error message without production error code - breaks React bundle size optimization
//   2. Line 357: Error message without production error code - breaks React bundle size optimization
//   3. Line 364: Error message without production error code - breaks React bundle size optimization
//   4. Line 364: Error message without production error code - breaks React bundle size optimization
//   5. Line 370: Error message without production error code - breaks React bundle size optimization
//   6. Line 370: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

					const backendNodeId = params?.backendNodeId;
					if (!backendNodeId) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 412: Error message without production error code - breaks React bundle size optimization
//   2. Line 412: Error message without production error code - breaks React bundle size optimization
//   3. Line 419: Error message without production error code - breaks React bundle size optimization
//   4. Line 419: Error message without production error code - breaks React bundle size optimization
//   5. Line 425: Error message without production error code - breaks React bundle size optimization
//   6. Line 425: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 458: Error message without production error code - breaks React bundle size optimization
//   2. Line 458: Error message without production error code - breaks React bundle size optimization
//   3. Line 465: Error message without production error code - breaks React bundle size optimization
//   4. Line 465: Error message without production error code - breaks React bundle size optimization
//   5. Line 471: Error message without production error code - breaks React bundle size optimization
//   6. Line 471: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 484: Error message without production error code - breaks React bundle size optimization
//   2. Line 484: Error message without production error code - breaks React bundle size optimization
//   3. Line 491: Error message without production error code - breaks React bundle size optimization
//   4. Line 491: Error message without production error code - breaks React bundle size optimization
//   5. Line 497: Error message without production error code - breaks React bundle size optimization
//   6. Line 497: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 510: Error message without production error code - breaks React bundle size optimization
//   2. Line 510: Error message without production error code - breaks React bundle size optimization
//   3. Line 517: Error message without production error code - breaks React bundle size optimization
//   4. Line 517: Error message without production error code - breaks React bundle size optimization
//   5. Line 523: Error message without production error code - breaks React bundle size optimization
//   6. Line 523: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 536: Error message without production error code - breaks React bundle size optimization
//   2. Line 536: Error message without production error code - breaks React bundle size optimization
//   3. Line 543: Error message without production error code - breaks React bundle size optimization
//   4. Line 543: Error message without production error code - breaks React bundle size optimization
//   5. Line 549: Error message without production error code - breaks React bundle size optimization
//   6. Line 549: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 562: Error message without production error code - breaks React bundle size optimization
//   2. Line 562: Error message without production error code - breaks React bundle size optimization
//   3. Line 569: Error message without production error code - breaks React bundle size optimization
//   4. Line 569: Error message without production error code - breaks React bundle size optimization
//   5. Line 575: Error message without production error code - breaks React bundle size optimization
//   6. Line 575: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 588: Error message without production error code - breaks React bundle size optimization
//   2. Line 588: Error message without production error code - breaks React bundle size optimization
//   3. Line 595: Error message without production error code - breaks React bundle size optimization
//   4. Line 595: Error message without production error code - breaks React bundle size optimization
//   5. Line 601: Error message without production error code - breaks React bundle size optimization
//   6. Line 601: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 614: Error message without production error code - breaks React bundle size optimization
//   2. Line 614: Error message without production error code - breaks React bundle size optimization
//   3. Line 621: Error message without production error code - breaks React bundle size optimization
//   4. Line 621: Error message without production error code - breaks React bundle size optimization
//   5. Line 627: Error message without production error code - breaks React bundle size optimization
//   6. Line 627: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 640: Error message without production error code - breaks React bundle size optimization
//   2. Line 640: Error message without production error code - breaks React bundle size optimization
//   3. Line 647: Error message without production error code - breaks React bundle size optimization
//   4. Line 647: Error message without production error code - breaks React bundle size optimization
//   5. Line 653: Error message without production error code - breaks React bundle size optimization
//   6. Line 653: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 666: Error message without production error code - breaks React bundle size optimization
//   2. Line 666: Error message without production error code - breaks React bundle size optimization
//   3. Line 673: Error message without production error code - breaks React bundle size optimization
//   4. Line 673: Error message without production error code - breaks React bundle size optimization
//   5. Line 679: Error message without production error code - breaks React bundle size optimization
//   6. Line 679: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 692: Error message without production error code - breaks React bundle size optimization
//   2. Line 692: Error message without production error code - breaks React bundle size optimization
//   3. Line 699: Error message without production error code - breaks React bundle size optimization
//   4. Line 699: Error message without production error code - breaks React bundle size optimization
//   5. Line 705: Error message without production error code - breaks React bundle size optimization
//   6. Line 705: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (6):
//   1. Line 718: Error message without production error code - breaks React bundle size optimization
//   2. Line 718: Error message without production error code - breaks React bundle size optimization
//   3. Line 725: Error message without production error code - breaks React bundle size optimization
//   4. Line 725: Error message without production error code - breaks React bundle size optimization
//   5. Line 731: Error message without production error code - breaks React bundle size optimization
//   6. Line 731: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

						throw new Error('Missing backendNodeId in inspectNodeRequested event');
					}

					try {
						await debuggers.sendCommand('DOM.getDocument', {}, sessionId);
						const { nodeIds } = await debuggers.sendCommand('DOM.pushNodesByBackendIdsToFrontend', { backendNodeIds: [backendNodeId] }, sessionId);
						if (!nodeIds || nodeIds.length === 0) {
							throw new Error('Failed to get node IDs.');
						}
						const nodeId = nodeIds[0];

						const { model } = await debuggers.sendCommand('DOM.getBoxModel', { nodeId }, sessionId);
						if (!model) {
							throw new Error('Failed to get box model.');
						}

						const content = model.content;
						const margin = model.margin;
						const x = Math.min(margin[0], content[0]);
						const y = Math.min(margin[1], content[1]) + 32.4; // 32.4 is height of the title bar
						const width = Math.max(margin[2] - margin[0], content[2] - content[0]);
						const height = Math.max(margin[5] - margin[1], content[5] - content[1]);

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 382: Error message without production error code - breaks React bundle size optimization
//   2. Line 382: Error message without production error code - breaks React bundle size optimization
//   3. Line 388: Error message without production error code - breaks React bundle size optimization
//   4. Line 388: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

						const matched = await debuggers.sendCommand('CSS.getMatchedStylesForNode', { nodeId }, sessionId);
						if (!matched) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 449: Error message without production error code - breaks React bundle size optimization
//   2. Line 449: Error message without production error code - breaks React bundle size optimization
//   3. Line 455: Error message without production error code - breaks React bundle size optimization
//   4. Line 455: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 507: Error message without production error code - breaks React bundle size optimization
//   2. Line 507: Error message without production error code - breaks React bundle size optimization
//   3. Line 513: Error message without production error code - breaks React bundle size optimization
//   4. Line 513: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 545: Error message without production error code - breaks React bundle size optimization
//   2. Line 545: Error message without production error code - breaks React bundle size optimization
//   3. Line 551: Error message without production error code - breaks React bundle size optimization
//   4. Line 551: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 583: Error message without production error code - breaks React bundle size optimization
//   2. Line 583: Error message without production error code - breaks React bundle size optimization
//   3. Line 589: Error message without production error code - breaks React bundle size optimization
//   4. Line 589: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 621: Error message without production error code - breaks React bundle size optimization
//   2. Line 621: Error message without production error code - breaks React bundle size optimization
//   3. Line 627: Error message without production error code - breaks React bundle size optimization
//   4. Line 627: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 659: Error message without production error code - breaks React bundle size optimization
//   2. Line 659: Error message without production error code - breaks React bundle size optimization
//   3. Line 665: Error message without production error code - breaks React bundle size optimization
//   4. Line 665: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 697: Error message without production error code - breaks React bundle size optimization
//   2. Line 697: Error message without production error code - breaks React bundle size optimization
//   3. Line 703: Error message without production error code - breaks React bundle size optimization
//   4. Line 703: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 735: Error message without production error code - breaks React bundle size optimization
//   2. Line 735: Error message without production error code - breaks React bundle size optimization
//   3. Line 741: Error message without production error code - breaks React bundle size optimization
//   4. Line 741: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 773: Error message without production error code - breaks React bundle size optimization
//   2. Line 773: Error message without production error code - breaks React bundle size optimization
//   3. Line 779: Error message without production error code - breaks React bundle size optimization
//   4. Line 779: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 811: Error message without production error code - breaks React bundle size optimization
//   2. Line 811: Error message without production error code - breaks React bundle size optimization
//   3. Line 817: Error message without production error code - breaks React bundle size optimization
//   4. Line 817: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 849: Error message without production error code - breaks React bundle size optimization
//   2. Line 849: Error message without production error code - breaks React bundle size optimization
//   3. Line 855: Error message without production error code - breaks React bundle size optimization
//   4. Line 855: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (4):
//   1. Line 887: Error message without production error code - breaks React bundle size optimization
//   2. Line 887: Error message without production error code - breaks React bundle size optimization
//   3. Line 893: Error message without production error code - breaks React bundle size optimization
//   4. Line 893: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

							throw new Error('Failed to get matched css.');
						}

						const formatted = this.formatMatchedStyles(matched);
						const { outerHTML } = await debuggers.sendCommand('DOM.getOuterHTML', { nodeId }, sessionId);
						if (!outerHTML) {
							throw new Error('Failed to get outerHTML.');
						}

						resolve({
							outerHTML,
							computedStyle: formatted,
							bounds: { x, y, width, height }
						});
					} catch (err) {
						debuggers.off('message', onMessage);
						debuggers.detach();
						reject(err);
					}
				}
			};

			window.webContents.on('ipc-message', async (event, channel, closedCancellationId) => {
				if (channel === `vscode:cancelElementSelection${cancellationId}`) {
					if (cancellationId !== closedCancellationId) {
						return;
					}
					debuggers.off('message', onMessage);
					await this.finishOverlay(debuggers, sessionId);
					window.webContents.removeAllListeners('ipc-message');
				}
			});

			debuggers.on('message', onMessage);
		});
	}

	formatMatchedStyles(matched: any): string {
		const lines: string[] = [];

		// inline
		if (matched.inlineStyle?.cssProperties?.length) {
			lines.push('/* Inline style */');
			lines.push('element {');
			for (const prop of matched.inlineStyle.cssProperties) {
				if (prop.name && prop.value) {
					lines.push(`  ${prop.name}: ${prop.value};`);
				}
			}
			lines.push('}\n');
		}

		// matched
		if (matched.matchedCSSRules?.length) {
			for (const ruleEntry of matched.matchedCSSRules) {
				const rule = ruleEntry.rule;
				const selectors = rule.selectorList.selectors.map((s: any) => s.text).join(', ');
				lines.push(`/* Matched Rule from ${rule.origin} */`);
				lines.push(`${selectors} {`);
				for (const prop of rule.style.cssProperties) {
					if (prop.name && prop.value) {
						lines.push(`  ${prop.name}: ${prop.value};`);
					}
				}
				lines.push('}\n');
			}
		}

		// inherited rules
		if (matched.inherited?.length) {
			let level = 1;
			for (const inherited of matched.inherited) {
				const rules = inherited.matchedCSSRules || [];
				for (const ruleEntry of rules) {
					const rule = ruleEntry.rule;
					const selectors = rule.selectorList.selectors.map((s: any) => s.text).join(', ');
					lines.push(`/* Inherited from ancestor level ${level} (${rule.origin}) */`);
					lines.push(`${selectors} {`);
					for (const prop of rule.style.cssProperties) {
						if (prop.name && prop.value) {
							lines.push(`  ${prop.name}: ${prop.value};`);
						}
					}
					lines.push('}\n');
				}
				level++;
			}
		}

		return '\n' + lines.join('\n');
	}

	private windowById(windowId: number | undefined, fallbackCodeWindowId?: number): ICodeWindow | IAuxiliaryWindow | undefined {
		return this.codeWindowById(windowId) ?? this.auxiliaryWindowById(windowId) ?? this.codeWindowById(fallbackCodeWindowId);
	}

	private codeWindowById(windowId: number | undefined): ICodeWindow | undefined {
		if (typeof windowId !== 'number') {
			return undefined;
		}

		return this.windowsMainService.getWindowById(windowId);
	}

	private auxiliaryWindowById(windowId: number | undefined): IAuxiliaryWindow | undefined {
		if (typeof windowId !== 'number') {
			return undefined;
		}

		const contents = webContents.fromId(windowId);
		if (!contents) {
			return undefined;
		}

		return this.auxiliaryWindowsMainService.getWindowByWebContents(contents);
	}
}
