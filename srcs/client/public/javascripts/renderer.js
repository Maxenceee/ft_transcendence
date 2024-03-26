/*!






 __  __                                                  ____
|  \/  |   __ _  __  __   ___   _ __     ___    ___     / ___|   __ _   _ __ ___     __ _ 
| |\/| |  / _` | \ \/ /  / _ \ | '_ \   / __|  / _ \   | |  _   / _` | | '_ ` _ \   / _` |
| |  | | | (_| |  >  <  |  __/ | | | | | (__  |  __/   | |_| | | (_| | | | | | | | | (_| |
|_|  |_|  \__,_| /_/\_\  \___| |_| |_|  \___|  \___|    \____|  \__,_| |_| |_| |_|  \__,_|







 */
/**!
 *   @license © Copyright 2024, All rights reserved.
 *   @author Maxence Gama, @maxencegama
 *   @contact contact@maxencegama.dev
 */

/**
 * 
 ************************************************************************************************************
 *
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 ************************************************************************************************************
 */


/**
 * This is shit, but THREE.js can only be imported has es module :/
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
/**
 * 
 */


var CallBack = function() {}
CallBack.prototype.on = function(t, e) {
	this.listeners = this.listeners || {}
	this.listeners[t] || (this.listeners[t] = []),
	this.listeners[t].push(e);
}
CallBack.prototype.emit = function(t) {
	for (var e = arguments.length, n = Array(e > 1 ? e - 1 : 0), o = 1; o < e; o++)
		n[o - 1] = arguments[o];
	if (!this.listeners)
		return ;
	var i = this.listeners[t];
	i && i.length && i.forEach(function(t) {
		return (t.apply(void 0, n));
	})
}
var mergeProto = function(a, b) {
	return function(t, e) {
		if ("function" != typeof e && null !== e)
			throw new TypeError("Super expression must either be null or a function, not " + typeof e);
		t.prototype = Object.create(e && e.prototype, {
			constructor: {
				value: t,
				enumerable: !1,
				writable: !0,
				configurable: !0
			}
		}),
		e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
	}(a, b)
};

var bindPort = function(a, b) {
	if (!isNaN(parseInt(b))) {
		return ("//"+a+':'+b);
	}
	return ("//"+b+'.'+a);
}
const {toString: Yh} = Object.prototype,
	{getPrototypeOf: n1} = Object,
	sl = e => t => typeof t === e,
	ku = (()=>typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global)(),
	pt = sl("function"),
	vi = sl("undefined"),
	isString = sl("string"),
	Mu = e => !vi(e) && e !== ku,
	ol = (e=>t=>{
		const r = Yh.call(t);
		return e[r] || (e[r] = r.slice(8, -1).toLowerCase())
	})(Object.create(null)),
	la = e=>{
		if (ol(e) !== "object")
			return !1;
		const t = n1(e);
		return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e)
	}

function Su(e, t) {
	t = t.toLowerCase();
	const r = Object.keys(e);
	let i = r.length, a;
	for (; i-- > 0; )
		if (a = r[i],
		t === a.toLowerCase())
			return a;
	return null
}

const isUndefined = vi,
isArray = Array.isArray,
forEach = function(e, t, { allOwnKeys: r = false } = {}) {
	if (e === null || typeof e > "u")
		return;
	let i, a;
	if (typeof e != "object" && (e = [e]), isArray(e))
		for (i = 0,a = e.length; i < a; i++)
			t.call(null, e[i], i, e);
	else {
		const l = r ? Object.getOwnPropertyNames(e) : Object.keys(e), o = l.length;
		let s;
		for (i = 0; i < o; i++)
			s = l[i],
			t.call(null, e[s], s, e)
	}
},
extend = (e,t,r,{allOwnKeys: i}={})=>(forEach(t, (a,l)=>{
	r && pt(a) ? e[l] = wrap(a, r) : e[l] = a
}, {
	allOwnKeys: i
}), e), s5 = e=>(e.charCodeAt(0) === 65279 && (e = e.slice(1)), e),
isPlainObject = e => {
    if (ol(e) !== "object")
        return !1;
    const t = n1(e);
    return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e)
},
merge = function() {
    const {caseless: e} = Mu(this) && this || {},
	t = {},
	r = (i, a) => {
        const l = e && Su(t, a) || a;
        la(t[l]) && la(i) ? t[l] = merge(t[l], i) : la(i) ? t[l] = merge({}, i) : isArray(i) ? t[l] = i.slice() : t[l] = i
    }
    ;
    for (let i = 0, a = arguments.length; i < a; i++)
        arguments[i] && forEach(arguments[i], r);
    return t
}

function J5(e) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e)
}
function X5(e, t) {
    return t ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "") : e
}
function Pu(e, t) {
    return e && !J5(t) ? X5(e, t) : t
}

function wr(e, t) {
	t = t || {};
	const r = {};
	function i(u, h, f) {
		return isPlainObject(u) && isPlainObject(h) ? merge.call({
			caseless: f
		}, u, h) : isPlainObject(h) ? merge({}, h) : isArray(h) ? h.slice() : h
	}
	function a(u, h, f) {
		if (isUndefined(h)) {
			if (!isUndefined(u))
				return i(void 0, u, f)
		} else
			return i(u, h, f)
	}
	function l(u, h) {
		if (!isUndefined(h))
			return i(void 0, h)
	}
	function o(u, h) {
		if (isUndefined(h)) {
			if (!isUndefined(u))
				return i(void 0, u)
		} else
			return i(void 0, h)
	}
	function s(u, h, f) {
		if (f in t)
			return i(u, h);
		if (f in e)
			return i(void 0, u)
	}
	const d = {
		url: l,
		method: l,
		data: l,
		baseURL: o,
		transformRequest: o,
		transformResponse: o,
		paramsSerializer: o,
		timeout: o,
		timeoutMessage: o,
		withCredentials: o,
		withXSRFToken: o,
		adapter: o,
		responseType: o,
		xsrfCookieName: o,
		xsrfHeaderName: o,
		onUploadProgress: o,
		onDownloadProgress: o,
		decompress: o,
		maxContentLength: o,
		maxBodyLength: o,
		beforeRedirect: o,
		transport: o,
		httpAgent: o,
		httpsAgent: o,
		cancelToken: o,
		socketPath: o,
		responseEncoding: o,
		validateStatus: s,
		headers: (u,h)=>a(jc(u), jc(h), !0)
	};
	return forEach(Object.keys(Object.assign({}, e, t)), function(h) {
		const f = d[h] || a,
			y = f(e[h], t[h], h);
		isUndefined(y) && f !== s || (r[h] = y)
	}),
	r
}

class XHR {
	constructor(t) {
		this.defaults = t || {}
	}

	request(u, d) {
		typeof u == "string" ? (d = d || {}, d.url = u) : d = u || {},
			d = wr(this.defaults, d);
		d.method = (d.method || this.defaults.method || "get").toLowerCase();
		const transport = d.transport || "xhr";
		const handler = Go[transport];

		if (!handler) {
			throw new Error(`Transport "${transport}" is not supported`);
		}

		return handler.call(this, d);
	}
}

const Go = {
	xhr: function(config) {
		return new Promise(function(resolve, reject) {
			let data = config.data;
			const headers = config.headers || {};
			let {responseType: o} = config;
			const xhr = new XMLHttpRequest();

			const y = Pu(config.baseURL, config.url);
			xhr.open(config.method.toUpperCase(), y, true);
			xhr.timeout = config.timeout;

			xhr.onload = function() {
				const responseHeaders = parseHeaders(xhr.getAllResponseHeaders());
				const transformResponse = function(t) {
					const r = this.transitional,
						i = r && r.forcedJSONParsing,
						a = this.responseType === "json";
					if (t && isString(t) && (i && !this.responseType || a)) {
						const o = a;
						try {
							return JSON.parse(t)
						} catch (s) {
							throw o ? new Error("Unable to parse JSON data") : s
						}
					}
					return t
				}
				resolve({
					data: transformResponse.call(config, xhr.response),
					status: xhr.status,
					statusText: xhr.statusText,
					headers: responseHeaders,
					config: config,
					request: xhr
				});
			};

			xhr.onerror = function() {
				reject(new Error("Network Error"));
			};

			xhr.timeout = config.timeout;
			xhr.ontimeout = function() {
				reject(new Error(config.timeoutErrorMessage || "Timeout exceeded"));
			};

			Object.keys(headers).forEach(function(key) {
				xhr.setRequestHeader(key, headers[key]);
			});
			isUndefined(config.withCredentials) || (xhr.withCredentials = !!config.withCredentials);
			o && o !== "json" && (f.responseType = e.responseType)
			xhr.send(data || null);
		}.bind(this));
	},
	http: function(config) {
		throw new Error("HTTP transport is not implemented");
	}
};

function parseHeaders(headers) {
	const r = {};
	if (!headers) {
		return r;
	}
	headers.trim().split('\n').forEach(function(line) {
		const [key, ...values] = line.split(':');
		const t = key.trim();
		if (t) {
			r[t] = values.join(':').trim();
		}
	});
	return r;
}

forEach(["delete", "get", "head", "options"], function(t) {
	XHR.prototype[t] = function(r, i) {
		return this.request(wr(i || {}, {
			method: t,
			url: r,
			data: (i || {}).data
		}))
	}
});

