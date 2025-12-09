//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';

const TS_CONFIG_PATH = path.join(__dirname, '../../', 'src', 'tsconfig.json');

//
// #############################################################################################
//
// A custom typescript checker that ensure constructor properties are NOT used to initialize
// defined properties. This is needed for the times when `useDefineForClassFields` is gone.
//
// see https://github.com/microsoft/vscode/issues/243049, https://github.com/microsoft/vscode/issues/186726,
// https://github.com/microsoft/vscode/pull/241544
//
// #############################################################################################
//

enum EntryKind {
	Span,
	Node,
	StringLiteral,
	SearchedLocalFoundProperty,
	SearchedPropertyFoundLocal,
}

const cancellationToken: ts.CancellationToken = {
	isCancellationRequested: () => false,
	throwIfCancellationRequested: () => { },
};

const seenFiles = new Set<ts.SourceFile>();
let errorCount = 0;



function createProgram(tsconfigPath: string): ts.Program {
	const tsConfig = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

	const configHostParser: ts.ParseConfigHost = { fileExists: fs.existsSync, readDirectory: ts.sys.readDirectory, readFile: file => fs.readFileSync(file, 'utf8'), useCaseSensitiveFileNames: process.platform === 'linux' };
	const tsConfigParsed = ts.parseJsonConfigFileContent(tsConfig.config, configHostParser, path.resolve(path.dirname(tsconfigPath)), { noEmit: true });

	const compilerHost = ts.createCompilerHost(tsConfigParsed.options, true);

	return ts.createProgram(tsConfigParsed.fileNames, tsConfigParsed.options, compilerHost);
}

const program = createProgram(TS_CONFIG_PATH);

program.getTypeChecker();

for (const file of program.getSourceFiles()) {
	if (!file || file.isDeclarationFile) {
		continue;
	}
	visit(file);
}

if (seenFiles.size) {
	console.log();
	console.log(`Found ${errorCount} error${errorCount === 1 ? '' : 's'} in ${seenFiles.size} file${seenFiles.size === 1 ? '' : 's'}.`);
	process.exit(errorCount);
}

function visit(node: ts.Node) {
	if (ts.isParameter(node) && ts.isParameterPropertyDeclaration(node, node.parent)) {
		checkParameterPropertyDeclaration(node);
	}

	ts.forEachChild(node, visit);
}

function checkParameterPropertyDeclaration(param: ts.ParameterPropertyDeclaration) {
	const uses = [...collectReferences(param.name, [])];
	if (!uses.length) {
		return;
	}

	const sourceFile = param.getSourceFile();
	if (!seenFiles.has(sourceFile)) {
		if (seenFiles.size) {
			console.log(``);
		}
		console.log(`${formatFileName(param)}:`);
		seenFiles.add(sourceFile);
	} else {
		console.log(``);
	}
	console.log(`  Parameter property '${param.name.getText()}' is used before its declaration.`);
	for (const { stack, container } of uses) {
		const use = stack[stack.length - 1];
		console.log(`    at ${formatLocation(use)}: ${formatMember(container)} -> ${formatStack(stack)}`);
		errorCount++;
	}
}

interface InvalidUse {
	stack: ts.Node[];
	container: ReferenceContainer;
}

function* collectReferences(node: ts.Node, stack: ts.Node[], requiresInvocationDepth: number = 0, seen = new Set<ReferenceContainer>()): Generator<InvalidUse> {
	for (const use of findAllReferencesInClass(node)) {
		const container = findContainer(use);
		if (!container || seen.has(container) || ts.isConstructorDeclaration(container)) {
			continue;
		}
		seen.add(container);

		const nextStack = [...stack, use];

		let nextRequiresInvocationDepth = requiresInvocationDepth;
		if (isInvocation(use) && nextRequiresInvocationDepth > 0) {
			nextRequiresInvocationDepth--;
		}

		if (ts.isPropertyDeclaration(container) && nextRequiresInvocationDepth === 0) {
			yield { stack: nextStack, container };
		}
		else if (requiresInvocation(container)) {
			nextRequiresInvocationDepth++;
		}

		yield* collectReferences(container.name ?? container, nextStack, nextRequiresInvocationDepth, seen);
	}
}

function requiresInvocation(definition: ReferenceContainer): boolean {
	return ts.isMethodDeclaration(definition) || ts.isFunctionDeclaration(definition) || ts.isFunctionExpression(definition) || ts.isArrowFunction(definition);
}

function isInvocation(use: ts.Node): boolean {
	let location = use;
	if (ts.isPropertyAccessExpression(location.parent) && location.parent.name === location) {
		location = location.parent;
	}
	else if (ts.isElementAccessExpression(location.parent) && location.parent.argumentExpression === location) {
		location = location.parent;
	}
	return ts.isCallExpression(location.parent) && location.parent.expression === location
		|| ts.isTaggedTemplateExpression(location.parent) && location.parent.tag === location;
}

function formatFileName(node: ts.Node): string {
	const sourceFile = node.getSourceFile();
	return path.resolve(sourceFile.fileName);
}

function formatLocation(node: ts.Node): string {
	const sourceFile = node.getSourceFile();
	const { line, character } = ts.getLineAndCharacterOfPosition(sourceFile, node.pos);
	return `${formatFileName(sourceFile)}(${line + 1},${character + 1})`;
}

function formatStack(stack: ts.Node[]): string {
	return stack.slice().reverse().map((use) => formatUse(use)).join(' -> ');
}

function formatMember(container: ReferenceContainer): string {
	const name = container.name?.getText();
	if (name) {
		const className = findClass(container)?.name?.getText();
		if (className) {
			return `${className}.${name}`;
		}
		return name;
	}
	return '<unknown>';
}

