const WebSocket = require("ws");

const wss = new WebSocket.Server({port: 8080});

let connections = [];

function handleDisconnection(ws) {
    const i = connections.indexOf(ws);

    if(i < 0) {
        return;
    }

    connections.splice(i, 1);

    for(let i = 0; i < connections.length; ++i) {
        if(connections[i].readyState != 1) {
            continue;
        } 

        connections[i].send(JSON.stringify({
            clientID: ws.id,
            disconnect: true
        }));
    }

    console.log("Handled disconnect.");
    ws.terminate();  
}

let counter = 0;

wss.on("connection", function(ws) {
    console.log("Connection!");
    let id = counter;
    counter += 1;

    connections.push(ws);
    ws.send(JSON.stringify({
        init: {
            host: id == 0,
            clientID: id
        }
    }));

    ws.id = id;

    for(let i = 0; i < connections.length; i++) {
        if(i == connections.length - 1) {
            for(let k = 0; k < connections.length; k++) {
                connections[i].send(JSON.stringify({
                    clientID: connections[k].id,
                    player: true
                }));
            }
        } else if(connections[i].readyState == 1) {
            connections[i].send(JSON.stringify({
                clientID: ws.id,
                player: true
            }));
        }
    }

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