forEach(["post", "put", "patch"], function(t) {
	function r(i) {
		return function(l, o, s) {
			return this.request(wr(s || {}, {
				method: t,
				headers: i ? {
					"Content-Type": "multipart/form-data"
				} : {},
				url: l,
				data: o
			}))
		}
	}
	XHR.prototype[t] = r(),
	XHR.prototype[t + "Form"] = r(!0)
});

function wrap(e, t) {
	return function() {
		return e.apply(t, arguments)
	}
}

function Bu(e) {
	const t = new XHR(e),
		r = wrap(XHR.prototype.request, t);
	return extend(r, XHR.prototype, t, {
		allOwnKeys: !0
	}),
	extend(r, t, null, {
		allOwnKeys: !0
	}),
	r.create = function(a) {
		return Bu(wr(e, a))
	},
	r
}
const xhrsum = Bu({
	transitional: {
		silentJSONParsing: !0,
		forcedJSONParsing: !0,
		clarifyTimeoutError: !1
	},
	timeout: 0,
	maxContentLength: -1,
	maxBodyLength: -1,
	env: {
		FormData: typeof FormData < "u" ? FormData : null,
		Blob: typeof Blob < "u" ? Blob : null
	},
});

xhrsum.default = xhrsum;
const xhr = xhrsum;

// (function() {
//     const t = document.createElement("link").relList;
//     if (t && t.supports && t.supports("modulepreload"))
//         return;
//     for (const a of document.querySelectorAll('link[rel="modulepreload"]'))
//         i(a);
//     new MutationObserver(a=>{
//         for (const l of a)
//             if (l.type === "childList")
//                 for (const o of l.addedNodes)
//                     o.tagName === "LINK" && o.rel === "modulepreload" && i(o)
//     }
//     ).observe(document, {
//         childList: !0,
//         subtree: !0
//     });
//     function r(a) {
//         const l = {};
//         return a.integrity && (l.integrity = a.integrity),
//         a.referrerPolicy && (l.referrerPolicy = a.referrerPolicy),
//         a.crossOrigin === "use-cjredentials" ? l.credentials = "include" : a.crossOrigin === "anonymous" ? l.credentials = "omit" : l.credentials = "same-origin",
//         l
//     }
//     function i(a) {
//         if (a.ep)
//             return;
//         a.ep = !0;
//         const l = r(a);
//         fetch(a.href, l)
//     }
// }
// )();

let S = {
	location: {
		pathname: window.location.pathname,
	}
}
let R = {
	routers: [],
	register: function(r) {
		this.routers.push(r);
	},
	pop: function(r) {
		this.routers = this.routers.filter(e => e !== r);
	},
}

let pushState = function(r) {
	if (r) {
		S.location.pathname = r;
		console.log("============ pushState", r, S);
		window.history.pushState({}, '', r);
		window.dispatchEvent(new Event('popstate'));
	}
}

let hh = function(e) {
	console.log("hh", S);
	let {pathname: t} = S.location;
	return Ia(e, t);
}

/**
 * TODO:
 * degage cette merde
 */

var Me = function(a, b, c) {
	return Le(document, arguments)
},
Le = function(a, b) {
	var c = String(b[0]),
		d = b[1],
		e = b[2] || null;
	c = (["svg", "path", "circle", "text"].includes(c.toLowerCase()) ? a.createElementNS("http://www.w3.org/2000/svg", c) : a.createElement(c));
	// c = a.createElement(c);
	if (e && e.in) c.innerHTML = e.in;
	if (e && e.style) c.style = e.style;

	b && (d && typeof e !== "object" && !je(d) ? Na(c, d, e) : (e && e.type ? c.setAttribute(e.type, d) : d && (c.className = d)));
	return c
},
Na = function(b, c, d) {
	function e(h, i) {
		b.setAttribute(h, i);
	}
	for (var i = 0; i < Math.min(c.length, d.length); i++) {
		e(c[i], d[i]);
	}
},
Mc = function(a, b) {
	a.classList.add(b);
},
Mr = function(a, b) {
	a.classList.remove(b);
},
jl = function(a) {
	return ("string" == typeof a);
},
Ms = function(a, b, c) {
	jl(b) ? a.setAttribute(b, c !== undefined ? c : "") : Na(a, b, c)
	return (a);
},
Md = function(a, b) {
	(b instanceof Node) ? a.appendChild(b) : dj(a, b)
	return (a);
},
Mg = function(a, b) {
	return (a.getElementsByClassName(b));
},
Mqa = function(a, b) {
	return (a.querySelectorAll(b));
},
Mq = function(a, b) {
	return (a.querySelector(b));
},
dj = function(a, b) {
	for(var i = 0; i < b.length; i++) 
		(a && b[i]) && a.appendChild(b[i]);
}

/**
 * TODO:
 * Improve the code
 */
var Socket = function({port = 3000, host = window.location.hostname, path = "/"}) {
	if (!(this instanceof Socket)) {
		throw new Error("Socket must be instanciated with new keyword");
	}
	if (typeof port !== "number" || typeof host !== "string" || typeof path !== "string") {
		throw new Error("Socket must be instanciated with an object containing port, host and path");
	}
	if (port < 0 || port > 65535) {
		throw new Error("Port must be a valid port number, not "+port);
	}
	if (host.length < 3) {
		throw new Error("Host must be a valid domain name, not "+host);
	}
	if (path.length < 1) {
		throw new Error("Path must be a valid path, not "+path);
	}
	this.callBack = null;

	try {
		let sp = port.toString(),
			hr = [host];
		let WSProtocol = (location.protocol === 'https:') ? 'wss:' : 'ws:',
			WSHost = (host === 'localhost') ? bindPort(hr[0], sp) : hr[0],
			spath = WSProtocol.concat(WSHost, path);
		this.socket = new WebSocket(spath);
	} catch (error) {
		console.error("Could not open socket with server");
	}

	this.initPing();

	this.socket.onerror = (error) => this.emit('error', error);

	this.socket.onopen = () => this.emit('connection');

	this.socket.onmessage = (message) => {
		try {
			let msg = this.p(message.data);
			if (!this.callBack) throw new Error("No callback function defined");
			if (msg.PING) {
				console.log("received ping from server");
				this.emit("server-ping");
			}
			this.callBack(msg);
		} catch (error) {
			console.error(error);
		}
	}

	this.socket.onclose = () => this.emit('close');
};
mergeProto(Socket, CallBack);
var s = Socket.prototype;
s.j = function(a) {
	return JSON.stringify(a);
};
s.p = function(a) {
	return JSON.parse(a);
};
s.close = function() {
	this.socket.close();
};
s.send = function(a) {
	if (this.socket.readyState !== WebSocket.OPEN) {
		console.error("Socket is not ready to send data");
		return;
	}
	this.pingServer();
	this.socket.send(this.j(a));
};
s.onconnection = function(a) {
	if (typeof a !== "function") {
		throw new Error("Callback must be a function, not "+typeof a);
	}
	this.on('connection', a);
};
s.onclose = function(a) {
	if (typeof a !== "function") {
		throw new Error("Callback must be a function, not "+typeof a);
	}
	this.on('close', a);
};
S.onerror = function(a) {
	if (typeof a !== "function") {
		throw new Error("Callback must be a function, not "+typeof a);
	}
	this.on('error', a);
};
s.onmessage = function(fn) {
	if (typeof fn !== "function") {
		throw new Error("Callback must be a function, not "+typeof fn);
	}
	this.callBack = fn;
};
s.initPing = function() {
	let pe,
		p,
		ul;
	this.on('server-ping', () => {
		pe = Date.now();
		p = pe - this.ps;
		ul = this.formatServerPing(p);
		console.info("Server ping status: %dms %s", p, ul == 0 ? "good :)" : ul == 1 ? "slow :\\" : "poor :(");
		this.serverDelayAlert(ul);
	});
};
s.pingServer = function() {
	this.ps = Date.now();
	if (this.lastPing && this.ps - this.lastPing < 1 * 60 * 1000) return;
	this.lastPing = this.ps;
	this.send(this.j({PING: this.ps}));
};
s.formatServerPing = function(a) {
	if (a > 100 && a < 200)
		return (1);
	else if (a > 250)
		return (2);
	else
		return (0);
};
s.serverDelayAlert = function(a) {
	if (a == 0)
		return ;
	let m,
		u,
		sg,
		pt,
		pth,
		tts;
	if (a == 1)
		m = "You have a slow connection, you may experiment some delay.";
	else if (a == 2)
		m = "You have a very poor connection, you should check your connection.";
	else
		return ;
	sg = Ms(Me("svg"), ["width", "height", "fill", "xmlns"], ["28", "28", "none", "http://www.w3.org/2000/svg"]);
	pt = Ms(Me("path"), "d", "M5.32789 25.4892H23.4434C25.4884 25.4892 26.7692 24.0199 26.7692 22.1784C26.7692 21.6108 26.6073 21.0197 26.3037 20.4851L17.2332 4.67086C16.5964 3.55805 15.5091 3 14.3867 3C13.2622 3 12.159 3.56227 11.536 4.67086L2.46547 20.4872C2.14484 21.0293 2 21.6108 2 22.1784C2 24.0199 3.28086 25.4892 5.32789 25.4892ZM5.52733 23.2823C4.78928 23.2823 4.3435 22.7107 4.3435 22.0634C4.3435 21.866 4.38404 21.6101 4.49819 21.3893L13.3693 5.88631C13.588 5.49701 13.9953 5.33061 14.3867 5.33061C14.776 5.33061 15.1695 5.49912 15.3903 5.88842L24.2635 21.4052C24.3777 21.6239 24.4278 21.8681 24.4278 22.0634C24.4278 22.7107 23.9628 23.2823 23.2344 23.2823H5.52733Z");
	pth = Ms(Me("path"), "d", "M14.3888 17.3883C15.023 17.3883 15.3934 17.0243 15.4135 16.3474L15.586 10.6567C15.6083 9.97682 15.0889 9.48511 14.3771 9.48511C13.6557 9.48511 13.1555 9.96721 13.1778 10.6471L13.3407 16.3516C13.3609 17.0147 13.7333 17.3883 14.3888 17.3883ZM14.3888 21.2707C15.1402 21.2707 15.7599 20.7232 15.7599 19.9845C15.7599 19.2382 15.1498 18.6982 14.3888 18.6982C13.6278 18.6982 13.0156 19.2457 13.0156 19.9845C13.0156 20.7136 13.6374 21.2707 14.3888 21.2707Z");
	tts = Me("div", "progression", {style: "width: 100%;"})
	u = Md(Me("div", "ws-server-p"),[Md(Me("div"), Md(sg, [pt, pth])), Me("p", "", {in: m}), tts]);

	let tm = 5000/100,
		k = 0,
		x = window.setInterval(() => {
			k++;
			if (k >= 100) clearInterval(x), u.remove();
			tts.style.width = 100 - k + "%";
		}, tm);
	Md(document.body, u);
};

