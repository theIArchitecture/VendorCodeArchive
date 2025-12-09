//using architecture IBaseArchitecture;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../charCode.js';
import { onUnexpectedError, transformErrorForSerialization } from '../errors.js';
import { Emitter, Event } from '../event.js';
import { Disposable, IDisposable } from '../lifecycle.js';
import { isWeb } from '../platform.js';
import * as strings from '../strings.js';

const DEFAULT_CHANNEL = 'default';
const INITIALIZE = '$initialize';

export interface IWebWorker extends IDisposable {
	getId(): number;
	onMessage: Event<Message>;
	onError: Event<any>;
	postMessage(message: Message, transfer: ArrayBuffer[]): void;
}

let webWorkerWarningLogged = false;
export function logOnceWebWorkerWarning(err: any): void {
	if (!isWeb) {
		// running tests
		return;
	}
	if (!webWorkerWarningLogged) {
		webWorkerWarningLogged = true;
		console.warn('Could not create web worker(s). Falling back to loading web worker code in main thread, which might cause UI freezes. Please see https://github.com/microsoft/monaco-editor#faq');
	}
	console.warn(err.message);
}

const enum MessageType {
	Request,
	Reply,
	SubscribeEvent,
	Event,
	UnsubscribeEvent
}
class RequestMessage {
	public readonly type = MessageType.Request;
	constructor(
		public readonly vsWorker: number,
		public readonly req: string,
		public readonly channel: string,
		public readonly method: string,
		public readonly args: any[]
	) { }
}
class ReplyMessage {
	public readonly type = MessageType.Reply;
	constructor(
		public readonly vsWorker: number,
		public readonly seq: string,
		public readonly res: any,
		public readonly err: any
	) { }
}
class SubscribeEventMessage {
	public readonly type = MessageType.SubscribeEvent;
	constructor(
		public readonly vsWorker: number,
		public readonly req: string,
		public readonly channel: string,
		public readonly eventName: string,
		public readonly arg: any
	) { }
}
class EventMessage {
	public readonly type = MessageType.Event;
	constructor(
		public readonly vsWorker: number,
		public readonly req: string,
		public readonly event: any
	) { }
}
class UnsubscribeEventMessage {
	public readonly type = MessageType.UnsubscribeEvent;
	constructor(
		public readonly vsWorker: number,
		public readonly req: string
	) { }
}
export type Message = RequestMessage | ReplyMessage | SubscribeEventMessage | EventMessage | UnsubscribeEventMessage;

interface IMessageReply {
	resolve: (value?: any) => void;
	reject: (error?: any) => void;
}

interface IMessageHandler {
	sendMessage(msg: any, transfer?: ArrayBuffer[]): void;
	handleMessage(channel: string, method: string, args: any[]): Promise<any>;
	handleEvent(channel: string, eventName: string, arg: any): Event<any>;
}

class WebWorkerProtocol {

	private _workerId: number;
	private _lastSentReq: number;
	private _pendingReplies: { [req: string]: IMessageReply };
	private _pendingEmitters: Map<string, Emitter<any>>;
	private _pendingEvents: Map<string, IDisposable>;
	private _handler: IMessageHandler;

	constructor(handler: IMessageHandler) {
		this._workerId = -1;
		this._handler = handler;
		this._lastSentReq = 0;
		this._pendingReplies = Object.create(null);
		this._pendingEmitters = new Map<string, Emitter<any>>();
		this._pendingEvents = new Map<string, IDisposable>();
	}

	public setWorkerId(workerId: number): void {
		this._workerId = workerId;
	}

	public sendMessage(channel: string, method: string, args: any[]): Promise<any> {
		const req = String(++this._lastSentReq);
		return new Promise<any>((resolve, reject) => {
			this._pendingReplies[req] = {
				resolve: resolve,
				reject: reject
			};
			this._send(new RequestMessage(this._workerId, req, channel, method, args));
		});
	}

	public listen(channel: string, eventName: string, arg: any): Event<any> {
		let req: string | null = null;
		const emitter = new Emitter<any>({
			onWillAddFirstListener: () => {
				req = String(++this._lastSentReq);
				this._pendingEmitters.set(req, emitter);
				this._send(new SubscribeEventMessage(this._workerId, req, channel, eventName, arg));
			},
			onDidRemoveLastListener: () => {
				this._pendingEmitters.delete(req!);
				this._send(new UnsubscribeEventMessage(this._workerId, req!));
				req = null;
			}
		});
		return emitter.event;
	}

	public handleMessage(message: Message): void {
		if (!message || !message.vsWorker) {
			return;
		}
		if (this._workerId !== -1 && message.vsWorker !== this._workerId) {
			return;
		}
		this._handleMessage(message);
	}

	public createProxyToRemoteChannel<T extends object>(channel: string, sendMessageBarrier?: () => Promise<void>): T {
		const handler = {
			get: (target: any, name: PropertyKey) => {
				if (typeof name === 'string' && !target[name]) {
					if (propertyIsDynamicEvent(name)) { // onDynamic...
						target[name] = (arg: any): Event<any> => {
							return this.listen(channel, name, arg);
						};
					} else if (propertyIsEvent(name)) { // on...
						target[name] = this.listen(channel, name, undefined);
					} else if (name.charCodeAt(0) === CharCode.DollarSign) { // $...
						target[name] = async (...myArgs: any[]) => {
							await sendMessageBarrier?.();
							return this.sendMessage(channel, name, myArgs);
						};
					}
				}
				return target[name];
			}
		};
		return new Proxy(Object.create(null), handler);
	}

