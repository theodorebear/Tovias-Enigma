var process = require("process");
var express = require("express");
var bodyParser = require('body-parser');


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


process.stdin.on("data",function(data) {
	process.exit();
});


function encrypt(request) {
	return {
		data:request.name+request.multiline+request.date2
	};
}