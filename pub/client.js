var socket = io();

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

socket.on("partSelected", function(partSelected) {
    //TODO: Make partSelected Array actually fill, have function change data
    vm.nameField = partSelected.name;
    vm.typeField = partSelected.type;
    vm.costField = partSelected.cost;
    
    console.log(partSelected);
});