	private _handleMessage(msg: Message): void {
		switch (msg.type) {
			case MessageType.Reply:
				return this._handleReplyMessage(msg);
			case MessageType.Request:
				return this._handleRequestMessage(msg);
			case MessageType.SubscribeEvent:
				return this._handleSubscribeEventMessage(msg);
			case MessageType.Event:
				return this._handleEventMessage(msg);
			case MessageType.UnsubscribeEvent:
				return this._handleUnsubscribeEventMessage(msg);
		}
	}

	private _handleReplyMessage(replyMessage: ReplyMessage): void {
		if (!this._pendingReplies[replyMessage.seq]) {
			console.warn('Got reply to unknown seq');
			return;
		}

		const reply = this._pendingReplies[replyMessage.seq];
		delete this._pendingReplies[replyMessage.seq];

		if (replyMessage.err) {
			let err = replyMessage.err;
			if (replyMessage.err.$isError) {
				err = new Error();
				err.name = replyMessage.err.name;
				err.message = replyMessage.err.message;
				err.stack = replyMessage.err.stack;
			}
			reply.reject(err);
			return;
		}

		reply.resolve(replyMessage.res);
	}

	private _handleRequestMessage(requestMessage: RequestMessage): void {
		const req = requestMessage.req;
		const result = this._handler.handleMessage(requestMessage.channel, requestMessage.method, requestMessage.args);
		result.then((r) => {
			this._send(new ReplyMessage(this._workerId, req, r, undefined));
		}, (e) => {
			if (e.detail instanceof Error) {
				// Loading errors have a detail property that points to the actual error
				e.detail = transformErrorForSerialization(e.detail);
			}
			this._send(new ReplyMessage(this._workerId, req, undefined, transformErrorForSerialization(e)));
		});
	}

	private _handleSubscribeEventMessage(msg: SubscribeEventMessage): void {
		const req = msg.req;
		const disposable = this._handler.handleEvent(msg.channel, msg.eventName, msg.arg)((event) => {
			this._send(new EventMessage(this._workerId, req, event));
		});
		this._pendingEvents.set(req, disposable);
	}

	private _handleEventMessage(msg: EventMessage): void {
		if (!this._pendingEmitters.has(msg.req)) {
			console.warn('Got event for unknown req');
			return;
		}
		this._pendingEmitters.get(msg.req)!.fire(msg.event);
	}

	private _handleUnsubscribeEventMessage(msg: UnsubscribeEventMessage): void {
		if (!this._pendingEvents.has(msg.req)) {
			console.warn('Got unsubscribe for unknown req');
			return;
		}
		this._pendingEvents.get(msg.req)!.dispose();
		this._pendingEvents.delete(msg.req);
	}

	private _send(msg: Message): void {
		const transfer: ArrayBuffer[] = [];
		if (msg.type === MessageType.Request) {
			for (let i = 0; i < msg.args.length; i++) {
				if (msg.args[i] instanceof ArrayBuffer) {
					transfer.push(msg.args[i]);
				}
			}
		} else if (msg.type === MessageType.Reply) {
			if (msg.res instanceof ArrayBuffer) {
				transfer.push(msg.res);
			}
		}
		this._handler.sendMessage(msg, transfer);
	}
}

type ProxiedMethodName = (`$${string}` | `on${string}`);

export type Proxied<T> = { [K in keyof T]: T[K] extends (...args: infer A) => infer R
	? (
		K extends ProxiedMethodName
		? (...args: A) => Promise<Awaited<R>>
		: never
	)
	: never
};

export interface IWebWorkerClient<TProxy> {
	proxy: Proxied<TProxy>;
	dispose(): void;
	setChannel<T extends object>(channel: string, handler: T): void;
	getChannel<T extends object>(channel: string): Proxied<T>;
}

export interface IWebWorkerServer {
	setChannel<T extends object>(channel: string, handler: T): void;
	getChannel<T extends object>(channel: string): Proxied<T>;
}

/**
 * Main thread side
 */
export class WebWorkerClient<W extends object> extends Disposable implements IWebWorkerClient<W> {

	private readonly _worker: IWebWorker;
	private readonly _onModuleLoaded: Promise<void>;
	private readonly _protocol: WebWorkerProtocol;
	public readonly proxy: Proxied<W>;
	private readonly _localChannels: Map<string, object> = new Map();
	private readonly _remoteChannels: Map<string, object> = new Map();

	constructor(
		worker: IWebWorker
	) {
		super();

		this._worker = this._register(worker);
		this._register(this._worker.onMessage((msg) => {
			this._protocol.handleMessage(msg);
		}));
		this._register(this._worker.onError((err) => {
			logOnceWebWorkerWarning(err);
			onUnexpectedError(err);
		}));

		this._protocol = new WebWorkerProtocol({
			sendMessage: (msg: any, transfer: ArrayBuffer[]): void => {
				this._worker.postMessage(msg, transfer);
			},
			handleMessage: (channel: string, method: string, args: any[]): Promise<any> => {
				return this._handleMessage(channel, method, args);
			},
			handleEvent: (channel: string, eventName: string, arg: any): Event<any> => {
				return this._handleEvent(channel, eventName, arg);
			}
		});
		this._protocol.setWorkerId(this._worker.getId());

		// Send initialize message
		this._onModuleLoaded = this._protocol.sendMessage(DEFAULT_CHANNEL, INITIALIZE, [
			this._worker.getId(),
		]);

		this.proxy = this._protocol.createProxyToRemoteChannel(DEFAULT_CHANNEL, async () => { await this._onModuleLoaded; });
		this._onModuleLoaded.catch((e) => {
			this._onError('Worker failed to load ', e);
		});
	}

