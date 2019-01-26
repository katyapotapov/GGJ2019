let host = false;
let clientID = 0;

function handleMessage(message) {
    if(message.init) {
        host = message.host;
        clientID = message.clientID;
    }

    if(message.player) {
        createPlayer(message.clientID, 100, 100);
    }

    if(host) {
        if(message.input) {
            handleInput(message.clientID, message.input);
        }
    } else {
        if(message.playerPos) {
            setPlayerPos(message.clientID, message.playerPos.x, message.playerPos.y);
        }
    }
}
