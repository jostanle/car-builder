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
var Room1 = [{ChosenTire:"",ChosenVehicle:"",ChosenEngine:"", ecost: 0, vcost: 0, tcost: 0, TotalCost: 0, ValidCar: false, Message:""}, 
			{ChosenTire:"",ChosenVehicle:"",ChosenEngine:"", ecost: 0, vcost: 0, tcost: 0, TotalCost: 0, ValidCar: false, Message:""}];
var Cars = [{Speed:0, Max:0, Accel: 0},{Speed:0, Max:0, Accel: 0}];
var nextUser = 0;

//Server-side functions:
    //Pass User number, Get returned if valid
function canRace(User){
	if(Room1[User].ChosenTire=="" || Room1[User].ChosenVehicle=="" || Room1[User].ChosenEngine==""){
		Room1[User].Message =  "Not valid because part not selected. Current Parts: " + Room1[User].ChosenTire +", "+ Room1[User].ChosenVehicle+", "+ Room1[User].ChosenEngine;
		Room1[User].ValidCar= false;
	}
	else {
		Room1[User].TotalCost = Room1[User].tcost + Room1[User].vcost + Room1[User].ecost;
		console.log(Room1[User].tcost);
		if(Room1[User].TotalCost > 800 || Room1[User].TotalCost < 0) {
			Room1[User].Message = "Not valid because out of cost range: " + Room1[User].TotalCost;
			Room1[User].ValidCar= false;
		}
		else {
			Room1[User].Message = "Valid with cost: " + Room1[User].TotalCost+ " and parts: "+ Room1[User].ChosenTire +", "+ Room1[User].ChosenVehicle+", "+ Room1[User].ChosenEngine;
			Room1[User].ValidCar = true;
			carStats(User);
		}
	}
}

	//Calculate car performances
function carStats(User){
	Cars[User].Accel = Room1[User].ChosenEngine / 8 + Room1[User].ChosenTire /10;
	Cars[User].Max = Room1[User].ChosenVehicle / 2 + Room1[User].ChosenTire /10;
	
}	
	//Run Race
function runRace(){
	var over = false;
	Car0pos = 0;
	Car1pos = 0;
	Car0speed= Cars[0].Accel;
	Car1speed= Cars[1].Accel;
	while(over = false){
		Car0pos += Car0speed;
		Car1pos += Car1speed;
		//Socketemit either absolute position(to hard set) or change in pos(to use translatex) to show progress
		if(Car0speed < Cars[0].Max) {
			Car0speed += Cars[0].Accel
		}
		if(Car1speed < Cars[1].Max) {
			Car1speed += Cars[1].Accel
		}
		if (Car0pos >= 950 || Car1pos >= 950){
			over = true;
			var winner = Math.max(Car1pos,Car2pos); //If having scoring, add this to winnders score and heavily reduced(/4, etc) to loser
			if (Car0pos == winner){
				console.log("Car 0 won the race!"); //If more rooms, add room as parameter and say which room here
				Room1[1].Message ="Car 0 won the race!";
				Room1[0].Message ="Car 0 won the race!";
				return 0;
				
			}
			if (Car1pos == winner){
				console.log("Car 1 won the race!"); 
				Room[1].Message = "Car 1 won the race!";
				Room[0].Message = "Car 1 won the race!";
				return 1;
				
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
	
	socket.emit("setUserNumber", nextUser%2);
	nextUser++;

	socket.on("disconnect", function() {
		console.log("Client disconnected.");
	});

	socket.on("getParts", function() {
		sendParts(socket);
	});

	socket.on("updateCar", function(car) {
		Room1[car.User].ChosenTire = car.tire; 
		Room1[car.User].ChosenVehicle= car.vehicle;
		Room1[car.User].ChosenEngine = car.engine;

		Room1[car.User].tcost = parseFloat(car.tirecost); 
		console.log(car.tirecost);
		console.log(Room1[car.User].tcost);
		Room1[car.User].vcost= parseFloat(car.vehiclecost);
		Room1[car.User].ecost = parseFloat(car.enginecost);

		canRace(car.User);
		socket.emit("sendMessage", Room1[car.User].Message);
		console.log(car.User + " is " + Room1[car.User].Message);
		socket.emit("updateValidation", Room1[car.User].ValidCar);
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

