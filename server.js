var express = require("express");

var app = express();

app.use(express.static("www"));

app.listen(8080,function() {
	console.log("server running on port 8080");
});