class Component {
	constructor(props) {
		this.props = props || {};
		this.state = {};
		this._pendingState = null;
		this._pendingStateCallbacks = [];
		this._element = null;
		this._data = null;
		this._parent = null;
		this._mounted = false;
		this._moised = null;
		this._owner = null;

		this._unmountComponent = this._unmountComponent.bind(this);
	}

	setState(newState, callback) {
		this._pendingState = Object.assign({}, this.state, newState);
		// console.log("this._pendingState", this._pendingState);
		if (callback) {
			this._pendingStateCallbacks.push(callback);
		}
		this._updateComponent();
	}

	// setParent(parent) {
	// 	this._parent = parent;
	// }

	_renderComponent() {
		let render = this.render();
		if (render == undefined) throw new Error('Render method must return a value');
		// if (render instanceof Component) {
		// 	this._moised = render;
		// }
		// console.log("render component", this);
		this._mounted = true;
		this._data = render;
		// this._data._owner = this;
		this._element = typeof render == "object" ? render._renderComponent() : document.createTextNode(render);
		this.componentDidMount();
		return this._element;
	}

	_updateComponent() {
		let node;
		if (!this._pendingState || !this._mounted) return;
		
		this.state = this._pendingState;
		this._pendingState = null;

		// console.log("this.state, this._pendingState", this.state, this._pendingState, this);

		const oldElement = this._data || null;
		const oldElementData = oldElement && oldElement.element || null;
		if (oldElement) {
			oldElement._unmountComponent();
		}
		let newElement = this.render();
		this._data = newElement;
		this._element = newElement._renderComponent()
		// console.log("new element before", newElement, this);
		console.log("reload element", this, newElement, newElement.element, oldElement, oldElementData);
		if ((node = (this._parent || (oldElementData && oldElementData.parentNode)))) {
			if (newElement && oldElementData) {
				node.replaceChild(newElement.element, oldElementData);
				this._parent = newElement.element.parentNode
			} else if (newElement) {
				node.appendChild(newElement.element);
				this._parent = newElement.element.parentNode
			} else {
				node.removeChild(oldElementData);
			}
		}

		this._pendingStateCallbacks.forEach(callback => callback());
		this._pendingStateCallbacks = [];

		if (this._mounted)
			this.componentDidUpdate();
	}

	_unmountComponent() {
		if (!this._mounted) return;
		this._mounted = false;
		console.log("component will unmount", this);
		this.componentWillUnmount();
		this._data && typeof this._data._unmountComponent === "function" && this._data._unmountComponent();
		this._data = null;
		this._element = null;
		this._parent = null;
    }

	render() {
		throw new Error('Render method must be implemented');
	}

	get element() {
		return this._data && this._data.element || this._element;
	}

	set element(e) {}

	componentDidMount() {}

	componentDidUpdate() {}

	componentWillUnmount() {}
}

function Is(e) {
	switch (e) {
		case "math":
			return "http://www.w3.org/1998/Math/MathML";
		case "foreignObject":
			return "http://www.w3.org/1999/xhtml";
		case "svg":
		default:
			return "http://www.w3.org/2000/svg";
	}
}
/**
 * 
 * @param {string|Component} type 
 * @param {{}} props 
 * @returns {new Component|{
 * 	type: string,
 * 	_data: string,
 * 	_element: HTMLElement,
 * 	_renderComponent(),
 * 	_unmountComponent(),
 * }}
 */
function createElement(type, props = {}) {
	let t;
	if (typeof props != "object") throw new Error('`props` must be an object, not '+typeof props);
	if (typeof type === 'function') {
		return new type(props);
	} else {
		type = type.toLowerCase();
		// TODO: find a better way to handle svg elements using NS not list
		let element = (["svg", "path", "circle", "text", "line", "g", "polygon"].includes(type) ? document.createElementNS(Is(type), type) : document.createElement(type));
		let jv = function(c) {
			if (typeof c === "function" && !(c instanceof Component))
				throw new Error('Route component must be instanciated with new keyword');

			if (c instanceof HTMLElement) {
				// console.log("c instanceof HTMLElement", c instanceof HTMLElement, c, element);
				return element.appendChild(c), c;
			}
			// console.log("=== c ===", c);
			// if (c instanceof Component) {
			// 	c = c._renderComponent();
			// }
			if (typeof c === 'string') {
				element.appendChild(document.createTextNode(c));
			} else {
				c && element.appendChild(c._renderComponent());
			}
		}
		Object.keys(props).forEach(key => {
			if (key === 'children') {
				const children = props[key];
				if (!children) return;
				if (Array.isArray(children)) {
					children.forEach(child => jv(child));
				} else {
					jv(children);
				}
			} else if (key.startsWith('on') && typeof props[key] === 'function') {
				element.addEventListener(key.substring(2).toLowerCase(), props[key]);
			} else {
				element.setAttribute(key, props[key]);
			}
		});
		return {
			type,
			_data: props,
			_element: element,
			get element() {
				return element;
			},
			_renderComponent() {
				return element;
			},
			_unmountComponent() {
				if (!this._data || !this._data.children) return;
				let k = e => e && typeof e === "object" && typeof e._unmountComponent === "function";
				if (Array.isArray(this._data.children)) {
					this._data.children.forEach(child => k(child) && child._unmountComponent());
				} else {
					k(this._data.children) && this._data.children._unmountComponent();
				}
			},
		};
	}
}

class BrowserRouter extends Component {
	constructor(props) {
		super(props);

		this.event = this.event.bind(this);
	}

	event() {
		console.log("i caught it first!!!!!!!!!!!!!!!!!!!!!", this);
		// const newRoute = window.location.pathname
		// console.log(S.location.pathname, R.routers);
		for (let router of R.routers) {
			// console.log(router, router.evalRoute(S.location.pathname));
			if (router.evalRoute(S.location.pathname)) {
				router.setState({ route: S.location.pathname });
				break; 
			}
		}
	}

	componentDidMount() {
		window.addEventListener('popstate', this.event);
		console.log("====== BrowserRouter Mounted ======", this);
	}

	componentWillUnmount() {
		window.removeEventListener('popstate', this.event);
		console.log("====== BrowserRouter Unmounted ======", this);
	}

	// get element() {
	// 	return this._data && this._data._element || this._element;
	// }

	render() {
		console.log("in render BrowserRouter", this);
		return this.props.children;
	}
}

class Router extends Component {
	// TODO: see hh() in react-router
	// see useContext qnd useMemo qnd how pop nqvigation is saved and params extracted
	constructor(props) {
		super(props);
		if (!props.children || !Array.isArray(props.children)) throw new Error('Router must have children');
		if (!props.children.every(child => child instanceof Route)) throw new Error('Router children must be Route components');

		this.state = { route: S.location.pathname };
		// this.currentRoute = {route: null, params: null};
		// this.event = this.event.bind(this);
		R.register(this);
	}

	// event() {
	// 	console.log("i caught it first!!!!!!!!!!!!!!!!!!!!!", this);
	// 	const newRoute = window.location.pathname;
	// 	if (newRoute !== this.previousRoute) {
	// 		this.setState({ route: newRoute });
	// 		this.previousRoute = newRoute;
	// 	}
	// }

	componentDidMount() {
		console.log("====== Router Mounted ======", this);
	}

	componentDidUpdate() {
		console.log("====== Router Updated ======", this);
	}

	componentWillUnmount() {
		R.pop(this);
		this.props.children.forEach(child => child.propagateUnmount());
		console.log("====== Router Unmounted ======", this);
	}

	evalRoute(route) {
		// const newRoute = window.location.pathname;
		// if (newRoute !== this.state.route) {
		// 	this.setState({ route: newRoute });
		// }
		return this.props.children.some(child => child.canRoute(route));
	}

	// get element() {
	// 	return this._data && this._data._element || this._element;
	// }

