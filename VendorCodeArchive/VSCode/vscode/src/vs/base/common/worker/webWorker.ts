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
