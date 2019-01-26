let host = false;

let socket = io("ws://localhost:8080");

socket.on("host", function() {
    host = true;
});

socket.on("set player id", function(id) {
    // Declared in players.js
    myPlayerID = id;

    if(host) {
        initDefaultBuilding();
        initDefaultResources();
    }
});

socket.on("player joined", function(id) {
    console.log("Hello " + id);
    createPlayer(id, 300, 300);
    if (host && id != myPlayerID) {
        sendSnapshot();
    }
});

socket.on("player input", handleInput);

socket.on("player state", handlePlayerState);

socket.on("create bullet", createBullet);
socket.on("remove bullet", removeBullet);

socket.on("bullet state", handleBulletState);

socket.on("set item quantity", setItemQuantity);
socket.on("set wall life", setWallLife);
socket.on("create wall", function(x, y, dir, life) {
    if (host) throw "You are the host";
    createWall(x, y, dir, life);
});
socket.on("set selected item", setSelectedItem);

socket.on("create resource", createResource);
socket.on("set resource life", setResourceLife);

socket.on("player left", function(id) {
    removePlayer(id);
    console.log("Goodbye " + id);
});

function sendSnapshot() {
    socket.emit("snapshot", {
        bullets: bullets,
        walls: walls,
        resources: resources
    });
}
