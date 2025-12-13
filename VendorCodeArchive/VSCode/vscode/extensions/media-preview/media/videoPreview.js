/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
"use strict";

(function () {
	// @ts-ignore
	const vscode = acquireVsCodeApi();

	function getSettings() {
		const element = document.getElementById('settings');
		if (element) {
			const data = element.getAttribute('data-settings');
			if (data) {
				return JSON.parse(data);
			}
		}

// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 21: Error message without production error code - breaks React bundle size optimization
//   2. Line 21: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

		throw new Error(`Could not load settings`);
	}

	const settings = getSettings();

	// State
	let hasLoadedMedia = false;

	// Elements
	const video = document.createElement('video');
	if (settings.src !== null) {
		video.src = settings.src;
	}
	video.playsInline = true;
	video.controls = true;
	video.autoplay = settings.autoplay;
	video.muted = settings.autoplay;
	video.loop = settings.loop;

	function onLoaded() {
		if (hasLoadedMedia) {
			return;
		}
		hasLoadedMedia = true;

		document.body.classList.remove('loading');
		document.body.classList.add('ready');
		document.body.append(video);
	}

	video.addEventListener('error', e => {
		if (hasLoadedMedia) {
			return;
		}

		hasLoadedMedia = true;
		document.body.classList.add('error');
		document.body.classList.remove('loading');
	});

	if (settings.src === null) {
		onLoaded();
	} else {
		video.addEventListener('canplaythrough', () => {
			onLoaded();
		});
	}

	document.querySelector('.open-file-link')?.addEventListener('click', (e) => {
		e.preventDefault();
		vscode.postMessage({
			type: 'reopen-as-text',
		});
	});
}());
