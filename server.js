//Stuff for MongoDB
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true });
var db;

//Stuff for express, server, and socket.io
var express = require("express");
var app = express();
var http = require("http");
var server = http.Server(app);
var socketio = require("socket.io");
var io = socketio(server);
app.use(express.static("pub"));

//Server-side data:
var listOfUsers = [];

//Server-side functions:

    //If client has valid cost(can race)

    //Calculate car performances

    //Run Race

//Access database
function sendParts(theSocket) {
	db.collection("carParts").find({}, {sort: [['cost', -1],['vehicle', 1]]}).toArray(function(error, documents) {
		if (error != null) {
			console.log(error);
		}
		else if(theSocket == null) {
			io.emit("setBookList", documents); //broadcast to all clients
		}
		else {
			theSocket.emit("setBookList", documents);
		}
	});
}

function updateClientIfNoError(error, result) {
	if (error != null) {
		console.log(error);
	}
	else {
		sendParts(null);
	}
}

io.on("connection", function(socket) {
	console.log("Client connected.");

	socket.on("disconnect", function() {
		console.log("Client disconnected.");
	});

	socket.on("getParts", function() {
		sendParts(socket);
    });
    
});

client.connect(function(err) {
    if (err != null) throw err; //No DB connection?  Then let our server crash with an error.
    else {
        db = client.db("carParts"); //Get our specific database

        //Start listening for client connections
        server.listen(80, function() {
            console.log("Server with socket.io is ready.");
        });
    }
}); 

app.listen(80, function() {
    //This function is only executed once the server is ready.
    console.log("Server is waiting on port 80");
});