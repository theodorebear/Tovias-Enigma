var process = require("process");
var express = require("express");
var bodyParser = require('body-parser');
var encrypter = require('object-encrypter');

// initialize server object
var app = express();

// initialize static www directory for index.php
app.use(express.static("www"));

// initialize bodyparsers used for GET and POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

// run server
app.listen(8080,function() {
	console.log("server running on port 8080");
});

// listen for POST requests to /encrypt path
app.post('/encrypt', function (req, res) {
	var request = req.body;
	var response = encrypt(request);
  	res.json(response);
});

// listen for POST requests to /decrypt path
app.post('/decrypt', function (req, res) {
	var request = req.body;
	var response = decrypt(request);
  	res.json(response);
});

// listen for data in stdin to kill server process
process.stdin.on("data",function(data) {
	process.exit();
});

// function to encrypt a javascript object with a given passphrase
function encrypt(request) {

	var engine = encrypter(request.password, {ttl: true});

	var t1 = new Date();
	
	var t2 = request.date2.split(/\D+/);
	var t2 = new Date(Date.UTC(t2[0], --t2[1], t2[2], t2[3], t2[4], t2[5], t2[6]));
	
	var ttl = Math.abs(t1.getTime() - t2.getTime());
	
	var hex = engine.encrypt(request, ttl);
	
	return {
		data:hex,
		ttl:ttl,
	};
}

// function to encrypt a javascript object with a given passphrase
function decrypt(request) {
	var engine = encrypter(request.password, {ttl: true});
	
	try {
		var data = engine.decrypt(request.message);
		return {
			success:true,
			data:engine.decrypt(request.message)
		}
	} catch(e) {
		return {
			success:false,
			data:null
		}
	}
	
}