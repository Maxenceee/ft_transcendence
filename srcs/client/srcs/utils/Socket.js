import { CallBack, mergeProto } from ".";
import AlertBanner from "./AlertBanner";

var bindPort = function(a, b) {
	if (!b.length)
		return ("//"+a);
	if (!isNaN(parseInt(b))) {
		return ("//"+a+':'+b);
	}
	return ("//"+b+'.'+a);
}

/**
 * 
 * @param {{
 * 	port?: number,
 * 	host?: string,
 * 	path?: string
 * }} data 
 */
var Socket = function({port = -1, host = process.env.BASE_URI || window.location.host, path = "/"}) {
	if (!(this instanceof Socket)) {
		throw new Error("Socket must be instanciated with new keyword");
	}
	if (typeof port !== "number" || typeof host !== "string" || typeof path !== "string") {
		throw new Error("Socket must be instanciated with an object containing port, host and path");
	}
	if (port > 65535) {
		throw new Error("Port must be a valid port number, not "+port);
	}
	if (host.length < 3) {
		throw new Error("Host must be a valid domain name, not "+host);
	}
	if (path.length < 1) {
		throw new Error("Path must be a valid path, not "+path);
	}
	try {
		host = new URL(host);
	} catch (error) {
		throw new Error("Host must be a valid domain name, not "+host);
	}
	this.callBack = null;

	try {
		let sp = (port > 0 && port || host.port).toString(),
			hr = [host.hostname];
		let WSProtocol = (host.protocol === 'https:') ? 'wss:' : 'ws:',
			WSHost = bindPort(hr[0], sp),
			spath = WSProtocol.concat(WSHost, path);
		this.socket = new WebSocket(spath);
		this.openingtime = Date.now();
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
s.rmconnection = function(a) {
	if (typeof a !== "function") {
		throw new Error("Callback must be a function, not "+typeof a);
	}
	this.remove('close', a);
};
s.onclose = function(a) {
	if (typeof a !== "function") {
		throw new Error("Callback must be a function, not "+typeof a);
	}
	this.on('close', a);
};
s.rmclose = function(a) {
	if (typeof a !== "function") {
		throw new Error("Callback must be a function, not "+typeof a);
	}
	this.remove('close', a);
};
s.onerror = function(a) {
	if (typeof a !== "function") {
		throw new Error("Callback must be a function, not "+typeof a);
	}
	this.on('error', a);
};
s.rmerror = function(a) {
	if (typeof a !== "function") {
		throw new Error("Callback must be a function, not "+typeof a);
	}
	this.remove('close', a);
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
	if (this.openingtime && this.ps - this.openingtime < 30 * 1000) return;
	if (this.lastPing && this.ps - this.lastPing < 60 * 1000) return;
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
	let m;
	if (a == 1)
		m = "Votre connexion est lente, vous pouvez rencontrer une certaine latence.";
	else if (a == 2)
		m = "Vous avez une très mauvaise connexion, vous devriez vérifier votre connexion.";
	else
		return ;
	new AlertBanner({ message: m, delay: 5000 });
};

export default Socket;