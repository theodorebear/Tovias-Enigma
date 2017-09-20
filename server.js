var process = require("process");
var express = require("express");
var bodyParser = require('body-parser');
var encrypter = require('object-encrypter');
var engine = encrypter('|uNTR5m5dp1:[d7h?rflL6]v>N;t*z&#Cu8yD@^#1TbY(Hynrt]Sjs"&=h,7WR', {ttl: true});

var app = express();

app.use(express.static("www"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.listen(8080,function() {
	console.log("server running on port 8080");
});

app.post('/encrypt', function (req, res) {
	var request = req.body;
	var response = encrypt(request);
  	res.json(response);
});
app.post('/decrypt', function (req, res) {
	var request = req.body;
	var response = decrypt(request);
  	res.json(response);
});


process.stdin.on("data",function(data) {
	process.exit();
});


function encrypt(request) {

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

function decrypt(request) {
	return {
		data:engine.decrypt(request.message)
	}
}