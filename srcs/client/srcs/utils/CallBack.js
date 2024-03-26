
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

export { CallBack, mergeProto };