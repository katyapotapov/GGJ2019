const io = require("socket.io").listen(8080);

let id = 0;
let playerIDs = [];
let newPlayers = [];

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
    } else {
        newPlayers.push(socket);
    }

    socket.emit("set player id", socket.playerID);

    // TODO only add these to the host

    socket.on("snapshot", function(data) {
        console.log(`Sending ${newPlayers.length} snapshots`);
        newPlayers.forEach(function(socket) {
            for(let i = 0; i < data.bullets.length; ++i) {
                socket.emit("create bullet", data.bullets[i].x, data.bullets[i].y, data.bullets[i].dir);
            }

            for(let i = 0; i < data.walls.length; ++i) {
                socket.emit("create wall", data.walls[i].x, data.walls[i].y, data.walls[i].dir, data.walls[i].life);
            }

            for(let i = 0; i < data.resources.length; ++i) {
                socket.emit("create resource", data.resources[i].type, data.resources[i].x, data.resources[i].y);
            }

            for(let i = 0; i < data.bombs.length; ++i) {
                socket.emit("create bomb", data.bombs[i].x, data.bombs[i].y);
            }
        });

        newPlayers.length = 0;
    });

    socket.on("create bullet", function(x, y, dir) {
        socket.broadcast.emit("create bullet", x, y, dir);
    });

    socket.on("remove bullet", function(index) {
        socket.broadcast.emit("remove bullet", index);
    });

    socket.on("bullet state", function(index, x, y) {
        socket.broadcast.volatile.emit("bullet state", index, x, y);
    });

    socket.on("set item quantity", function(id, type, quantity) {
        socket.broadcast.emit("set item quantity", id, type, quantity);
    });

    socket.on("set selected item", function(id, index) {
        socket.broadcast.emit("set selected item", id, index);
    });

    socket.on("player input", function(input) {
        socket.broadcast.volatile.emit("player input", socket.playerID, input);
    });

    socket.on("player state", function(id, x, y, anim) {
        socket.broadcast.volatile.emit("player state", id, x, y, anim);
    });

    socket.on("create wall", function(x, y, dir, life) {
        socket.broadcast.emit("create wall", x, y, dir, life);
    });

    socket.on("set wall life", function(index, life) {
        socket.broadcast.emit("set wall life", index, life);
    });

    socket.on("create resource", function(type, x, y) {
        socket.broadcast.emit("create resource", type, x, y);
    });

    socket.on("set resource life", function(index, life) {
        socket.broadcast.emit("set resource life", index, life);
    });

    socket.on("create bomb", function(type, x, y) {
        socket.broadcast.emit("create bomb", type, x, y);
    });

    socket.on("remove bomb", function(type, x, y) {
        socket.broadcast.emit("remove bomb", type, x, y);
    });

    socket.on("create explosion", function(type, x, y) {
        socket.broadcast.emit("create explosion", type, x, y);
    });

    socket.on("remove explosion", function(type, x, y) {
        socket.broadcast.emit("remove explosion", type, x, y);
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