	render() {
		const { children } = this.props;
		const { route } = this.state;

		// console.log("in render router", this, children, route);
		this.currentRoute = {route: null, params: null};
		let t;
		children.forEach(child => {
			if (!this.currentRoute.route && (t = child.canRoute(route)) !== null) {
				this.currentRoute.route = child;
				this.currentRoute.route.active = true;
				this.currentRoute.params = t.params;
			} else {
				if (child.active) {
					child.propagateUnmount();
				}
			}
		});
		// console.log("currentRoute", currentRoute);
		// if (currentRoute.route !== null) {
		// 	currentRoute.route.active = true;
		// 	this._element = currentRoute.route;
		// } else {
		// 	this._element = null;
		// });
		return (this.currentRoute.route || null);
	}
}

function Ia(e, t) {
    typeof e == "string" && (e = {
        path: e,
        caseSensitive: !1,
        end: !0
    });
    let[r, i] = eh(e.path, e.caseSensitive, e.end),
		a = t.match(r);
    if (!a)
        return null;
    let l = a[0],
	  o = l.replace(/(.)\/+$/, "$1"),
	  s = a.slice(1);
    return {
        params: i.reduce((u,h,f)=>{
            let {paramName: y, isOptional: v} = h;
            if (y === "*") {
                let x = s[f] || "";
                o = l.slice(0, l.length - x.length).replace(/(.)\/+$/, "$1")
            }
            const N = s[f];
            return v && !N ? u[y] = void 0 : u[y] = nh(N || "", y),
            u
        }, {}),
        pathname: l,
        pathnameBase: o,
        pattern: e
    }
}
function nh(e, t) {
    try {
        return decodeURIComponent(e)
    } catch (r) {
        return Xs(!1, 'The value for the URL param "' + t + '" will not be decoded because' + (' the string "' + e + '" is a malformed URL segment. This is probably') + (" due to a bad percent encoding (" + r + ").")),
        e
    }
}
function Xs(e, t) {
    if (!e) {
        typeof console < "u" && console.warn(t);
        try {
            throw new Error(t)
        } catch {}
    }
}
function eh(e, t, r) {
    t === void 0 && (t = !1),
    r === void 0 && (r = !0),
    Xs(e === "*" || !e.endsWith("*") || e.endsWith("/*"), 'Route path "' + e + '" will be treated as if it were ' + ('"' + e.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + e.replace(/\*$/, "/*") + '".'));
    let i = [],
		a = "^" + e.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:(\w+)(\?)?/g, (o, s, d)=>(i.push({
        paramName: s,
        isOptional: d != null
    }),
    d ? "/?([^\\/]+)?" : "/([^\\/]+)"));
    return e.endsWith("*") ? (i.push({
        paramName: "*"
    }),
    a += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : r ? a += "\\/*$" : e !== "" && e !== "/" && (a += "(?:(?=\\/|$))"),
    [new RegExp(a, t ? void 0 : "i"), i]
}

class Route extends Component {
	constructor(props) {
		super(props);
		if (props.path === void 0 || !props.path.length) throw new Error('Route must have a `path` property');
		if (props.element === void 0) throw new Error('Route must have an `element` property');
		if (typeof props.element === "object" && Array.isArray(props.element))
			throw new Error('Route component cannot be an array');

		this.path = props.path.replace(/^\/*/, "/");
		this.active = false;
	}

	// get element() {
	// 	return this._data && this._data._element || this._element;
	// }

	// set element(e) {
	// 	this._data && (this._element = e);
	// }

	canRoute(route) {
		const regex = Ia(this.path, route);
		// console.log("regex result on route", this, regex);
		return regex;
	}

	propagateUnmount() {
		console.log("propagateUnmount from route", this);
		this.active = false;
		this._data && this._data._unmountComponent();
	}

	render() {
		const { element } = this.props;

		this._data = element;
		// console.log("in render route", this, this._element);
		return this._data;
	}
}

/**
 * 
 * @param  {...route} routes 
 * @returns {new Router}
 * 
 */
function router(...routes) {
	return createElement(Router, { children: routes });
}

/**
 * 
 * @param {{
 * 	path: string,
 * 	element: HTMLElement|Component|String,
 * }} 
 * @returns {new Route}
 */
function route({ path, element }) {
	return createElement(Route, { path, element });
}

/**
 * 
 * @param {{
 * 	to: string,
 * }} props 
 * @returns 
 */
function link(props) {
	const { to } = props;

	if (to === void 0) throw new Error('Link must have a destination (missing `to` property)');

	const handleClick = (event) => {
		if (event.metaKey || event.ctrlKey) {
			return;
		}
		event.preventDefault();
		pushState(to);
	};

	return createElement('a', { href: to, onClick: handleClick, ...props });
}

/**
 * 
 * @param {string} path 
 */
function navigate(path) {
	if (typeof path !== "string") throw new Error('Path must be a string, not '+typeof path);
	pushState(path);
}

let renderer = function() {
	this._internalRoot = root;
}
renderer.prototype.render = function(elem) {
	if (typeof elem !== "object" || (typeof elem.render !== "function" && typeof elem._renderComponent !== "function"))
		throw new TypeError('Cannot mount invalid element');
	this._children = elem;
	// console.log(elem);
	if (this._internalRoot === null) throw Error('Unable to find root node');
	let element = this._children._renderComponent();
	if (element == undefined) throw new Error('Cannot mount invalid element');
	console.log("root element", element, this);
	// let element = (this._children instanceof Component ? this._children._renderComponent() : this._children).render();
	// console.log("root element", element);
	// this._children._element = element;
	// if (typeof element === "object" && !(element instanceof HTMLElement)) {
	// 	element = element.render();
	// } else if (!(element instanceof HTMLElement)) {
	// 	throw new TypeError('Cannot mount invalid element', element);
	// }
	this._internalRoot.appendChild(element);
}

function setParentToComponents(obj) {
	const stack = [obj]; 
	const visited = new Set();

	while (stack.length > 0) {
		const current = stack.pop();

		if (current instanceof Component) {
			if (stack.length > 0) {
				const parent = stack[stack.length - 1];
				current.setParent(parent);
			}
		}

		for (const key in current) {
			if (current.hasOwnProperty(key)) {
				const child = current[key];
				if (typeof child === 'object' && child !== null && !visited.has(child)) {
					stack.push(child);
					visited.add(child);
				}
			}
		}
	}
}

const App = {
	createRoot: function(t) {
		while (t.firstChild) {
			t.removeChild(t.firstChild);
		}
		return (
			new renderer(t)
		);
	},
}

/**
 * 
 * 
 * 
 * 
 */

!function() {
    if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
        document.querySelector('body').classList.add('chrome');
    }
}();

/**
 * 
 * 
 * 
 * 
 */

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = { user: props.user, reload: props.reload };
	}

	componentDidMount() {
		console.log("this.componentDidMount HomePage Page");
	}

	componentWillUnmount() {
		console.log("this.componentWillUnmount HomePage Page");
	}

