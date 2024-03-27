import { CallBack, mergeProto } from ".";

var bindPort = function(a, b) {
	if (!isNaN(parseInt(b))) {
		return ("//"+a+':'+b);
	}
	return ("//"+b+'.'+a);
}

var Me = function(a, b, c) {
	return Le(document, arguments)
},
Le = function(a, b) {
	var c = String(b[0]),
		d = b[1],
		e = b[2] || null;
	c = (["svg", "path", "circle", "text"].includes(c.toLowerCase()) ? a.createElementNS("http://www.w3.org/2000/svg", c) : a.createElement(c));
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
s.onerror = function(a) {
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

export default Socket;