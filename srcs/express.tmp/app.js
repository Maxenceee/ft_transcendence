var express = require('express');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var path = require('path');
var fs = require('fs');
var morgan = require('morgan');
var uuid = require('uuid');
const expressWs = require('express-ws');
var fileUpload = require('express-fileupload');
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

let tmp_user = {
	"id": "max",
	"nickname": "Max",
	"username": "max",
	"is_online": false,
	"profile_picture": "https://cdn.maxencegama.dev/placeholder/u/pl/static/profile/2023-03-01-23-34-51.png",
	"following": [
		{
			"id": "S2u0kgbPSC",
			"nickname": "01234567890123456789",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
		{
			"id": "S2u0kgbPSC",
			"nickname": "mgama",
			"is_online": false,
			"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
		},
	],
	"game_history": [
		{
			"id": 1,
			"date": 1711405447,
			"type": "2p",
			"data": [
				{
					"id": "max",
					"score": 0
				},
				{
					"id": "hj10QnsdUi",
					"score": 3
				}
			]
		},
		{
			"id": 2,
			"date": 1711405993,
			"type": "2p",
			"data": [
				{
					"id": "max",
					"score": 3
				},
				{
					"id": "hj10QnsdUi",
					"score": 5
				}
			]
		},
		{
			"id": 3,
			"date": 1711406177,
			"type": "2p",
			"data": [
				{
					"id": "max",
					"score": 0
				},
				{
					"id": "hj10QnsdUi",
					"score": 3
				}
			]
		},
		{
			"id": 4,
			"date": 1711406237,
			"type": "2p",
			"data": [
				{
					"id": "max",
					"score": 1
				},
				{
					"id": "hj10QnsdUi",
					"score": 0
				}
			]
		},
		{
			"id": 5,
			"date": 1711406469,
			"type": "2p",
			"data": [
				{
					"id": "max",
					"score": 5
				},
				{
					"id": "hj10QnsdUi",
					"score": 1
				}
			]
		},
		{
			"id": 6,
			"date": 1711410695,
			"type": "2p",
			"data": [
				{
					"id": "max",
					"score": 0
				},
				{
					"id": "hj10QnsdUi",
					"score": 3
				}
			]
		},
		{
			"id": 7,
			"date": 1711410747,
			"type": "2p",
			"data": [
				{
					"id": "max",
					"score": 1
				},
				{
					"id": "hj10QnsdUi",
					"score": 0
				}
			]
		},
		{
			"id": 8,
			"date": 1711410801,
			"type": "2p",
			"data": [
				{
					"id": "hj10QnsdUi",
					"score": 0
				},
				{
					"id": "max",
					"score": 3
				}
			]
		},
		{
			"id": 9,
			"date": 1711410905,
			"type": "2p",
			"data": [
				{
					"id": "max",
					"score": 5
				},
				{
					"id": "hj10QnsdUi",
					"score": 3
				}
			]
		},
		{
			"id": 2, "date": 1712590934, "type": "tournament",
			"data": [
				{"id": "max", "score": 1}, {"id": "RK6Ftpougi", "score": 3}, {"id": "3SbkJyRddF", "score": 1}, {"id": "qhIwrQGYTN", "score": 2}, {"id": "max", "score": 1}, {"id": "jrlWksamCf", "score": 4}, {"id": "9Us3UMEOER", "score": 2}, {"id": "6BHmf1HCsb", "score": 1}
			]
		},
		{
			"id": 2, "date": 1712590934, "type": "4p",
			"data": [
				{"id": "max", "score": 1}, {"id": "RK6Ftpougi", "score": 3}, {"id": "3SbkJyRddF", "score": 1}, {"id": "qhIwrQGYTN", "score": 2}
			]
		},
		{
			"id": 2, "date": 1712590934, "type": "tournament",
			"data": [
				{"id": "max", "score": 1}, {"id": "RK6Ftpougi", "score": 3}, {"id": "3SbkJyRddF", "score": 1}, {"id": "qhIwrQGYTN", "score": 2}, {"id": "max", "score": 1}, {"id": "jrlWksamCf", "score": 4}, {"id": "9Us3UMEOER", "score": 2}, {"id": "6BHmf1HCsb", "score": 1}
			]
		},
		{
			"id": 10, "date": 1712667425, "type": "tournament",
			"data": [
				{"id": "Got2qOJZUw", "score": 2}, {"id": "Fvry3Irxp9", "score": 1}, {"id": "QCrogLZZbO", "score": 4}, {"id": "N7Wpm3J6Sh", "score": 1}, {"id": "730Mu2xJsC", "score": 1}, {"id": "upj9MA54aQ", "score": 3}, {"id": "QtHfiWRa1B", "score": 1}, {"id": "RK6Ftpougi", "score": 2}
			]
		},
		{
			"id": 12, "date": 1712668590, "type": "2p",
			"data": [
				{"id": "max", "score": 2}, {"id": "RK6Ftpougi", "score": 5}
			]
		},
		{
			"id": 13, "date": 1712668789, "type": "2p",
			"data": [
				{"id": "max", "score": 2}, {"id": "RK6Ftpougi", "score": 5}
			]
		}
	]
};

app.get('/api/user/:id/get', (req, res) => {
	console.log(req.headers);
	res.status(200).json(tmp_user);
});

app.post('/api/user/update/nickname', (req, res) => {
	console.log("body:", req.method, req.headers, req.body);
	if(req.body.nickname)
		tmp_user.nickname = req.body.nickname;
	res.status(200).json({ success: true });
});

let router = require('./router');

app.use(router)

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