	private _handleMessage(channelName: string, method: string, args: any[]): Promise<any> {
		const channel: object | undefined = this._localChannels.get(channelName);
		if (!channel) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 356: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 361: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 370: Error message without production error code - breaks React bundle size optimization
//   4. Line 370: Error message without production error code - breaks React bundle size optimization
//   5. Line 373: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 375: Error message without production error code - breaks React bundle size optimization
//   7. Line 375: Error message without production error code - breaks React bundle size optimization
//   8. Line 380: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 382: Error message without production error code - breaks React bundle size optimization
//   10. Line 382: Error message without production error code - breaks React bundle size optimization
//   11. Line 386: Error message without production error code - breaks React bundle size optimization
//   12. Line 386: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			return Promise.reject(new Error(`Missing channel ${channelName} on main thread`));
		}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 378: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 383: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 392: Error message without production error code - breaks React bundle size optimization
//   4. Line 392: Error message without production error code - breaks React bundle size optimization
//   5. Line 395: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 397: Error message without production error code - breaks React bundle size optimization
//   7. Line 397: Error message without production error code - breaks React bundle size optimization
//   8. Line 402: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 404: Error message without production error code - breaks React bundle size optimization
//   10. Line 404: Error message without production error code - breaks React bundle size optimization
//   11. Line 408: Error message without production error code - breaks React bundle size optimization
//   12. Line 408: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 398: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 403: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 412: Error message without production error code - breaks React bundle size optimization
//   4. Line 412: Error message without production error code - breaks React bundle size optimization
//   5. Line 415: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 417: Error message without production error code - breaks React bundle size optimization
//   7. Line 417: Error message without production error code - breaks React bundle size optimization
//   8. Line 422: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 424: Error message without production error code - breaks React bundle size optimization
//   10. Line 424: Error message without production error code - breaks React bundle size optimization
//   11. Line 428: Error message without production error code - breaks React bundle size optimization
//   12. Line 428: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 418: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 423: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 432: Error message without production error code - breaks React bundle size optimization
//   4. Line 432: Error message without production error code - breaks React bundle size optimization
//   5. Line 435: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 437: Error message without production error code - breaks React bundle size optimization
//   7. Line 437: Error message without production error code - breaks React bundle size optimization
//   8. Line 442: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 444: Error message without production error code - breaks React bundle size optimization
//   10. Line 444: Error message without production error code - breaks React bundle size optimization
//   11. Line 448: Error message without production error code - breaks React bundle size optimization
//   12. Line 448: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 438: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 443: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 452: Error message without production error code - breaks React bundle size optimization
//   4. Line 452: Error message without production error code - breaks React bundle size optimization
//   5. Line 455: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 457: Error message without production error code - breaks React bundle size optimization
//   7. Line 457: Error message without production error code - breaks React bundle size optimization
//   8. Line 462: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 464: Error message without production error code - breaks React bundle size optimization
//   10. Line 464: Error message without production error code - breaks React bundle size optimization
//   11. Line 468: Error message without production error code - breaks React bundle size optimization
//   12. Line 468: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 458: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 463: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 472: Error message without production error code - breaks React bundle size optimization
//   4. Line 472: Error message without production error code - breaks React bundle size optimization
//   5. Line 475: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 477: Error message without production error code - breaks React bundle size optimization
//   7. Line 477: Error message without production error code - breaks React bundle size optimization
//   8. Line 482: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 484: Error message without production error code - breaks React bundle size optimization
//   10. Line 484: Error message without production error code - breaks React bundle size optimization
//   11. Line 488: Error message without production error code - breaks React bundle size optimization
//   12. Line 488: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 478: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 483: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 492: Error message without production error code - breaks React bundle size optimization
//   4. Line 492: Error message without production error code - breaks React bundle size optimization
//   5. Line 495: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 497: Error message without production error code - breaks React bundle size optimization
//   7. Line 497: Error message without production error code - breaks React bundle size optimization
//   8. Line 502: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 504: Error message without production error code - breaks React bundle size optimization
//   10. Line 504: Error message without production error code - breaks React bundle size optimization
//   11. Line 508: Error message without production error code - breaks React bundle size optimization
//   12. Line 508: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 498: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 503: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 512: Error message without production error code - breaks React bundle size optimization
//   4. Line 512: Error message without production error code - breaks React bundle size optimization
//   5. Line 515: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 517: Error message without production error code - breaks React bundle size optimization
//   7. Line 517: Error message without production error code - breaks React bundle size optimization
//   8. Line 522: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 524: Error message without production error code - breaks React bundle size optimization
//   10. Line 524: Error message without production error code - breaks React bundle size optimization
//   11. Line 528: Error message without production error code - breaks React bundle size optimization
//   12. Line 528: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 518: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 523: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 532: Error message without production error code - breaks React bundle size optimization
//   4. Line 532: Error message without production error code - breaks React bundle size optimization
//   5. Line 535: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 537: Error message without production error code - breaks React bundle size optimization
//   7. Line 537: Error message without production error code - breaks React bundle size optimization
//   8. Line 542: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 544: Error message without production error code - breaks React bundle size optimization
//   10. Line 544: Error message without production error code - breaks React bundle size optimization
//   11. Line 548: Error message without production error code - breaks React bundle size optimization
//   12. Line 548: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 538: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 543: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 552: Error message without production error code - breaks React bundle size optimization
//   4. Line 552: Error message without production error code - breaks React bundle size optimization
//   5. Line 555: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 557: Error message without production error code - breaks React bundle size optimization
//   7. Line 557: Error message without production error code - breaks React bundle size optimization
//   8. Line 562: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 564: Error message without production error code - breaks React bundle size optimization
//   10. Line 564: Error message without production error code - breaks React bundle size optimization
//   11. Line 568: Error message without production error code - breaks React bundle size optimization
//   12. Line 568: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 558: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 563: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 572: Error message without production error code - breaks React bundle size optimization
//   4. Line 572: Error message without production error code - breaks React bundle size optimization
//   5. Line 575: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 577: Error message without production error code - breaks React bundle size optimization
//   7. Line 577: Error message without production error code - breaks React bundle size optimization
//   8. Line 582: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 584: Error message without production error code - breaks React bundle size optimization
//   10. Line 584: Error message without production error code - breaks React bundle size optimization
//   11. Line 588: Error message without production error code - breaks React bundle size optimization
//   12. Line 588: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 578: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 583: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 592: Error message without production error code - breaks React bundle size optimization
//   4. Line 592: Error message without production error code - breaks React bundle size optimization
//   5. Line 595: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 597: Error message without production error code - breaks React bundle size optimization
//   7. Line 597: Error message without production error code - breaks React bundle size optimization
//   8. Line 602: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 604: Error message without production error code - breaks React bundle size optimization
//   10. Line 604: Error message without production error code - breaks React bundle size optimization
//   11. Line 608: Error message without production error code - breaks React bundle size optimization
//   12. Line 608: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 598: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 603: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 612: Error message without production error code - breaks React bundle size optimization
//   4. Line 612: Error message without production error code - breaks React bundle size optimization
//   5. Line 615: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 617: Error message without production error code - breaks React bundle size optimization
//   7. Line 617: Error message without production error code - breaks React bundle size optimization
//   8. Line 622: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 624: Error message without production error code - breaks React bundle size optimization
//   10. Line 624: Error message without production error code - breaks React bundle size optimization
//   11. Line 628: Error message without production error code - breaks React bundle size optimization
//   12. Line 628: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 618: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 623: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 632: Error message without production error code - breaks React bundle size optimization
//   4. Line 632: Error message without production error code - breaks React bundle size optimization
//   5. Line 635: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 637: Error message without production error code - breaks React bundle size optimization
//   7. Line 637: Error message without production error code - breaks React bundle size optimization
//   8. Line 642: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 644: Error message without production error code - breaks React bundle size optimization
//   10. Line 644: Error message without production error code - breaks React bundle size optimization
//   11. Line 648: Error message without production error code - breaks React bundle size optimization
//   12. Line 648: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 638: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 643: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 652: Error message without production error code - breaks React bundle size optimization
//   4. Line 652: Error message without production error code - breaks React bundle size optimization
//   5. Line 655: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 657: Error message without production error code - breaks React bundle size optimization
//   7. Line 657: Error message without production error code - breaks React bundle size optimization
//   8. Line 662: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 664: Error message without production error code - breaks React bundle size optimization
//   10. Line 664: Error message without production error code - breaks React bundle size optimization
//   11. Line 668: Error message without production error code - breaks React bundle size optimization
//   12. Line 668: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 658: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 663: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 672: Error message without production error code - breaks React bundle size optimization
//   4. Line 672: Error message without production error code - breaks React bundle size optimization
//   5. Line 675: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 677: Error message without production error code - breaks React bundle size optimization
//   7. Line 677: Error message without production error code - breaks React bundle size optimization
//   8. Line 682: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 684: Error message without production error code - breaks React bundle size optimization
//   10. Line 684: Error message without production error code - breaks React bundle size optimization
//   11. Line 688: Error message without production error code - breaks React bundle size optimization
//   12. Line 688: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 678: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 683: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 692: Error message without production error code - breaks React bundle size optimization
//   4. Line 692: Error message without production error code - breaks React bundle size optimization
//   5. Line 695: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 697: Error message without production error code - breaks React bundle size optimization
//   7. Line 697: Error message without production error code - breaks React bundle size optimization
//   8. Line 702: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 704: Error message without production error code - breaks React bundle size optimization
//   10. Line 704: Error message without production error code - breaks React bundle size optimization
//   11. Line 708: Error message without production error code - breaks React bundle size optimization
//   12. Line 708: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 698: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 703: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 712: Error message without production error code - breaks React bundle size optimization
//   4. Line 712: Error message without production error code - breaks React bundle size optimization
//   5. Line 715: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 717: Error message without production error code - breaks React bundle size optimization
//   7. Line 717: Error message without production error code - breaks React bundle size optimization
//   8. Line 722: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 724: Error message without production error code - breaks React bundle size optimization
//   10. Line 724: Error message without production error code - breaks React bundle size optimization
//   11. Line 728: Error message without production error code - breaks React bundle size optimization
//   12. Line 728: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 718: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 723: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 732: Error message without production error code - breaks React bundle size optimization
//   4. Line 732: Error message without production error code - breaks React bundle size optimization
//   5. Line 735: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 737: Error message without production error code - breaks React bundle size optimization
//   7. Line 737: Error message without production error code - breaks React bundle size optimization
//   8. Line 742: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 744: Error message without production error code - breaks React bundle size optimization
//   10. Line 744: Error message without production error code - breaks React bundle size optimization
//   11. Line 748: Error message without production error code - breaks React bundle size optimization
//   12. Line 748: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 738: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 743: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 752: Error message without production error code - breaks React bundle size optimization
//   4. Line 752: Error message without production error code - breaks React bundle size optimization
//   5. Line 755: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 757: Error message without production error code - breaks React bundle size optimization
//   7. Line 757: Error message without production error code - breaks React bundle size optimization
//   8. Line 762: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 764: Error message without production error code - breaks React bundle size optimization
//   10. Line 764: Error message without production error code - breaks React bundle size optimization
//   11. Line 768: Error message without production error code - breaks React bundle size optimization
//   12. Line 768: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 758: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 763: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 772: Error message without production error code - breaks React bundle size optimization
//   4. Line 772: Error message without production error code - breaks React bundle size optimization
//   5. Line 775: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 777: Error message without production error code - breaks React bundle size optimization
//   7. Line 777: Error message without production error code - breaks React bundle size optimization
//   8. Line 782: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 784: Error message without production error code - breaks React bundle size optimization
//   10. Line 784: Error message without production error code - breaks React bundle size optimization
//   11. Line 788: Error message without production error code - breaks React bundle size optimization
//   12. Line 788: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 778: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 783: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 792: Error message without production error code - breaks React bundle size optimization
//   4. Line 792: Error message without production error code - breaks React bundle size optimization
//   5. Line 795: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 797: Error message without production error code - breaks React bundle size optimization
//   7. Line 797: Error message without production error code - breaks React bundle size optimization
//   8. Line 802: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 804: Error message without production error code - breaks React bundle size optimization
//   10. Line 804: Error message without production error code - breaks React bundle size optimization
//   11. Line 808: Error message without production error code - breaks React bundle size optimization
//   12. Line 808: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 798: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 803: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 812: Error message without production error code - breaks React bundle size optimization
//   4. Line 812: Error message without production error code - breaks React bundle size optimization
//   5. Line 815: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 817: Error message without production error code - breaks React bundle size optimization
//   7. Line 817: Error message without production error code - breaks React bundle size optimization
//   8. Line 822: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 824: Error message without production error code - breaks React bundle size optimization
//   10. Line 824: Error message without production error code - breaks React bundle size optimization
//   11. Line 828: Error message without production error code - breaks React bundle size optimization
//   12. Line 828: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		if (typeof (channel as any)[method] !== 'function') {
			return Promise.reject(new Error(`Missing method ${method} on main thread channel ${channelName}`));
		}

		try {
			return Promise.resolve((channel as any)[method].apply(channel, args));
		} catch (e) {
			return Promise.reject(e);
		}
	}

	private _handleEvent(channelName: string, eventName: string, arg: any): Event<any> {
		const channel: object | undefined = this._localChannels.get(channelName);
		if (!channel) {
			throw new Error(`Missing channel ${channelName} on main thread`);
		}
		if (propertyIsDynamicEvent(eventName)) {
			const event = (channel as any)[eventName].call(channel, arg);
			if (typeof event !== 'function') {
				throw new Error(`Missing dynamic event ${eventName} on main thread channel ${channelName}.`);
			}
			return event;
		}
		if (propertyIsEvent(eventName)) {
			const event = (channel as any)[eventName];
			if (typeof event !== 'function') {
				throw new Error(`Missing event ${eventName} on main thread channel ${channelName}.`);
			}
			return event;
		}
		throw new Error(`Malformed event name ${eventName}`);
	}

	public setChannel<T extends object>(channel: string, handler: T): void {
		this._localChannels.set(channel, handler);
	}

	public getChannel<T extends object>(channel: string): Proxied<T> {
		if (!this._remoteChannels.has(channel)) {
			const inst = this._protocol.createProxyToRemoteChannel(channel, async () => { await this._onModuleLoaded; });
			this._remoteChannels.set(channel, inst);
		}
		return this._remoteChannels.get(channel) as Proxied<T>;
	}

	private _onError(message: string, error?: any): void {
		console.error(message);
		console.info(error);
	}
}

