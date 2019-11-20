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
        TotalCost: Total,
        errors: []
    },
    methods: {
        setParts: function(partsList) {
            this.partsList = partsList;
        },
        selectAPart: function(PartIdToSelect) {
            console.log(PartIdToSelect);
            var actualPart = null;
            for(part of partsList) {
                if (part._id == PartIdToSelect)  {
                    actualPart = part;
                }
            }
            if (actualPart.type == "vehicle"){
                VehicleName = actualPart.name;
                VehicleCost = actualPart.cost;
            }
            else if (actualPart.type == "tire"){
                TireName = actualPart.name;
                TireCost = actualPart.cost;
            }
            else if (actualPart.type == "engine"){
                EngineName = actualPart.name;
                EngineCost = actualPart.cost;
            }
            //socket.emit("selectPart", {_id: PartIdToSelect});
        },

    },
    computed: {
        Total: function(){
            return EngineCost+VehicleCost+TireCost;
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

