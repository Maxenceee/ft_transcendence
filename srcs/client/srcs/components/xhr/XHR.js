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

export default xhr ;