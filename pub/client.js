var socket = io();

var imag = ["images/BuggyVehicle.png","images/RaceCarVehicle.png","images/TankVehicle.png","images/VanVehicle.png","images/DragCarVehicle.png",
            "images/OneEngine.png","images/TwoEngine.png","images/ThreeEngine.png","images/FourEngine.png","images/FiveEngine.png",
            "images/DiamondTire.png", "images/FancyTire.png", "images/HoverTire.png", "images/SquareTire.png", "images/TreadTire.png"];
var typ = ["Buggy","RaceCar","Tank", "Van", "DragCar", "One","Two","Three","Four","Five","Diamond", "Fancy","Hover","Square","Tread"];

function isCanvasSupported() {
    var tempCanvas = document.createElement("canvas"); 
    return !!(tempCanvas.getContext && tempCanvas.getContext("2d")); 
}

//Use to load all part images
function loadAllTheImages(arrayOfImages, callbackFunction) {
    var numImagesLoaded = 0;

    var ret = [];
    for(i in arrayOfImages) {
        ret[i] = new Image();
        ret[i].src = arrayOfImages[i];
        ret[i].addEventListener("load", function() {
            numImagesLoaded++;
            if (numImagesLoaded == arrayOfImages.length) {
                callbackFunction();
            }
        });
    }
    return ret;
}

var vm = new Vue({
    el: "#app",
    data: {
        partsList: [],
        EngineName: "",
        EngineCost: 0,
        VehicleName: "",
        VehicleCost: 0,
        TireName: "",
        TireCost: 0,
        User: 0,
        ready: false,
        validation: false,
        serverMessage: "Welcome!",
        raceMessage: "Race hasn't run yet",
        p0: "",
        p1: "",
        errors: [],
        race: "No Race in Progress \n Both Cars must be ready to begin"
    },
    methods: {
        setParts: function(pl) {
            this.partsList = pl;
        },
        setUser: function(un) {
            this.User = un;
        },
        setMessage: function(sm) {
            this.serverMessage = sm;
        },
        setResults: function(rm) {
            this.raceMessage = rm;
        },
        setRace: function(rt) {
            this.race = rt;
        },
        playerStatus: function(status) {
            if(status.p0){
                this.p0 = "Ready";
            }
            else this.p0 = "Not Ready";

            if(status.p1){
                this.p1 = "Ready";
            }
            else this.p1 = "Not Ready";
        },
        selectAPart: function(PartIdToSelect) {
            console.log(PartIdToSelect);
            var actualPart = null;
            for(part of this.partsList) {
                if (part._id == PartIdToSelect)  {
                    actualPart = part;
                }
            }
            if (actualPart.type == "vehicle"){
                this.VehicleName = actualPart.name;
                this.VehicleCost = actualPart.cost;
               
            }
            else if (actualPart.type == "tire"){
                this.TireName = actualPart.name;
                this.TireCost = actualPart.cost;
            }
            else if (actualPart.type == "engine"){
                this.EngineName = actualPart.name;
                this.EngineCost = actualPart.cost;
            }
            var car = {};
            car.vehicle = this.VehicleName;
            car.tire = this.TireName;
            car.engine = this.EngineName;
            car.tirecost = this.TireCost;         
            car.vehiclecost = this.VehicleCost;
            car.enginecost = this.EngineCost;
            car.User = this.User;
            socket.emit("updateCar", car);
            this.validationUpdate();
        },
        vehicleDisplay: function(){
            var btx = document.getElementById("buildCanvas").getContext("2d");
            btx.clearRect(0, 0, 320, 160);

                var index = 0;
            
                var theImages = loadAllTheImages(imag, function() {
                   for(i of typ){

                       if(i == vm.VehicleName ){
                           btx.drawImage(theImages[index], 0, 0, 320, 160);
                        }
                        if(vm.VehicleName == "Tank"){
                            if(i == vm.EngineName){
                                 btx.drawImage(theImages[index], 50, 0, 75, 75);
                            }
                        }
                        else if(i == vm.EngineName){
                            btx.drawImage(theImages[index], 225, 0, 75, 75);
                           
                        }
                        if(i == vm.TireName){
                           btx.drawImage(theImages[index], 0, 0, 320, 160);
                        }
                        index ++;
                   
                    } 
                
            });
        },
        userReady: function(){
            this.ready = !this.ready;
            var readyUp = {};
            readyUp.User = this.User;
            readyUp.ready = this.ready;
            console.log("Sending to server that "+ readyUp.User+" is "+ readyUp.ready);
            socket.emit("userReady", readyUp);
        },
        validationUpdate: function(){
            
            socket.on("updateValidation", function(valid) {
                vm.validation = valid;
                console.log(vm.validation); 
            });
            
        }    
        

    },
    computed: {
        currentTotal: function(){
            return parseFloat(this.EngineCost)+parseFloat(this.TireCost)+parseFloat(this.VehicleCost);
        },
        validCost: function(){
            var className = this.validation ? 'validCost' : 'nonValid';
            return className;
        }
        
    }
});

socket.emit("getParts");
socket.on("setPartsList", function(partsList) {
    vm.setParts(partsList);
});
socket.on("setUserNumber", function(setUser) {
    vm.setUser(setUser);
});
socket.on("sendMessage", function(message) {
    vm.setMessage(message);
});
socket.on("sendResults", function(winner) {
    vm.setResults(winner);
});
socket.on("sendRace", function(track) {
    vm.setRace(track);
});
socket.on("updateStatus", function(status) {
    vm.playerStatus(status);
});