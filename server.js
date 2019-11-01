var express = require("express"); //load up another module we will need (express)
var bodyParser = require("body-parser");
var app = express(); //Instantiating a server
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('pub')); //to serve up .txt, .html, .jpg, etc. files.

//Server-side data:


//Server-side functions:

app.listen(80, function() {
    //This function is only executed once the server is ready.
    console.log("Server is waiting on port 80");
});