function propertyIsEvent(name: string): boolean {
	// Assume a property is an event if it has a form of "onSomething"
	return name[0] === 'o' && name[1] === 'n' && strings.isUpperAsciiLetter(name.charCodeAt(2));
}

function propertyIsDynamicEvent(name: string): boolean {
	// Assume a property is a dynamic event (a method that returns an event) if it has a form of "onDynamicSomething"
	return /^onDynamic/.test(name) && strings.isUpperAsciiLetter(name.charCodeAt(9));
}

export interface IWebWorkerServerRequestHandler {
	_requestHandlerBrand: any;
	[prop: string]: any;
}

export interface IWebWorkerServerRequestHandlerFactory<T extends IWebWorkerServerRequestHandler> {
	(workerServer: IWebWorkerServer): T;
}

/**
 * Worker side
 */
export class WebWorkerServer<T extends IWebWorkerServerRequestHandler> implements IWebWorkerServer {

	public readonly requestHandler: T;
	private _protocol: WebWorkerProtocol;
	private readonly _localChannels: Map<string, object> = new Map();
	private readonly _remoteChannels: Map<string, object> = new Map();

	constructor(postMessage: (msg: Message, transfer?: ArrayBuffer[]) => void, requestHandlerFactory: IWebWorkerServerRequestHandlerFactory<T>) {
		this._protocol = new WebWorkerProtocol({
			sendMessage: (msg: any, transfer: ArrayBuffer[]): void => {
				postMessage(msg, transfer);
			},
			handleMessage: (channel: string, method: string, args: any[]): Promise<any> => this._handleMessage(channel, method, args),
			handleEvent: (channel: string, eventName: string, arg: any): Event<any> => this._handleEvent(channel, eventName, arg)
		});
		this.requestHandler = requestHandlerFactory(this);
	}

