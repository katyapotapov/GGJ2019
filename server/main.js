const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080});

function handleDisconnection(ws) {
        console.log("Handled disconnect.");
        ws.terminate();  
}

function sendSimpleMessage(ws, message) {
    ws.send(message);
    console.log(`Sent simple message: ${message}`);
}

function sendError(ws, data, message) {
    if(!data) {
        data = { request: "UNKNOWN" };
    }

    if(message.stack && message.message) {
        console.log("Sending error: " + message.message + "\n" + message.stack);
        ws.send(JSON.stringify({ request: data.request, error: message.message }));
    } else {
        ws.send(JSON.stringify({ request: data.request, error: message }));
        console.log("Sending simple error: " + message);
    }
}

wss.on("connection", function(ws, request) {
    ws.isAlive = true;
    sendSimpleMessage(ws, "i am alive");

    ws.on("error", function(err) {
        handleDisconnection(ws);
    });

    ws.on("pong", function() {
        ws.isAlive = true;
    });

    ws.on("message", function(message) {
        let data;

        try {
            data = JSON.parse(message);

            for(let handler in handlers) {
                if(data.request == handler) {
                    try {
                        handlers[handler](ws, data);
                    } catch(e) {
                        sendError(ws, data, e);
                    }
                }
            }
        } catch(e) {
            console.log(e);
            sendError(ws, null, "Invalid JSON");
        }        
    });
});