//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { OpenerService } from '../../../browser/services/openerService.js';
import { TestCodeEditorService } from '../editorTestServices.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { NullCommandService } from '../../../../platform/commands/test/common/nullCommandService.js';
import { ITextEditorOptions } from '../../../../platform/editor/common/editor.js';
import { matchesScheme, matchesSomeScheme } from '../../../../base/common/network.js';
import { TestThemeService } from '../../../../platform/theme/test/common/testThemeService.js';

suite('OpenerService', function () {
	const themeService = new TestThemeService();
	const editorService = new TestCodeEditorService(themeService);

	let lastCommand: { id: string; args: any[] } | undefined;

	const commandService = new (class implements ICommandService {
		declare readonly _serviceBrand: undefined;
		onWillExecuteCommand = () => Disposable.None;
		onDidExecuteCommand = () => Disposable.None;
		executeCommand(id: string, ...args: any[]): Promise<any> {
			lastCommand = { id, args };
			return Promise.resolve(undefined);
		}
	})();

	setup(function () {
		lastCommand = undefined;
	});

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('delegate to editorService, scheme:///fff', async function () {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 42: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 49: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 49: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 50: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 50: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 51: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 51: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 52: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 52: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 53: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 56: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 56: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 57: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 57: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 60: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 60: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 61: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 61: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 62: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 62: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 63: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 63: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 64: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 71: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 71: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 72: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 72: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 73: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 73: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 74: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 74: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 75: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 78: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 78: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 79: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 79: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 80: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 80: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 81: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 81: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 82: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const openerService = new OpenerService(editorService, NullCommandService);
		await openerService.open(URI.parse('another:///somepath'));
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 93: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 100: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 100: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 101: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 101: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 102: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 102: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 103: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 103: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 104: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 107: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 107: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 108: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 108: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 111: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 111: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 112: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 112: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 113: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 113: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 114: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 114: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 115: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 122: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 122: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 123: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 124: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 124: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 125: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 125: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 126: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 129: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 131: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 131: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 132: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 132: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 133: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 142: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 149: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 149: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 150: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 150: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 151: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 152: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 153: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 156: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 157: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 160: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 161: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 161: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 162: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 162: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 163: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 163: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 164: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 171: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 172: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 173: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 174: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 175: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 178: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 180: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 180: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 182: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 191: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 198: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 198: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 199: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 200: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 201: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 201: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 202: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 205: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 205: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 206: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 206: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 209: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 209: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 210: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 211: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 212: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 213: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 220: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 220: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 221: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 222: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 224: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 227: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 227: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 228: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 229: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 230: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 230: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 231: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 240: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 247: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 248: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 248: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 249: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 249: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 250: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 250: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 251: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 258: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 258: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 261: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 261: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 262: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 269: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 269: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 270: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 270: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 271: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 272: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 272: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 273: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 276: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 276: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 277: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 278: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 278: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 280: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 289: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 296: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 296: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 297: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 297: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 298: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 299: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 299: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 300: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 303: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 303: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 304: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 304: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 307: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 307: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 308: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 308: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 309: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 309: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 310: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 310: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 311: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 318: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 318: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 319: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 319: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 320: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 320: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 321: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 321: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 322: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 325: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 325: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 326: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 326: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 327: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 327: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 328: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 328: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 329: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 338: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 345: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 345: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 346: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 346: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 347: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 348: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 349: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 352: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 353: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 353: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 357: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 357: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 358: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 358: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 359: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 359: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 360: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 367: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 367: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 369: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 369: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 370: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 370: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 371: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 374: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 374: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 375: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 376: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 376: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 378: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 387: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 394: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 394: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 395: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 395: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 396: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 396: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 397: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 397: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 401: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 401: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 402: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 402: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 405: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 405: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 406: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 406: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 407: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 407: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 408: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 408: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 409: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 417: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 417: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 418: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 418: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 419: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 419: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 420: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 423: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 423: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 424: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 424: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 425: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 425: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 426: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 426: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 427: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 436: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 443: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 443: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 444: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 444: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 445: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 445: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 446: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 446: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 447: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 450: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 450: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 451: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 451: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 454: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 454: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 455: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 455: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 458: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 465: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 465: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 466: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 466: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 467: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 467: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 469: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 472: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 472: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 473: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 473: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 474: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 474: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 475: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 475: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 476: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 485: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 492: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 492: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 493: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 493: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 494: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 494: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 495: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 495: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 496: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 499: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 499: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 500: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 500: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 503: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 503: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 504: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 504: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 505: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 505: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 506: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 506: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 507: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 514: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 514: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 515: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 515: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 516: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 516: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 517: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 517: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 518: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 521: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 521: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 522: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 522: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 523: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 523: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 524: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 524: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 525: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 534: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 541: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 541: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 542: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 542: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 543: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 543: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 544: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 544: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 545: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 548: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 548: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 549: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 549: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 552: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 552: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 553: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 553: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 554: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 554: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 555: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 555: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 556: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 563: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 563: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 564: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 564: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 565: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 565: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 566: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 566: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 567: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 570: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 570: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 571: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 571: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 572: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 572: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 573: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 573: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 574: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 583: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 590: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 590: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 591: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 591: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 592: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 592: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 593: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 593: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 594: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 597: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 597: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 598: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 598: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 601: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 601: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 602: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 602: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 603: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 603: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 604: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 604: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 605: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 612: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 612: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 613: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 613: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 614: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 614: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 615: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 615: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 616: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 619: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 619: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 620: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 620: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 621: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 621: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 622: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 622: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 623: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 632: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 639: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 639: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 640: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 640: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 641: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 641: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 642: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 642: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 643: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 646: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 646: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 647: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 647: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 650: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 650: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 651: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 651: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 652: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 652: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 653: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 653: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 654: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 661: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 661: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 662: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 662: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 663: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 663: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 664: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 664: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 665: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 668: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 668: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 669: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 669: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 670: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 670: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 671: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 671: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 672: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 681: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 688: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 688: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 689: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 689: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 690: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 690: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 691: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 691: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 692: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 695: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 695: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 696: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 696: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 699: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 699: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 700: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 700: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 701: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 701: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 702: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 702: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 703: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 710: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 710: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 711: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 711: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 712: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 712: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 713: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 713: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 714: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 717: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 717: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 718: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 718: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 719: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 719: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 720: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 720: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 721: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 730: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 737: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 737: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 738: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 738: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 739: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 739: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 740: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 740: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 741: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 744: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 744: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 745: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 745: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 748: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 748: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 749: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 749: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 750: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 750: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 751: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 751: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 752: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 759: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 759: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 760: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 760: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 761: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 761: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 762: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 762: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 763: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 766: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 766: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 767: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 767: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 768: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 768: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 769: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 769: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 770: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 779: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 786: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 786: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 787: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 787: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 788: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 788: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 789: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 789: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 790: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 793: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 793: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 794: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 794: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 797: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 797: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 798: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 798: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 799: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 799: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 800: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 800: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 801: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 808: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 808: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 809: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 809: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 810: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 810: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 811: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 811: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 812: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 815: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 815: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 816: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 816: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 817: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 817: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 818: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 818: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 819: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 828: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 835: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 835: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 836: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 836: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 837: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 837: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 838: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 838: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 839: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 842: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 842: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 843: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 843: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 846: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 846: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 847: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 847: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 848: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 848: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 849: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 849: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 850: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 857: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 857: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 858: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 858: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 859: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 859: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 860: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 860: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 861: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 864: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 864: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 865: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 865: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 866: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 866: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 867: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 867: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 868: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 877: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 884: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 884: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 885: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 885: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 886: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 886: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 887: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 887: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 888: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 891: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 891: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 892: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 892: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 895: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 895: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 896: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 896: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 897: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 897: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 898: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 898: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 899: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 906: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 906: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 907: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 907: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 908: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 908: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 909: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 909: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 910: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 913: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 913: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 914: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 914: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 915: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 915: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 916: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 916: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 917: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 926: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 933: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 933: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 934: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 934: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 935: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 935: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 936: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 936: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 937: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 940: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 940: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 941: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 941: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 944: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 944: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 945: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 945: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 946: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 946: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 947: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 947: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 948: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 955: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 955: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 956: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 956: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 957: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 957: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 958: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 958: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 959: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 962: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 962: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 963: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 963: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 964: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 964: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 965: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 965: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 966: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 975: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 982: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 982: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 983: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 983: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 984: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 984: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 985: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 985: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 986: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 989: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 989: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 990: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 990: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 993: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 993: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 994: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 994: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 995: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 995: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 996: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 996: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 997: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 1004: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 1004: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 1005: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 1005: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 1006: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 1006: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 1007: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 1007: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 1008: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 1011: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 1011: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 1012: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 1012: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 1013: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 1013: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 1014: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 1014: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 1015: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 1024: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1031: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1031: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1032: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1032: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1033: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1033: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1034: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1034: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1035: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1038: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1038: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 1039: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 1039: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 1042: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 1042: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 1043: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 1043: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 1044: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 1044: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 1045: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 1045: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 1046: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 1053: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 1053: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 1054: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 1054: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 1055: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 1055: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 1056: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 1056: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 1057: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 1060: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 1060: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 1061: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 1061: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 1062: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 1062: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 1063: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 1063: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 1064: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 1073: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1080: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1080: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1081: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1081: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1082: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1082: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1083: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1083: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1084: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1087: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1087: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 1088: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 1088: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 1091: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 1091: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 1092: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 1092: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 1093: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 1093: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 1094: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 1094: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 1095: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 1102: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 1102: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 1103: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 1103: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 1104: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 1104: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 1105: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 1105: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 1106: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 1109: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 1109: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 1110: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 1110: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 1111: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 1111: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 1112: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 1112: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 1113: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 1122: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1129: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1129: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1130: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1130: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1131: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1131: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1132: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1132: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1133: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1136: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1136: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 1137: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 1137: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 1140: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 1140: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 1141: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 1141: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 1142: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 1142: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 1143: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 1143: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 1144: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 1151: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 1151: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 1152: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 1152: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 1153: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 1153: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 1154: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 1154: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 1155: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 1158: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 1158: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 1159: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 1159: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 1160: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 1160: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 1161: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 1161: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 1162: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 1171: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1178: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1178: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1179: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1179: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1180: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1180: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1181: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1181: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1182: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1185: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1185: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 1186: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 1186: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 1189: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 1189: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 1190: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 1190: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 1191: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 1191: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 1192: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 1192: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 1193: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 1200: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 1200: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 1201: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 1201: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 1202: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 1202: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 1203: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 1203: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 1204: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 1207: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 1207: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 1208: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 1208: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 1209: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 1209: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 1210: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 1210: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 1211: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 1220: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1227: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1227: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1228: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1228: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1229: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1229: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1230: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1230: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1231: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1234: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1234: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 1235: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 1235: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 1238: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 1238: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 1239: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 1239: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 1240: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 1240: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 1241: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 1241: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 1242: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 1249: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 1249: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 1250: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 1250: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 1251: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 1251: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 1252: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 1252: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 1253: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 1256: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 1256: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 1257: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 1257: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 1258: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 1258: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 1259: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 1259: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 1260: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 1269: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1276: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1276: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1277: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1277: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1278: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1278: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1279: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1279: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1280: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1283: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1283: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 1284: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 1284: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 1287: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 1287: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 1288: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 1288: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 1289: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 1289: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 1290: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 1290: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 1291: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 1298: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 1298: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 1299: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 1299: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 1300: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 1300: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 1301: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 1301: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 1302: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 1305: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 1305: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 1306: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 1306: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 1307: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 1307: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 1308: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 1308: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 1309: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (41):
//   1. Line 1318: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1325: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1325: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1326: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1326: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1327: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1327: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1328: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1328: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1329: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1332: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1332: Dangerous type assertion in VSCode source - runtime type error risk
//   13. Line 1333: Dangerous type assertion in VSCode source - runtime type error risk
//   14. Line 1333: Dangerous type assertion in VSCode source - runtime type error risk
//   15. Line 1336: Dangerous type assertion in VSCode source - runtime type error risk
//   16. Line 1336: Dangerous type assertion in VSCode source - runtime type error risk
//   17. Line 1337: Dangerous type assertion in VSCode source - runtime type error risk
//   18. Line 1337: Dangerous type assertion in VSCode source - runtime type error risk
//   19. Line 1338: Dangerous type assertion in VSCode source - runtime type error risk
//   20. Line 1338: Dangerous type assertion in VSCode source - runtime type error risk
//   21. Line 1339: Dangerous type assertion in VSCode source - runtime type error risk
//   22. Line 1339: Dangerous type assertion in VSCode source - runtime type error risk
//   23. Line 1340: Dangerous type assertion in VSCode source - runtime type error risk
//   24. Line 1347: Dangerous type assertion in VSCode source - runtime type error risk
//   25. Line 1347: Dangerous type assertion in VSCode source - runtime type error risk
//   26. Line 1348: Dangerous type assertion in VSCode source - runtime type error risk
//   27. Line 1348: Dangerous type assertion in VSCode source - runtime type error risk
//   28. Line 1349: Dangerous type assertion in VSCode source - runtime type error risk
//   29. Line 1349: Dangerous type assertion in VSCode source - runtime type error risk
//   30. Line 1350: Dangerous type assertion in VSCode source - runtime type error risk
//   31. Line 1350: Dangerous type assertion in VSCode source - runtime type error risk
//   32. Line 1351: Dangerous type assertion in VSCode source - runtime type error risk
//   33. Line 1354: Dangerous type assertion in VSCode source - runtime type error risk
//   34. Line 1354: Dangerous type assertion in VSCode source - runtime type error risk
//   35. Line 1355: Dangerous type assertion in VSCode source - runtime type error risk
//   36. Line 1355: Dangerous type assertion in VSCode source - runtime type error risk
//   37. Line 1356: Dangerous type assertion in VSCode source - runtime type error risk
//   38. Line 1356: Dangerous type assertion in VSCode source - runtime type error risk
//   39. Line 1357: Dangerous type assertion in VSCode source - runtime type error risk
//   40. Line 1357: Dangerous type assertion in VSCode source - runtime type error risk
//   41. Line 1358: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection, undefined);
	});

	test('delegate to editorService, scheme:///fff#L123', async function () {
		const openerService = new OpenerService(editorService, NullCommandService);

		await openerService.open(URI.parse('file:///somepath#L23'));
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startLineNumber, 23);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startColumn, 1);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endLineNumber, undefined);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endColumn, undefined);
		assert.strictEqual(editorService.lastInput!.resource.fragment, '');

		await openerService.open(URI.parse('another:///somepath#L23'));
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startLineNumber, 23);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startColumn, 1);

		await openerService.open(URI.parse('another:///somepath#L23,45'));
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startLineNumber, 23);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startColumn, 45);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endLineNumber, undefined);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endColumn, undefined);
		assert.strictEqual(editorService.lastInput!.resource.fragment, '');
	});

	test('delegate to editorService, scheme:///fff#123,123', async function () {
		const openerService = new OpenerService(editorService, NullCommandService);

		await openerService.open(URI.parse('file:///somepath#23'));
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startLineNumber, 23);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startColumn, 1);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endLineNumber, undefined);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endColumn, undefined);
		assert.strictEqual(editorService.lastInput!.resource.fragment, '');

		await openerService.open(URI.parse('file:///somepath#23,45'));
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startLineNumber, 23);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startColumn, 45);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endLineNumber, undefined);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endColumn, undefined);
		assert.strictEqual(editorService.lastInput!.resource.fragment, '');
	});

	test('delegate to commandsService, command:someid', async function () {
		const openerService = new OpenerService(editorService, commandService);

		const id = `aCommand${Math.random()}`;
		store.add(CommandsRegistry.registerCommand(id, function () { }));

		assert.strictEqual(lastCommand, undefined);
		await openerService.open(URI.parse('command:' + id));
		assert.strictEqual(lastCommand, undefined);
	});


	test('delegate to commandsService, command:someid, 2', async function () {
		const openerService = new OpenerService(editorService, commandService);

		const id = `aCommand${Math.random()}`;
		store.add(CommandsRegistry.registerCommand(id, function () { }));
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 104: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 105: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 106: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 109: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 110: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 113: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 114: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 115: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 118: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 119: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 120: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 121: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions


		await openerService.open(URI.parse('command:' + id).with({ query: '\"123\"' }), { allowCommands: true });
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 175: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 176: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 177: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 180: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 181: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 185: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 186: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 189: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 190: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 191: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 192: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 245: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 246: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 249: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 250: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 258: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 259: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 260: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 261: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 313: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 315: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 318: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 319: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 322: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 323: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 327: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 328: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 329: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 330: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 382: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 384: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 387: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 388: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 391: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 392: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 393: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 396: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 397: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 399: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 451: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 452: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 453: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 457: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 460: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 461: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 462: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 465: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 466: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 467: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 520: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 521: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 522: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 525: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 526: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 529: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 530: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 531: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 534: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 535: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 536: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 537: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 589: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 590: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 591: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 594: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 595: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 598: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 599: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 600: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 603: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 604: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 605: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 606: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 658: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 659: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 660: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 663: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 664: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 667: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 668: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 669: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 672: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 673: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 674: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 675: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 727: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 728: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 729: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 732: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 733: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 736: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 737: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 738: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 741: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 742: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 743: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 744: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 796: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 797: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 798: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 801: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 802: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 805: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 806: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 807: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 810: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 811: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 812: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 813: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 865: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 866: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 867: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 870: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 871: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 874: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 875: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 876: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 879: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 880: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 881: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 882: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 934: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 935: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 936: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 939: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 940: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 943: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 944: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 945: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 948: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 949: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 950: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 951: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1003: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1004: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1005: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1008: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1009: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1012: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1013: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1014: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1017: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1018: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1019: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1020: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1072: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1073: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1074: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1077: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1078: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1081: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1082: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1083: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1086: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1087: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1088: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1089: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1141: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1142: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1143: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1146: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1147: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1150: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1151: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1152: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1155: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1156: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1157: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1158: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1210: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1211: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1212: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1215: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1216: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1219: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1220: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1221: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1224: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1225: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1226: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1227: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1279: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1280: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1281: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1284: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1285: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1288: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1289: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1290: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1293: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1294: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1295: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1296: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1348: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1349: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1350: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1353: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1354: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1357: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1358: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1359: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1362: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1363: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1364: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1365: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1417: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1418: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1419: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1422: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1423: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1426: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1427: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1428: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1431: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1432: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1433: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1434: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1486: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1487: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1488: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1491: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1492: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1495: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1496: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1497: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1500: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1501: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1502: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1503: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1555: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1556: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1557: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1560: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1561: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1564: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1565: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1566: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1569: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1570: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1571: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1572: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1624: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1625: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1626: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1629: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1630: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1633: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1634: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1635: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1638: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1639: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1640: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1641: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1693: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1694: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1695: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1698: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1699: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1702: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1703: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1704: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1707: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1708: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1709: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1710: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1762: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1763: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1764: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1767: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1768: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1771: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1772: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1773: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1776: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1777: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1778: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1779: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1831: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1832: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1833: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1836: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1837: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1840: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1841: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1842: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1845: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1846: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1847: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1848: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1900: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1901: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1902: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 1905: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 1906: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1909: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 1910: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 1911: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1914: Dangerous type assertion in VSCode source - runtime type error risk
//   10. Line 1915: Dangerous type assertion in VSCode source - runtime type error risk
//   11. Line 1916: Dangerous type assertion in VSCode source - runtime type error risk
//   12. Line 1917: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		assert.strictEqual(lastCommand!.id, id);
		assert.strictEqual(lastCommand!.args.length, 1);
		assert.strictEqual(lastCommand!.args[0], '123');

		await openerService.open(URI.parse('command:' + id), { allowCommands: true });
		assert.strictEqual(lastCommand!.id, id);
		assert.strictEqual(lastCommand!.args.length, 0);

		await openerService.open(URI.parse('command:' + id).with({ query: '123' }), { allowCommands: true });
		assert.strictEqual(lastCommand!.id, id);
		assert.strictEqual(lastCommand!.args.length, 1);
		assert.strictEqual(lastCommand!.args[0], 123);

		await openerService.open(URI.parse('command:' + id).with({ query: JSON.stringify([12, true]) }), { allowCommands: true });
		assert.strictEqual(lastCommand!.id, id);
		assert.strictEqual(lastCommand!.args.length, 2);
		assert.strictEqual(lastCommand!.args[0], 12);
		assert.strictEqual(lastCommand!.args[1], true);
	});

	test('links are protected by validators', async function () {
		const openerService = new OpenerService(editorService, commandService);

		store.add(openerService.registerValidator({ shouldOpen: () => Promise.resolve(false) }));

		const httpResult = await openerService.open(URI.parse('https://www.microsoft.com'));
		const httpsResult = await openerService.open(URI.parse('https://www.microsoft.com'));
		assert.strictEqual(httpResult, false);
		assert.strictEqual(httpsResult, false);
	});

	test('links validated by validators go to openers', async function () {
		const openerService = new OpenerService(editorService, commandService);

		store.add(openerService.registerValidator({ shouldOpen: () => Promise.resolve(true) }));

		let openCount = 0;
		store.add(openerService.registerOpener({
			open: (resource: URI) => {
				openCount++;
				return Promise.resolve(true);
			}
		}));

		await openerService.open(URI.parse('http://microsoft.com'));
		assert.strictEqual(openCount, 1);
		await openerService.open(URI.parse('https://microsoft.com'));
		assert.strictEqual(openCount, 2);
	});

	test('links aren\'t manipulated before being passed to validator: PR #118226', async function () {
		const openerService = new OpenerService(editorService, commandService);

		store.add(openerService.registerValidator({
			shouldOpen: (resource) => {
				// We don't want it to convert strings into URIs
				assert.strictEqual(resource instanceof URI, false);
				return Promise.resolve(false);
			}
		}));
		await openerService.open('https://wwww.microsoft.com');
		await openerService.open('https://www.microsoft.com??params=CountryCode%3DUSA%26Name%3Dvscode"');
	});

	test('links validated by multiple validators', async function () {
		const openerService = new OpenerService(editorService, commandService);

		let v1 = 0;
		openerService.registerValidator({
			shouldOpen: () => {
				v1++;
				return Promise.resolve(true);
			}
		});

		let v2 = 0;
		openerService.registerValidator({
			shouldOpen: () => {
				v2++;
				return Promise.resolve(true);
			}
		});

		let openCount = 0;
		openerService.registerOpener({
			open: (resource: URI) => {
				openCount++;
				return Promise.resolve(true);
			}
		});

		await openerService.open(URI.parse('http://microsoft.com'));
		assert.strictEqual(openCount, 1);
		assert.strictEqual(v1, 1);
		assert.strictEqual(v2, 1);
		await openerService.open(URI.parse('https://microsoft.com'));
		assert.strictEqual(openCount, 2);
		assert.strictEqual(v1, 2);
		assert.strictEqual(v2, 2);
	});

	test('links invalidated by first validator do not continue validating', async function () {
		const openerService = new OpenerService(editorService, commandService);

		let v1 = 0;
		openerService.registerValidator({
			shouldOpen: () => {
				v1++;
				return Promise.resolve(false);
			}
		});

		let v2 = 0;
		openerService.registerValidator({
			shouldOpen: () => {
				v2++;
				return Promise.resolve(true);
			}
		});

		let openCount = 0;
		openerService.registerOpener({
			open: (resource: URI) => {
				openCount++;
				return Promise.resolve(true);
			}
		});

		await openerService.open(URI.parse('http://microsoft.com'));
		assert.strictEqual(openCount, 0);
		assert.strictEqual(v1, 1);
		assert.strictEqual(v2, 0);
		await openerService.open(URI.parse('https://microsoft.com'));
		assert.strictEqual(openCount, 0);
		assert.strictEqual(v1, 2);
		assert.strictEqual(v2, 0);
	});

	test('matchesScheme', function () {
		assert.ok(matchesScheme('https://microsoft.com', 'https'));
		assert.ok(matchesScheme('http://microsoft.com', 'http'));
		assert.ok(matchesScheme('hTTPs://microsoft.com', 'https'));
		assert.ok(matchesScheme('httP://microsoft.com', 'http'));
		assert.ok(matchesScheme(URI.parse('https://microsoft.com'), 'https'));
		assert.ok(matchesScheme(URI.parse('http://microsoft.com'), 'http'));
		assert.ok(matchesScheme(URI.parse('hTTPs://microsoft.com'), 'https'));
		assert.ok(matchesScheme(URI.parse('httP://microsoft.com'), 'http'));
		assert.ok(!matchesScheme(URI.parse('https://microsoft.com'), 'http'));
		assert.ok(!matchesScheme(URI.parse('htt://microsoft.com'), 'http'));
		assert.ok(!matchesScheme(URI.parse('z://microsoft.com'), 'http'));
	});

	test('matchesSomeScheme', function () {
		assert.ok(matchesSomeScheme('https://microsoft.com', 'http', 'https'));
		assert.ok(matchesSomeScheme('http://microsoft.com', 'http', 'https'));
		assert.ok(!matchesSomeScheme('x://microsoft.com', 'http', 'https'));
	});

	test('resolveExternalUri', async function () {
		const openerService = new OpenerService(editorService, NullCommandService);

		try {
			await openerService.resolveExternalUri(URI.parse('file:///Users/user/folder'));
			assert.fail('Should not reach here');
		} catch {
			// OK
		}

		const disposable = openerService.registerExternalUriResolver({
			async resolveExternalUri(uri) {
				return { resolved: uri, dispose() { } };
			}
		});

		const result = await openerService.resolveExternalUri(URI.parse('file:///Users/user/folder'));
		assert.deepStrictEqual(result.resolved.toString(), 'file:///Users/user/folder');
		disposable.dispose();
	});

	test('vscode.open command can\'t open HTTP URL with hash (#) in it [extension development] #140907', async function () {
		const openerService = new OpenerService(editorService, NullCommandService);

		const actual: string[] = [];

		openerService.setDefaultExternalOpener({
			async openExternal(href) {
				actual.push(href);
				return true;
			}
		});

		const href = 'https://gitlab.com/viktomas/test-project/merge_requests/new?merge_request%5Bsource_branch%5D=test-%23-hash';
		const uri = URI.parse(href);

		assert.ok(await openerService.open(uri));
		assert.ok(await openerService.open(href));

		assert.deepStrictEqual(actual, [
			encodeURI(uri.toString(true)), // BAD, the encoded # (%23) is double encoded to %2523 (% is double encoded)
			href // good
		]);
	});
});
