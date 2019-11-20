var socket = io();

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
        //TotalCost: Total,
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
        Total: function(){
            return this.EngineCost+this.VehicleCost+this.TireCost;
        }

    }
});


if (isCanvasSupported()) {
    var btx = document.getElementById("buildCanvas").getContext("2d");

    //TODO: Add rest of images
    var theImages = loadAllTheImages(["images/BuggyVehicle.png"], function() {
        //btx.drawImage(theImages[0], 0, 0, 320, 160);

    });
}



socket.emit("getParts");
socket.on("setPartsList", function(partsList) {
    vm.setParts(partsList);
});

