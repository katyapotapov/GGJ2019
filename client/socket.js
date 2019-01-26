let ws = new WebSocket("ws://localhost:8080");

ws.onmessage = function(e) {
    handleMessage(JSON.parse(e.data));
}
