let host = false;
let clientID = 0;

function handleMessage(message) {
    if(message.init) {
        host = message.init.host;
        clientID = message.init.clientID;
    }

    if(message.player) {
        createPlayer(message.clientID, 300, 300);
    }

    if(message.disconnect) {
        removePlayer(message.clientID);
    }

    if(host) {
        if(message.input) {
            handleInput(message.clientID, message.input);
        }
    } else {
        if(message.playerState) {
            handlePlayerState(message.clientID, message.playerState);
        }
    }
}
