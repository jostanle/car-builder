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
        selectAPart: function(thePartIdToSelect) {
            socket.emit("selectPart", {id: thePartIdToSelect});
        },

    },
    computed: {}
});

socket.emit("getParts");
socket.on("setPartsList", function(partsList) {
    vm.setParts(partsList);
});
