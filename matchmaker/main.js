const io = require("socket.io").listen(8000);

let unmatchedUsers = [];
let id = io.on("connection", function(socket) {
    console.log("User joined!");

    var fs = require('fs');
    fs.readFile( __dirname + '/servers.txt', function (err, data) {
    if (err) {
        throw err; 
    }
    console.log(data.toString());
    });

    var client = new XMLHttpRequest();
    client.open('GET', '/servers.txt');
    client.onreadystatechange = function() {
      console.log(client.responseText);
    }
    client.send();

    // players.push(socket);

    // socket.isProtector = computeRole();

    // // Even the player that joined receives this message
    // io.emit("player joined", socket.playerID, socket.isProtector);

    // // Now we send it a "player joined" for every other player connected
    // players.forEach(function(playerSocket) {
    //     if(socket == playerSocket) {
    //         return;
    //     }

    socket.on("disconnect", function() {
        console.log("Player left!");

        io.emit("player left", socket.playerID);

        players.splice(players.indexOf(socket), 1);

        if(socket == hostPlayer && players.length >= 1) {
            // Reassign host
            setHost(players[0]);
        }
    });
});
