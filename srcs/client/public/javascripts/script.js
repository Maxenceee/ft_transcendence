/**!






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

// (function () {
//     const t = document.createElement("link").relList;
//     if (t && t.supports && t.supports("modulepreload")) return;
//     for (const l of document.querySelectorAll('link[rel="modulepreload"]')) r(l);
//     new MutationObserver((l) => {
//         for (const o of l) if (o.type === "childList") for (const i of o.addedNodes) i.tagName === "LINK" && i.rel === "modulepreload" && r(i);
//     }).observe(document, { childList: !0, subtree: !0 });
//     function n(l) {
//         const o = {};
//         return (
//             l.integrity && (o.integrity = l.integrity),
//             l.referrerPolicy && (o.referrerPolicy = l.referrerPolicy),
//             l.crossOrigin === "use-credentials" ? (o.credentials = "include") : l.crossOrigin === "anonymous" ? (o.credentials = "omit") : (o.credentials = "same-origin"),
//             o
//         );
//     }
//     function r(l) {
//         if (l.ep) return;
//         l.ep = !0;
//         const o = n(l);
//         fetch(l.href, o);
//     }
// })();
// function Cs(e, t, n) {
//     var r,
//         l = {},
//         o = null,
//         i = null;
//     if (t != null) for (r in (t.ref !== void 0 && (i = t.ref), t.key !== void 0 && (o = "" + t.key), t)) ks.call(t, r) && !xs.hasOwnProperty(r) && (l[r] = t[r]);
//     var u = arguments.length - 2;
//     if (u === 1) l.children = n;
//     else if (1 < u) {
//         for (var a = Array(u), s = 0; s < u; s++) a[s] = arguments[s + 2];
//         l.children = a;
//     }
//     if (e && e.defaultProps) for (r in ((u = e.defaultProps), u)) l[r] === void 0 && (l[r] = u[r]);
//     return { $$typeof: hr, type: e, key: o, ref: i, props: l, _owner: Vi.current };
// }
// let F = {};
// F.createElement = Cs;
function Li(e, t) {
    if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
var N1 = Symbol.for("trascendence.element"),
    T1 = Symbol.for("trascendence.fragment"),
    O1 = Object.prototype.hasOwnProperty,
    F1 = { key: !0, ref: !0, __self: !0, __source: !0 };
function zs(e, t, n) {
    var r,
        l = {},
        o = null,
        i = null;
    n !== void 0 && (o = "" + n), t.key !== void 0 && (o = "" + t.key), t.ref !== void 0 && (i = t.ref);
    for (r in t) O1.call(t, r) && !F1.hasOwnProperty(r) && (l[r] = t[r]);
    if (e && e.defaultProps) for (r in ((t = e.defaultProps), t)) l[r] === void 0 && (l[r] = t[r]);
    return { $$typeof: N1, type: e, key: o, ref: i, props: l };
}
var p = zs;
let r = p(T1, { children: [p(Li, { path: "/", element: p("h1", {children: "Oui"}) }), p(Li, { path: "*", element: p("h1", {children: "non"}) })] });
console.log(r);

function xf(e) {
    var t = e;
    console.log("-----------------------------------------------------------------")
    do {
		if (typeof t === 'object' && t !== null && t.props !== void 0) {
			t = t.props.children;
		} else
			t = null;
    } while (t !== null);
}

////////////////////////////////////////////

function ina() {}

function O2(elem, tag) {
	this.tag = tag;
	this.containerInfo = elem;
}

function Rt(e) {
	this._internalRoot = e;
}

Rt.prototype.render = function(elem) {
	let t = this._internalRoot;
	if (t === null) throw Error('Unable to find root node.');
	xf(elem);;
};

// function Cs(e, t, n) {
//     var r,
//         l = {},
//         o = null,
//         i = null;
//     if (t != null) for (r in (t.ref !== void 0 && (i = t.ref), t.key !== void 0 && (o = "" + t.key), t)) Object.prototype.hasOwnProperty.call(t, r) && !xs.hasOwnProperty(r) && (l[r] = t[r]);
//     var u = arguments.length - 2;
//     if (u === 1) l.children = n;
//     else if (1 < u) {
//         for (var a = Array(u), s = 0; s < u; s++) a[s] = arguments[s + 2];
//         l.children = a;
//     }
//     if (e && e.defaultProps) for (r in ((u = e.defaultProps), u)) l[r] === void 0 && (l[r] = u[r]);
//     return { $$typeof: hr, type: e, key: o, ref: i, props: l, _owner: Vi.current };
// }

var _s = { exports: {} },
	A2;
let Xe = {
	createRoot: function(e, t) {
		return (
			(t = new O2(e, 1)),
			new Rt(t)
		);
	},
	// createElement: Cs,
	
}
// ina(), (_s.exports = Xe);
// var A2 = _s.exports,
// 	Ao = A2;

// (Ao.createRoot = Xe.createRoot);

// Ao.createRoot(document.getElementById('root')).render(r);

