//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { dirname, joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { INativeEnvironmentService } from '../../../environment/common/environment.js';
import { IExtensionsProfileScannerService, IProfileExtensionsScanOptions } from '../../common/extensionsProfileScannerService.js';
import { AbstractExtensionsScannerService, ExtensionScannerInput, IExtensionsScannerService, IScannedExtensionManifest, Translations } from '../../common/extensionsScannerService.js';
import { ExtensionsProfileScannerService } from '../../node/extensionsProfileScannerService.js';
import { ExtensionType, IExtensionManifest, TargetPlatform } from '../../../extensions/common/extensions.js';
import { IFileService } from '../../../files/common/files.js';
import { FileService } from '../../../files/common/fileService.js';
import { InMemoryFileSystemProvider } from '../../../files/common/inMemoryFilesystemProvider.js';
import { IInstantiationService } from '../../../instantiation/common/instantiation.js';
import { TestInstantiationService } from '../../../instantiation/test/common/instantiationServiceMock.js';
import { ILogService, NullLogService } from '../../../log/common/log.js';
import { IProductService } from '../../../product/common/productService.js';
import { IUriIdentityService } from '../../../uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../../uriIdentity/common/uriIdentityService.js';
import { IUserDataProfilesService, UserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';

let translations: Translations = Object.create(null);
const ROOT = URI.file('/ROOT');

class ExtensionsScannerService extends AbstractExtensionsScannerService implements IExtensionsScannerService {

	constructor(
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IExtensionsProfileScannerService extensionsProfileScannerService: IExtensionsProfileScannerService,
		@IFileService fileService: IFileService,
		@ILogService logService: ILogService,
		@INativeEnvironmentService nativeEnvironmentService: INativeEnvironmentService,
		@IProductService productService: IProductService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super(
			URI.file(nativeEnvironmentService.builtinExtensionsPath),
			URI.file(nativeEnvironmentService.extensionsPath),
			joinPath(nativeEnvironmentService.userHome, '.vscode-oss-dev', 'extensions', 'control.json'),
			userDataProfilesService.defaultProfile,
			userDataProfilesService, extensionsProfileScannerService, fileService, logService, nativeEnvironmentService, productService, uriIdentityService, instantiationService);
	}

	protected async getTranslations(language: string): Promise<Translations> {
		return translations;
	}

}

suite('NativeExtensionsScanerService Test', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let instantiationService: TestInstantiationService;

	setup(async () => {
		translations = {};
		instantiationService = disposables.add(new TestInstantiationService());
		const logService = new NullLogService();
		const fileService = disposables.add(new FileService(logService));
		const fileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		disposables.add(fileService.registerProvider(ROOT.scheme, fileSystemProvider));
		instantiationService.stub(ILogService, logService);
		instantiationService.stub(IFileService, fileService);
		const systemExtensionsLocation = joinPath(ROOT, 'system');
		const userExtensionsLocation = joinPath(ROOT, 'extensions');
		const environmentService = instantiationService.stub(INativeEnvironmentService, {
			userHome: ROOT,
			userRoamingDataHome: ROOT,
			builtinExtensionsPath: systemExtensionsLocation.fsPath,
			extensionsPath: userExtensionsLocation.fsPath,
			cacheHome: joinPath(ROOT, 'cache'),
		});
		instantiationService.stub(IProductService, { version: '1.66.0' });
		const uriIdentityService = disposables.add(new UriIdentityService(fileService));
		instantiationService.stub(IUriIdentityService, uriIdentityService);
		const userDataProfilesService = disposables.add(new UserDataProfilesService(environmentService, fileService, uriIdentityService, logService));
		instantiationService.stub(IUserDataProfilesService, userDataProfilesService);
		instantiationService.stub(IExtensionsProfileScannerService, disposables.add(new ExtensionsProfileScannerService(environmentService, fileService, userDataProfilesService, uriIdentityService, logService)));
		await fileService.createFolder(systemExtensionsLocation);
		await fileService.createFolder(userExtensionsLocation);
	});

	test('scan system extension', async () => {
		const manifest: Partial<IExtensionManifest> = anExtensionManifest({ 'name': 'name', 'publisher': 'pub' });
		const extensionLocation = await aSystemExtension(manifest);
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanSystemExtensions({});

		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[0].location.toString(), extensionLocation.toString());
		assert.deepStrictEqual(actual[0].isBuiltin, true);
		assert.deepStrictEqual(actual[0].type, ExtensionType.System);
		assert.deepStrictEqual(actual[0].isValid, true);
		assert.deepStrictEqual(actual[0].validations, []);
		assert.deepStrictEqual(actual[0].metadata, undefined);
		assert.deepStrictEqual(actual[0].targetPlatform, TargetPlatform.UNDEFINED);
		assert.deepStrictEqual(actual[0].manifest, manifest);
	});

	test('scan user extensions', async () => {
		const manifest: Partial<IScannedExtensionManifest> = anExtensionManifest({ 'name': 'name', 'publisher': 'pub' });
		const extensionLocation = await aUserExtension(manifest);
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanAllUserExtensions();

		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[0].location.toString(), extensionLocation.toString());
		assert.deepStrictEqual(actual[0].isBuiltin, false);
		assert.deepStrictEqual(actual[0].type, ExtensionType.User);
		assert.deepStrictEqual(actual[0].isValid, true);
		assert.deepStrictEqual(actual[0].validations, []);
		assert.deepStrictEqual(actual[0].metadata, undefined);
		assert.deepStrictEqual(actual[0].targetPlatform, TargetPlatform.UNDEFINED);
		delete manifest.__metadata;
		assert.deepStrictEqual(actual[0].manifest, manifest);
	});

	test('scan existing extension', async () => {
		const manifest: Partial<IExtensionManifest> = anExtensionManifest({ 'name': 'name', 'publisher': 'pub' });
		const extensionLocation = await aUserExtension(manifest);
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanExistingExtension(extensionLocation, ExtensionType.User, {});
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 135: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 136: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 137: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 138: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 139: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 140: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 141: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 142: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 143: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.notEqual(actual, null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 154: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 155: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 158: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 159: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 161: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 162: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 175: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 176: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 177: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 188: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 189: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 191: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 192: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 194: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 195: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 196: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 205: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 206: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 207: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 208: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 209: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 213: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 224: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 225: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 226: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 227: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 230: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 239: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 241: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 242: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 245: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 256: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 257: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 258: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 261: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 262: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 263: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 264: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 273: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 274: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 275: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 276: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 278: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 280: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 281: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 290: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 292: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 293: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 294: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 295: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 296: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 297: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 307: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 308: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 309: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 310: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 311: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 313: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 315: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 325: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 326: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 327: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 328: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 329: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 330: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 331: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 332: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 341: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 342: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 343: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 344: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 345: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 346: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 349: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 358: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 359: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 360: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 361: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 362: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 363: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 364: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 365: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 366: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 376: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 378: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 381: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 382: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 392: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 393: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 394: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 395: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 396: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 397: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 399: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 400: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (9):
//   1. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 410: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 411: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 412: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 413: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 414: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 415: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 417: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.deepStrictEqual(actual!.identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual!.location.toString(), extensionLocation.toString());
		assert.deepStrictEqual(actual!.isBuiltin, false);
		assert.deepStrictEqual(actual!.type, ExtensionType.User);
		assert.deepStrictEqual(actual!.isValid, true);
		assert.deepStrictEqual(actual!.validations, []);
		assert.deepStrictEqual(actual!.metadata, undefined);
		assert.deepStrictEqual(actual!.targetPlatform, TargetPlatform.UNDEFINED);
		assert.deepStrictEqual(actual!.manifest, manifest);
	});

	test('scan single extension', async () => {
		const manifest: Partial<IExtensionManifest> = anExtensionManifest({ 'name': 'name', 'publisher': 'pub' });
		const extensionLocation = await aUserExtension(manifest);
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanOneOrMultipleExtensions(extensionLocation, ExtensionType.User, {});

		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[0].location.toString(), extensionLocation.toString());
		assert.deepStrictEqual(actual[0].isBuiltin, false);
		assert.deepStrictEqual(actual[0].type, ExtensionType.User);
		assert.deepStrictEqual(actual[0].isValid, true);
		assert.deepStrictEqual(actual[0].validations, []);
		assert.deepStrictEqual(actual[0].metadata, undefined);
		assert.deepStrictEqual(actual[0].targetPlatform, TargetPlatform.UNDEFINED);
		assert.deepStrictEqual(actual[0].manifest, manifest);
	});

	test('scan multiple extensions', async () => {
		const extensionLocation = await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub' }));
		await aUserExtension(anExtensionManifest({ 'name': 'name2', 'publisher': 'pub' }));
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanOneOrMultipleExtensions(dirname(extensionLocation), ExtensionType.User, {});

		assert.deepStrictEqual(actual.length, 2);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[1].identifier, { id: 'pub.name2' });
	});

	test('scan all user extensions with different versions', async () => {
		await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', version: '1.0.1' }));
		await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', version: '1.0.2' }));
		const testObject = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanAllUserExtensions({ includeAllVersions: false, includeInvalid: false });

		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[0].manifest.version, '1.0.2');
	});

	test('scan all user extensions include all versions', async () => {
		await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', version: '1.0.1' }));
		await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', version: '1.0.2' }));
		const testObject = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanAllUserExtensions();

		assert.deepStrictEqual(actual.length, 2);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[0].manifest.version, '1.0.1');
		assert.deepStrictEqual(actual[1].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[1].manifest.version, '1.0.2');
	});

	test('scan all user extensions with different versions and higher version is not compatible', async () => {
		await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', version: '1.0.1' }));
		await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', version: '1.0.2', engines: { vscode: '^1.67.0' } }));
		const testObject = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanAllUserExtensions({ includeAllVersions: false, includeInvalid: false });

		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[0].manifest.version, '1.0.1');
	});

	test('scan all user extensions exclude invalid extensions', async () => {
		await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub' }));
		await aUserExtension(anExtensionManifest({ 'name': 'name2', 'publisher': 'pub', engines: { vscode: '^1.67.0' } }));
		const testObject = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanAllUserExtensions({ includeAllVersions: false, includeInvalid: false });

		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
	});

	test('scan all user extensions include invalid extensions', async () => {
		await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub' }));
		await aUserExtension(anExtensionManifest({ 'name': 'name2', 'publisher': 'pub', engines: { vscode: '^1.67.0' } }));
		const testObject = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanAllUserExtensions({ includeAllVersions: false, includeInvalid: true });

		assert.deepStrictEqual(actual.length, 2);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[1].identifier, { id: 'pub.name2' });
	});

	test('scan system extensions include additional builtin extensions', async () => {
		instantiationService.stub(IProductService, {
			version: '1.66.0',
			builtInExtensions: [
				{ name: 'pub.name2', version: '', repo: '', metadata: undefined },
				{ name: 'pub.name', version: '', repo: '', metadata: undefined }
			]
		});
		await anExtension(anExtensionManifest({ 'name': 'name2', 'publisher': 'pub' }), joinPath(ROOT, 'additional'));
		const extensionLocation = await anExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub' }), joinPath(ROOT, 'additional'));
		await aSystemExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', version: '1.0.1' }));
		await instantiationService.get(IFileService).writeFile(joinPath(instantiationService.get(INativeEnvironmentService).userHome, '.vscode-oss-dev', 'extensions', 'control.json'), VSBuffer.fromString(JSON.stringify({ 'pub.name2': 'disabled', 'pub.name': extensionLocation.fsPath })));
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanSystemExtensions({ checkControlFile: true });

		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[0].manifest.version, '1.0.0');
	});

	test('scan all user extensions with default nls replacements', async () => {
		const extensionLocation = await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', displayName: '%displayName%' }));
		await instantiationService.get(IFileService).writeFile(joinPath(extensionLocation, 'package.nls.json'), VSBuffer.fromString(JSON.stringify({ displayName: 'Hello World' })));
		const testObject = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanAllUserExtensions();

		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[0].manifest.displayName, 'Hello World');
	});

	test('scan extension with en nls replacements', async () => {
		const extensionLocation = await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', displayName: '%displayName%' }));
		await instantiationService.get(IFileService).writeFile(joinPath(extensionLocation, 'package.nls.json'), VSBuffer.fromString(JSON.stringify({ displayName: 'Hello World' })));
		const nlsLocation = joinPath(extensionLocation, 'package.en.json');
		await instantiationService.get(IFileService).writeFile(nlsLocation, VSBuffer.fromString(JSON.stringify({ contents: { package: { displayName: 'Hello World EN' } } })));
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		translations = { 'pub.name': nlsLocation.fsPath };
		const actual = await testObject.scanExistingExtension(extensionLocation, ExtensionType.User, { language: 'en' });
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 282: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 283: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.ok(actual !== null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 311: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.deepStrictEqual(actual!.identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual!.manifest.displayName, 'Hello World EN');
	});

	test('scan extension falls back to default nls replacements', async () => {
		const extensionLocation = await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', displayName: '%displayName%' }));
		await instantiationService.get(IFileService).writeFile(joinPath(extensionLocation, 'package.nls.json'), VSBuffer.fromString(JSON.stringify({ displayName: 'Hello World' })));
		const nlsLocation = joinPath(extensionLocation, 'package.en.json');
		await instantiationService.get(IFileService).writeFile(nlsLocation, VSBuffer.fromString(JSON.stringify({ contents: { package: { displayName: 'Hello World EN' } } })));
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		translations = { 'pub.name2': nlsLocation.fsPath };
		const actual = await testObject.scanExistingExtension(extensionLocation, ExtensionType.User, { language: 'en' });
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 297: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.ok(actual !== null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 336: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 337: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.deepStrictEqual(actual!.identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual!.manifest.displayName, 'Hello World');
	});

	test('scan single extension with manifest metadata retains manifest metadata', async () => {
		const manifest: Partial<IExtensionManifest> = anExtensionManifest({ 'name': 'name', 'publisher': 'pub' });
		const expectedMetadata = { size: 12345, installedTimestamp: 1234567890, targetPlatform: TargetPlatform.DARWIN_ARM64 };
		const extensionLocation = await aUserExtension({
			...manifest,
			__metadata: expectedMetadata
		});
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanExistingExtension(extensionLocation, ExtensionType.User, {});
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 313: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 315: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 316: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 317: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 318: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 319: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 320: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		assert.notStrictEqual(actual, null);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 369: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 370: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 371: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 372: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 373: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 374: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 421: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 422: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 423: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 424: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 425: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 426: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 428: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 454: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 455: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 458: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 459: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 460: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 461: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 487: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 488: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 490: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 491: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 492: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 493: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 494: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 520: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 521: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 522: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 523: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 524: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 525: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 526: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 527: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 553: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 554: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 555: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 556: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 557: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 558: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 559: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 560: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 586: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 587: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 588: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 589: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 590: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 591: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 592: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 593: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 619: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 620: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 621: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 622: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 623: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 624: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 625: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 626: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 652: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 653: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 654: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 655: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 656: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 657: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 658: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 659: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 685: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 686: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 687: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 688: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 689: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 690: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 691: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 692: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 718: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 719: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 720: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 721: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 722: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 723: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 724: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 725: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 751: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 752: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 753: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 754: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 755: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 756: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 757: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 758: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 784: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 785: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 786: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 787: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 788: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 789: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 790: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 791: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 817: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 818: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 819: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 820: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 821: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 822: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 823: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 824: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 850: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 851: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 852: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 853: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 854: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 855: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 856: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 857: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 883: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 884: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 885: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 886: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 887: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 888: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 889: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 890: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.deepStrictEqual(actual!.identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual!.location.toString(), extensionLocation.toString());
		assert.deepStrictEqual(actual!.isBuiltin, false);
		assert.deepStrictEqual(actual!.type, ExtensionType.User);
		assert.deepStrictEqual(actual!.isValid, true);
		assert.deepStrictEqual(actual!.validations, []);
		assert.deepStrictEqual(actual!.metadata, expectedMetadata);
		assert.deepStrictEqual(actual!.manifest, manifest);
	});

	async function aUserExtension(manifest: Partial<IScannedExtensionManifest>): Promise<URI> {
		const environmentService = instantiationService.get(INativeEnvironmentService);
		return anExtension(manifest, URI.file(environmentService.extensionsPath));
	}

	async function aSystemExtension(manifest: Partial<IScannedExtensionManifest>): Promise<URI> {
		const environmentService = instantiationService.get(INativeEnvironmentService);
		return anExtension(manifest, URI.file(environmentService.builtinExtensionsPath));
	}

	async function anExtension(manifest: Partial<IScannedExtensionManifest>, root: URI): Promise<URI> {
		const fileService = instantiationService.get(IFileService);
		const extensionLocation = joinPath(root, `${manifest.publisher}.${manifest.name}-${manifest.version}`);
		await fileService.writeFile(joinPath(extensionLocation, 'package.json'), VSBuffer.fromString(JSON.stringify(manifest)));
		return extensionLocation;
	}

	function anExtensionManifest(manifest: Partial<IScannedExtensionManifest>): Partial<IExtensionManifest> {
		return { engines: { vscode: '^1.66.0' }, version: '1.0.0', main: 'main.js', activationEvents: ['*'], ...manifest };
	}
});

