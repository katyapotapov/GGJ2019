var ws = new WebSocket("ws://localhost:8080");

ws.onmessage = function(e) {
    console.log(e.data);
}

