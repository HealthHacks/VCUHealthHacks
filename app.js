var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/groceries', function (req, res) {	
	var listString = req.query.list;
	var listArray = listString.split(',')
	var listObject = {}
	for(var i = 0; i < listArray.length; i++) {
		listObject[i] = listArray[i];
	}
	wss.broadcast(listObject);
  	res.send(listObject); 	
});

var server = http.createServer(app)
server.listen(process.env.port || port);

console.log("http server listening");

var wss = new WebSocketServer({server: server})
wss.broadcast = function broadcast(data) {
	console.log(typeof data);
	console.log(typeof data[0]);
	wss.clients.forEach(function each(client) {		
		client.send(JSON.stringify(data));
	});
};

console.log("websocket server created")

wss.on("connection", function(ws) {
    console.log("client connected");	
    console.log(ws);     
    
	ws.on("close", function() {			    	    
	    console.log("connection closed");        
	});

	ws.on("error", function() {		
	    	    	    
	});
});