suite('ExtensionScannerInput', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('compare inputs - location', () => {
		const anInput = (location: URI, mtime: number | undefined) => new ExtensionScannerInput(location, mtime, undefined, undefined, false, undefined, ExtensionType.User, true, '1.1.1', undefined, undefined, true, undefined, {});

		assert.strictEqual(ExtensionScannerInput.equals(anInput(ROOT, undefined), anInput(ROOT, undefined)), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(ROOT, 100), anInput(ROOT, 100)), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(joinPath(ROOT, 'foo'), undefined), anInput(ROOT, undefined)), false);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(ROOT, 100), anInput(ROOT, 200)), false);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(ROOT, undefined), anInput(ROOT, 200)), false);
	});

	test('compare inputs - application location', () => {
		const anInput = (location: URI, mtime: number | undefined) => new ExtensionScannerInput(ROOT, undefined, location, mtime, false, undefined, ExtensionType.User, true, '1.1.1', undefined, undefined, true, undefined, {});

		assert.strictEqual(ExtensionScannerInput.equals(anInput(ROOT, undefined), anInput(ROOT, undefined)), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(ROOT, 100), anInput(ROOT, 100)), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(joinPath(ROOT, 'foo'), undefined), anInput(ROOT, undefined)), false);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(ROOT, 100), anInput(ROOT, 200)), false);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(ROOT, undefined), anInput(ROOT, 200)), false);
	});

	test('compare inputs - profile', () => {
		const anInput = (profile: boolean, profileScanOptions: IProfileExtensionsScanOptions | undefined) => new ExtensionScannerInput(ROOT, undefined, undefined, undefined, profile, profileScanOptions, ExtensionType.User, true, '1.1.1', undefined, undefined, true, undefined, {});

		assert.strictEqual(ExtensionScannerInput.equals(anInput(true, { bailOutWhenFileNotFound: true }), anInput(true, { bailOutWhenFileNotFound: true })), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(false, { bailOutWhenFileNotFound: true }), anInput(false, { bailOutWhenFileNotFound: true })), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(true, { bailOutWhenFileNotFound: false }), anInput(true, { bailOutWhenFileNotFound: false })), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(true, {}), anInput(true, {})), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(true, { bailOutWhenFileNotFound: true }), anInput(true, { bailOutWhenFileNotFound: false })), false);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(true, {}), anInput(true, { bailOutWhenFileNotFound: true })), false);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(true, undefined), anInput(true, {})), false);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(false, { bailOutWhenFileNotFound: true }), anInput(true, { bailOutWhenFileNotFound: true })), false);
	});

	test('compare inputs - extension type', () => {
		const anInput = (type: ExtensionType) => new ExtensionScannerInput(ROOT, undefined, undefined, undefined, false, undefined, type, true, '1.1.1', undefined, undefined, true, undefined, {});

		assert.strictEqual(ExtensionScannerInput.equals(anInput(ExtensionType.System), anInput(ExtensionType.System)), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(ExtensionType.User), anInput(ExtensionType.User)), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(ExtensionType.User), anInput(ExtensionType.System)), false);
	});

});
