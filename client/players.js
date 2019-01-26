const PLAYER_MOVE_SPEED = 6;
const PLAYER_SHOOT_COOLDOWN = 1;

let players = [];

function createPlayer(id, x, y) {
    let player = {
        id: id,
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
        },
        cooldown: 0
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
        if (players[i].id === id) {
            removeSprite(players[i].sprite);
            players.splice(i, 1);
        }
    }

    throw "Couldn't find player to remove";
}

function handleInput(id, input) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == id) {
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

            if(input.use && players[i].cooldown <= 0) {
                createBullet(players[i].x, players[i].y, DIR_UP);
                players[i].cooldown += PLAYER_SHOOT_COOLDOWN;
            }

            return;
        }
    }

    throw "Couldn't find player for input";
}

function handlePlayerState(id, x, y, anim) {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];

        if(player.id != id) {
            continue;
        }

        player.x = x;
        player.y = y;

        if(anim) {
            playAnim(player.sprite, anim);
        }
    }
}

function updatePlayerSpritePositions() {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];

        if(player.sprite) {
            player.sprite.x = player.x;
            player.sprite.y = player.y;
        }
    }
}

function movePlayers() {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];

        if(player.cooldown > 0) {
            player.cooldown -= SEC_PER_FRAME;
        }

        moveCollideTileMap(player, true);
    }
}

function sendPlayers() {
    for(let i = 0; i < players.length; ++i) {
        const player = players[i];

        socket.emit("player state", player.id, player.x, player.y, 
            player.sprite ? player.sprite.curAnimName : "up");
    }
}
