var process = require("process");
var express = require("express");


var app = express();

app.use(express.static("www"));

app.listen(8080,function() {
	console.log("server running on port 8080");
});


process.stdin.on("data",function(data) {
	process.exit();
});
