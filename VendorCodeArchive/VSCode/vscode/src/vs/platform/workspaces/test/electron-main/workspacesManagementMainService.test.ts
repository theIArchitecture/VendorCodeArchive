//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import { isUNC, toSlashes } from '../../../../base/common/extpath.js';
import { normalizeDriveLetter } from '../../../../base/common/labels.js';
import * as path from '../../../../base/common/path.js';
import { isWindows } from '../../../../base/common/platform.js';
import { extUriBiasedIgnorePathCase } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import * as pfs from '../../../../base/node/pfs.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { flakySuite, getRandomTestPath } from '../../../../base/test/node/testUtils.js';
import { IWorkspaceBackupInfo, IFolderBackupInfo } from '../../../backup/common/backup.js';
import { IBackupMainService } from '../../../backup/electron-main/backup.js';
import { IEmptyWindowBackupInfo } from '../../../backup/node/backup.js';
import { INativeOpenDialogOptions } from '../../../dialogs/common/dialogs.js';
import { IDialogMainService } from '../../../dialogs/electron-main/dialogMainService.js';
import { EnvironmentMainService } from '../../../environment/electron-main/environmentMainService.js';
import { OPTIONS, parseArgs } from '../../../environment/node/argv.js';
import { FileService } from '../../../files/common/fileService.js';
import { NullLogService } from '../../../log/common/log.js';
import product from '../../../product/common/product.js';
import { IProductService } from '../../../product/common/productService.js';
import { SaveStrategy, StateService } from '../../../state/node/stateService.js';
import { UriIdentityService } from '../../../uriIdentity/common/uriIdentityService.js';
import { UserDataProfilesMainService } from '../../../userDataProfile/electron-main/userDataProfile.js';
import { IRawFileWorkspaceFolder, IRawUriWorkspaceFolder, WORKSPACE_EXTENSION } from '../../../workspace/common/workspace.js';
import { IStoredWorkspace, IStoredWorkspaceFolder, IWorkspaceFolderCreationData, rewriteWorkspaceFileForNewLocation } from '../../common/workspaces.js';
import { WorkspacesManagementMainService } from '../../electron-main/workspacesManagementMainService.js';

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 38: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 42: Error message without production error code - breaks React bundle size optimization
//   3. Line 42: Error message without production error code - breaks React bundle size optimization
//   4. Line 43: Error message without production error code - breaks React bundle size optimization
//   5. Line 43: Error message without production error code - breaks React bundle size optimization
//   6. Line 44: Error message without production error code - breaks React bundle size optimization
//   7. Line 44: Error message without production error code - breaks React bundle size optimization
//   8. Line 45: Error message without production error code - breaks React bundle size optimization
//   9. Line 45: Error message without production error code - breaks React bundle size optimization
//   10. Line 46: Error message without production error code - breaks React bundle size optimization
//   11. Line 46: Error message without production error code - breaks React bundle size optimization
//   12. Line 47: Error message without production error code - breaks React bundle size optimization
//   13. Line 47: Error message without production error code - breaks React bundle size optimization
//   14. Line 48: Error message without production error code - breaks React bundle size optimization
//   15. Line 48: Error message without production error code - breaks React bundle size optimization
//   16. Line 51: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 55: Error message without production error code - breaks React bundle size optimization
//   18. Line 55: Error message without production error code - breaks React bundle size optimization
//   19. Line 56: Error message without production error code - breaks React bundle size optimization
//   20. Line 56: Error message without production error code - breaks React bundle size optimization
//   21. Line 59: Error message without production error code - breaks React bundle size optimization
//   22. Line 59: Error message without production error code - breaks React bundle size optimization
//   23. Line 60: Error message without production error code - breaks React bundle size optimization
//   24. Line 60: Error message without production error code - breaks React bundle size optimization
//   25. Line 61: Error message without production error code - breaks React bundle size optimization
//   26. Line 61: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

