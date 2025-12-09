//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MockObject, mockObject } from '../../../../../base/test/common/mock.js';
import { assertSnapshot } from '../../../../../base/test/common/snapshot.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { IExtensionService, nullExtensionDescription } from '../../../../services/extensions/common/extensions.js';
import { TestExtensionService, TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { ChatAgentService, IChatAgentCommand, IChatAgentData, IChatAgentService } from '../../common/chatAgents.js';
import { ChatRequestParser } from '../../common/chatRequestParser.js';
import { IChatService } from '../../common/chatService.js';
import { IChatSlashCommandService } from '../../common/chatSlashCommands.js';
import { IChatVariablesService } from '../../common/chatVariables.js';
import { ChatModeKind, ChatAgentLocation } from '../../common/constants.js';
import { IToolData, ToolDataSource } from '../../common/languageModelToolsService.js';
import { IPromptsService } from '../../common/promptSyntax/service/promptsService.js';
import { MockChatService } from './mockChatService.js';
import { MockPromptsService } from './mockPromptsService.js';

suite('ChatRequestParser', () => {
	const testDisposables = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let parser: ChatRequestParser;

	let variableService: MockObject<IChatVariablesService>;
	setup(async () => {
		instantiationService = testDisposables.add(new TestInstantiationService());
		instantiationService.stub(IStorageService, testDisposables.add(new TestStorageService()));
		instantiationService.stub(ILogService, new NullLogService());
		instantiationService.stub(IExtensionService, new TestExtensionService());
		instantiationService.stub(IChatService, new MockChatService());
		instantiationService.stub(IContextKeyService, new MockContextKeyService());
		instantiationService.stub(IChatAgentService, testDisposables.add(instantiationService.createInstance(ChatAgentService)));
		instantiationService.stub(IPromptsService, testDisposables.add(new MockPromptsService()));

		variableService = mockObject<IChatVariablesService>()();
		variableService.getDynamicVariables.returns([]);
		variableService.getSelectedTools.returns([]);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		variableService.getSelectedToolSets.returns([]);

		instantiationService.stub(IChatVariablesService, variableService as any);
	});

	test('plain text', async () => {
		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest('1', 'test');
		await assertSnapshot(result);
	});

	test('plain text with newlines', async () => {
		parser = instantiationService.createInstance(ChatRequestParser);
		const text = 'line 1\nline 2\r\nline 3';
		const result = parser.parseChatRequest('1', text);
		await assertSnapshot(result);
	});

	test('slash in text', async () => {
		parser = instantiationService.createInstance(ChatRequestParser);
		const text = 'can we add a new file for an Express router to handle the / route';
		const result = parser.parseChatRequest('1', text);
		await assertSnapshot(result);
	});

	test('slash command', async () => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = '/fix this';
		const result = parser.parseChatRequest('1', text);
		await assertSnapshot(result);
	});

	test('invalid slash command', async () => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = '/explain this';
		const result = parser.parseChatRequest('1', text);
		await assertSnapshot(result);
	});

	test('multiple slash commands', async () => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = '/fix /fix';
		const result = parser.parseChatRequest('1', text);
		await assertSnapshot(result);
	});

	test('slash command not first', async () => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = 'Hello /fix';
		const result = parser.parseChatRequest('1', text);
		await assertSnapshot(result);
	});

	test('slash command after whitespace', async () => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = '    /fix';
		const result = parser.parseChatRequest('1', text);
		await assertSnapshot(result);
	});

	test('prompt slash command', async () => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 130: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 139: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 184: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 193: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		const promptSlashCommandService = mockObject<IPromptsService>()({});
		promptSlashCommandService.asPromptSlashCommand.callsFake((command: string) => {
			if (command.match(/^[\w_\-\.]+$/)) {
				return { command };
			}
			return undefined;
		});
		instantiationService.stub(IPromptsService, promptSlashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = '    /prompt';
		const result = parser.parseChatRequest('1', text);
		await assertSnapshot(result);
	});

	test('prompt slash command after text', async () => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 150: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 159: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 214: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 223: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		const promptSlashCommandService = mockObject<IPromptsService>()({});
		promptSlashCommandService.asPromptSlashCommand.callsFake((command: string) => {
			if (command.match(/^[\w_\-\.]+$/)) {
				return { command };
			}
			return undefined;
		});
		instantiationService.stub(IPromptsService, promptSlashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = 'handle the / route and the request of /search-option';
		const result = parser.parseChatRequest('1', text);
		await assertSnapshot(result);
	});

	test('prompt slash command after slash', async () => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 170: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 179: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (2):
//   1. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 253: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		const promptSlashCommandService = mockObject<IPromptsService>()({});
		promptSlashCommandService.asPromptSlashCommand.callsFake((command: string) => {
			if (command.match(/^[\w_\-\.]+$/)) {
				return { command };
			}
			return undefined;
		});
		instantiationService.stub(IPromptsService, promptSlashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = '/ route and the request of /search-option';
		const result = parser.parseChatRequest('1', text);
		await assertSnapshot(result);
	});


	// test('variables', async () => {
	// 	varService.hasVariable.returns(true);
	// 	varService.getVariable.returns({ id: 'copilot.selection' });

	// 	parser = instantiationService.createInstance(ChatRequestParser);
	// 	const text = 'What does #selection mean?';
	// 	const result = parser.parseChatRequest('1', text);
	// 	await assertSnapshot(result);
	// });

	// test('variable with question mark', async () => {
	// 	varService.hasVariable.returns(true);
	// 	varService.getVariable.returns({ id: 'copilot.selection' });

	// 	parser = instantiationService.createInstance(ChatRequestParser);
	// 	const text = 'What is #selection?';
	// 	const result = parser.parseChatRequest('1', text);
	// 	await assertSnapshot(result);
	// });

	// test('invalid variables', async () => {
	// 	varService.hasVariable.returns(false);

	// 	parser = instantiationService.createInstance(ChatRequestParser);
	// 	const text = 'What does #selection mean?';
	// 	const result = parser.parseChatRequest('1', text);
	// 	await assertSnapshot(result);
	// });

	const getAgentWithSlashCommands = (slashCommands: IChatAgentCommand[]) => {
		return { id: 'agent', name: 'agent', extensionId: nullExtensionDescription.identifier, publisherDisplayName: '', extensionDisplayName: '', extensionPublisherId: '', locations: [ChatAgentLocation.Panel], modes: [ChatModeKind.Ask], metadata: {}, slashCommands, disambiguation: [] } satisfies IChatAgentData;
	};

	test('agent with subcommand after text', async () => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 224: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 234: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 244: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 264: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 274: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 284: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 294: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([{ name: 'subCommand', description: '' }])]);
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 314: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 334: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 344: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 354: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 364: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 374: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 384: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 360: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 370: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 390: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 400: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 410: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 420: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 430: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 376: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 386: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 396: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 406: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 416: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 426: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 436: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 446: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 392: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 402: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 412: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 422: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 432: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 442: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 452: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 462: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 408: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 418: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 428: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 438: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 448: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 458: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 468: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 478: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 424: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 434: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 444: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 454: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 464: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 474: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 484: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 494: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 440: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 450: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 460: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 470: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 480: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 490: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 500: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 510: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 466: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 476: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 486: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 496: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 506: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 516: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 526: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 472: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 482: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 492: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 502: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 512: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 522: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 532: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 542: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 488: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 498: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 508: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 518: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 528: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 538: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 548: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 558: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 504: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 514: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 524: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 534: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 544: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 554: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 564: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 574: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 520: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 530: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 540: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 550: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 560: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 570: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 580: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 590: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 536: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 546: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 556: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 566: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 576: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 586: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 596: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 606: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 552: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 562: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 572: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 582: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 592: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 602: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 612: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 622: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (8):
//   1. Line 568: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 578: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 588: Dangerous type assertion in VSCode source - runtime type error risk
//   4. Line 598: Dangerous type assertion in VSCode source - runtime type error risk
//   5. Line 608: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 618: Dangerous type assertion in VSCode source - runtime type error risk
//   7. Line 628: Dangerous type assertion in VSCode source - runtime type error risk
//   8. Line 638: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		instantiationService.stub(IChatAgentService, agentsService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest('1', '@agent Please do /subCommand thanks');
		await assertSnapshot(result);
	});

	test('agents, subCommand', async () => {
		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([{ name: 'subCommand', description: '' }])]);
		instantiationService.stub(IChatAgentService, agentsService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest('1', '@agent /subCommand Please do thanks');
		await assertSnapshot(result);
	});

	test('agent but edit mode', async () => {
		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([])]);
		instantiationService.stub(IChatAgentService, agentsService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest('1', '@agent hello', undefined, { mode: ChatModeKind.Edit });
		await assertSnapshot(result);
	});

	test('agent with question mark', async () => {
		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([{ name: 'subCommand', description: '' }])]);
		instantiationService.stub(IChatAgentService, agentsService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest('1', '@agent? Are you there');
		await assertSnapshot(result);
	});

	test('agent and subcommand with leading whitespace', async () => {
		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([{ name: 'subCommand', description: '' }])]);
		instantiationService.stub(IChatAgentService, agentsService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest('1', '    \r\n\t   @agent \r\n\t   /subCommand Thanks');
		await assertSnapshot(result);
	});

	test('agent and subcommand after newline', async () => {
		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([{ name: 'subCommand', description: '' }])]);
		instantiationService.stub(IChatAgentService, agentsService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest('1', '    \n@agent\n/subCommand Thanks');
		await assertSnapshot(result);
	});

	test('agent not first', async () => {
		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([{ name: 'subCommand', description: '' }])]);
		instantiationService.stub(IChatAgentService, agentsService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest('1', 'Hello Mr. @agent');
		await assertSnapshot(result);
	});

	test('agents and tools and multiline', async () => {
		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([{ name: 'subCommand', description: '' }])]);
		instantiationService.stub(IChatAgentService, agentsService as any);

		variableService.getSelectedTools.returns([
			{ id: 'get_selection', toolReferenceName: 'selection', canBeReferencedInPrompt: true, displayName: '', modelDescription: '', source: ToolDataSource.Internal },
			{ id: 'get_debugConsole', toolReferenceName: 'debugConsole', canBeReferencedInPrompt: true, displayName: '', modelDescription: '', source: ToolDataSource.Internal }
		] satisfies IToolData[]);

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest('1', '@agent /subCommand \nPlease do with #selection\nand #debugConsole');
		await assertSnapshot(result);
	});

	test('agents and tools and multiline, part2', async () => {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([{ name: 'subCommand', description: '' }])]);
		instantiationService.stub(IChatAgentService, agentsService as any);

		variableService.getSelectedTools.returns([
			{ id: 'get_selection', toolReferenceName: 'selection', canBeReferencedInPrompt: true, displayName: '', modelDescription: '', source: ToolDataSource.Internal },
			{ id: 'get_debugConsole', toolReferenceName: 'debugConsole', canBeReferencedInPrompt: true, displayName: '', modelDescription: '', source: ToolDataSource.Internal }
		] satisfies IToolData[]);

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest('1', '@agent Please \ndo /subCommand with #selection\nand #debugConsole');
		await assertSnapshot(result);
	});
});