	public onmessage(msg: any): void {
		this._protocol.handleMessage(msg);
	}

	private _handleMessage(channel: string, method: string, args: any[]): Promise<any> {
		if (channel === DEFAULT_CHANNEL && method === INITIALIZE) {
			return this.initialize(<number>args[0]);
		}

		const requestHandler: object | null | undefined = (channel === DEFAULT_CHANNEL ? this.requestHandler : this._localChannels.get(channel));
		if (!requestHandler) {
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 460: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 465: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 474: Error message without production error code - breaks React bundle size optimization
//   4. Line 474: Error message without production error code - breaks React bundle size optimization
//   5. Line 477: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 479: Error message without production error code - breaks React bundle size optimization
//   7. Line 479: Error message without production error code - breaks React bundle size optimization
//   8. Line 484: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 486: Error message without production error code - breaks React bundle size optimization
//   10. Line 486: Error message without production error code - breaks React bundle size optimization
//   11. Line 490: Error message without production error code - breaks React bundle size optimization
//   12. Line 490: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

			return Promise.reject(new Error(`Missing channel ${channel} on worker thread`));
		}
// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 502: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 507: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 516: Error message without production error code - breaks React bundle size optimization
//   4. Line 516: Error message without production error code - breaks React bundle size optimization
//   5. Line 519: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 521: Error message without production error code - breaks React bundle size optimization
//   7. Line 521: Error message without production error code - breaks React bundle size optimization
//   8. Line 526: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 528: Error message without production error code - breaks React bundle size optimization
//   10. Line 528: Error message without production error code - breaks React bundle size optimization
//   11. Line 532: Error message without production error code - breaks React bundle size optimization
//   12. Line 532: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 542: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 547: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 556: Error message without production error code - breaks React bundle size optimization
//   4. Line 556: Error message without production error code - breaks React bundle size optimization
//   5. Line 559: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 561: Error message without production error code - breaks React bundle size optimization
//   7. Line 561: Error message without production error code - breaks React bundle size optimization
//   8. Line 566: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 568: Error message without production error code - breaks React bundle size optimization
//   10. Line 568: Error message without production error code - breaks React bundle size optimization
//   11. Line 572: Error message without production error code - breaks React bundle size optimization
//   12. Line 572: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 582: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 587: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 596: Error message without production error code - breaks React bundle size optimization
//   4. Line 596: Error message without production error code - breaks React bundle size optimization
//   5. Line 599: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 601: Error message without production error code - breaks React bundle size optimization
//   7. Line 601: Error message without production error code - breaks React bundle size optimization
//   8. Line 606: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 608: Error message without production error code - breaks React bundle size optimization
//   10. Line 608: Error message without production error code - breaks React bundle size optimization
//   11. Line 612: Error message without production error code - breaks React bundle size optimization
//   12. Line 612: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 622: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 627: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 636: Error message without production error code - breaks React bundle size optimization
//   4. Line 636: Error message without production error code - breaks React bundle size optimization
//   5. Line 639: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 641: Error message without production error code - breaks React bundle size optimization
//   7. Line 641: Error message without production error code - breaks React bundle size optimization
//   8. Line 646: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 648: Error message without production error code - breaks React bundle size optimization
//   10. Line 648: Error message without production error code - breaks React bundle size optimization
//   11. Line 652: Error message without production error code - breaks React bundle size optimization
//   12. Line 652: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 662: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 667: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 676: Error message without production error code - breaks React bundle size optimization
//   4. Line 676: Error message without production error code - breaks React bundle size optimization
//   5. Line 679: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 681: Error message without production error code - breaks React bundle size optimization
//   7. Line 681: Error message without production error code - breaks React bundle size optimization
//   8. Line 686: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 688: Error message without production error code - breaks React bundle size optimization
//   10. Line 688: Error message without production error code - breaks React bundle size optimization
//   11. Line 692: Error message without production error code - breaks React bundle size optimization
//   12. Line 692: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 702: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 707: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 716: Error message without production error code - breaks React bundle size optimization
//   4. Line 716: Error message without production error code - breaks React bundle size optimization
//   5. Line 719: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 721: Error message without production error code - breaks React bundle size optimization
//   7. Line 721: Error message without production error code - breaks React bundle size optimization
//   8. Line 726: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 728: Error message without production error code - breaks React bundle size optimization
//   10. Line 728: Error message without production error code - breaks React bundle size optimization
//   11. Line 732: Error message without production error code - breaks React bundle size optimization
//   12. Line 732: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 742: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 747: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 756: Error message without production error code - breaks React bundle size optimization
//   4. Line 756: Error message without production error code - breaks React bundle size optimization
//   5. Line 759: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 761: Error message without production error code - breaks React bundle size optimization
//   7. Line 761: Error message without production error code - breaks React bundle size optimization
//   8. Line 766: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 768: Error message without production error code - breaks React bundle size optimization
//   10. Line 768: Error message without production error code - breaks React bundle size optimization
//   11. Line 772: Error message without production error code - breaks React bundle size optimization
//   12. Line 772: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 782: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 787: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 796: Error message without production error code - breaks React bundle size optimization
//   4. Line 796: Error message without production error code - breaks React bundle size optimization
//   5. Line 799: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 801: Error message without production error code - breaks React bundle size optimization
//   7. Line 801: Error message without production error code - breaks React bundle size optimization
//   8. Line 806: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 808: Error message without production error code - breaks React bundle size optimization
//   10. Line 808: Error message without production error code - breaks React bundle size optimization
//   11. Line 812: Error message without production error code - breaks React bundle size optimization
//   12. Line 812: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 822: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 827: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 836: Error message without production error code - breaks React bundle size optimization
//   4. Line 836: Error message without production error code - breaks React bundle size optimization
//   5. Line 839: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 841: Error message without production error code - breaks React bundle size optimization
//   7. Line 841: Error message without production error code - breaks React bundle size optimization
//   8. Line 846: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 848: Error message without production error code - breaks React bundle size optimization
//   10. Line 848: Error message without production error code - breaks React bundle size optimization
//   11. Line 852: Error message without production error code - breaks React bundle size optimization
//   12. Line 852: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 862: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 867: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 876: Error message without production error code - breaks React bundle size optimization
//   4. Line 876: Error message without production error code - breaks React bundle size optimization
//   5. Line 879: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 881: Error message without production error code - breaks React bundle size optimization
//   7. Line 881: Error message without production error code - breaks React bundle size optimization
//   8. Line 886: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 888: Error message without production error code - breaks React bundle size optimization
//   10. Line 888: Error message without production error code - breaks React bundle size optimization
//   11. Line 892: Error message without production error code - breaks React bundle size optimization
//   12. Line 892: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 902: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 907: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 916: Error message without production error code - breaks React bundle size optimization
//   4. Line 916: Error message without production error code - breaks React bundle size optimization
//   5. Line 919: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 921: Error message without production error code - breaks React bundle size optimization
//   7. Line 921: Error message without production error code - breaks React bundle size optimization
//   8. Line 926: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 928: Error message without production error code - breaks React bundle size optimization
//   10. Line 928: Error message without production error code - breaks React bundle size optimization
//   11. Line 932: Error message without production error code - breaks React bundle size optimization
//   12. Line 932: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 942: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 947: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 956: Error message without production error code - breaks React bundle size optimization
//   4. Line 956: Error message without production error code - breaks React bundle size optimization
//   5. Line 959: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 961: Error message without production error code - breaks React bundle size optimization
//   7. Line 961: Error message without production error code - breaks React bundle size optimization
//   8. Line 966: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 968: Error message without production error code - breaks React bundle size optimization
//   10. Line 968: Error message without production error code - breaks React bundle size optimization
//   11. Line 972: Error message without production error code - breaks React bundle size optimization
//   12. Line 972: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 982: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 987: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 996: Error message without production error code - breaks React bundle size optimization
//   4. Line 996: Error message without production error code - breaks React bundle size optimization
//   5. Line 999: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1001: Error message without production error code - breaks React bundle size optimization
//   7. Line 1001: Error message without production error code - breaks React bundle size optimization
//   8. Line 1006: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1008: Error message without production error code - breaks React bundle size optimization
//   10. Line 1008: Error message without production error code - breaks React bundle size optimization
//   11. Line 1012: Error message without production error code - breaks React bundle size optimization
//   12. Line 1012: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1022: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1027: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1036: Error message without production error code - breaks React bundle size optimization
//   4. Line 1036: Error message without production error code - breaks React bundle size optimization
//   5. Line 1039: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1041: Error message without production error code - breaks React bundle size optimization
//   7. Line 1041: Error message without production error code - breaks React bundle size optimization
//   8. Line 1046: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1048: Error message without production error code - breaks React bundle size optimization
//   10. Line 1048: Error message without production error code - breaks React bundle size optimization
//   11. Line 1052: Error message without production error code - breaks React bundle size optimization
//   12. Line 1052: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1062: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1067: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1076: Error message without production error code - breaks React bundle size optimization
//   4. Line 1076: Error message without production error code - breaks React bundle size optimization
//   5. Line 1079: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1081: Error message without production error code - breaks React bundle size optimization
//   7. Line 1081: Error message without production error code - breaks React bundle size optimization
//   8. Line 1086: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1088: Error message without production error code - breaks React bundle size optimization
//   10. Line 1088: Error message without production error code - breaks React bundle size optimization
//   11. Line 1092: Error message without production error code - breaks React bundle size optimization
//   12. Line 1092: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1102: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1107: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1116: Error message without production error code - breaks React bundle size optimization
//   4. Line 1116: Error message without production error code - breaks React bundle size optimization
//   5. Line 1119: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1121: Error message without production error code - breaks React bundle size optimization
//   7. Line 1121: Error message without production error code - breaks React bundle size optimization
//   8. Line 1126: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1128: Error message without production error code - breaks React bundle size optimization
//   10. Line 1128: Error message without production error code - breaks React bundle size optimization
//   11. Line 1132: Error message without production error code - breaks React bundle size optimization
//   12. Line 1132: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1142: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1147: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1156: Error message without production error code - breaks React bundle size optimization
//   4. Line 1156: Error message without production error code - breaks React bundle size optimization
//   5. Line 1159: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1161: Error message without production error code - breaks React bundle size optimization
//   7. Line 1161: Error message without production error code - breaks React bundle size optimization
//   8. Line 1166: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1168: Error message without production error code - breaks React bundle size optimization
//   10. Line 1168: Error message without production error code - breaks React bundle size optimization
//   11. Line 1172: Error message without production error code - breaks React bundle size optimization
//   12. Line 1172: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1182: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1187: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1196: Error message without production error code - breaks React bundle size optimization
//   4. Line 1196: Error message without production error code - breaks React bundle size optimization
//   5. Line 1199: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1201: Error message without production error code - breaks React bundle size optimization
//   7. Line 1201: Error message without production error code - breaks React bundle size optimization
//   8. Line 1206: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1208: Error message without production error code - breaks React bundle size optimization
//   10. Line 1208: Error message without production error code - breaks React bundle size optimization
//   11. Line 1212: Error message without production error code - breaks React bundle size optimization
//   12. Line 1212: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1222: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1227: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1236: Error message without production error code - breaks React bundle size optimization
//   4. Line 1236: Error message without production error code - breaks React bundle size optimization
//   5. Line 1239: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1241: Error message without production error code - breaks React bundle size optimization
//   7. Line 1241: Error message without production error code - breaks React bundle size optimization
//   8. Line 1246: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1248: Error message without production error code - breaks React bundle size optimization
//   10. Line 1248: Error message without production error code - breaks React bundle size optimization
//   11. Line 1252: Error message without production error code - breaks React bundle size optimization
//   12. Line 1252: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1262: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1267: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1276: Error message without production error code - breaks React bundle size optimization
//   4. Line 1276: Error message without production error code - breaks React bundle size optimization
//   5. Line 1279: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1281: Error message without production error code - breaks React bundle size optimization
//   7. Line 1281: Error message without production error code - breaks React bundle size optimization
//   8. Line 1286: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1288: Error message without production error code - breaks React bundle size optimization
//   10. Line 1288: Error message without production error code - breaks React bundle size optimization
//   11. Line 1292: Error message without production error code - breaks React bundle size optimization
//   12. Line 1292: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1302: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1307: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1316: Error message without production error code - breaks React bundle size optimization
//   4. Line 1316: Error message without production error code - breaks React bundle size optimization
//   5. Line 1319: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1321: Error message without production error code - breaks React bundle size optimization
//   7. Line 1321: Error message without production error code - breaks React bundle size optimization
//   8. Line 1326: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1328: Error message without production error code - breaks React bundle size optimization
//   10. Line 1328: Error message without production error code - breaks React bundle size optimization
//   11. Line 1332: Error message without production error code - breaks React bundle size optimization
//   12. Line 1332: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

// VIOLATION: VSCODE-DANGEROUS-ASSERTIONS-006 - Dangerous type assertion in VSCode source - runtime type error risk
// SEVERITY: ERROR
// ISSUES FOUND (12):
//   1. Line 1342: Dangerous type assertion in VSCode source - runtime type error risk
//   2. Line 1347: Dangerous type assertion in VSCode source - runtime type error risk
//   3. Line 1356: Error message without production error code - breaks React bundle size optimization
//   4. Line 1356: Error message without production error code - breaks React bundle size optimization
//   5. Line 1359: Dangerous type assertion in VSCode source - runtime type error risk
//   6. Line 1361: Error message without production error code - breaks React bundle size optimization
//   7. Line 1361: Error message without production error code - breaks React bundle size optimization
//   8. Line 1366: Dangerous type assertion in VSCode source - runtime type error risk
//   9. Line 1368: Error message without production error code - breaks React bundle size optimization
//   10. Line 1368: Error message without production error code - breaks React bundle size optimization
//   11. Line 1372: Error message without production error code - breaks React bundle size optimization
//   12. Line 1372: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Type assertions bypass TypeScript safety - cause runtime crashes in VSCODE_EDITOR_PLATFORM
// QUICK_FIX: Use type guards, optional chaining, or instanceof checks
// BUSINESS_IMPACT: Runtime type errors crash editor features affecting millions of developers
// DOCS: https://github.com/microsoft/vscode/wiki/Coding-Guidelines#type-assertions

		if (typeof (requestHandler as any)[method] !== 'function') {
			return Promise.reject(new Error(`Missing method ${method} on worker thread channel ${channel}`));
		}

		try {
			return Promise.resolve((requestHandler as any)[method].apply(requestHandler, args));
		} catch (e) {
			return Promise.reject(e);
		}
	}

