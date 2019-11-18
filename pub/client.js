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

if (isCanvasSupported()) {
    var btx = document.getElementById("buildCanvas").getContext("2d");
}

//TODO: Add rest of images
var theImages = loadAllTheImages(["images/BuggyVehicle.png"], function() {
    btx.drawImage(theImages[0], 0, 0, 320, 160);

});

var vm = new Vue({
    el: "#app",
    data: {
        partsList: [],
        nameField: "",
        typeField: "",
        costField: "",
        errors: []
    },
    methods: {
        setParts: function(partsList) {
            this.partsList = partsList;
        },
        selectAPart: function(PartIdToSelect) {
            console.log(PartIdToSelect);

            socket.emit("selectPart", {_id: PartIdToSelect});


        },

    },
    computed: {}
});

socket.emit("getParts");
socket.on("setPartsList", function(partsList) {
    vm.setParts(partsList);
});

socket.on("partChosen", function(partSelected) {

    vm.nameField = partSelected.name;
    vm.typeField = partSelected.type;
    vm.costField = partSelected.cost;

    var frame = new Image();
    frame.src = "images/"+vm.nameField+"Vehicle.png";
    frame.addEventListener("load", function() {
        btx.drawImage(frame, 0, 0, 320, );
    });
    
    console.log(partSelected);
});