	render() {
		return createElement('div', {
			children: createElement('div', {
				class: "data", children: [
					createElement('div', {
						class: "featured-bar", children: createElement('div', {
							class: "featured-bar-margin", children: createElement('div', {
								class: "featured-bar-content", children: createElement('div', {
									class: "featured-bar-primary-row", children: createElement('div', {
										class: "feature-title"
									})
								})
							})
						})
					}),
					createElement('section', {
						children: createElement('div', {
							class: "oa-container", children: createElement('div', {
								class: "lobby-container page-card", children: [
									createElement('h2', {
										class: "container-title", children: ("Bonjour <user>, commençons à jouer !").replace("<user>", this.state.user.nickname)
									}),
									createElement('div', {
										class: "fa-list", children: [
											createElement('div', {
												class: "fa-list-row", children: createElement('div', {
													class: "lobby-card", children: createElement('div', {
														class: "content", style: "background-image: url('/static/images/pong_visual_1.png');", children: createElement('div', {
															class: "card-container", children: [
																link({
																	to: "/game/2p", children: createElement('div', {
																		class: "play-button", children: createElement('svg', {
																			width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
																				d: "M5.32789 25.4892H23.4434C25.4884 25.4892 26.7692 24.0199 26.7692 22.1784C26.7692 21.6108 26.6073 21.0197 26.3037 20.4851L17.2332 4.67086C16.5964 3.55805 15.5091 3 14.3867 3C13.2622 3 12.159 3.56227 11.536 4.67086L2.46547 20.4872C2.14484 21.0293 2 21.6108 2 22.1784C2 24.0199 3.28086 25.4892 5.32789 25.4892Z"
																			})
																		})
																	})
																}),
																createElement('div', {
																	class: "lobby-name", children: createElement('h2', {
																		children: "Partie normale"
																	})
																})
															]
														})
													})
												})
											}),
											createElement('div', {
												class: "fa-list-row", children: createElement('div', {
													class: "lobby-card", children: createElement('div', {
														class: "content", style: "background-image: url('/static/images/pong_visual_3.png');", children: createElement('div', {
															class: "card-container", children: [
																link({
																	// to: "/game/4p", children: createElement('div', {
																	to: "/game/ai", children: createElement('div', {
																		class: "play-button", children: createElement('svg', {
																			width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
																				d: "M5.32789 25.4892H23.4434C25.4884 25.4892 26.7692 24.0199 26.7692 22.1784C26.7692 21.6108 26.6073 21.0197 26.3037 20.4851L17.2332 4.67086C16.5964 3.55805 15.5091 3 14.3867 3C13.2622 3 12.159 3.56227 11.536 4.67086L2.46547 20.4872C2.14484 21.0293 2 21.6108 2 22.1784C2 24.0199 3.28086 25.4892 5.32789 25.4892Z"
																			})
																		})
																	})
																}),
																createElement('div', {
																	class: "lobby-name", children: createElement('h2', {
																		// children: "Partie à 4"
																		children: "Partie contre une ia"
																	})
																})
															]
														})
													})
												})
											}),
											createElement('div', {
												class: "fa-list-row", children: createElement('div', {
													class: "lobby-card", children: createElement('div', {
														class: "content", style: "background-image: url('/static/images/pong_visual_4.png');", children: createElement('div', {
															class: "card-container", children: [
																link({
																	// to: "/game/tournament", children: createElement('div', {
																	to: "/game/local", children: createElement('div', {
																		class: "play-button", children: createElement('svg', {
																			width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
																				d: "M5.32789 25.4892H23.4434C25.4884 25.4892 26.7692 24.0199 26.7692 22.1784C26.7692 21.6108 26.6073 21.0197 26.3037 20.4851L17.2332 4.67086C16.5964 3.55805 15.5091 3 14.3867 3C13.2622 3 12.159 3.56227 11.536 4.67086L2.46547 20.4872C2.14484 21.0293 2 21.6108 2 22.1784C2 24.0199 3.28086 25.4892 5.32789 25.4892Z"
																			})
																		})
																	})
																}),
																createElement('div', {
																	class: "lobby-name", children: createElement('h2', {
																		// children: "Rejoindre un tournois"
																		children: "Partie locale"
																	})
																})
															]
														})
													})
												})
											})
										]
									})
								]
							})
						})
					}),
					createElement('section', {
						children: createElement('div', {
							class: "gr-container", children: [
								createElement('div', {
									class: "home-view-container", children: createElement('div', {
										class: "home-image-card", children: [
											createElement('h2', {
												children: "Some view"
											}),
											createElement('img', {
												src: "", alt: ""
											})
										]
									})
								}),
								createElement('div', {
									class: "home-view-container", children: [
										createElement('div', {
											class: "home-view-card", children: [
												createElement('div', {
													class: "card-title", children: createElement('h2', {
														children: "Some data"
													})
												}),
												createElement('div', {
													class: "card-progress-view", children: createElement('progress', {
														value: "0", max: "100", style: "--value: 70; --max: 100;"
													})
												})
											]
										}),
										createElement('div', {
											class: "home-view-card", children: [
												createElement('div', {
													class: "card-title", children: createElement('h2', {
														children: "Some other data"
													})
												}),
												createElement('div', {
													class: "card-progress-view", children: createElement('progress', {
														value: "0", max: "100", style: "--value: 50; --max: 100;"
													})
												})
											]
										})
									]
								})
							]
						})
					})
				]
			})
		});
	}
}

class UserPagePlayerStats extends Component {
	constructor(props) {
		super(props);
		this.state = { user: props.user };
	}

	isWinner(data) {
		data = data.map(e => {
			let p = e.data.sort((a, b) => a.score < b.score ? 1 : -1);
			return p[0].id == this.state.user.id;
		});
		return data;
	}

	getWinRate(data) {
		let n = data.length && this.isWinner(data.filter(e => e.type === "2p")) || [];
		let f = data.length && this.isWinner(data.filter(e => e.type === "4p")) || [];
		let t = data.length && this.isWinner(data.filter(e => e.type === "tournament")) || [];
		return ({
			normal: {
				total: n.length,
				wr: n.length > 0 ? ((n.filter(e => e).length / n.length) * 100).toFixed(0)+"%" : "none",
			},
			four: {
				total: f.length,
				wr: f.length > 0 ? ((f.filter(e => e).length / f.length) * 100).toFixed(0)+"%" : "none",
			},
			tournament: {
				total: t.length,
				wr: t.length > 0 ? ((t.filter(e => e).length / t.length) * 100).toFixed(0)+"%" : "none",
			},
		})
	}

	render() {
		let data = this.getWinRate(this.state.user.game_history);
		return createElement('div', {
			class: "stat-card-content", children: [
				createElement('div', {
					class: "stat-group w-full", children: [
						createElement('h1', {
							children: "Normal"
						}),
						createElement('p', {
							class: "note", children: "<count> Played".replace("<count>", data.normal.total)
						}),
						createElement('p', {
							class: "note", children: "WR: <per>".replace("<per>", data.normal.wr)
						}),
						createElement('div', {
							class: "progress-bar", style: "--value: <per>;".replace("<per>", data.normal.wr), children: [
								createElement('div', {}), createElement('div', {})
							]
						})
					]
				}),
				createElement('div', {
					class: "stat-group w-full", children: [
						createElement('h1', {
							children: "4 Players"
						}),
						createElement('p', {
							class: "note", children: "<count>  Played".replace("<count>", data.four.total)
						}),
						createElement('p', {
							class: "note", children: "WR: <per>".replace("<per>", data.four.wr)
						}),
						createElement('div', {
							class: "progress-bar", style: "--value: <per>;".replace("<per>", data.four.wr), children: [
								createElement('div', {}), createElement('div', {})
							]
						})
					]
				}),
				createElement('div', {
					class: "stat-group w-full", children: [
						createElement('h1', {
							children: "Tournament"
						}),
						createElement('p', {
							class: "note", children: "<count>  Played".replace("<count>", data.tournament.total)
						}),
						createElement('p', {
							class: "note", children: "WR: <per>".replace("<per>", data.tournament.wr)
						}),
						createElement('div', {
							class: "progress-bar", style: "--value: <per>;".replace("<per>", data.tournament.wr), children: [
								createElement('div', {}), createElement('div', {})
							]
						})
					]
				})
			]
		})
	}
}
class UserPagePlayerHistory extends Component {
	constructor(props) {
		super(props);
		this.state = { user: props.user };
		// console.log(this.state);
	}
	
	componentDidUpdate() {
		// console.log("this.componentDidUpdate");
	}

	render() {
		return createElement('div', {children: [
			createElement('div', {
				class: "history-card-content", children: (
					(this.state.user.game_history && this.state.user.game_history.length) ?
					this.state.user.game_history.sort((a, b) => a.date > b.date ? -1 : 1).map(game => {
						let p = game.data.sort((a, b) => a.score > b.score ? -1 : 1)[0].id == this.state.user.id;
						let s = game.data.sort((_, b) => b.id == this.state.user.id ? 1 : -1);
						if (game.type === "2p") {
							return createElement('div', {
								class: "history-row", children: [
									(
										p ?
										createElement('div', {
											class: "win", children: "Victory"
										})
										:
										createElement('div', {
											class: "lost", children: "Defeat"
										})
									),
									createElement('div', {
										class: "note score", children: "".concat(s[0].score, " - ", s[1].score)
									}),
									createElement('div', {
										class: "type", children: "Normal"
									})
								]
							})
						} else {
							return createElement('div', {
								class: "history-row", children: [
									(
										p ?
										createElement('div', {
											class: "win", children: "Victory"
										})
										:
										createElement('div', {
											class: "lost", children: "Defeat"
										})
									),
									createElement('div', {
										class: "type", children: "4 Players"
									})
								]
							})
						}
					})
					:
					createElement('div', {children:
						createElement('p', {children: "No game played yet", style: "text-align: center; margin-bottom: 10px;"})
					})
				)
			})
		]})
	}
}

class UserPage extends Component {
	constructor(props) {
		super(props);
		this.state = { user: props.user };
	}

	componentDidMount() {
		console.log("this.componentDidMount UserPage Page");
	}

	componentDidUpdate() {
		console.log("this.componentDidUpdate UserPage Page");
	}

	componentWillUnmount() {
		console.log("this.componentWillUnmount UserPage Page");
	}

	render() {
		return createElement('div', {
			children: createElement('div', {
				class: "data", children: [
					createElement('div', {
						class: "featured-bar", children: createElement('div', {
							class: "featured-bar-margin", children: createElement('div', {
								class: "featured-bar-content", children: createElement('div', {
									class: "featured-bar-primary-row", children: createElement('div', {
										class: "feature-title"
									})
								})
							})
						})
					}),
					createElement('section', {
						class: "player-profile", children: createElement('div', {
							class: "oa-container", children: createElement('div', {
								class: "player-container", children: [
									createElement('div', {
										class: "player-card", children: [
											createElement('div', {
												class: "card-header", children: createElement('h2', {
													children: this.state.user.nickname
												})
											}),
											createElement('div', {
												class: "card-picture", children: createElement('img', {
													src: this.state.user.profile_picture, alt: "profile-picture"
												})
											})
										]
									}),
									createElement('div', {
										class: "card-container", children: [
											createElement('div', {
												class: "stat-card page-card", children: [
													createElement('div', {
														class: "card-title", children: createElement('h2', {
															children: "Statistics"
														})
													}),
													createElement(UserPagePlayerStats, {user: this.state.user})
												]
											}),
											createElement('div', {
												class: "history-card page-card", children: [
													createElement('div', {
														class: "card-title", children: createElement('h2', {
															children: "Game History"
														})
													}),
													createElement(UserPagePlayerHistory, {user: this.state.user}),
												]
											})
										]
									})
								]
							})
						})
					})
				]
			})
		});		
	}
}

