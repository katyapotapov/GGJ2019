let ws = new WebSocket("ws://localhost:8080");

ws.onmessage = function(e) {
    handleMessage(JSON.parse(e.data));
}

function sendMessage(message) {
    if(ws.readyState != 1) {
        return;
    }

    ws.send(JSON.stringify(message));
}
