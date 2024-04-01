let S = {
	location: {
		pathname: window.location.pathname,
	},
    history: {
        current: [],
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
	if (r && r !== S.location.pathname) {
        S.history.current.push(r);
		window.history.pushState({}, '', r);
		window.dispatchEvent(new Event('popstate'));
	}
}

function useRoute(e, t) {
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
        params: i.reduce((u, h, f)=>{
            let {paramName: y, isOptional: v} = h;
            if (y === "*") {
                let x = s[f] || "";
                o = l.slice(0, l.length - x.length).replace(/(.)\/+$/, "$1")
            }
            const N = s[f];
            return v && !N ? u[y] = undefined : u[y] = nh(N || "", y),
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
    t === undefined && (t = !1),
    r === undefined && (r = !0),
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
    [new RegExp(a, t ? undefined : "i"), i]
}

let useParams = function(e) {
	let {pathname: t} = S.location;
	return useRoute(e, t);
}

export { pushState, useRoute, useParams, S, R };