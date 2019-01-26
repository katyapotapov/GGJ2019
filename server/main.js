const WebSocket = require("ws");

const wss = new WebSocket.Server({port: 8080});

let connections = [];

function handleDisconnection(ws) {
    const i = connections.indexOf(ws);

    if(i < 0) {
        return;
    }

    connections.splice(i, 1);

    console.log("Handled disconnect.");
    ws.terminate();  
}

wss.on("connection", function(ws) {
    console.log("Connection!");

    ws.isAlive = true;

    ws.on("error", function(err) {
        handleDisconnection(ws);
    });

    ws.on("pong", function() {
        ws.isAlive = true;
    });

    ws.on("message", function(message) {
        try {
            for(let i = 0; i < connections.length; ++i) {
                // Forward all messages to everyone else
                if(connections[i] != ws) {
                    connections[i].send(message);
                }
            }
        } catch(e) {
            console.log(e);
        }        
    });
});
