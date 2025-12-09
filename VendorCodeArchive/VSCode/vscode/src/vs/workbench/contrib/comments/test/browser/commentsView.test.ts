//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { IRange, Range } from '../../../../../editor/common/core/range.js';
import { CommentsPanel } from '../../browser/commentsView.js';
import { CommentService, ICommentController, ICommentInfo, ICommentService, INotebookCommentInfo } from '../../browser/commentService.js';
import { Comment, CommentInput, CommentReaction, CommentThread, CommentThreadCollapsibleState, CommentThreadState } from '../../../../../editor/common/languages.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IViewContainerModel, IViewDescriptor, IViewDescriptorService, ViewContainer, ViewContainerLocation } from '../../../../common/views.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IContextViewService } from '../../../../../platform/contextview/browser/contextView.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { URI, UriComponents } from '../../../../../base/common/uri.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { NullHoverService } from '../../../../../platform/hover/test/browser/nullHoverService.js';

class TestCommentThread implements CommentThread<IRange> {
	isDocumentCommentThread(): this is CommentThread<IRange> {
		return true;
	}
	constructor(public readonly commentThreadHandle: number,
		public readonly controllerHandle: number,
		public readonly threadId: string,
		public readonly resource: string,
		public readonly range: IRange,
		public readonly comments: Comment[]) { }

	onDidChangeComments: Event<readonly Comment[] | undefined> = new Emitter<readonly Comment[] | undefined>().event;
	onDidChangeInitialCollapsibleState: Event<CommentThreadCollapsibleState | undefined> = new Emitter<CommentThreadCollapsibleState | undefined>().event;
	canReply: boolean = false;
	onDidChangeInput: Event<CommentInput | undefined> = new Emitter<CommentInput | undefined>().event;
	onDidChangeRange: Event<IRange> = new Emitter<IRange>().event;
	onDidChangeLabel: Event<string | undefined> = new Emitter<string | undefined>().event;
	onDidChangeCollapsibleState: Event<CommentThreadCollapsibleState | undefined> = new Emitter<CommentThreadCollapsibleState | undefined>().event;
	onDidChangeState: Event<CommentThreadState | undefined> = new Emitter<CommentThreadState | undefined>().event;
	onDidChangeCanReply: Event<boolean> = new Emitter<boolean>().event;
	isDisposed: boolean = false;
	isTemplate: boolean = false;
	label: string | undefined = undefined;
	contextValue: string | undefined = undefined;
}

class TestCommentController implements ICommentController {
	activeComment: { thread: CommentThread; comment?: Comment } | undefined;
	id: string = 'test';
	label: string = 'Test Comments';
	owner: string = 'test';
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (14):
//   1. Line 58: Error message without production error code - breaks React bundle size optimization
//   2. Line 58: Error message without production error code - breaks React bundle size optimization
//   3. Line 61: Error message without production error code - breaks React bundle size optimization
//   4. Line 61: Error message without production error code - breaks React bundle size optimization
//   5. Line 64: Error message without production error code - breaks React bundle size optimization
//   6. Line 64: Error message without production error code - breaks React bundle size optimization
//   7. Line 67: Error message without production error code - breaks React bundle size optimization
//   8. Line 67: Error message without production error code - breaks React bundle size optimization
//   9. Line 70: Error message without production error code - breaks React bundle size optimization
//   10. Line 70: Error message without production error code - breaks React bundle size optimization
//   11. Line 73: Error message without production error code - breaks React bundle size optimization
//   12. Line 73: Error message without production error code - breaks React bundle size optimization
//   13. Line 76: Error message without production error code - breaks React bundle size optimization
//   14. Line 76: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

	features = {};
	createCommentThreadTemplate(resource: UriComponents, range: IRange | undefined): Promise<void> {
		throw new Error('Method not implemented.');
	}
	updateCommentThreadTemplate(threadHandle: number, range: IRange): Promise<void> {
		throw new Error('Method not implemented.');
	}
	deleteCommentThreadMain(commentThreadId: string): void {
		throw new Error('Method not implemented.');
	}
	toggleReaction(uri: URI, thread: CommentThread<IRange>, comment: Comment, reaction: CommentReaction, token: CancellationToken): Promise<void> {
		throw new Error('Method not implemented.');
	}
	getDocumentComments(resource: URI, token: CancellationToken): Promise<ICommentInfo> {
		throw new Error('Method not implemented.');
	}
	getNotebookComments(resource: URI, token: CancellationToken): Promise<INotebookCommentInfo> {
		throw new Error('Method not implemented.');
	}
	setActiveCommentAndThread(commentInfo: { thread: CommentThread; comment: Comment } | undefined): Promise<void> {
		throw new Error('Method not implemented.');
	}

}

