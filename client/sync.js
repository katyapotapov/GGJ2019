let host = false;
let hostPlayerID = -1;

let socket = io("ws://63ff3bc7.ngrok.io");

socket.on("host", function(id) {
    host = true;
    hostPlayerID = id;
});

socket.on("player joined", function(id) {
    console.log("Hello " + id);
    createPlayer(id, 300, 300);
});

socket.on("player input", handleInput);

socket.on("player state", handlePlayerState);

socket.on("player left", function(id) {
    removePlayer(id);
    console.log("Goodbye " + id);
});
