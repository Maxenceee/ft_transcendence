var express = require('express');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var path = require('path');
var fs = require('fs');
var morgan = require('morgan');
var uuid = require('uuid');
const expressWs = require('express-ws');
require('dotenv').config();

/**
 * *************************************************************
 * 
 * Ceci est uniquement à but illustratif, il ne sert qu'à tester
 * le client en attendant que le server Django soit prêt.
 * 
 * *************************************************************
 */

/**
 * 
 *	Express App
 * 
 */

var app = express();


/**
 * 
 *	Client build path
 * 
 */

if (!process.env.CLIENT_BUILD_BIR) {
	// process.env["CLIENT_BUILD_BIR"] = path.resolve(__dirname, '.');
	process.env["CLIENT_BUILD_BIR"] = path.resolve(__dirname, '../client');
}

let buildDashPath = path.join(process.env.CLIENT_BUILD_BIR, 'public');
console.info("Static dir:", buildDashPath);

if (!fs.existsSync(buildDashPath)) {
	throw new Error("Could not find build dir!");
}

/**
 * 
 *	Express settings
 * 
 */

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


/**
 *  Static Handler
 */

app.use('/static', express.static(buildDashPath, {
	index: false,
}));


/**
 * 
 *	Boot log
 * 
 */

let now = new Date();
console.info("\x1b[1;36mBoot time %d - %dh%d(UTC+%d) - timezone %s\x1b[0m", Math.floor(Date.now() / 1000), now.getHours(), now.getMinutes(), now.getHours() - now.getUTCHours(), process.env.TZ || "Default");


/* enable cors for developpement */

let origin_list = ["http://localhost:3000", "http://localhost:3004", "https://maxencegama.dev", "https://previews.maxencegama.dev"];

app.use(cors({
	credentials: true,
	origin: origin_list,
}));


/**
 * Socket handler
 */

let playerSet = [];
let playerPools = [];

let getOpp = function(id) {
	if (!playerPools.length) return
	let el = playerPools.find(e => Object.keys(e).includes(id));
	if (!el) return
	let [player1, player2] = Object.values(el);
	if (player1.id == id)
		return player2;
	return player1
}

expressWs(app);

app.ws('/socket', function(ws, req) {
	ws.id = uuid.v4();
	console.info("new connection", ws.id);

	if (playerSet.length == 1) {
		let opp = playerSet.pop();
		let data = {};
		data[opp.id] = opp;
		data[ws.id] = ws;
		playerPools.push(data);
	} else {
		playerSet.push(ws);
	}

	ws.on('message', function(msg) {
		let op = getOpp(ws.id)
		if (op) {
			op.send(msg);
		}
	});

	ws.on('close', () => {
		console.info("close connection", ws.id);
		playerSet = playerSet.filter(e => e != ws.id);
		let el = playerPools.find(e => Object.keys(e).includes(ws.id));
		if (el) {
			Object.values(el).forEach(e => e.close());
		} 
		playerPools = playerPools.filter(e => Object.keys(e).includes(ws.id));
	});
});

app.use('/oui', (req, res) => {
	console.log("body:", req.method, req.headers, req.body);
	res.status(200).send(req.body);
});


/**
 * 
 *	Default handler
 * 
 */

app.get('/:page', (req, res, next) => {
	if (!req.params.page || req.params.page == "index.html")
		return res.status(200).sendFile(path.join(process.env["CLIENT_BUILD_BIR"], 'views/index.html'));
	let p = path.join(process.env["CLIENT_BUILD_BIR"], 'views/'+req.params.page);
	if (!fs.existsSync(p))
		return next();
	res.status(200).sendFile(p);
});

app.post('/login', (req, res) => {
	console.log("login body", req.body);
	res.writeHead(302, {
		'Location': '/connection.html'
	}).end();
});

app.use((_, res) => {
	res.status(200).sendFile(path.join(process.env["CLIENT_BUILD_BIR"], 'views/index.html'));
});

module.exports = app;