var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');

router.use(fileUpload({limits: { fileSize: 5 * 1024 * 1024 }}));

router.post('/api/user/update/picture', (req, res) => {
	console.log(req.headers, req.files);
	if (!req.files || !req.files.profile_picture)
		return res.status(400).send("No file uploaded");

	res.status(200).json({ success: true });
});

module.exports = router;