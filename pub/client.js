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
            socket.emit("selectPart", {id: PartIdToSelect});
        },

    },
    computed: {}
});

socket.emit("getParts");
socket.on("setPartsList", function(partsList) {
    vm.setParts(partsList);
});
