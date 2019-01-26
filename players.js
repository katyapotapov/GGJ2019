const PLAYER_MOVE_SPEED = 6;
let players = [];

function createPlayer(id, x, y) {
    let player = {
        clientID: id,
        x: x,
        y: y,
        dx: 0,
        dy: 0,
        sprite: null,
        rect: {
            x: 16,
            y: 32,
            w: 32,
            h: 32
        }
    };

    loadImage("assets/rick.png", function(image) {
        player.sprite = createSprite({
            image: image,
            frameWidth: 64,
            frameHeight: 64,

            anims: {
                up: {
                    startFrame: 1,
                    length: 8,
                    frameTime: 0.1
                },
                left: {
                    startFrame: 10,
                    length: 8,
                    frameTime: 0.1
                },
                down: {
                    startFrame: 19,
                    length: 8,
                    frameTime: 0.1
                },
                right: {
                    startFrame: 28,
                    length: 8,
                    frameTime: 0.1
                }
            }
        });

        playAnim(player.sprite, "down");
    });

    players.push(player);
}

function removePlayer(id) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].clientID === id) {
            players.splice(i, 1);
        }
    }
    throw "Couldn't find player to remove";
}

function handleInput(id, input) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].clientID == id) {
            if(input.left) {
                players[i].dx = -PLAYER_MOVE_SPEED;
                playAnim(players[i].sprite, "left");
            } else if(input.right) {
                players[i].dx = PLAYER_MOVE_SPEED;
                playAnim(players[i].sprite, "right");
            } else {
                players[i].dx = 0;
            }

            if(input.up) {
                players[i].dy = -PLAYER_MOVE_SPEED;
                playAnim(players[i].sprite, "up");
            } else if(input.down) {
                players[i].dy = PLAYER_MOVE_SPEED;
                playAnim(players[i].sprite, "down");
            } else {
                players[i].dy = 0;
            }
        }
    }
}

function handlePlayerState(id, state) {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];

        if(player.clientID == id) {
            player.x = state.x;
            player.y = state.y;
            playAnim(player.sprite, state.anim);
        }
    }
}

function updatePlayers() {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];

        if(host) {
            moveCollideTileMap(player, true);
        }

        if(player.sprite) {
            player.sprite.x = player.x;
            player.sprite.y = player.y;
        }
    }
}

function sendPlayers() {
    for (let i = 0; i < players.length; i++) {
        const message = {
            clientID: players[i].clientID,
            playerState: {
                x: players[i].x,
                y: players[i].y,
                anim: players[i].sprite.curAnimName
            }
        };
        sendMessage(message);
    }
}
