const io = require("socket.io").listen(process.env.PORT || 8080);

let id = 0;
let players = [];
let newPlayers = [];

function computeRole() {
    let isProtector;
    let diff = 0;

    // Want the first joined player to be the protector
    if (players.length === 1) {
        return true;
    }

    for (let i = 0; i < players.length; i++) {
        let socket = players[i];
        if (socket.isProtector) {
            diff++;
        } else {
            diff--;
        }
    }
    if (diff > 1) {
        return false;
    } else if (diff < -1) {
        return true;
    } else {
        return Math.round(Math.random()) > 0;
    }
}

io.on("connection", function(socket) {
    console.log("Player joined!");

    socket.playerID = id++;

    players.push(socket);

    socket.isProtector = computeRole();

    function setHost(sock) {
        console.log("Host: ", socket.playerID);
        sock.emit("host");
        sock.broadcast.emit("unhost");
        hostPlayer = socket;
    }

    if(players.length == 1) {
        setHost(socket);
    } else {
        newPlayers.push(socket);
    }

    // Even the player that joined receives this message
    io.emit("player joined", socket.playerID, socket.isProtector);

    // Now we send it a "player joined" for every other player connected
    players.forEach(function(playerSocket) {
        if(socket == playerSocket) {
            return;
        }

        socket.emit("player joined", playerSocket.playerID, playerSocket.isProtector);
    });

    socket.emit("set player id", socket.playerID);

    // TODO only add these to the host

    socket.on("snapshot", function(data) {
        console.log(`Sending ${newPlayers.length} snapshots`);
        newPlayers.forEach(function(socket) {
            for(let i = 0; i < data.bullets.length; ++i) {
                socket.emit("create bullet", data.bullets[i].x, data.bullets[i].y, data.bullets[i].ownerID, data.bullets[i].direction);
            }

            for(let i = 0; i < data.walls.length; ++i) {
                socket.emit("create wall", data.walls[i].x, data.walls[i].y, data.walls[i].direction, data.walls[i].life);
            }

            for(let i = 0; i < data.resources.length; ++i) {
                socket.emit("create resource", data.resources[i].type, data.resources[i].x, data.resources[i].y);
            }

            for(let i = 0; i < data.bombs.length; ++i) {
                socket.emit("create bomb", data.bombs[i].x, data.bombs[i].y);
            }

            for(let i = 0; i < data.items.length; ++i) {
                socket.emit("create item", data.items[i].type, data.items[i].x, data.items[i].y);
            }

            socket.emit("set hearth life", data.hearthLife);
            socket.emit("set hearth magic wood", data.hearthMagicWood);
        });

        newPlayers.length = 0;
    });

    socket.on("request host", function() {
        setHost(socket);
    });

    socket.on("create bullet", function(x, y, owner, dir) {
        socket.broadcast.emit("create bullet", x, y, owner, dir);
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

    socket.on("player state", function(id, x, y, anim, sequenceNumber, name, life) {
        socket.broadcast.volatile.emit("player state", id, x, y, anim, sequenceNumber, name, life);
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

    socket.on("create bomb", function(x, y) {
        socket.broadcast.emit("create bomb", x, y);
    });

    socket.on("remove bomb", function(x, y) {
        socket.broadcast.emit("remove bomb", x, y);
    });

    socket.on("create explosion", function(x, y) {
        socket.broadcast.emit("create explosion", x, y);
    });

    socket.on("create item", function(type, x, y) {
        socket.broadcast.emit("create item", type, x, y);
    });

    socket.on("remove item", function(index) {
        socket.broadcast.emit("remove item", index);
    });

    socket.on("create punch", function(x, y, dir) {
        socket.broadcast.emit("create punch", x, y, dir);
    });

    socket.on("set hearth life", function(life) {
        socket.broadcast.emit("set hearth life", life);
    });

    socket.on("set hearth magic wood", function(magicWood) {
        socket.broadcast.emit("set hearth magic wood", magicWood);
    });

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