class Loader extends Component {
	render() {
		return createElement('div', {
			class: "ad-up-box-loader", children: [
				// createElement('div', {
				// 	class: "loader", children: createElement('div', {
				// 		class: "inner-loader"
				// 	})
				// }),
				// createElement('div', {
				// 	class: "loader ellipse"
				// }),
				// createElement('div', {
				// 	class: "loader square"
				// }),
				// createElement('div', {
				// 	class: "loader triangle", children: createElement('svg', {
				// 		viewBox: "0 0 86 80", children: createElement('polygon', {
				// 			points: "43 8 79 72 7 72"
				// 		})
				// 	})
				// })
				createElement('div', {
					class: "loader", children: [
						createElement('div', {
							class: "player_one"
						}),
						createElement('div', {
							class: "player_two"
						}),
						createElement('div', {
							class: "ball"
						})
					]
				})					
			]
		})		
	}
}

class NotFound extends Component {
	render() {
		return createElement("div", {children: [
				createElement("p", {children:
					"Page not found"
				}),
				link({to: "/", class: "link", children: "Go back to home"})
			]
		});
	}
}

class BadConnection extends Component {
	render() {
		return createElement('div', {
			class: "preload", children: [
				// createElement('svg', {
				// 	height: "75px", width: "75px", class: "icon", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", viewBox: "0 0 622.09431 815.20567", children: [
				// 		createElement('g', {
				// 			children: createElement('path', {
				// 				class: "cls-1", d: "m185.78512,722.53752c-2.3257-2.57814-4.55636-5.1912-6.72495-7.82005,30.41037,65.64506,52.64157,100.4882,52.64157,100.4882v-52.9691c-14.53391-10.38544-32.05025-24.32663-45.91663-39.69905Z"
				// 			})
				// 		}),
				// 		createElement('g', {
				// 			children: createElement('path', {
				// 				class: "cls-1", d: "m420.98693,21.67264c83.16529,150.85703,201.10737,226.82161,201.10737,226.82161,0,0-68.15333-35.82915-112.04384-80.27478-65.17563-65.99995-89.06353-146.54683-89.06353-146.54683Z"
				// 			})
				// 		}),
				// 		createElement('g', {
				// 			children: createElement('path', {
				// 				class: "cls-1", d: "m134.28938,615.53255c55.06509,109.34912,133.15648,164.41225,133.15648,164.41225,0,0-45.12543-25.97086-74.18606-58.18739-43.15385-47.84024-58.97042-106.22486-58.97042-106.22486Z"
				// 			})
				// 		}),
				// 		createElement('g', {
				// 			children: createElement('path', {
				// 				class: "cls-1", d: "m429.32177,55.4862c-54.85948,22.14835-112.63212,57.37888-143.26722,112.52183-22.08683-39.75613-58.52219-64.03704-103.8231-84.85531,0,0,30.81438,12.30852,50.19727,25.08617,30.96402,20.41204,43.47981,38.43769,43.47981,38.43769,0,0-13.19468-24.63034-36.39075-39.81986C176.65619,65.69319,73.59594,33.00034,73.59594,33.00034,42.13204,61.01435,18.75641,105.26588,14.73652,174.29877c9.15318,76.9912,26.85351,154.81205,48.44212,228.43593,33.76356,83.30965,71.23362,114.22406,71.23362,114.22406,0,0-35.84015-18.589-53.42355-56.74875,21.90311,66.83493,44.32635,128.4914,71.76205,178.87183,23.61144,43.3576,53.23955,77.43706,79.13042,104.30664v-52.66596s-53.31299-100.0828-100.68854-236.80131c-24.2424-101.91915-26.42013-211.99446-26.42013-211.99446,0,0-.95489,126.3871,7.71198,154.79321-27.58062-89.76553-49.86032-190.2166-52.89706-286.48207,0,0,149.24122,16.85213,226.46713,140.75891,49.53001-79.46987,128.62579-114.86693,179.02452-130.05813-16.61022-24.72704-28.25065-48.12456-35.7573-65.45247Z"
				// 			})
				// 		}),
				// 		createElement('g', {
				// 			children: createElement('path', {
				// 				class: "cls-1", d: "m554.13826,199.45559c.02577-.18233.05514-.36439.08091-.54672-1.15856-.88229-2.30741-1.81445-3.46431-2.71309,1.13279,1.09565,2.26613,2.19325,3.38339,3.25981Z"
				// 			})
				// 		}),
				// 		createElement('g', {
				// 			children: createElement('path', {
				// 				class: "cls-1", d: "m268.06467,87.83386S116.67847-59.02596,32.75952,27.05312C-22.26819,83.49728,8.66415,248.49425,8.66415,248.49425-2.10994,147.50711,10.05288,71.04401,49.84801,36.84784c69.51309-59.73298,218.21666,50.98601,218.21666,50.98601Z"
				// 			})
				// 		}),
				// 		createElement('g', {
				// 			children: createElement('path', {
				// 				class: "cls-1", d: "m582.87994,69.88295s-2.03946,22.61221-21.45809,64.14317c0,0,3.73171-75.18174,1.26219-113.55376,0,0-54.78716,6.09177-117.43649,28.90128,14.67856,23.75608,30.05097,45.35079,45.40066,64.84313,13.58096-3.02261,21.87319-3.97888,21.87319-3.97888-.30121,9.54777-.81024,19.13987-1.47639,28.7558,15.60989,18.09243,30.81854,33.88909,44.88193,47.45619,1.40905-10.82437,3.17003-27.0037,3.17003-27.0037,23.45986-51.9926,23.78296-89.56324,23.78296-89.56324Z"
				// 			})
				// 		}),
				// 		createElement('g', {
				// 			children: createElement('path', {
				// 				class: "cls-1", d: "m552.38228,211.31964c-13.70372-10.28707-27.47726-21.75791-39.44661-33.87856-1.66122-1.68228-3.27754-3.37952-4.88556-5.07925-6.86599,62.96356-23.40117,125.61745-37.22925,186.13103-11.41582,49.9572-36.20445,108.35402-106.93224,212.67687,90.68041-107.64585,98.69126-152.16376,103.9393-181.34491-50.89058,168.2262-127.60027,300.8977-127.60027,300.8977v124.48315s31.11143-56.61464,70.13242-145.26539c9.35103-52.72997,1.32288-94.07056,1.32288-94.07056,0,0,10.99007,26.27991,14.03014,58.43518,48.09491-114.08274,103.09793-268.58333,126.66919-422.98527Z"
				// 			})
				// 		})
				// 	]
				// }),
				createElement('div', {
					style: "margin-top: 10; position: relative; display: flex; flex-direction: row; align-content: center", children: [
						createElement('svg', {
							style: "margin-right: 5; color: #818185; height: 100%", width: "22", height: "22", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
								createElement('path', {
									d: "M10.4152 4.50378C6.2126 5.26292 2.41385 7.36925 0.135958 10.1745C-0.0534164 10.3873 -0.0491978 10.699 0.175332 10.931L1.81572 12.5991C2.07541 12.8513 2.45416 12.8492 2.70212 12.5853C4.85158 10.3015 7.52135 8.82471 10.4853 8.24979L10.4152 4.50378ZM16.8846 4.51339L16.8263 8.25729C19.7944 8.81299 22.4492 10.3132 24.6413 12.5991C24.8796 12.8375 25.2445 12.8257 25.5021 12.5735L27.1425 10.931C27.3766 10.699 27.3713 10.3873 27.1819 10.1745C24.8827 7.38636 21.1298 5.22987 16.8846 4.51339ZM16.7977 11.5395L16.7393 15.4486C17.9124 15.9005 18.9617 16.6191 19.756 17.471C19.9943 17.7349 20.3316 17.719 20.6147 17.4614L22.4468 15.6642C22.6596 15.4439 22.6873 15.1523 22.4883 14.9278C21.2044 13.3816 19.1646 12.0975 16.7977 11.5395ZM10.5352 11.5416C8.17244 12.1306 6.14979 13.3549 4.83916 14.9278C4.64018 15.1523 4.65822 15.4343 4.88064 15.6642L6.72236 17.4806C7.00759 17.752 7.37041 17.719 7.6322 17.422C8.40306 16.5743 9.43643 15.8812 10.5957 15.4336L10.5352 11.5416Z", style: "fill: currentcolor"
								}),
								createElement('path', {
									d: "M13.659 24.0201C14.7775 24.0201 15.6723 23.1272 15.6723 22.0289C15.6723 20.921 14.7775 20.0473 13.659 20.0473C12.5439 20.0473 11.6436 20.921 11.6436 22.0289C11.6436 23.1272 12.5439 24.0201 13.659 24.0201ZM13.6686 18.0722C14.4775 18.0722 14.9753 17.5608 14.9975 16.7264C15.0369 12.8505 15.1121 8.21931 15.141 4.4435C15.141 3.61523 14.5091 3 13.6611 3C12.8132 3 12.1771 3.61523 12.1771 4.4435C12.2155 8.2172 12.2929 12.8505 12.3418 16.7264C12.3641 17.5608 12.8577 18.0722 13.6686 18.0722Z", style: "fill: currentcolor"
								})
							]
						}),
						createElement('p', {
							style: "color: #818185; font-size: 20", children: "Unable to connect"
						})
					]
				})
			]
		})
	}
}

