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
	db.collection("carParts").find({}, {sort: [['type', 1],['cost', -1]]}).toArray(function(error, documents) {
		if (error != null) {
			console.log(error);
		}
		else if(theSocket == null) {
			io.emit("setPartsList", documents); //broadcast to all clients
		}
		else {
			theSocket.emit("setPartsList", documents);
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

function validateInput(objectToValidate, schema) {
	
	for(prop in objectToValidate) {
		//nonemptyString
		if (schema[prop] === "nonemptyString") {
			if (!(typeof objectToValidate[prop] === "string" && objectToValidate[prop].length > 0)) {
				return false;
			}
		}
		//positiveInteger
		else if (schema[prop] === "positiveInteger") {
			if (typeof objectToValidate[prop] !== "number") return false;
			if (Math.floor(objectToValidate[prop]) != objectToValidate[prop]) return false; //not an integer
			if (objectToValidate[prop] <= 0) return false;
		}
		else {
			return false;
		}
	}

	return true;
}

io.on("connection", function(socket) {
	console.log("Client connected.");

	socket.on("disconnect", function() {
		console.log("Client disconnected.");
	});

	socket.on("getParts", function() {
		sendParts(socket);
    });
    socket.on("selectPart", function(partIdToSelect) {
		db.collection("carParts").find({_id: new ObjectID(partIdToSelect.id)}, updateClientIfNoError);
		console.log("Part Selected");
		//Send part to client
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