	private _handleEvent(channel: string, eventName: string, arg: any): Event<any> {
		const requestHandler: object | null | undefined = (channel === DEFAULT_CHANNEL ? this.requestHandler : this._localChannels.get(channel));
		if (!requestHandler) {
			throw new Error(`Missing channel ${channel} on worker thread`);
		}
		if (propertyIsDynamicEvent(eventName)) {
			const event = (requestHandler as any)[eventName].call(requestHandler, arg);
			if (typeof event !== 'function') {
				throw new Error(`Missing dynamic event ${eventName} on request handler.`);
			}
			return event;
		}
		if (propertyIsEvent(eventName)) {
			const event = (requestHandler as any)[eventName];
			if (typeof event !== 'function') {
				throw new Error(`Missing event ${eventName} on request handler.`);
			}
			return event;
		}
		throw new Error(`Malformed event name ${eventName}`);
	}

	public setChannel<T extends object>(channel: string, handler: T): void {
		this._localChannels.set(channel, handler);
	}

	public getChannel<T extends object>(channel: string): Proxied<T> {
		if (!this._remoteChannels.has(channel)) {
			const inst = this._protocol.createProxyToRemoteChannel(channel);
			this._remoteChannels.set(channel, inst);
		}
		return this._remoteChannels.get(channel) as Proxied<T>;
	}

	private async initialize(workerId: number): Promise<void> {
		this._protocol.setWorkerId(workerId);
	}
}
