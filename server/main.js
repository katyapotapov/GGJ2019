const io = require("socket.io").listen(8080);

let id = 0;
let playerIDs = [];

io.on("connection", function(socket) {
    console.log("Player joined!"); 
    
    socket.playerID = id++;
    playerIDs.push(socket.playerID);

    // Even the player that joined receives this message
    io.emit("player joined", socket.playerID);

    // Now we send it a "player joined" for every other player connected
    playerIDs.forEach(function(id) {
        if(id == socket.playerID) {
            return;
        }

        socket.emit("player joined", id);
    });

    if(playerIDs.length == 1) {
        socket.emit("host", socket.playerID);
    }

    socket.on("create bullet", function(x, y, dir) {
        socket.broadcast.emit("create bullet", x, y, dir);
    });

    socket.on("remove bullet", function(index) {
        socket.broadcast.emit("remove bullet", index);
    });

    socket.on("bullet state", function(index, x, y) {
        socket.broadcast.emit("bullet state", index, x, y);
    });

    socket.on("player input", function(input) { 
        socket.broadcast.emit("player input", socket.playerID, input);
    });
    
    socket.on("player state", function(id, x, y, anim) {
        socket.broadcast.emit("player state", id, x, y, anim);
    });

    socket.on("disconnect", function() {
        console.log("Player left!");
        io.emit("player left", socket.playerID);
        playerIDs.splice(playerIDs.indexOf(socket.playerID), 1);

        if(playerIDs.length == 1) {
            // Reassign host
            io.emit("host", playerIDs[0]);
        }
    });
});