export class TestViewDescriptorService implements Partial<IViewDescriptorService> {
	getViewLocationById(id: string): ViewContainerLocation | null {
		return ViewContainerLocation.Panel;
	}
	readonly onDidChangeLocation: Event<{ views: IViewDescriptor[]; from: ViewContainerLocation; to: ViewContainerLocation }> = new Emitter<{ views: IViewDescriptor[]; from: ViewContainerLocation; to: ViewContainerLocation }>().event;
	getViewDescriptorById(id: string): IViewDescriptor | null {
		return null;
	}
	getViewContainerByViewId(id: string): ViewContainer | null {
		return {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			id: 'comments',
			title: { value: 'Comments', original: 'Comments' },
			ctorDescriptor: {} as any
		};
	}
	getViewContainerModel(viewContainer: ViewContainer): IViewContainerModel {
		const partialViewContainerModel: Partial<IViewContainerModel> = {
			onDidChangeContainerInfo: new Emitter<{ title?: boolean; icon?: boolean; keybindingId?: boolean }>().event
		};
		return partialViewContainerModel as IViewContainerModel;
	}
	getDefaultContainerById(id: string): ViewContainer | null {
		return null;
	}
}

suite('Comments View', function () {
	teardown(() => {
		instantiationService.dispose();
		commentService.dispose();
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let commentService: CommentService;

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = workbenchInstantiationService({}, disposables);
		instantiationService.stub(IConfigurationService, new TestConfigurationService());
		instantiationService.stub(IHoverService, NullHoverService);
		instantiationService.stub(IContextViewService, {});
		instantiationService.stub(IViewDescriptorService, new TestViewDescriptorService());
		commentService = instantiationService.createInstance(CommentService);
		instantiationService.stub(ICommentService, commentService);
		commentService.registerCommentController('test', new TestCommentController());
	});



	test('collapse all', async function () {
		const view = instantiationService.createInstance(CommentsPanel, { id: 'comments', title: 'Comments' });
		view.render();
		commentService.setWorkspaceComments('test', [
			new TestCommentThread(1, 1, '1', 'test1', new Range(1, 1, 1, 1), [{ body: 'test', uniqueIdInThread: 1, userName: 'alex' }]),
			new TestCommentThread(2, 1, '1', 'test2', new Range(1, 1, 1, 1), [{ body: 'test', uniqueIdInThread: 1, userName: 'alex' }]),
		]);
		assert.strictEqual(view.getFilterStats().total, 2);
		assert.strictEqual(view.areAllCommentsExpanded(), true);
		view.collapseAll();
		assert.strictEqual(view.isSomeCommentsExpanded(), false);
		view.dispose();
	});

	test('expand all', async function () {
		const view = instantiationService.createInstance(CommentsPanel, { id: 'comments', title: 'Comments' });
		view.render();
		commentService.setWorkspaceComments('test', [
			new TestCommentThread(1, 1, '1', 'test1', new Range(1, 1, 1, 1), [{ body: 'test', uniqueIdInThread: 1, userName: 'alex' }]),
			new TestCommentThread(2, 1, '1', 'test2', new Range(1, 1, 1, 1), [{ body: 'test', uniqueIdInThread: 1, userName: 'alex' }]),
		]);
		assert.strictEqual(view.getFilterStats().total, 2);
		view.collapseAll();
		assert.strictEqual(view.isSomeCommentsExpanded(), false);
		view.expandAll();
		assert.strictEqual(view.areAllCommentsExpanded(), true);
		view.dispose();
	});

	test('filter by text', async function () {
		const view = instantiationService.createInstance(CommentsPanel, { id: 'comments', title: 'Comments' });
		view.setVisible(true);
		view.render();
		commentService.setWorkspaceComments('test', [
			new TestCommentThread(1, 1, '1', 'test1', new Range(1, 1, 1, 1), [{ body: 'This comment is a cat.', uniqueIdInThread: 1, userName: 'alex' }]),
			new TestCommentThread(2, 1, '1', 'test2', new Range(1, 1, 1, 1), [{ body: 'This comment is a dog.', uniqueIdInThread: 1, userName: 'alex' }]),
		]);
		assert.strictEqual(view.getFilterStats().total, 2);
		assert.strictEqual(view.getFilterStats().filtered, 2);
		view.getFilterWidget().setFilterText('cat');
		// Setting showResolved causes the filter to trigger for the purposes of this test.
		view.filters.showResolved = false;

		assert.strictEqual(view.getFilterStats().total, 2);
		assert.strictEqual(view.getFilterStats().filtered, 1);
		view.clearFilterText();
		// Setting showResolved causes the filter to trigger for the purposes of this test.
		view.filters.showResolved = true;
		assert.strictEqual(view.getFilterStats().total, 2);
		assert.strictEqual(view.getFilterStats().filtered, 2);
		view.dispose();
	});
});
