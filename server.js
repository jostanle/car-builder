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
var Room1 = [{ChosenTire:"",ChosenVehicle:"",ChosenEngine:"", TotalCost:0, ValidCar:true}, {ChosenTire:"",ChosenVehicle:"",ChosenEngine:"", TotalCost:0, ValidCost: true}];
var Cars = [{Speed:0, Max:0, Accel: 0},{Speed:0, Max:0, Accel: 0}];

//Server-side functions:
    //Pass User number, Get returned if valid
function canRace(User){
	if(Room1[User].ChosenTire==""&& Room1[User].ChosenVehicle==""&& Room1[User].ChosenEngine==""){
		Room1[User].ValidCar= false;
	}
	else {
		var ecost = 0;
		var vcost = 0;
		var tcost = 0;
		db.collection("carParts").find({name: Room1[User].ChosenTire}).toArray(function(error,pitire){
			tcost = pitire.cost;
		});
		db.collection("carParts").find({name: Room1[User].ChosenVehicle}).toArray(function(error,piveh){
			vcost = piveh.cost;
		});
		db.collection("carParts").find({name: Room1[User].ChosenEngine}).toArray(function(error,piceng){
			ecost= piceng.cost;
		});
		var TotalCost = tcost + vcost + tcost;
		if(TotalCost > 800 && TotalCost < 0)
			Room1[User].ValidCar= false;
		else 
			Room1[User].ValidCar = true;
			carStats(User);
	}
}
	//Calculate car performances
function carStats(User){
	Car[User].Accel = Room1[User].ChosenEngine / 8 + Room1[User].ChosenTire /10;
	Car[User].Max = Room1[User].ChosenVehicle / 2 + Room1[User].ChosenTire /10;
	
}	
	//Run Race
function runRace(){
	var over = false;
	Car1pos = 0;
	Car2pos = 0;
	Car1speed= Cars[1].Accel;
	Car2speed= Cars[2].Accel;
	while(over = false){
		Car1pos += Car1speed;
		Car2pos += Car2speed;
		//Socketemit either absolute position(to hard set) or change in pos(to use translatex) to show progress
		if(Car1speed < Cars[1].Max) {
			Car1speed += Cars[1].Accel
		}
		if(Car2speed < Cars[2].Max) {
			Car2speed += Cars[2].Accel
		}
		if (Car1pos >= 950 && Car2pos >= 950){
			over = true;
			var winner = Math.max(Car1pos,Car2pos); //If having scoring, add this to winnders score and heavily reducec(/4, etc) to loser
			if (Car1pos == winner){
				return 1;
				console.log("Car 1 won the race!"); //If more rooms, add room as parameter and say which room here
			}
			if (Car2pos == winner){
				return 2;
				console.log("Car 2 won the race!"); 
			}
		}
	}
}	

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


io.on("connection", function(socket) {
	console.log("Client connected.");

	socket.on("disconnect", function() {
		console.log("Client disconnected.");
	});

	socket.on("getParts", function() {
		sendParts(socket);
    });
    socket.on("selectPart", function(partIdToSelect) {
		db.collection("carParts").find({_id: new ObjectID(partIdToSelect._id)}).toArray(function(error,documents){
			if (error != null) {
				console.log(error);
			}
			else {
				socket.emit("partChosen", documents);
			}
		});
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

