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

app.listen(80, function() {
    //This function is only executed once the server is ready.
    console.log("Server is waiting on port 80");
});