flakySuite('WorkspacesManagementMainService', () => {

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 74: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 78: Error message without production error code - breaks React bundle size optimization
//   3. Line 78: Error message without production error code - breaks React bundle size optimization
//   4. Line 79: Error message without production error code - breaks React bundle size optimization
//   5. Line 79: Error message without production error code - breaks React bundle size optimization
//   6. Line 80: Error message without production error code - breaks React bundle size optimization
//   7. Line 80: Error message without production error code - breaks React bundle size optimization
//   8. Line 81: Error message without production error code - breaks React bundle size optimization
//   9. Line 81: Error message without production error code - breaks React bundle size optimization
//   10. Line 82: Error message without production error code - breaks React bundle size optimization
//   11. Line 82: Error message without production error code - breaks React bundle size optimization
//   12. Line 83: Error message without production error code - breaks React bundle size optimization
//   13. Line 83: Error message without production error code - breaks React bundle size optimization
//   14. Line 84: Error message without production error code - breaks React bundle size optimization
//   15. Line 84: Error message without production error code - breaks React bundle size optimization
//   16. Line 87: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 91: Error message without production error code - breaks React bundle size optimization
//   18. Line 91: Error message without production error code - breaks React bundle size optimization
//   19. Line 92: Error message without production error code - breaks React bundle size optimization
//   20. Line 92: Error message without production error code - breaks React bundle size optimization
//   21. Line 95: Error message without production error code - breaks React bundle size optimization
//   22. Line 95: Error message without production error code - breaks React bundle size optimization
//   23. Line 96: Error message without production error code - breaks React bundle size optimization
//   24. Line 96: Error message without production error code - breaks React bundle size optimization
//   25. Line 97: Error message without production error code - breaks React bundle size optimization
//   26. Line 97: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 108: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 112: Error message without production error code - breaks React bundle size optimization
//   3. Line 112: Error message without production error code - breaks React bundle size optimization
//   4. Line 113: Error message without production error code - breaks React bundle size optimization
//   5. Line 113: Error message without production error code - breaks React bundle size optimization
//   6. Line 114: Error message without production error code - breaks React bundle size optimization
//   7. Line 114: Error message without production error code - breaks React bundle size optimization
//   8. Line 115: Error message without production error code - breaks React bundle size optimization
//   9. Line 115: Error message without production error code - breaks React bundle size optimization
//   10. Line 116: Error message without production error code - breaks React bundle size optimization
//   11. Line 116: Error message without production error code - breaks React bundle size optimization
//   12. Line 117: Error message without production error code - breaks React bundle size optimization
//   13. Line 117: Error message without production error code - breaks React bundle size optimization
//   14. Line 118: Error message without production error code - breaks React bundle size optimization
//   15. Line 118: Error message without production error code - breaks React bundle size optimization
//   16. Line 121: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 125: Error message without production error code - breaks React bundle size optimization
//   18. Line 125: Error message without production error code - breaks React bundle size optimization
//   19. Line 126: Error message without production error code - breaks React bundle size optimization
//   20. Line 126: Error message without production error code - breaks React bundle size optimization
//   21. Line 129: Error message without production error code - breaks React bundle size optimization
//   22. Line 129: Error message without production error code - breaks React bundle size optimization
//   23. Line 130: Error message without production error code - breaks React bundle size optimization
//   24. Line 130: Error message without production error code - breaks React bundle size optimization
//   25. Line 131: Error message without production error code - breaks React bundle size optimization
//   26. Line 131: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 142: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 146: Error message without production error code - breaks React bundle size optimization
//   3. Line 146: Error message without production error code - breaks React bundle size optimization
//   4. Line 147: Error message without production error code - breaks React bundle size optimization
//   5. Line 147: Error message without production error code - breaks React bundle size optimization
//   6. Line 148: Error message without production error code - breaks React bundle size optimization
//   7. Line 148: Error message without production error code - breaks React bundle size optimization
//   8. Line 149: Error message without production error code - breaks React bundle size optimization
//   9. Line 149: Error message without production error code - breaks React bundle size optimization
//   10. Line 150: Error message without production error code - breaks React bundle size optimization
//   11. Line 150: Error message without production error code - breaks React bundle size optimization
//   12. Line 151: Error message without production error code - breaks React bundle size optimization
//   13. Line 151: Error message without production error code - breaks React bundle size optimization
//   14. Line 152: Error message without production error code - breaks React bundle size optimization
//   15. Line 152: Error message without production error code - breaks React bundle size optimization
//   16. Line 155: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 159: Error message without production error code - breaks React bundle size optimization
//   18. Line 159: Error message without production error code - breaks React bundle size optimization
//   19. Line 160: Error message without production error code - breaks React bundle size optimization
//   20. Line 160: Error message without production error code - breaks React bundle size optimization
//   21. Line 163: Error message without production error code - breaks React bundle size optimization
//   22. Line 163: Error message without production error code - breaks React bundle size optimization
//   23. Line 164: Error message without production error code - breaks React bundle size optimization
//   24. Line 164: Error message without production error code - breaks React bundle size optimization
//   25. Line 165: Error message without production error code - breaks React bundle size optimization
//   26. Line 165: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 176: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 180: Error message without production error code - breaks React bundle size optimization
//   3. Line 180: Error message without production error code - breaks React bundle size optimization
//   4. Line 181: Error message without production error code - breaks React bundle size optimization
//   5. Line 181: Error message without production error code - breaks React bundle size optimization
//   6. Line 182: Error message without production error code - breaks React bundle size optimization
//   7. Line 182: Error message without production error code - breaks React bundle size optimization
//   8. Line 183: Error message without production error code - breaks React bundle size optimization
//   9. Line 183: Error message without production error code - breaks React bundle size optimization
//   10. Line 184: Error message without production error code - breaks React bundle size optimization
//   11. Line 184: Error message without production error code - breaks React bundle size optimization
//   12. Line 185: Error message without production error code - breaks React bundle size optimization
//   13. Line 185: Error message without production error code - breaks React bundle size optimization
//   14. Line 186: Error message without production error code - breaks React bundle size optimization
//   15. Line 186: Error message without production error code - breaks React bundle size optimization
//   16. Line 189: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 193: Error message without production error code - breaks React bundle size optimization
//   18. Line 193: Error message without production error code - breaks React bundle size optimization
//   19. Line 194: Error message without production error code - breaks React bundle size optimization
//   20. Line 194: Error message without production error code - breaks React bundle size optimization
//   21. Line 197: Error message without production error code - breaks React bundle size optimization
//   22. Line 197: Error message without production error code - breaks React bundle size optimization
//   23. Line 198: Error message without production error code - breaks React bundle size optimization
//   24. Line 198: Error message without production error code - breaks React bundle size optimization
//   25. Line 199: Error message without production error code - breaks React bundle size optimization
//   26. Line 199: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 210: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 214: Error message without production error code - breaks React bundle size optimization
//   3. Line 214: Error message without production error code - breaks React bundle size optimization
//   4. Line 215: Error message without production error code - breaks React bundle size optimization
//   5. Line 215: Error message without production error code - breaks React bundle size optimization
//   6. Line 216: Error message without production error code - breaks React bundle size optimization
//   7. Line 216: Error message without production error code - breaks React bundle size optimization
//   8. Line 217: Error message without production error code - breaks React bundle size optimization
//   9. Line 217: Error message without production error code - breaks React bundle size optimization
//   10. Line 218: Error message without production error code - breaks React bundle size optimization
//   11. Line 218: Error message without production error code - breaks React bundle size optimization
//   12. Line 219: Error message without production error code - breaks React bundle size optimization
//   13. Line 219: Error message without production error code - breaks React bundle size optimization
//   14. Line 220: Error message without production error code - breaks React bundle size optimization
//   15. Line 220: Error message without production error code - breaks React bundle size optimization
//   16. Line 223: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 227: Error message without production error code - breaks React bundle size optimization
//   18. Line 227: Error message without production error code - breaks React bundle size optimization
//   19. Line 228: Error message without production error code - breaks React bundle size optimization
//   20. Line 228: Error message without production error code - breaks React bundle size optimization
//   21. Line 231: Error message without production error code - breaks React bundle size optimization
//   22. Line 231: Error message without production error code - breaks React bundle size optimization
//   23. Line 232: Error message without production error code - breaks React bundle size optimization
//   24. Line 232: Error message without production error code - breaks React bundle size optimization
//   25. Line 233: Error message without production error code - breaks React bundle size optimization
//   26. Line 233: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 244: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 248: Error message without production error code - breaks React bundle size optimization
//   3. Line 248: Error message without production error code - breaks React bundle size optimization
//   4. Line 249: Error message without production error code - breaks React bundle size optimization
//   5. Line 249: Error message without production error code - breaks React bundle size optimization
//   6. Line 250: Error message without production error code - breaks React bundle size optimization
//   7. Line 250: Error message without production error code - breaks React bundle size optimization
//   8. Line 251: Error message without production error code - breaks React bundle size optimization
//   9. Line 251: Error message without production error code - breaks React bundle size optimization
//   10. Line 252: Error message without production error code - breaks React bundle size optimization
//   11. Line 252: Error message without production error code - breaks React bundle size optimization
//   12. Line 253: Error message without production error code - breaks React bundle size optimization
//   13. Line 253: Error message without production error code - breaks React bundle size optimization
//   14. Line 254: Error message without production error code - breaks React bundle size optimization
//   15. Line 254: Error message without production error code - breaks React bundle size optimization
//   16. Line 257: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 261: Error message without production error code - breaks React bundle size optimization
//   18. Line 261: Error message without production error code - breaks React bundle size optimization
//   19. Line 262: Error message without production error code - breaks React bundle size optimization
//   20. Line 262: Error message without production error code - breaks React bundle size optimization
//   21. Line 265: Error message without production error code - breaks React bundle size optimization
//   22. Line 265: Error message without production error code - breaks React bundle size optimization
//   23. Line 266: Error message without production error code - breaks React bundle size optimization
//   24. Line 266: Error message without production error code - breaks React bundle size optimization
//   25. Line 267: Error message without production error code - breaks React bundle size optimization
//   26. Line 267: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 278: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 282: Error message without production error code - breaks React bundle size optimization
//   3. Line 282: Error message without production error code - breaks React bundle size optimization
//   4. Line 283: Error message without production error code - breaks React bundle size optimization
//   5. Line 283: Error message without production error code - breaks React bundle size optimization
//   6. Line 284: Error message without production error code - breaks React bundle size optimization
//   7. Line 284: Error message without production error code - breaks React bundle size optimization
//   8. Line 285: Error message without production error code - breaks React bundle size optimization
//   9. Line 285: Error message without production error code - breaks React bundle size optimization
//   10. Line 286: Error message without production error code - breaks React bundle size optimization
//   11. Line 286: Error message without production error code - breaks React bundle size optimization
//   12. Line 287: Error message without production error code - breaks React bundle size optimization
//   13. Line 287: Error message without production error code - breaks React bundle size optimization
//   14. Line 288: Error message without production error code - breaks React bundle size optimization
//   15. Line 288: Error message without production error code - breaks React bundle size optimization
//   16. Line 291: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 295: Error message without production error code - breaks React bundle size optimization
//   18. Line 295: Error message without production error code - breaks React bundle size optimization
//   19. Line 296: Error message without production error code - breaks React bundle size optimization
//   20. Line 296: Error message without production error code - breaks React bundle size optimization
//   21. Line 299: Error message without production error code - breaks React bundle size optimization
//   22. Line 299: Error message without production error code - breaks React bundle size optimization
//   23. Line 300: Error message without production error code - breaks React bundle size optimization
//   24. Line 300: Error message without production error code - breaks React bundle size optimization
//   25. Line 301: Error message without production error code - breaks React bundle size optimization
//   26. Line 301: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 312: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 316: Error message without production error code - breaks React bundle size optimization
//   3. Line 316: Error message without production error code - breaks React bundle size optimization
//   4. Line 317: Error message without production error code - breaks React bundle size optimization
//   5. Line 317: Error message without production error code - breaks React bundle size optimization
//   6. Line 318: Error message without production error code - breaks React bundle size optimization
//   7. Line 318: Error message without production error code - breaks React bundle size optimization
//   8. Line 319: Error message without production error code - breaks React bundle size optimization
//   9. Line 319: Error message without production error code - breaks React bundle size optimization
//   10. Line 320: Error message without production error code - breaks React bundle size optimization
//   11. Line 320: Error message without production error code - breaks React bundle size optimization
//   12. Line 321: Error message without production error code - breaks React bundle size optimization
//   13. Line 321: Error message without production error code - breaks React bundle size optimization
//   14. Line 322: Error message without production error code - breaks React bundle size optimization
//   15. Line 322: Error message without production error code - breaks React bundle size optimization
//   16. Line 325: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 329: Error message without production error code - breaks React bundle size optimization
//   18. Line 329: Error message without production error code - breaks React bundle size optimization
//   19. Line 330: Error message without production error code - breaks React bundle size optimization
//   20. Line 330: Error message without production error code - breaks React bundle size optimization
//   21. Line 333: Error message without production error code - breaks React bundle size optimization
//   22. Line 333: Error message without production error code - breaks React bundle size optimization
//   23. Line 334: Error message without production error code - breaks React bundle size optimization
//   24. Line 334: Error message without production error code - breaks React bundle size optimization
//   25. Line 335: Error message without production error code - breaks React bundle size optimization
//   26. Line 335: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 346: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 350: Error message without production error code - breaks React bundle size optimization
//   3. Line 350: Error message without production error code - breaks React bundle size optimization
//   4. Line 351: Error message without production error code - breaks React bundle size optimization
//   5. Line 351: Error message without production error code - breaks React bundle size optimization
//   6. Line 352: Error message without production error code - breaks React bundle size optimization
//   7. Line 352: Error message without production error code - breaks React bundle size optimization
//   8. Line 353: Error message without production error code - breaks React bundle size optimization
//   9. Line 353: Error message without production error code - breaks React bundle size optimization
//   10. Line 354: Error message without production error code - breaks React bundle size optimization
//   11. Line 354: Error message without production error code - breaks React bundle size optimization
//   12. Line 355: Error message without production error code - breaks React bundle size optimization
//   13. Line 355: Error message without production error code - breaks React bundle size optimization
//   14. Line 356: Error message without production error code - breaks React bundle size optimization
//   15. Line 356: Error message without production error code - breaks React bundle size optimization
//   16. Line 359: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 363: Error message without production error code - breaks React bundle size optimization
//   18. Line 363: Error message without production error code - breaks React bundle size optimization
//   19. Line 364: Error message without production error code - breaks React bundle size optimization
//   20. Line 364: Error message without production error code - breaks React bundle size optimization
//   21. Line 367: Error message without production error code - breaks React bundle size optimization
//   22. Line 367: Error message without production error code - breaks React bundle size optimization
//   23. Line 368: Error message without production error code - breaks React bundle size optimization
//   24. Line 368: Error message without production error code - breaks React bundle size optimization
//   25. Line 369: Error message without production error code - breaks React bundle size optimization
//   26. Line 369: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 380: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 384: Error message without production error code - breaks React bundle size optimization
//   3. Line 384: Error message without production error code - breaks React bundle size optimization
//   4. Line 385: Error message without production error code - breaks React bundle size optimization
//   5. Line 385: Error message without production error code - breaks React bundle size optimization
//   6. Line 386: Error message without production error code - breaks React bundle size optimization
//   7. Line 386: Error message without production error code - breaks React bundle size optimization
//   8. Line 387: Error message without production error code - breaks React bundle size optimization
//   9. Line 387: Error message without production error code - breaks React bundle size optimization
//   10. Line 388: Error message without production error code - breaks React bundle size optimization
//   11. Line 388: Error message without production error code - breaks React bundle size optimization
//   12. Line 389: Error message without production error code - breaks React bundle size optimization
//   13. Line 389: Error message without production error code - breaks React bundle size optimization
//   14. Line 390: Error message without production error code - breaks React bundle size optimization
//   15. Line 390: Error message without production error code - breaks React bundle size optimization
//   16. Line 393: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 397: Error message without production error code - breaks React bundle size optimization
//   18. Line 397: Error message without production error code - breaks React bundle size optimization
//   19. Line 398: Error message without production error code - breaks React bundle size optimization
//   20. Line 398: Error message without production error code - breaks React bundle size optimization
//   21. Line 401: Error message without production error code - breaks React bundle size optimization
//   22. Line 401: Error message without production error code - breaks React bundle size optimization
//   23. Line 402: Error message without production error code - breaks React bundle size optimization
//   24. Line 402: Error message without production error code - breaks React bundle size optimization
//   25. Line 403: Error message without production error code - breaks React bundle size optimization
//   26. Line 403: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 414: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 418: Error message without production error code - breaks React bundle size optimization
//   3. Line 418: Error message without production error code - breaks React bundle size optimization
//   4. Line 419: Error message without production error code - breaks React bundle size optimization
//   5. Line 419: Error message without production error code - breaks React bundle size optimization
//   6. Line 420: Error message without production error code - breaks React bundle size optimization
//   7. Line 420: Error message without production error code - breaks React bundle size optimization
//   8. Line 421: Error message without production error code - breaks React bundle size optimization
//   9. Line 421: Error message without production error code - breaks React bundle size optimization
//   10. Line 422: Error message without production error code - breaks React bundle size optimization
//   11. Line 422: Error message without production error code - breaks React bundle size optimization
//   12. Line 423: Error message without production error code - breaks React bundle size optimization
//   13. Line 423: Error message without production error code - breaks React bundle size optimization
//   14. Line 424: Error message without production error code - breaks React bundle size optimization
//   15. Line 424: Error message without production error code - breaks React bundle size optimization
//   16. Line 427: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 431: Error message without production error code - breaks React bundle size optimization
//   18. Line 431: Error message without production error code - breaks React bundle size optimization
//   19. Line 432: Error message without production error code - breaks React bundle size optimization
//   20. Line 432: Error message without production error code - breaks React bundle size optimization
//   21. Line 435: Error message without production error code - breaks React bundle size optimization
//   22. Line 435: Error message without production error code - breaks React bundle size optimization
//   23. Line 436: Error message without production error code - breaks React bundle size optimization
//   24. Line 436: Error message without production error code - breaks React bundle size optimization
//   25. Line 437: Error message without production error code - breaks React bundle size optimization
//   26. Line 437: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 448: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 452: Error message without production error code - breaks React bundle size optimization
//   3. Line 452: Error message without production error code - breaks React bundle size optimization
//   4. Line 453: Error message without production error code - breaks React bundle size optimization
//   5. Line 453: Error message without production error code - breaks React bundle size optimization
//   6. Line 454: Error message without production error code - breaks React bundle size optimization
//   7. Line 454: Error message without production error code - breaks React bundle size optimization
//   8. Line 455: Error message without production error code - breaks React bundle size optimization
//   9. Line 455: Error message without production error code - breaks React bundle size optimization
//   10. Line 456: Error message without production error code - breaks React bundle size optimization
//   11. Line 456: Error message without production error code - breaks React bundle size optimization
//   12. Line 457: Error message without production error code - breaks React bundle size optimization
//   13. Line 457: Error message without production error code - breaks React bundle size optimization
//   14. Line 458: Error message without production error code - breaks React bundle size optimization
//   15. Line 458: Error message without production error code - breaks React bundle size optimization
//   16. Line 461: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 465: Error message without production error code - breaks React bundle size optimization
//   18. Line 465: Error message without production error code - breaks React bundle size optimization
//   19. Line 466: Error message without production error code - breaks React bundle size optimization
//   20. Line 466: Error message without production error code - breaks React bundle size optimization
//   21. Line 469: Error message without production error code - breaks React bundle size optimization
//   22. Line 469: Error message without production error code - breaks React bundle size optimization
//   23. Line 470: Error message without production error code - breaks React bundle size optimization
//   24. Line 470: Error message without production error code - breaks React bundle size optimization
//   25. Line 471: Error message without production error code - breaks React bundle size optimization
//   26. Line 471: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 482: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 486: Error message without production error code - breaks React bundle size optimization
//   3. Line 486: Error message without production error code - breaks React bundle size optimization
//   4. Line 487: Error message without production error code - breaks React bundle size optimization
//   5. Line 487: Error message without production error code - breaks React bundle size optimization
//   6. Line 488: Error message without production error code - breaks React bundle size optimization
//   7. Line 488: Error message without production error code - breaks React bundle size optimization
//   8. Line 489: Error message without production error code - breaks React bundle size optimization
//   9. Line 489: Error message without production error code - breaks React bundle size optimization
//   10. Line 490: Error message without production error code - breaks React bundle size optimization
//   11. Line 490: Error message without production error code - breaks React bundle size optimization
//   12. Line 491: Error message without production error code - breaks React bundle size optimization
//   13. Line 491: Error message without production error code - breaks React bundle size optimization
//   14. Line 492: Error message without production error code - breaks React bundle size optimization
//   15. Line 492: Error message without production error code - breaks React bundle size optimization
//   16. Line 495: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 499: Error message without production error code - breaks React bundle size optimization
//   18. Line 499: Error message without production error code - breaks React bundle size optimization
//   19. Line 500: Error message without production error code - breaks React bundle size optimization
//   20. Line 500: Error message without production error code - breaks React bundle size optimization
//   21. Line 503: Error message without production error code - breaks React bundle size optimization
//   22. Line 503: Error message without production error code - breaks React bundle size optimization
//   23. Line 504: Error message without production error code - breaks React bundle size optimization
//   24. Line 504: Error message without production error code - breaks React bundle size optimization
//   25. Line 505: Error message without production error code - breaks React bundle size optimization
//   26. Line 505: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 516: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 520: Error message without production error code - breaks React bundle size optimization
//   3. Line 520: Error message without production error code - breaks React bundle size optimization
//   4. Line 521: Error message without production error code - breaks React bundle size optimization
//   5. Line 521: Error message without production error code - breaks React bundle size optimization
//   6. Line 522: Error message without production error code - breaks React bundle size optimization
//   7. Line 522: Error message without production error code - breaks React bundle size optimization
//   8. Line 523: Error message without production error code - breaks React bundle size optimization
//   9. Line 523: Error message without production error code - breaks React bundle size optimization
//   10. Line 524: Error message without production error code - breaks React bundle size optimization
//   11. Line 524: Error message without production error code - breaks React bundle size optimization
//   12. Line 525: Error message without production error code - breaks React bundle size optimization
//   13. Line 525: Error message without production error code - breaks React bundle size optimization
//   14. Line 526: Error message without production error code - breaks React bundle size optimization
//   15. Line 526: Error message without production error code - breaks React bundle size optimization
//   16. Line 529: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 533: Error message without production error code - breaks React bundle size optimization
//   18. Line 533: Error message without production error code - breaks React bundle size optimization
//   19. Line 534: Error message without production error code - breaks React bundle size optimization
//   20. Line 534: Error message without production error code - breaks React bundle size optimization
//   21. Line 537: Error message without production error code - breaks React bundle size optimization
//   22. Line 537: Error message without production error code - breaks React bundle size optimization
//   23. Line 538: Error message without production error code - breaks React bundle size optimization
//   24. Line 538: Error message without production error code - breaks React bundle size optimization
//   25. Line 539: Error message without production error code - breaks React bundle size optimization
//   26. Line 539: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 550: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 554: Error message without production error code - breaks React bundle size optimization
//   3. Line 554: Error message without production error code - breaks React bundle size optimization
//   4. Line 555: Error message without production error code - breaks React bundle size optimization
//   5. Line 555: Error message without production error code - breaks React bundle size optimization
//   6. Line 556: Error message without production error code - breaks React bundle size optimization
//   7. Line 556: Error message without production error code - breaks React bundle size optimization
//   8. Line 557: Error message without production error code - breaks React bundle size optimization
//   9. Line 557: Error message without production error code - breaks React bundle size optimization
//   10. Line 558: Error message without production error code - breaks React bundle size optimization
//   11. Line 558: Error message without production error code - breaks React bundle size optimization
//   12. Line 559: Error message without production error code - breaks React bundle size optimization
//   13. Line 559: Error message without production error code - breaks React bundle size optimization
//   14. Line 560: Error message without production error code - breaks React bundle size optimization
//   15. Line 560: Error message without production error code - breaks React bundle size optimization
//   16. Line 563: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 567: Error message without production error code - breaks React bundle size optimization
//   18. Line 567: Error message without production error code - breaks React bundle size optimization
//   19. Line 568: Error message without production error code - breaks React bundle size optimization
//   20. Line 568: Error message without production error code - breaks React bundle size optimization
//   21. Line 571: Error message without production error code - breaks React bundle size optimization
//   22. Line 571: Error message without production error code - breaks React bundle size optimization
//   23. Line 572: Error message without production error code - breaks React bundle size optimization
//   24. Line 572: Error message without production error code - breaks React bundle size optimization
//   25. Line 573: Error message without production error code - breaks React bundle size optimization
//   26. Line 573: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 584: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 588: Error message without production error code - breaks React bundle size optimization
//   3. Line 588: Error message without production error code - breaks React bundle size optimization
//   4. Line 589: Error message without production error code - breaks React bundle size optimization
//   5. Line 589: Error message without production error code - breaks React bundle size optimization
//   6. Line 590: Error message without production error code - breaks React bundle size optimization
//   7. Line 590: Error message without production error code - breaks React bundle size optimization
//   8. Line 591: Error message without production error code - breaks React bundle size optimization
//   9. Line 591: Error message without production error code - breaks React bundle size optimization
//   10. Line 592: Error message without production error code - breaks React bundle size optimization
//   11. Line 592: Error message without production error code - breaks React bundle size optimization
//   12. Line 593: Error message without production error code - breaks React bundle size optimization
//   13. Line 593: Error message without production error code - breaks React bundle size optimization
//   14. Line 594: Error message without production error code - breaks React bundle size optimization
//   15. Line 594: Error message without production error code - breaks React bundle size optimization
//   16. Line 597: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 601: Error message without production error code - breaks React bundle size optimization
//   18. Line 601: Error message without production error code - breaks React bundle size optimization
//   19. Line 602: Error message without production error code - breaks React bundle size optimization
//   20. Line 602: Error message without production error code - breaks React bundle size optimization
//   21. Line 605: Error message without production error code - breaks React bundle size optimization
//   22. Line 605: Error message without production error code - breaks React bundle size optimization
//   23. Line 606: Error message without production error code - breaks React bundle size optimization
//   24. Line 606: Error message without production error code - breaks React bundle size optimization
//   25. Line 607: Error message without production error code - breaks React bundle size optimization
//   26. Line 607: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 618: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 622: Error message without production error code - breaks React bundle size optimization
//   3. Line 622: Error message without production error code - breaks React bundle size optimization
//   4. Line 623: Error message without production error code - breaks React bundle size optimization
//   5. Line 623: Error message without production error code - breaks React bundle size optimization
//   6. Line 624: Error message without production error code - breaks React bundle size optimization
//   7. Line 624: Error message without production error code - breaks React bundle size optimization
//   8. Line 625: Error message without production error code - breaks React bundle size optimization
//   9. Line 625: Error message without production error code - breaks React bundle size optimization
//   10. Line 626: Error message without production error code - breaks React bundle size optimization
//   11. Line 626: Error message without production error code - breaks React bundle size optimization
//   12. Line 627: Error message without production error code - breaks React bundle size optimization
//   13. Line 627: Error message without production error code - breaks React bundle size optimization
//   14. Line 628: Error message without production error code - breaks React bundle size optimization
//   15. Line 628: Error message without production error code - breaks React bundle size optimization
//   16. Line 631: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 635: Error message without production error code - breaks React bundle size optimization
//   18. Line 635: Error message without production error code - breaks React bundle size optimization
//   19. Line 636: Error message without production error code - breaks React bundle size optimization
//   20. Line 636: Error message without production error code - breaks React bundle size optimization
//   21. Line 639: Error message without production error code - breaks React bundle size optimization
//   22. Line 639: Error message without production error code - breaks React bundle size optimization
//   23. Line 640: Error message without production error code - breaks React bundle size optimization
//   24. Line 640: Error message without production error code - breaks React bundle size optimization
//   25. Line 641: Error message without production error code - breaks React bundle size optimization
//   26. Line 641: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 652: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 656: Error message without production error code - breaks React bundle size optimization
//   3. Line 656: Error message without production error code - breaks React bundle size optimization
//   4. Line 657: Error message without production error code - breaks React bundle size optimization
//   5. Line 657: Error message without production error code - breaks React bundle size optimization
//   6. Line 658: Error message without production error code - breaks React bundle size optimization
//   7. Line 658: Error message without production error code - breaks React bundle size optimization
//   8. Line 659: Error message without production error code - breaks React bundle size optimization
//   9. Line 659: Error message without production error code - breaks React bundle size optimization
//   10. Line 660: Error message without production error code - breaks React bundle size optimization
//   11. Line 660: Error message without production error code - breaks React bundle size optimization
//   12. Line 661: Error message without production error code - breaks React bundle size optimization
//   13. Line 661: Error message without production error code - breaks React bundle size optimization
//   14. Line 662: Error message without production error code - breaks React bundle size optimization
//   15. Line 662: Error message without production error code - breaks React bundle size optimization
//   16. Line 665: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 669: Error message without production error code - breaks React bundle size optimization
//   18. Line 669: Error message without production error code - breaks React bundle size optimization
//   19. Line 670: Error message without production error code - breaks React bundle size optimization
//   20. Line 670: Error message without production error code - breaks React bundle size optimization
//   21. Line 673: Error message without production error code - breaks React bundle size optimization
//   22. Line 673: Error message without production error code - breaks React bundle size optimization
//   23. Line 674: Error message without production error code - breaks React bundle size optimization
//   24. Line 674: Error message without production error code - breaks React bundle size optimization
//   25. Line 675: Error message without production error code - breaks React bundle size optimization
//   26. Line 675: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 686: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 690: Error message without production error code - breaks React bundle size optimization
//   3. Line 690: Error message without production error code - breaks React bundle size optimization
//   4. Line 691: Error message without production error code - breaks React bundle size optimization
//   5. Line 691: Error message without production error code - breaks React bundle size optimization
//   6. Line 692: Error message without production error code - breaks React bundle size optimization
//   7. Line 692: Error message without production error code - breaks React bundle size optimization
//   8. Line 693: Error message without production error code - breaks React bundle size optimization
//   9. Line 693: Error message without production error code - breaks React bundle size optimization
//   10. Line 694: Error message without production error code - breaks React bundle size optimization
//   11. Line 694: Error message without production error code - breaks React bundle size optimization
//   12. Line 695: Error message without production error code - breaks React bundle size optimization
//   13. Line 695: Error message without production error code - breaks React bundle size optimization
//   14. Line 696: Error message without production error code - breaks React bundle size optimization
//   15. Line 696: Error message without production error code - breaks React bundle size optimization
//   16. Line 699: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 703: Error message without production error code - breaks React bundle size optimization
//   18. Line 703: Error message without production error code - breaks React bundle size optimization
//   19. Line 704: Error message without production error code - breaks React bundle size optimization
//   20. Line 704: Error message without production error code - breaks React bundle size optimization
//   21. Line 707: Error message without production error code - breaks React bundle size optimization
//   22. Line 707: Error message without production error code - breaks React bundle size optimization
//   23. Line 708: Error message without production error code - breaks React bundle size optimization
//   24. Line 708: Error message without production error code - breaks React bundle size optimization
//   25. Line 709: Error message without production error code - breaks React bundle size optimization
//   26. Line 709: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 720: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 724: Error message without production error code - breaks React bundle size optimization
//   3. Line 724: Error message without production error code - breaks React bundle size optimization
//   4. Line 725: Error message without production error code - breaks React bundle size optimization
//   5. Line 725: Error message without production error code - breaks React bundle size optimization
//   6. Line 726: Error message without production error code - breaks React bundle size optimization
//   7. Line 726: Error message without production error code - breaks React bundle size optimization
//   8. Line 727: Error message without production error code - breaks React bundle size optimization
//   9. Line 727: Error message without production error code - breaks React bundle size optimization
//   10. Line 728: Error message without production error code - breaks React bundle size optimization
//   11. Line 728: Error message without production error code - breaks React bundle size optimization
//   12. Line 729: Error message without production error code - breaks React bundle size optimization
//   13. Line 729: Error message without production error code - breaks React bundle size optimization
//   14. Line 730: Error message without production error code - breaks React bundle size optimization
//   15. Line 730: Error message without production error code - breaks React bundle size optimization
//   16. Line 733: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 737: Error message without production error code - breaks React bundle size optimization
//   18. Line 737: Error message without production error code - breaks React bundle size optimization
//   19. Line 738: Error message without production error code - breaks React bundle size optimization
//   20. Line 738: Error message without production error code - breaks React bundle size optimization
//   21. Line 741: Error message without production error code - breaks React bundle size optimization
//   22. Line 741: Error message without production error code - breaks React bundle size optimization
//   23. Line 742: Error message without production error code - breaks React bundle size optimization
//   24. Line 742: Error message without production error code - breaks React bundle size optimization
//   25. Line 743: Error message without production error code - breaks React bundle size optimization
//   26. Line 743: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 754: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 758: Error message without production error code - breaks React bundle size optimization
//   3. Line 758: Error message without production error code - breaks React bundle size optimization
//   4. Line 759: Error message without production error code - breaks React bundle size optimization
//   5. Line 759: Error message without production error code - breaks React bundle size optimization
//   6. Line 760: Error message without production error code - breaks React bundle size optimization
//   7. Line 760: Error message without production error code - breaks React bundle size optimization
//   8. Line 761: Error message without production error code - breaks React bundle size optimization
//   9. Line 761: Error message without production error code - breaks React bundle size optimization
//   10. Line 762: Error message without production error code - breaks React bundle size optimization
//   11. Line 762: Error message without production error code - breaks React bundle size optimization
//   12. Line 763: Error message without production error code - breaks React bundle size optimization
//   13. Line 763: Error message without production error code - breaks React bundle size optimization
//   14. Line 764: Error message without production error code - breaks React bundle size optimization
//   15. Line 764: Error message without production error code - breaks React bundle size optimization
//   16. Line 767: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 771: Error message without production error code - breaks React bundle size optimization
//   18. Line 771: Error message without production error code - breaks React bundle size optimization
//   19. Line 772: Error message without production error code - breaks React bundle size optimization
//   20. Line 772: Error message without production error code - breaks React bundle size optimization
//   21. Line 775: Error message without production error code - breaks React bundle size optimization
//   22. Line 775: Error message without production error code - breaks React bundle size optimization
//   23. Line 776: Error message without production error code - breaks React bundle size optimization
//   24. Line 776: Error message without production error code - breaks React bundle size optimization
//   25. Line 777: Error message without production error code - breaks React bundle size optimization
//   26. Line 777: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 788: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 792: Error message without production error code - breaks React bundle size optimization
//   3. Line 792: Error message without production error code - breaks React bundle size optimization
//   4. Line 793: Error message without production error code - breaks React bundle size optimization
//   5. Line 793: Error message without production error code - breaks React bundle size optimization
//   6. Line 794: Error message without production error code - breaks React bundle size optimization
//   7. Line 794: Error message without production error code - breaks React bundle size optimization
//   8. Line 795: Error message without production error code - breaks React bundle size optimization
//   9. Line 795: Error message without production error code - breaks React bundle size optimization
//   10. Line 796: Error message without production error code - breaks React bundle size optimization
//   11. Line 796: Error message without production error code - breaks React bundle size optimization
//   12. Line 797: Error message without production error code - breaks React bundle size optimization
//   13. Line 797: Error message without production error code - breaks React bundle size optimization
//   14. Line 798: Error message without production error code - breaks React bundle size optimization
//   15. Line 798: Error message without production error code - breaks React bundle size optimization
//   16. Line 801: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 805: Error message without production error code - breaks React bundle size optimization
//   18. Line 805: Error message without production error code - breaks React bundle size optimization
//   19. Line 806: Error message without production error code - breaks React bundle size optimization
//   20. Line 806: Error message without production error code - breaks React bundle size optimization
//   21. Line 809: Error message without production error code - breaks React bundle size optimization
//   22. Line 809: Error message without production error code - breaks React bundle size optimization
//   23. Line 810: Error message without production error code - breaks React bundle size optimization
//   24. Line 810: Error message without production error code - breaks React bundle size optimization
//   25. Line 811: Error message without production error code - breaks React bundle size optimization
//   26. Line 811: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 822: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 826: Error message without production error code - breaks React bundle size optimization
//   3. Line 826: Error message without production error code - breaks React bundle size optimization
//   4. Line 827: Error message without production error code - breaks React bundle size optimization
//   5. Line 827: Error message without production error code - breaks React bundle size optimization
//   6. Line 828: Error message without production error code - breaks React bundle size optimization
//   7. Line 828: Error message without production error code - breaks React bundle size optimization
//   8. Line 829: Error message without production error code - breaks React bundle size optimization
//   9. Line 829: Error message without production error code - breaks React bundle size optimization
//   10. Line 830: Error message without production error code - breaks React bundle size optimization
//   11. Line 830: Error message without production error code - breaks React bundle size optimization
//   12. Line 831: Error message without production error code - breaks React bundle size optimization
//   13. Line 831: Error message without production error code - breaks React bundle size optimization
//   14. Line 832: Error message without production error code - breaks React bundle size optimization
//   15. Line 832: Error message without production error code - breaks React bundle size optimization
//   16. Line 835: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 839: Error message without production error code - breaks React bundle size optimization
//   18. Line 839: Error message without production error code - breaks React bundle size optimization
//   19. Line 840: Error message without production error code - breaks React bundle size optimization
//   20. Line 840: Error message without production error code - breaks React bundle size optimization
//   21. Line 843: Error message without production error code - breaks React bundle size optimization
//   22. Line 843: Error message without production error code - breaks React bundle size optimization
//   23. Line 844: Error message without production error code - breaks React bundle size optimization
//   24. Line 844: Error message without production error code - breaks React bundle size optimization
//   25. Line 845: Error message without production error code - breaks React bundle size optimization
//   26. Line 845: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 856: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 860: Error message without production error code - breaks React bundle size optimization
//   3. Line 860: Error message without production error code - breaks React bundle size optimization
//   4. Line 861: Error message without production error code - breaks React bundle size optimization
//   5. Line 861: Error message without production error code - breaks React bundle size optimization
//   6. Line 862: Error message without production error code - breaks React bundle size optimization
//   7. Line 862: Error message without production error code - breaks React bundle size optimization
//   8. Line 863: Error message without production error code - breaks React bundle size optimization
//   9. Line 863: Error message without production error code - breaks React bundle size optimization
//   10. Line 864: Error message without production error code - breaks React bundle size optimization
//   11. Line 864: Error message without production error code - breaks React bundle size optimization
//   12. Line 865: Error message without production error code - breaks React bundle size optimization
//   13. Line 865: Error message without production error code - breaks React bundle size optimization
//   14. Line 866: Error message without production error code - breaks React bundle size optimization
//   15. Line 866: Error message without production error code - breaks React bundle size optimization
//   16. Line 869: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 873: Error message without production error code - breaks React bundle size optimization
//   18. Line 873: Error message without production error code - breaks React bundle size optimization
//   19. Line 874: Error message without production error code - breaks React bundle size optimization
//   20. Line 874: Error message without production error code - breaks React bundle size optimization
//   21. Line 877: Error message without production error code - breaks React bundle size optimization
//   22. Line 877: Error message without production error code - breaks React bundle size optimization
//   23. Line 878: Error message without production error code - breaks React bundle size optimization
//   24. Line 878: Error message without production error code - breaks React bundle size optimization
//   25. Line 879: Error message without production error code - breaks React bundle size optimization
//   26. Line 879: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 890: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 894: Error message without production error code - breaks React bundle size optimization
//   3. Line 894: Error message without production error code - breaks React bundle size optimization
//   4. Line 895: Error message without production error code - breaks React bundle size optimization
//   5. Line 895: Error message without production error code - breaks React bundle size optimization
//   6. Line 896: Error message without production error code - breaks React bundle size optimization
//   7. Line 896: Error message without production error code - breaks React bundle size optimization
//   8. Line 897: Error message without production error code - breaks React bundle size optimization
//   9. Line 897: Error message without production error code - breaks React bundle size optimization
//   10. Line 898: Error message without production error code - breaks React bundle size optimization
//   11. Line 898: Error message without production error code - breaks React bundle size optimization
//   12. Line 899: Error message without production error code - breaks React bundle size optimization
//   13. Line 899: Error message without production error code - breaks React bundle size optimization
//   14. Line 900: Error message without production error code - breaks React bundle size optimization
//   15. Line 900: Error message without production error code - breaks React bundle size optimization
//   16. Line 903: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 907: Error message without production error code - breaks React bundle size optimization
//   18. Line 907: Error message without production error code - breaks React bundle size optimization
//   19. Line 908: Error message without production error code - breaks React bundle size optimization
//   20. Line 908: Error message without production error code - breaks React bundle size optimization
//   21. Line 911: Error message without production error code - breaks React bundle size optimization
//   22. Line 911: Error message without production error code - breaks React bundle size optimization
//   23. Line 912: Error message without production error code - breaks React bundle size optimization
//   24. Line 912: Error message without production error code - breaks React bundle size optimization
//   25. Line 913: Error message without production error code - breaks React bundle size optimization
//   26. Line 913: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 924: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 928: Error message without production error code - breaks React bundle size optimization
//   3. Line 928: Error message without production error code - breaks React bundle size optimization
//   4. Line 929: Error message without production error code - breaks React bundle size optimization
//   5. Line 929: Error message without production error code - breaks React bundle size optimization
//   6. Line 930: Error message without production error code - breaks React bundle size optimization
//   7. Line 930: Error message without production error code - breaks React bundle size optimization
//   8. Line 931: Error message without production error code - breaks React bundle size optimization
//   9. Line 931: Error message without production error code - breaks React bundle size optimization
//   10. Line 932: Error message without production error code - breaks React bundle size optimization
//   11. Line 932: Error message without production error code - breaks React bundle size optimization
//   12. Line 933: Error message without production error code - breaks React bundle size optimization
//   13. Line 933: Error message without production error code - breaks React bundle size optimization
//   14. Line 934: Error message without production error code - breaks React bundle size optimization
//   15. Line 934: Error message without production error code - breaks React bundle size optimization
//   16. Line 937: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 941: Error message without production error code - breaks React bundle size optimization
//   18. Line 941: Error message without production error code - breaks React bundle size optimization
//   19. Line 942: Error message without production error code - breaks React bundle size optimization
//   20. Line 942: Error message without production error code - breaks React bundle size optimization
//   21. Line 945: Error message without production error code - breaks React bundle size optimization
//   22. Line 945: Error message without production error code - breaks React bundle size optimization
//   23. Line 946: Error message without production error code - breaks React bundle size optimization
//   24. Line 946: Error message without production error code - breaks React bundle size optimization
//   25. Line 947: Error message without production error code - breaks React bundle size optimization
//   26. Line 947: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 958: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 962: Error message without production error code - breaks React bundle size optimization
//   3. Line 962: Error message without production error code - breaks React bundle size optimization
//   4. Line 963: Error message without production error code - breaks React bundle size optimization
//   5. Line 963: Error message without production error code - breaks React bundle size optimization
//   6. Line 964: Error message without production error code - breaks React bundle size optimization
//   7. Line 964: Error message without production error code - breaks React bundle size optimization
//   8. Line 965: Error message without production error code - breaks React bundle size optimization
//   9. Line 965: Error message without production error code - breaks React bundle size optimization
//   10. Line 966: Error message without production error code - breaks React bundle size optimization
//   11. Line 966: Error message without production error code - breaks React bundle size optimization
//   12. Line 967: Error message without production error code - breaks React bundle size optimization
//   13. Line 967: Error message without production error code - breaks React bundle size optimization
//   14. Line 968: Error message without production error code - breaks React bundle size optimization
//   15. Line 968: Error message without production error code - breaks React bundle size optimization
//   16. Line 971: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 975: Error message without production error code - breaks React bundle size optimization
//   18. Line 975: Error message without production error code - breaks React bundle size optimization
//   19. Line 976: Error message without production error code - breaks React bundle size optimization
//   20. Line 976: Error message without production error code - breaks React bundle size optimization
//   21. Line 979: Error message without production error code - breaks React bundle size optimization
//   22. Line 979: Error message without production error code - breaks React bundle size optimization
//   23. Line 980: Error message without production error code - breaks React bundle size optimization
//   24. Line 980: Error message without production error code - breaks React bundle size optimization
//   25. Line 981: Error message without production error code - breaks React bundle size optimization
//   26. Line 981: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

// VIOLATION: VSCODE-SERVICE-BRAND-005 - Missing service brand declaration - breaks VSCode's DI system type safety
// SEVERITY: ERROR
// ISSUES FOUND (26):
//   1. Line 992: Missing service brand declaration - breaks VSCode's DI system type safety
//   2. Line 996: Error message without production error code - breaks React bundle size optimization
//   3. Line 996: Error message without production error code - breaks React bundle size optimization
//   4. Line 997: Error message without production error code - breaks React bundle size optimization
//   5. Line 997: Error message without production error code - breaks React bundle size optimization
//   6. Line 998: Error message without production error code - breaks React bundle size optimization
//   7. Line 998: Error message without production error code - breaks React bundle size optimization
//   8. Line 999: Error message without production error code - breaks React bundle size optimization
//   9. Line 999: Error message without production error code - breaks React bundle size optimization
//   10. Line 1000: Error message without production error code - breaks React bundle size optimization
//   11. Line 1000: Error message without production error code - breaks React bundle size optimization
//   12. Line 1001: Error message without production error code - breaks React bundle size optimization
//   13. Line 1001: Error message without production error code - breaks React bundle size optimization
//   14. Line 1002: Error message without production error code - breaks React bundle size optimization
//   15. Line 1002: Error message without production error code - breaks React bundle size optimization
//   16. Line 1005: Missing service brand declaration - breaks VSCode's DI system type safety
//   17. Line 1009: Error message without production error code - breaks React bundle size optimization
//   18. Line 1009: Error message without production error code - breaks React bundle size optimization
//   19. Line 1010: Error message without production error code - breaks React bundle size optimization
//   20. Line 1010: Error message without production error code - breaks React bundle size optimization
//   21. Line 1013: Error message without production error code - breaks React bundle size optimization
//   22. Line 1013: Error message without production error code - breaks React bundle size optimization
//   23. Line 1014: Error message without production error code - breaks React bundle size optimization
//   24. Line 1014: Error message without production error code - breaks React bundle size optimization
//   25. Line 1015: Error message without production error code - breaks React bundle size optimization
//   26. Line 1015: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Service brands enable compile-time DI validation - missing brands cause runtime injection failures in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Add readonly _serviceBrand: undefined; to service interface for Enterprise_Editor
// BUSINESS_IMPACT: Service injection failures break VSCode features during startup affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Dependency-Injection#service-branding

	class TestDialogMainService implements IDialogMainService {

		declare readonly _serviceBrand: undefined;

		pickFileFolder(options: INativeOpenDialogOptions, window?: Electron.BrowserWindow | undefined): Promise<string[] | undefined> { throw new Error('Method not implemented.'); }
		pickFolder(options: INativeOpenDialogOptions, window?: Electron.BrowserWindow | undefined): Promise<string[] | undefined> { throw new Error('Method not implemented.'); }
		pickFile(options: INativeOpenDialogOptions, window?: Electron.BrowserWindow | undefined): Promise<string[] | undefined> { throw new Error('Method not implemented.'); }
		pickWorkspace(options: INativeOpenDialogOptions, window?: Electron.BrowserWindow | undefined): Promise<string[] | undefined> { throw new Error('Method not implemented.'); }
		showMessageBox(options: Electron.MessageBoxOptions, window?: Electron.BrowserWindow | undefined): Promise<Electron.MessageBoxReturnValue> { throw new Error('Method not implemented.'); }
		showSaveDialog(options: Electron.SaveDialogOptions, window?: Electron.BrowserWindow | undefined): Promise<Electron.SaveDialogReturnValue> { throw new Error('Method not implemented.'); }
		showOpenDialog(options: Electron.OpenDialogOptions, window?: Electron.BrowserWindow | undefined): Promise<Electron.OpenDialogReturnValue> { throw new Error('Method not implemented.'); }
	}

	class TestBackupMainService implements IBackupMainService {

		declare readonly _serviceBrand: undefined;

		isHotExitEnabled(): boolean { throw new Error('Method not implemented.'); }
		getEmptyWindowBackups(): IEmptyWindowBackupInfo[] { throw new Error('Method not implemented.'); }
		registerWorkspaceBackup(workspaceInfo: IWorkspaceBackupInfo): string;
		registerWorkspaceBackup(workspaceInfo: IWorkspaceBackupInfo, migrateFrom: string): Promise<string>;
		registerWorkspaceBackup(workspaceInfo: unknown, migrateFrom?: unknown): string | Promise<string> { throw new Error('Method not implemented.'); }
		registerFolderBackup(folder: IFolderBackupInfo): string { throw new Error('Method not implemented.'); }
		registerEmptyWindowBackup(empty: IEmptyWindowBackupInfo): string { throw new Error('Method not implemented.'); }
		async getDirtyWorkspaces(): Promise<(IWorkspaceBackupInfo | IFolderBackupInfo)[]> { return []; }
	}

	function createUntitledWorkspace(folders: string[], names?: string[]) {
		return service.createUntitledWorkspace(folders.map((folder, index) => ({ uri: URI.file(folder), name: names ? names[index] : undefined } as IWorkspaceFolderCreationData)));
	}

	function createWorkspace(workspaceConfigPath: string, folders: (string | URI)[], names?: string[]): void {
		const ws: IStoredWorkspace = {
			folders: []
		};

		for (let i = 0; i < folders.length; i++) {
			const f = folders[i];
			const s: IStoredWorkspaceFolder = f instanceof URI ? { uri: f.toString() } : { path: f };
			if (names) {
				s.name = names[i];
			}
			ws.folders.push(s);
		}

		fs.writeFileSync(workspaceConfigPath, JSON.stringify(ws));
	}

	let testDir: string;
	let untitledWorkspacesHomePath: string;
	let environmentMainService: EnvironmentMainService;
	let service: WorkspacesManagementMainService;

	const cwd = process.cwd();
	const tmpDir = os.tmpdir();

	setup(async () => {
		testDir = getRandomTestPath(tmpDir, 'vsctests', 'workspacesmanagementmainservice');
		untitledWorkspacesHomePath = path.join(testDir, 'Workspaces');

		const productService: IProductService = { _serviceBrand: undefined, ...product };

		environmentMainService = new class TestEnvironmentService extends EnvironmentMainService {

			constructor() {
				super(parseArgs(process.argv, OPTIONS), productService);
			}

			override get untitledWorkspacesHome(): URI {
				return URI.file(untitledWorkspacesHomePath);
			}
		};

		const logService = new NullLogService();
		const fileService = new FileService(logService);
		service = new WorkspacesManagementMainService(environmentMainService, logService, new UserDataProfilesMainService(new StateService(SaveStrategy.DELAYED, environmentMainService, logService, fileService), new UriIdentityService(fileService), environmentMainService, fileService, logService), new TestBackupMainService(), new TestDialogMainService());

		return fs.promises.mkdir(untitledWorkspacesHomePath, { recursive: true });
	});

	teardown(() => {
		service.dispose();

		return pfs.Promises.rm(testDir);
	});

	function assertPathEquals(pathInWorkspaceFile: string, pathOnDisk: string): void {
		if (isWindows) {
			pathInWorkspaceFile = normalizeDriveLetter(pathInWorkspaceFile);
			pathOnDisk = normalizeDriveLetter(pathOnDisk);
			if (!isUNC(pathOnDisk)) {
				pathOnDisk = toSlashes(pathOnDisk); // workspace file is using slashes for all paths except where mandatory
			}
		}

		assert.strictEqual(pathInWorkspaceFile, pathOnDisk);
	}

	function assertEqualURI(u1: URI, u2: URI): void {
		assert.strictEqual(u1.toString(), u2.toString());
	}

	test('createWorkspace (folders)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir]);
		assert.ok(workspace);
		assert.ok(fs.existsSync(workspace.configPath.fsPath));
		assert.ok(service.isUntitledWorkspace(workspace));

		const ws = (JSON.parse(fs.readFileSync(workspace.configPath.fsPath).toString()) as IStoredWorkspace);
		assert.strictEqual(ws.folders.length, 2);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[0]).path, cwd);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[1]).path, tmpDir);
		assert.ok(!(<IRawFileWorkspaceFolder>ws.folders[0]).name);
		assert.ok(!(<IRawFileWorkspaceFolder>ws.folders[1]).name);
	});

	test('createWorkspace (folders with name)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir], ['currentworkingdirectory', 'tempdir']);
		assert.ok(workspace);
		assert.ok(fs.existsSync(workspace.configPath.fsPath));
		assert.ok(service.isUntitledWorkspace(workspace));

		const ws = (JSON.parse(fs.readFileSync(workspace.configPath.fsPath).toString()) as IStoredWorkspace);
		assert.strictEqual(ws.folders.length, 2);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[0]).path, cwd);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[1]).path, tmpDir);
		assert.strictEqual((<IRawFileWorkspaceFolder>ws.folders[0]).name, 'currentworkingdirectory');
		assert.strictEqual((<IRawFileWorkspaceFolder>ws.folders[1]).name, 'tempdir');
	});

	test('createUntitledWorkspace (folders as other resource URIs)', async () => {
		const folder1URI = URI.parse('myscheme://server/work/p/f1');
		const folder2URI = URI.parse('myscheme://server/work/o/f3');

		const workspace = await service.createUntitledWorkspace([{ uri: folder1URI }, { uri: folder2URI }], 'server');
		assert.ok(workspace);
		assert.ok(fs.existsSync(workspace.configPath.fsPath));
		assert.ok(service.isUntitledWorkspace(workspace));

		const ws = (JSON.parse(fs.readFileSync(workspace.configPath.fsPath).toString()) as IStoredWorkspace);
		assert.strictEqual(ws.folders.length, 2);
		assert.strictEqual((<IRawUriWorkspaceFolder>ws.folders[0]).uri, folder1URI.toString(true));
		assert.strictEqual((<IRawUriWorkspaceFolder>ws.folders[1]).uri, folder2URI.toString(true));
		assert.ok(!(<IRawFileWorkspaceFolder>ws.folders[0]).name);
		assert.ok(!(<IRawFileWorkspaceFolder>ws.folders[1]).name);
		assert.strictEqual(ws.remoteAuthority, 'server');
	});

	test('resolveWorkspace', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir]);
		assert.ok(await service.resolveLocalWorkspace(workspace.configPath));

		// make it a valid workspace path
		const newPath = path.join(path.dirname(workspace.configPath.fsPath), `workspace.${WORKSPACE_EXTENSION}`);
		fs.renameSync(workspace.configPath.fsPath, newPath);
		workspace.configPath = URI.file(newPath);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 196: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 197: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 198: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		const resolved = await service.resolveLocalWorkspace(workspace.configPath);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 243: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 245: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 288: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 289: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 290: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 333: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 334: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 335: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 378: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 423: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 424: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 425: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 469: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 470: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 513: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 514: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 515: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 558: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 559: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 560: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 603: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 604: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 605: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 648: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 649: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 650: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 693: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 694: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 695: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 738: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 739: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 740: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 783: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 784: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 785: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 828: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 829: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 830: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 873: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 874: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 875: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 918: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 919: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 920: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 963: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 964: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 965: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1008: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1009: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1010: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1053: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1054: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1055: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1098: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1099: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1100: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1143: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1144: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1145: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1188: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1189: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1190: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1233: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1234: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1235: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1278: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1279: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1280: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1323: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1324: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1325: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1368: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1369: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1370: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1413: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1414: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1415: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 1458: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1459: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1460: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(2, resolved!.folders.length);
		assertEqualURI(resolved!.configPath, workspace.configPath);
		assert.ok(resolved!.id);
		fs.writeFileSync(workspace.configPath.fsPath, JSON.stringify({ something: 'something' })); // invalid workspace

		const resolvedInvalid = await service.resolveLocalWorkspace(workspace.configPath);
		assert.ok(!resolvedInvalid);

		fs.writeFileSync(workspace.configPath.fsPath, JSON.stringify({ transient: true, folders: [] })); // transient worksapce
		const resolvedTransient = await service.resolveLocalWorkspace(workspace.configPath);
		assert.ok(resolvedTransient?.transient);
	});

	test('resolveWorkspace (support relative paths)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir]);
		fs.writeFileSync(workspace.configPath.fsPath, JSON.stringify({ folders: [{ path: './ticino-playground/lib' }] }));
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 230: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 238: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		const resolved = await service.resolveLocalWorkspace(workspace.configPath);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 273: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 281: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 289: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 297: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 330: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 346: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 354: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 387: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 395: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 403: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 411: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 444: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 452: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 460: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 501: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 509: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 517: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 525: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 558: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 566: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 574: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 582: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 615: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 623: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 631: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 639: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 672: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 680: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 688: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 696: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 729: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 737: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 745: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 753: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 786: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 794: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 802: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 810: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 843: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 851: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 859: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 867: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 900: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 908: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 916: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 924: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 957: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 965: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 973: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 981: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1014: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1022: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1030: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1038: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1071: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1079: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1087: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1095: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1128: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1136: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1144: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1152: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1185: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1193: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1201: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1209: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1242: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1250: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1258: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1266: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1299: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1307: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1315: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1323: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1356: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1364: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1372: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1380: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1413: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1421: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1429: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1437: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1470: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1478: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1486: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1494: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1527: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1535: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1543: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1551: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1584: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1592: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1600: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1608: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1641: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1649: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1657: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1665: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1698: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1706: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1714: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1722: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1755: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1763: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1771: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1779: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 1812: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1820: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1828: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1836: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assertEqualURI(resolved!.folders[0].uri, URI.file(path.join(path.dirname(workspace.configPath.fsPath), 'ticino-playground', 'lib')));
	});

	test('resolveWorkspace (support relative paths #2)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir]);
		fs.writeFileSync(workspace.configPath.fsPath, JSON.stringify({ folders: [{ path: './ticino-playground/lib/../other' }] }));

		const resolved = await service.resolveLocalWorkspace(workspace.configPath);
		assertEqualURI(resolved!.folders[0].uri, URI.file(path.join(path.dirname(workspace.configPath.fsPath), 'ticino-playground', 'other')));
	});

	test('resolveWorkspace (support relative paths #3)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir]);
		fs.writeFileSync(workspace.configPath.fsPath, JSON.stringify({ folders: [{ path: 'ticino-playground/lib' }] }));

		const resolved = await service.resolveLocalWorkspace(workspace.configPath);
		assertEqualURI(resolved!.folders[0].uri, URI.file(path.join(path.dirname(workspace.configPath.fsPath), 'ticino-playground', 'lib')));
	});

	test('resolveWorkspace (support invalid JSON via fault tolerant parsing)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir]);
		fs.writeFileSync(workspace.configPath.fsPath, '{ "folders": [ { "path": "./ticino-playground/lib" } , ] }'); // trailing comma

		const resolved = await service.resolveLocalWorkspace(workspace.configPath);
		assertEqualURI(resolved!.folders[0].uri, URI.file(path.join(path.dirname(workspace.configPath.fsPath), 'ticino-playground', 'lib')));
	});

	test('rewriteWorkspaceFileForNewLocation', async () => {
		const folder1 = cwd;  // absolute path because outside of tmpDir
		const tmpInsideDir = path.join(tmpDir, 'inside');

		const firstConfigPath = path.join(tmpDir, 'myworkspace0.code-workspace');
		createWorkspace(firstConfigPath, [folder1, 'inside', path.join('inside', 'somefolder')]);
		const origContent = fs.readFileSync(firstConfigPath).toString();

		let origConfigPath = URI.file(firstConfigPath);
		let workspaceConfigPath = URI.file(path.join(tmpDir, 'inside', 'myworkspace1.code-workspace'));
		let newContent = rewriteWorkspaceFileForNewLocation(origContent, origConfigPath, false, workspaceConfigPath, extUriBiasedIgnorePathCase);
		let ws = (JSON.parse(newContent) as IStoredWorkspace);
		assert.strictEqual(ws.folders.length, 3);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[0]).path, folder1); // absolute path because outside of tmpdir
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[1]).path, '.');
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[2]).path, 'somefolder');

		origConfigPath = workspaceConfigPath;
		workspaceConfigPath = URI.file(path.join(tmpDir, 'myworkspace2.code-workspace'));
		newContent = rewriteWorkspaceFileForNewLocation(newContent, origConfigPath, false, workspaceConfigPath, extUriBiasedIgnorePathCase);
		ws = (JSON.parse(newContent) as IStoredWorkspace);
		assert.strictEqual(ws.folders.length, 3);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[0]).path, folder1);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[1]).path, 'inside');
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[2]).path, 'inside/somefolder');

		origConfigPath = workspaceConfigPath;
		workspaceConfigPath = URI.file(path.join(tmpDir, 'other', 'myworkspace2.code-workspace'));
		newContent = rewriteWorkspaceFileForNewLocation(newContent, origConfigPath, false, workspaceConfigPath, extUriBiasedIgnorePathCase);
		ws = (JSON.parse(newContent) as IStoredWorkspace);
		assert.strictEqual(ws.folders.length, 3);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[0]).path, folder1);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[1]).path, '../inside');
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[2]).path, '../inside/somefolder');

		origConfigPath = workspaceConfigPath;
		workspaceConfigPath = URI.parse('foo://foo/bar/myworkspace2.code-workspace');
		newContent = rewriteWorkspaceFileForNewLocation(newContent, origConfigPath, false, workspaceConfigPath, extUriBiasedIgnorePathCase);
		ws = (JSON.parse(newContent) as IStoredWorkspace);
		assert.strictEqual(ws.folders.length, 3);
		assert.strictEqual((<IRawUriWorkspaceFolder>ws.folders[0]).uri, URI.file(folder1).toString(true));
		assert.strictEqual((<IRawUriWorkspaceFolder>ws.folders[1]).uri, URI.file(tmpInsideDir).toString(true));
		assert.strictEqual((<IRawUriWorkspaceFolder>ws.folders[2]).uri, URI.file(path.join(tmpInsideDir, 'somefolder')).toString(true));

		fs.unlinkSync(firstConfigPath);
	});

	test('rewriteWorkspaceFileForNewLocation (preserves comments)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir, path.join(tmpDir, 'somefolder')]);
		const workspaceConfigPath = URI.file(path.join(tmpDir, `myworkspace.${Date.now()}.${WORKSPACE_EXTENSION}`));

		let origContent = fs.readFileSync(workspace.configPath.fsPath).toString();
		origContent = `// this is a comment\n${origContent}`;

		const newContent = rewriteWorkspaceFileForNewLocation(origContent, workspace.configPath, false, workspaceConfigPath, extUriBiasedIgnorePathCase);
		assert.strictEqual(0, newContent.indexOf('// this is a comment'));
		await service.deleteUntitledWorkspace(workspace);
	});

	test('rewriteWorkspaceFileForNewLocation (preserves forward slashes)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir, path.join(tmpDir, 'somefolder')]);
		const workspaceConfigPath = URI.file(path.join(tmpDir, `myworkspace.${Date.now()}.${WORKSPACE_EXTENSION}`));

		let origContent = fs.readFileSync(workspace.configPath.fsPath).toString();
		origContent = origContent.replace(/[\\]/g, '/'); // convert backslash to slash

		const newContent = rewriteWorkspaceFileForNewLocation(origContent, workspace.configPath, false, workspaceConfigPath, extUriBiasedIgnorePathCase);
		const ws = (JSON.parse(newContent) as IStoredWorkspace);
		assert.ok(ws.folders.every(f => (<IRawFileWorkspaceFolder>f).path.indexOf('\\') < 0));
		await service.deleteUntitledWorkspace(workspace);
	});

	(!isWindows ? test.skip : test)('rewriteWorkspaceFileForNewLocation (unc paths)', async () => {
		const workspaceLocation = path.join(tmpDir, 'wsloc');
		const folder1Location = 'x:\\foo';
		const folder2Location = '\\\\server\\share2\\some\\path';
		const folder3Location = path.join(workspaceLocation, 'inner', 'more');

		const workspace = await createUntitledWorkspace([folder1Location, folder2Location, folder3Location]);
		const workspaceConfigPath = URI.file(path.join(workspaceLocation, `myworkspace.${Date.now()}.${WORKSPACE_EXTENSION}`));
		const origContent = fs.readFileSync(workspace.configPath.fsPath).toString();
		const newContent = rewriteWorkspaceFileForNewLocation(origContent, workspace.configPath, true, workspaceConfigPath, extUriBiasedIgnorePathCase);
		const ws = (JSON.parse(newContent) as IStoredWorkspace);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[0]).path, folder1Location);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[1]).path, folder2Location);
		assertPathEquals((<IRawFileWorkspaceFolder>ws.folders[2]).path, 'inner/more');

		await service.deleteUntitledWorkspace(workspace);
	});

	test('deleteUntitledWorkspace (untitled)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir]);
		assert.ok(fs.existsSync(workspace.configPath.fsPath));
		await service.deleteUntitledWorkspace(workspace);
		assert.ok(!fs.existsSync(workspace.configPath.fsPath));
	});

	test('deleteUntitledWorkspace (saved)', async () => {
		const workspace = await createUntitledWorkspace([cwd, tmpDir]);
		await service.deleteUntitledWorkspace(workspace);
	});

	test('getUntitledWorkspace', async function () {
		await service.initialize();
		let untitled = service.getUntitledWorkspaces();
		assert.strictEqual(untitled.length, 0);

		const untitledOne = await createUntitledWorkspace([cwd, tmpDir]);
		assert.ok(fs.existsSync(untitledOne.configPath.fsPath));

		await service.initialize();
		untitled = service.getUntitledWorkspaces();
		assert.strictEqual(1, untitled.length);
		assert.strictEqual(untitledOne.id, untitled[0].workspace.id);

		await service.deleteUntitledWorkspace(untitledOne);
		await service.initialize();
		untitled = service.getUntitledWorkspaces();
		assert.strictEqual(0, untitled.length);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
