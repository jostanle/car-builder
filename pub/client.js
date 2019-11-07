var socket = io();

socket.emit("getBooks");

socket.on("setPartsList", function(bookList) {
    $("#partsList").html("");
    for(let part of partsList) {
        var tdName = $("<td></td>").text(part.name);
        var tdType = $("<td></td>").text(part.type);
        var tdCost = $("<td></td>").text(part.cost);

        var tdSelect = $("<td></td>");
        var theSelectButton = $("<button>Select</button>");
        theSelectButton.click(function() {
            socket.emit("selectBook", {id: part._id});
        });
        tdSelect.append(theSelectionButton);

        var tr = $("<tr></tr>")
            .append(tdTitle)
            .append(tdAuthor)
            .append(tdPages)
            .append(tdSelect);

        $("#partsList").append(tr);
    }

    console.log(partsList);
});

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