let LoadManager = function() {
	if (!(this instanceof LoadManager)) {
		throw new Error("LoadManager is a constructor and should be called with the new keyword");
	}
}
LoadManager.prototype = {
	loaded: 0,
	total: 0,
	onload: function() {},
	add: function(func, proto) {
		console.log(func, proto, typeof func, typeof proto);
		if (typeof func !== "object" && typeof func !== "function") {
			throw new Error("LoadManager.add() expects a function as argument");
		}
		if (typeof proto !== "string") {
			throw new Error("LoadManager.add() expects a string as second argument");
		}
		let t = this;
		t.total++;
		let c = () => {
			t.loaded++;
			if (t.loaded === t.total) {
				t.onload();
			}
		};
		if (!func[proto]) {
			func[proto] = c.bind(func);
		} else {
			func[proto].call(func, c);
		}
		return (this);
	},
}

let game_render = function(type, onload, onclose, {width, height} = {width: window.innerWidth, height: window.innerHeight}) {
	let render_data = {
		pallet: [],
		ball: null,
		ballDirection: {
			x : 0.5 + Math.random(),
			z : 0.5 + Math.random(),
		},
		keyCodes: {},
		updateScore: 0,
		queue: [],
	}

	let socket = new Socket({path: "/game/"+type});
	socket.onclose(onclose);
	socket.onmessage((msg) => {
		switch (msg.type) {
			case "resetCam":
				setcam(10, 69, 0);
				break;
			case "setCam":
				setcam(msg.data.x, msg.data.y, msg.data.z);
				break;
			case "text":
				createText(msg.data.text, msg.data.size);
			default:
				render_data.queue.push(msg);
		}
	});
	
	var loaderManager = new THREE.LoadingManager();
	
	let manager = new LoadManager();
	manager.add(socket, "onconnection");
	manager.add(loaderManager, "onLoad");
	manager.onload = () => {
		console.info("game ready");
		socket.send({type : "ready"});
		onload();
	};

	let setcam = (x, y, z) => {
		camera.position.set(x, y, z);
	}

	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(width, height);
	renderer.setPixelRatio(window.devicePixelRatio);

	let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	setcam(10, 80, 0);

	const controls = new OrbitControls(camera, renderer.domElement);
	const scene = new THREE.Scene();
	controls.maxDistance = 100;
	controls.target.set(0, 0, 0);
	controls.update();

	const Alight = new THREE.AmbientLight({ color: 0xffffff });
	scene.add(Alight);

	const skyLoader = new THREE.TextureLoader(loaderManager);
	const sky = skyLoader.load("/static/images/background_sky_box.jpg", () => {
		const skyboxGeo = new THREE.SphereGeometry(700);
		const materialSky = new THREE.MeshPhysicalMaterial({
			wireframe: false,
			opacity: 1,
			side: THREE.BackSide,
			map: sky,
		});
		const skybox = new THREE.Mesh(skyboxGeo, materialSky);
		scene.add(skybox);
	});

	let font,
		textGeo,
		textMesh;

	const fontLoader = new FontLoader(loaderManager);
	fontLoader.load('/static/fonts/font.json', function (response) {
		font = response;
		createText("Waiting for opponent", 2.5);
	});

	const materials = [
		new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
		new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
	];

	function createText(msg, size = 10) {
		scene.remove(textMesh);
		textGeo = new TextGeometry(msg, {
			font: font,
			size: size,
			height: 0.5,
			curveSegments: 2,
			bevelThickness: 0.1,
			bevelSize: 0.01,
			bevelEnabled: true
		});

		textGeo.computeBoundingBox();
		textGeo.center();
		textMesh = new THREE.Mesh(textGeo, materials);
		textMesh.rotateX(-Math.PI * 0.5);
		textMesh.rotateZ(Math.PI * 0.5);
		textMesh.position.y -= 2;
		
		scene.add(textMesh);
		textGeo.dispose();
	}

	(function() {
		let mapWidth = 40;
		let mapLenth = 60;
		render_data.pallet.push(new THREE.Mesh(
			new THREE.BoxGeometry(6, 1, 1), 
			new THREE.MeshStandardMaterial({
				wireframe:false, 
					color:0xffffff, 
					opacity: 1, 
					emissive:0xffffff,
					side : THREE.DoubleSide,
				})
			));
		render_data.pallet.push(new THREE.Mesh(
			new THREE.BoxGeometry(6, 1, 1), 
			new THREE.MeshStandardMaterial({
				wireframe:false, 
				color:0xffffff, 
				opacity: 1, 
				emissive:0xffffff,
				side : THREE.DoubleSide,
			})
		));
		let wallLeft = new THREE.Mesh(
			new THREE.BoxGeometry(1 , 1, mapLenth + 1),
			new THREE.MeshStandardMaterial({
				wireframe:false, 
				color:0xffffff, 
				opacity: 1, 
				emissive:0xffffff,
				side : THREE.DoubleSide,
			})
		);
		let wallRight = new THREE.Mesh(
			new THREE.BoxGeometry(1 , 1,  mapLenth + 1),
			new THREE.MeshStandardMaterial({
				wireframe:false, 
				color:0xffffff, 
				opacity: 1, 
				emissive:0xffffff,
				side : THREE.DoubleSide,
			})
		);
		wallRight.position.x += mapWidth / 2;
		wallLeft.position.x -= mapWidth / 2;
		let wallP2 = new THREE.Mesh(
			new THREE.BoxGeometry(mapWidth - 1, 1, 1),
			new THREE.MeshStandardMaterial({
				wireframe:false, 
				color:0xff00ff, 
				opacity: 1, 
				emissive:0xff00ff,
				side : THREE.DoubleSide,
			})
		);	
		let wallP1 = new THREE.Mesh(
			new THREE.BoxGeometry(mapWidth - 1, 1 , 1),
			new THREE.MeshStandardMaterial({
				wireframe:false,
				color:0x00ffff, 
				opacity: 1, 
				emissive:0x00ffff,
				side : THREE.DoubleSide,
			})
		);
		wallP1.position.z += mapLenth / 2
		wallP2.position.z -= mapLenth / 2

		const geometryBall = new THREE.BoxGeometry(1, 1, 1);
		const materialBall = new THREE.MeshPhysicalMaterial({
			wireframe:false, 
			color:0xff0000, 
			opacity: 1, 
			iridescence :1,
			side : THREE.DoubleSide,
		});
		render_data.ball = new THREE.Mesh(geometryBall, materialBall);

		render_data.pallet[0].position.z += (mapLenth / 2) - 1.5;
		render_data.pallet[1].position.z -= (mapLenth / 2) - 1.5;
		
		scene.add(wallLeft, wallRight, wallP1, wallP2);
		scene.add(...render_data.pallet);
	}());

	const params = {
		threshold: 0,
		strength: 0.35,
		radius: 0,
		exposure: 1,
	};

	const renderScene = new RenderPass(scene, camera);

	const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
	bloomPass.threshold = params.threshold;
	bloomPass.strength = params.strength;
	bloomPass.radius = params.radius;
	const outputPass = new OutputPass();
	let composer = new EffectComposer(renderer);
	composer.addPass(renderScene);
	composer.addPass(bloomPass);
	composer.addPass(outputPass);

	document.addEventListener("keydown", onDocumentKeyEvent, true);
	document.addEventListener("keyup", onDocumentKeyEvent, true);
	function onDocumentKeyEvent(event) {
		let d = (event.type === "keydown");
		switch (event.which) {
			case 68:
				render_data.keyCodes["d_key"] = d;
				break;
			case 39:
				render_data.keyCodes["right_arrow_key"] = d;
				break;
			case 65:
				render_data.keyCodes["a_key"] = d;
				break;
			case 37:
				render_data.keyCodes["left_arrow_key"] = d;
				break;
			case 82:
				d && (
					setcam(10, 80, 0),
					controls.target.set(0, 0, 0)
				)
				break;
		}
	}

	let animationid = null,
		ts = Date.now();
	const animate = async () => {
		renderer.render(scene, camera);
		composer.render();

		controls.update();
		animationid = requestAnimationFrame(animate);
		while (render_data.queue.length > 0)
		{
			let event = render_data.queue.shift(),
				data = event.data;
			
			if (Date.now() - ts > 25) {
				Object.keys(render_data.keyCodes).forEach((key) => {
					if (render_data.keyCodes[key]) {
						socket.send({type : 'keyCode', move : key});
					}
				});
				ts = Date.now();
			}

			switch (event.type) {
				case "initGame": {
					createText("");
					scene.add(render_data.ball);
					for (let i = 0; i < render_data.pallet.length; i++) {
						render_data.pallet[i].position.x = data.players[i].x;
						render_data.pallet[i].score = data.players[i].score;
						render_data.ball.position.x = data.ball.x;
						render_data.ball.position.z = data.ball.z;
					}
				} break;
				case "updateScore": {
					render_data.pallet[data.n].score = data.score;
					createText(render_data.pallet[0].score + " : " + render_data.pallet[1].score);
					if (render_data.pallet.some(e => e.score > 9))
					{
						scene.remove(render_data.ball);
						return;
					}
				} break;
				case "updatePlayer": {
					render_data.pallet[data.n].position.x = data.x;
				} break;
				case "updateBall": {
					render_data.ball.position.x = data.x;
					render_data.ball.position.z = data.z;
				} break;
			}
		}
	}

	return {
		start: animate,
		socket: socket,
		renderer: renderer,
		animationid: () => animationid,
		render: () => renderer.domElement,
		unmount: () => {
			animationid && cancelAnimationFrame(animationid);
			socket.close();
			document.removeEventListener("keydown", onDocumentKeyEvent, true);
			document.removeEventListener("keyup", onDocumentKeyEvent, true);
		}
	};
};

class GameView extends Component {

