/**!



 __  __                                                  ____                             
|  \/  |   __ _  __  __   ___   _ __     ___    ___     / ___|   __ _   _ __ ___     __ _ 
| |\/| |  / _` | \ \/ /  / _ \ | '_ \   / __|  / _ \   | |  _   / _` | | '_ ` _ \   / _` |
| |  | | | (_| |  >  <  |  __/ | | | | | (__  |  __/   | |_| | | (_| | | | | | | | | (_| |
|_|  |_|  \__,_| /_/\_\  \___| |_| |_|  \___|  \___|    \____|  \__,_| |_| |_| |_|  \__,_|
    



*/
/**!
 * @author Maxence Gama, @maxencegama
 * @contact contact@maxencegama.dev
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
var Socket = function({port = 3000, host = "10.14.5.2", path = "/"}) {
	if (!(this instanceof Socket)) {
		throw new Error("Socket must be instanciated with new keyword");
	}
	if (typeof port !== "number" || typeof host !== "string" || typeof path !== "string") {
		throw new Error("Socket must be instanciated with an object containing port, host and path");
	}
	if (port < 0 || port > 65535) {
		throw new Error("Port must be a valid port number");
	}
	if (host.length < 3) {
		throw new Error("Host must be a valid domain name");
	}
	if (path.length < 1) {
		throw new Error("Path must be a valid path");
	}
	this.callBack = null;
	try {
		let sp = port.toString(),
			hr = [host];
		let WSProtocol = (location.protocol === 'https:') ? 'wss:' : 'ws:',
			WSHost = bindPort(hr[0], sp),
			spath = WSProtocol.concat(WSHost, path);
		console.log(spath);
		this.socket = new WebSocket(spath);
	} catch (error) {
		throw new Error("Could not open socket with server");
	}
	
	this.socket.onerror = (error) => {
		throw new Error("Server is not available, please try again later.");
	}

	this.socket.onopen = () => this.emit('connection');

	this.socket.onmessage = (message) => {
		try {
			let msg = this.p(message.data);
			if (!this.callBack) throw new Error("No callback function defined");
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
s.end = function() {
	this.delete();
};
s.send = function(a) {
	if (this.socket.readyState !== 1) {
		console.error("Socket is not ready to send data");
		return;
	}
	this.socket.send(this.j(a));
};
s.delete = function() {
	this.socket.close();
	delete this
}
s.onconnection = function(a) {
	this.on('connection', a);
};
s.onclose = function(a) {
	this.on('close', a);
};
s.use = function(fn) {
	this.callBack = fn;
}