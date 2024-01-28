var express = require('express');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var path = require('path');
var fs = require('fs');
var morgan = require('morgan');
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
	process.env["CLIENT_BUILD_BIR"] = path.resolve(__dirname, '.');
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
 * 
 *	Default handler
 * 
 */

app.use((req, res, next) => {
	res.status(200).sendFile(path.join(process.env["CLIENT_BUILD_BIR"], 'views/index.html'));
});

module.exports = app;