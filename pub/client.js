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
        errors: []
    },
    methods: {
        setParts: function(partsList) {
            this.partsList = partsList;
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
            //socket.emit("selectPart", {_id: PartIdToSelect});
        },

    },
    computed: {
        //Total: function(){
        //    return this.EngineCost+this.VehicleCost+this.TireCost;
        //}
        /*
        vehicleDisplay: function(){
            var btx = document.getElementById("buildCanvas").getContext("2d");

            //TODO: Add rest of images
            var theImages = loadAllTheImages(imag, function() {
               for(i of typ){
                   console.log(vm.VehicleName);
                   if(i == this.VehicleName){
                        btx.drawImage(theImages[i], 0, 0, 320, 160);
                    }
                    if(i == this.EngineName){
                        btx.drawImage(theImages[i], 225, 0, 75, 75);
                    }
                    if(i == this.TireName){
                        btx.drawImage(theImages[i], 0, 0, 320, 160);
                    }
               }
            });
        
        }
        */

    }
});

var imag = ["images/BuggyVehicle.png","images/RaceCarVehicle.png","images/TankVehicle.png","images/VanVehicle.png","images/DragCarVehicle.png",
            "images/OneEngine.png","images/TwoEngine.png","images/ThreeEngine.png","images/FourEngine.png","images/FiveEngine.png",
            "images/DiamondTire.png", "images/FancyTire.png", "images/HoverTire.png", "images/SquareTire.png", "images/TreadTire.png"];
var type = ["Buggy","RaceCar","Tank", "Van", "DragCar", "One","Two","Three","Four","Five","Diamond", "Fancy","Hover","Square","Tread"];


if (isCanvasSupported()) {
    var btx = document.getElementById("buildCanvas").getContext("2d");

    //TODO: Add rest of images
    var theImages = loadAllTheImages(imag, function() {
       for(i of typ){
           console.log(vm.VehicleName);
           if(i == vm.VehicleName){
                btx.drawImage(theImages[i], 0, 0, 320, 160);
            }
            if(i == vm.EngineName){
                btx.drawImage(theImages[i], 225, 0, 75, 75);
            }
            if(i == vm.TireName){
                btx.drawImage(theImages[i], 0, 0, 320, 160);
            }
       }
    });
}

socket.emit("getParts");
socket.on("setPartsList", function(partsList) {
    vm.setParts(partsList);
});