function formatUse(use: ts.Node): string {
	let text = use.getText();
	if (use.parent && ts.isPropertyAccessExpression(use.parent) && use.parent.name === use) {
		if (use.parent.expression.kind === ts.SyntaxKind.ThisKeyword) {
			text = `this.${text}`;
		}
		use = use.parent;
	}
	else if (use.parent && ts.isElementAccessExpression(use.parent) && use.parent.argumentExpression === use) {
		if (use.parent.expression.kind === ts.SyntaxKind.ThisKeyword) {
			text = `this['${text}']`;
		}
		use = use.parent;
	}
	if (ts.isCallExpression(use.parent)) {
		text = `${text}(...)`;
	}
	return text;
}

type ReferenceContainer =
	| ts.PropertyDeclaration
	| ts.MethodDeclaration
	| ts.GetAccessorDeclaration
	| ts.SetAccessorDeclaration
	| ts.ConstructorDeclaration
	| ts.ClassStaticBlockDeclaration
	| ts.ArrowFunction
	| ts.FunctionExpression
	| ts.FunctionDeclaration
	| ts.ParameterDeclaration;

function findContainer(node: ts.Node): ReferenceContainer | undefined {
	return ts.findAncestor(node, ancestor => {
		switch (ancestor.kind) {
			case ts.SyntaxKind.PropertyDeclaration:
			case ts.SyntaxKind.MethodDeclaration:
			case ts.SyntaxKind.GetAccessor:
			case ts.SyntaxKind.SetAccessor:
			case ts.SyntaxKind.Constructor:
			case ts.SyntaxKind.ClassStaticBlockDeclaration:
			case ts.SyntaxKind.ArrowFunction:
			case ts.SyntaxKind.FunctionExpression:
			case ts.SyntaxKind.FunctionDeclaration:
			case ts.SyntaxKind.Parameter:
				return true;
		}
		return false;
	}) as ReferenceContainer | undefined;
}

function findClass(node: ts.Node): ts.ClassLikeDeclaration | undefined {
	return ts.findAncestor(node, ts.isClassLike);
}

function* findAllReferencesInClass(node: ts.Node): Generator<ts.Node> {
	const classDecl = findClass(node);
	if (!classDecl) {
		return [];
	}
	for (const ref of findAllReferences(node)) {
		for (const entry of ref.references) {
			if (entry.kind !== EntryKind.Node || entry.node === node) {
				continue;
			}
			if (findClass(entry.node) === classDecl) {
				yield entry.node;
			}
		}
	}
}

// NOTE: The following uses TypeScript internals and are subject to change from version to version.

function findAllReferences(node: ts.Node): readonly SymbolAndEntries[] {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 254: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 255: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 256: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	const sourceFile = node.getSourceFile();
	const position = node.getStart();
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 267: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 268: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 269: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 278: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 279: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 280: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 289: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 290: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 291: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 300: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 301: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 302: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 311: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 312: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 313: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 322: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 323: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 324: Dangerous type assertion in VSCode source - runtime type error risk
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
//   1. Line 344: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 345: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 346: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 355: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 357: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 366: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 367: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 368: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 377: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 378: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 379: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 388: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 389: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 390: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 399: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 400: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 401: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 410: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 411: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 412: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 421: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 422: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 423: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 432: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 433: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 434: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 443: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 444: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 445: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 454: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 455: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 456: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 465: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 466: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 467: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 476: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 477: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 478: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 487: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 488: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 489: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 498: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 499: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 500: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 509: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 510: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 511: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 520: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 521: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 522: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 531: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 532: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 533: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 542: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 543: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 544: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 553: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 554: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 555: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 564: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 565: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 566: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 575: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 576: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 577: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 586: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 587: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 588: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 597: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 598: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 599: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (3):
//   1. Line 608: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 609: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 610: Dangerous type assertion in VSCode source - runtime type error risk
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

	const name: ts.Node = (ts as any).getTouchingPropertyName(sourceFile, position);
	const options = { use: (ts as any).FindAllReferences.FindReferencesUse.References };
	return (ts as any).FindAllReferences.Core.getReferencedSymbolsForNode(position, name, program, [sourceFile], cancellationToken, options) ?? [];
}

interface SymbolAndEntries {
	readonly definition: Definition | undefined;
	readonly references: readonly Entry[];
}

const enum DefinitionKind {
	Symbol,
	Label,
	Keyword,
	This,
	String,
	TripleSlashReference,
}

type Definition =
	| { readonly type: DefinitionKind.Symbol; readonly symbol: ts.Symbol }
	| { readonly type: DefinitionKind.Label; readonly node: ts.Identifier }
	| { readonly type: DefinitionKind.Keyword; readonly node: ts.Node }
	| { readonly type: DefinitionKind.This; readonly node: ts.Node }
	| { readonly type: DefinitionKind.String; readonly node: ts.StringLiteralLike }
	| { readonly type: DefinitionKind.TripleSlashReference; readonly reference: ts.FileReference; readonly file: ts.SourceFile };

type NodeEntryKind = EntryKind.Node | EntryKind.StringLiteral | EntryKind.SearchedLocalFoundProperty | EntryKind.SearchedPropertyFoundLocal;
type Entry = NodeEntry | SpanEntry;
interface ContextWithStartAndEndNode {
	start: ts.Node;
	end: ts.Node;
}
type ContextNode = ts.Node | ContextWithStartAndEndNode;
interface NodeEntry {
	readonly kind: NodeEntryKind;
	readonly node: ts.Node;
	readonly context?: ContextNode;
}
interface SpanEntry {
	readonly kind: EntryKind.Span;
	readonly fileName: string;
	readonly textSpan: ts.TextSpan;
}
