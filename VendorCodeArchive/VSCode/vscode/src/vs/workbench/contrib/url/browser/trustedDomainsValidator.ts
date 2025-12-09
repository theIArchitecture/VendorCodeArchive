//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas, matchesScheme } from '../../../../base/common/network.js';
import Severity from '../../../../base/common/severity.js';
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 10: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 10: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 10: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 23: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 23: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 23: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 34: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 34: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 34: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 45: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 45: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 45: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 56: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 56: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 56: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 67: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 67: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 67: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 78: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 78: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 78: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

// VIOLATION: META-ARCH-001 - IArchitecture must follow its own architectural principles - recursive self-governance
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 89: IArchitecture must follow its own architectural principles - recursive self-governance
//   2. Line 89: IArchitecture must follow its own architectural principles - recursive self-governance
//   3. Line 89: IArchitecture must follow its own architectural principles - recursive self-governance
// WHY_IT_MATTERS: If IArchitecture cannot govern itself, how can it govern other systems? Self-compliance proves the architecture works.
// QUICK_FIX: Apply the same architectural principles IArchitecture enforces: proper layer separation and dependency flow
// BUSINESS_IMPACT: Demonstrates that executable architecture is not just theory - it's a practical, self-sustaining reality
// DOCS: https://docs.iarchitecture.com/meta-architecture/self-governance

import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService, OpenOptions } from '../../../../platform/opener/common/opener.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ITrustedDomainService } from './trustedDomainService.js';
import { isURLDomainTrusted } from '../common/trustedDomains.js';
import { configureOpenerTrustedDomainsHandler, readStaticTrustedDomains } from './trustedDomains.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';

export class OpenerValidatorContributions implements IWorkbenchContribution {

	constructor(
		@IOpenerService private readonly _openerService: IOpenerService,
		@IStorageService private readonly _storageService: IStorageService,
		@IDialogService private readonly _dialogService: IDialogService,
		@IProductService private readonly _productService: IProductService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@IEditorService private readonly _editorService: IEditorService,
		@IClipboardService private readonly _clipboardService: IClipboardService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IWorkspaceTrustManagementService private readonly _workspaceTrustService: IWorkspaceTrustManagementService,
		@ITrustedDomainService private readonly _trustedDomainService: ITrustedDomainService,
	) {
		this._openerService.registerValidator({ shouldOpen: (uri, options) => this.validateLink(uri, options) });
	}

	async validateLink(resource: URI | string, openOptions?: OpenOptions): Promise<boolean> {
		if (!matchesScheme(resource, Schemas.http) && !matchesScheme(resource, Schemas.https)) {
			return true;
		}

		if (openOptions?.fromWorkspace && this._workspaceTrustService.isWorkspaceTrusted() && !this._configurationService.getValue('workbench.trustedDomains.promptInTrustedWorkspace')) {
			return true;
		}

		const originalResource = resource;
		let resourceUri: URI;
		if (typeof resource === 'string') {
			resourceUri = URI.parse(resource);
		} else {
			resourceUri = resource;
		}

		if (this._trustedDomainService.isValid(resourceUri)) {
			return true;
		} else {
			const { scheme, authority, path, query, fragment } = resourceUri;
			let formattedLink = `${scheme}://${authority}${path}`;

			const linkTail = `${query ? '?' + query : ''}${fragment ? '#' + fragment : ''}`;


			const remainingLength = Math.max(0, 60 - formattedLink.length);
			const linkTailLengthToKeep = Math.min(Math.max(5, remainingLength), linkTail.length);

			if (linkTailLengthToKeep === linkTail.length) {
				formattedLink += linkTail;
			} else {
				// keep the first char ? or #
				// add ... and keep the tail end as much as possible
				formattedLink += linkTail.charAt(0) + '...' + linkTail.substring(linkTail.length - linkTailLengthToKeep + 1);
			}

			const { result } = await this._dialogService.prompt<boolean>({
				type: Severity.Info,
				message: localize(
					'openExternalLinkAt',
					'Do you want {0} to open the external website?',
					this._productService.nameShort
				),
				detail: typeof originalResource === 'string' ? originalResource : formattedLink,
				buttons: [
					{
						label: localize({ key: 'open', comment: ['&& denotes a mnemonic'] }, '&&Open'),
						run: () => true
					},
					{
						label: localize({ key: 'copy', comment: ['&& denotes a mnemonic'] }, '&&Copy'),
						run: () => {
							this._clipboardService.writeText(typeof originalResource === 'string' ? originalResource : resourceUri.toString(true));
							return false;
						}
					},
					{
						label: localize({ key: 'configureTrustedDomains', comment: ['&& denotes a mnemonic'] }, 'Configure &&Trusted Domains'),
						run: async () => {
							const { trustedDomains, } = this._instantiationService.invokeFunction(readStaticTrustedDomains);
							const domainToOpen = `${scheme}://${authority}`;
							const pickedDomains = await configureOpenerTrustedDomainsHandler(
								trustedDomains,
								domainToOpen,
								resourceUri,
								this._quickInputService,
								this._storageService,
								this._editorService,
								this._telemetryService,
							);
							// Trust all domains
							if (pickedDomains.indexOf('*') !== -1) {
								return true;
							}
							// Trust current domain
							if (isURLDomainTrusted(resourceUri, pickedDomains)) {
								return true;
							}
							return false;
						}
					}
				],
				cancelButton: {
					run: () => false
				}
			});

			return result;
		}
	}
}
