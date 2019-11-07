var socket = io();

socket.emit("getBooks");

var vm = new Vue({
    el: "#app",
    data: {
        frame:" ",
        engine:" ",
        wheel:" ",
        position: 0
    },
    methods: {
       
    },
    computed: {
       
    }
});