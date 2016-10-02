var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/public"));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/pillsInventory', function(req, res){
  res.json(pills);
});

app.get('/pillsRemoved', function (req, res) {
	var results = {};
	var pillArray = [];
	var listString = req.query.pills;
	if(listString) {
		if(listString[listString.length -1] == ',') { //hacking the csv
			listString = listString.substring(0, listString.length - 1);
		}	 
		var listArray = listString.split(',')		
		for(var i = 0; i < listArray.length; i++) {		
			var removedPill = listArray[i];				
			var currentPill = pills.pills.filter(function(e) {
				return e.name == removedPill;
			})[0];
			if(new Date().getHours() < currentPill.schedule) {
				pillArray.push({name:currentPill.name, correct:false});
			} else {
				pillArray.push({name:currentPill.name, correct:true});
			}
		}
	}	
	results.pills = pillArray;
	wss.broadcast(results);
  	res.json(results);	
});

var server = http.createServer(app)
server.listen(process.env.port || port);

console.log("http server listening");

var wss = new WebSocketServer({server: server})
wss.broadcast = function broadcast(data) {
	// console.log(typeof data);
	// console.log(typeof data[0]);
	wss.clients.forEach(function each(client) {		
		client.send(JSON.stringify(data));
	});
};

console.log("websocket server created");

wss.on("connection", function(ws) {
    // console.log("client connected");	
    // console.log(ws);     
    
	ws.on("close", function() {			    	    
	    console.log("connection closed");        
	});

	ws.on("error", function(e) {		
        console.log(e);
	});
});

var pillA = {
    'name': 'PillA',
    'weightMg': 50,
    'color': '#cc4555',
	'schedule': 8,
	'time': '8:00 AM'
};

var pillB = {
    'name': 'PillB',
    'weightMg': 30,
    'color': '#cc9845',
	'schedule': 20,
	'time': '8:00 PM'
};

var pillC = {
    'name': 'PillC',
    'weightMg': 80,
    'color': '#4578cc',
	'schedule': 12,
	'time': '12:00 PM'
};

var pills = {
    pills: [pillA, pillB, pillC]
};