	componentDidMount() {
		console.log("componentDidMount GameView", this);
		let a = hh("/game/:type") ?? {params: {type: null}},
			{type} = a.params;
		if (!type) {
			navigate("/");
		}
		this.setState({loading: true, game_render: null});
		window.onbeforeunload = (e) => {
			// display a message to the user
			e.preventDefault();
			return "Quitting this page will stop the game and you will lose the game.\nAre you sure you want to quit?";
		}
		let onload = () => this.setState({loading: false});

		this.setState({game_render: game_render(type, onload, this.endGame.bind(this), {width: window.innerWidth, height: window.innerHeight})});
	}

	componentDidUpdate() {
		console.log("componentDidUpdate GameView", this.state.game_render);
		if (this.state.game_render) {
			this.state.game_render.animationid() && cancelAnimationFrame(this.state.game_render.animationid());
			this.state.game_render.start(this.state);
		}
	}

	componentWillUnmount() {
		this.state.game_render.unmount();
		window.onbeforeunload = null;
		console.log("game view unmounted", this.state.game_render);
	}

	endGame() {
		navigate("/");
		this.props.reload();
		console.log("game view unmounted", this.state.game_render);
	}

	render() {
		console.log("======================== GameView render ========================", this.state);
		return (
			this.state.loading ?
			createElement(Loader)
			:
			createElement('div', {
				class: "render-context", children: [
					createElement('div', {
						class: "back-button", onclick: () => this.endGame(), children: "Go home"
					}),
					this.state.game_render && this.state.game_render.render()
				]
			})
		)
	}
}

class MainRouter extends Component {

	componentDidMount() {
		console.log("componentDidMount MainRouter", this);
	}

	render() {
		return createElement('div', {
			class: "home", children: [
				createElement('div', {
					class: "nav-bar", children: createElement('nav', {
						children: [
							createElement('div', {
								class: "nav-container", children: [
									link({
										to: "/", children: createElement('div', {
											class: "icon-container", children: createElement('svg', {
												class: "icon", width: "29", height: "28", viewBox: "0 0 29 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
													d: "M17.3688 22.7488H11.2228V15.1419C11.2228 14.5944 11.5903 14.2386 12.1378 14.2386H16.4655C17.013 14.2386 17.3688 14.5944 17.3688 15.1419V22.7488ZM3.78914 22.3431C3.78914 24.0268 4.84734 25.0447 6.58194 25.0447H22.0364C23.771 25.0447 24.8175 24.0268 24.8175 22.3431V13.4141L15.0286 5.20275C14.5727 4.81931 14.0306 4.82892 13.5844 5.20275L3.78914 13.4141V22.3431ZM0 11.814C0 12.4189 0.455153 12.935 1.19765 12.935C1.56163 12.935 1.886 12.7466 2.17217 12.5115L13.8119 2.7458C14.1267 2.46713 14.4958 2.46713 14.8127 2.7458L26.4462 12.5115C26.7248 12.7466 27.0492 12.935 27.4132 12.935C28.0863 12.935 28.6012 12.5171 28.6012 11.8428C28.6012 11.447 28.4482 11.1409 28.1515 10.8878L15.9544 0.635973C14.9522 -0.211991 13.6821 -0.211991 12.6703 0.635973L0.459372 10.8899C0.153045 11.1451 0 11.4875 0 11.814ZM21.547 6.13864L24.8576 8.92464V3.26801C24.8576 2.73973 24.521 2.40317 23.9927 2.40317H22.414C21.8953 2.40317 21.547 2.73973 21.547 3.26801V6.13864Z"
												})
											})
										})
									}),
									link({
										to: "/user/me", children: createElement('div', {
											class: "icon-container", children: createElement('svg', {
												class: "icon", width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
													d: "M14.105 26.21C20.7369 26.21 26.2121 20.7273 26.2121 14.105C26.2121 7.47312 20.7273 2 14.0954 2C7.47523 2 2 7.47312 2 14.105C2 20.7273 7.48484 26.21 14.105 26.21ZM14.105 23.8255C8.71085 23.8255 4.39412 19.4991 4.39412 14.105C4.39412 8.71085 8.70124 4.38452 14.0954 4.38452C19.4895 4.38452 23.8276 8.71085 23.8276 14.105C23.8276 19.4991 19.4991 23.8255 14.105 23.8255ZM21.9181 21.8361L21.8766 21.6418C21.14 19.9212 18.196 18.1442 14.105 18.1442C10.0257 18.1442 7.07959 19.9212 6.33545 21.6322L6.29397 21.8361C8.49826 23.8651 11.8683 24.9826 14.105 24.9826C16.3534 24.9826 19.6946 23.8747 21.9181 21.8361ZM14.105 16.2132C16.3794 16.2324 18.1414 14.2979 18.1414 11.7847C18.1414 9.4196 16.3655 7.4478 14.105 7.4478C11.8466 7.4478 10.059 9.4196 10.0707 11.7847C10.0803 14.2979 11.8423 16.194 14.105 16.2132Z"
												})
											})
										})
									})
								]
							}),
							createElement('div', {
								class: "nav-bottom", children: createElement('a', {
									href: "/logout", children: createElement('div', {
										class: "icon-container", children: createElement('svg', {
											class: "icon", width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
												createElement('path', {
													d: "M7.41333 16.5205V23.4008C7.41333 25.3365 8.76661 26.6312 10.7865 26.6312H19.9953C21.9856 26.6312 23.3135 25.3365 23.3135 23.3987V4.23249C23.3135 2.29258 21.9856 1 19.9953 1H10.7865C8.76661 1 7.41333 2.29258 7.41333 4.23038V11.1309H9.71136V4.75866C9.71136 3.86545 10.2411 3.36131 11.1802 3.36131H19.5605C20.4879 3.36131 21.0176 3.86967 21.0176 4.76076V22.8705C21.0176 23.7615 20.4879 24.2699 19.5605 24.2699H11.1802C10.2411 24.2699 9.71136 23.7658 9.71136 22.8726V16.5205H7.41333Z"
												}),
												createElement('path', {
													d: "M4.99257 14.7958H12.6859L14.9498 14.6807L12.644 16.7265L11.9992 17.3755C11.8279 17.5607 11.7013 17.8213 11.7013 18.099C11.7013 18.6533 12.1098 19.0384 12.647 19.0384C12.9215 19.0384 13.1694 18.9362 13.3525 18.7511L17.4934 14.6144C17.755 14.3624 17.8858 14.0807 17.8858 13.8161C17.8858 13.5494 17.755 13.2505 17.4934 13.0061L13.3525 8.87895C13.1694 8.69379 12.9215 8.59161 12.647 8.59161C12.1098 8.59161 11.7013 8.97668 11.7013 9.52348C11.7013 9.81082 11.8237 10.0597 11.9992 10.2449L12.644 10.9056L14.9498 12.9419L12.6859 12.8247H4.99257C4.39562 12.8247 4 13.2918 4 13.8161C4 14.3383 4.39562 14.7958 4.99257 14.7958Z"
												})
											]
										})
									})
								})
							})
						]
					})
				}),
				createElement('header', {}),
				createElement('main', {children:
					router(
						route({path: "/", element: createElement(HomePage, {user: this.props.user, reload: this.props.reload})}),
						route({path: "/user/me", element: createElement(UserPage, {user: this.props.user, reload: this.props.reload})}),
						route({path: "*", element: createElement(NotFound)})
					)
				})
			]
		})
	}
}


class Main extends Component {
	constructor(props) {
		super(props);
		this.state = { user: null, loading: true, error: null, socket: null};
	}

	// connectSocket() {
	// 	let socket = new Socket({path: "/user"});
	// 	socket.onconnection(() => {
	// 		console.info("Connection opened");
	// 	});
	// 	socket.onclose(() => {
	// 		console.info("Connection closed");
	// 	});
	// 	socket.onmessage((msg) => {
	// 		console.log(msg);
	// 	});
	// 	this.setState({socket: socket});
	// }

	loadUser(callBack = null) {
		xhr.get('/api/user/me/get')
		.then(res => res.data)
		.then(data => {
			console.log("data", data);
			this.setState({ user: data, loading: false }, callBack);
			// this.connectSocket();
		})
		.catch(error => {
			console.error("error", error);
			this.setState({ loading: false, error: "An error occured" });
		})
	}

	reload() {
		this.setState({ loading: true });
	}

	componentDidMount() {
		console.log("==================== Main mounted ====================");
		/**
		 * TODO: remove setTimeout
		 */
		setTimeout(() => {
			// this.setState({ loading: false });
			this.loadUser();
		}, 1000);
	}

	componentDidUpdate() {
		console.log("==================== Main updated ====================");
	}

	componentWillUnmount() {
		console.log("==================== Main unmounted ====================");
		// this.state.socket.close();
	}

	render() {
		return (
			this.state.loading ?
			createElement(Loader)
			:
			this.state.error != null ?
			createElement(BadConnection)
			:
			createElement(BrowserRouter, {children:
				router(
					route({path: "/game/:type", element: createElement(GameView, {reload: this.loadUser.bind(this)})}),
					route({path: "/*", element: createElement(MainRouter, {user: this.state.user, reload: this.loadUser.bind(this)})}),
				)
			})
		)
	}
}

xhr.defaults.baseURL = (window.location.hostname == "localhost" ? "http://localhost:3000" : "");

App.createRoot(document.getElementById('root')).render(createElement(Main));
