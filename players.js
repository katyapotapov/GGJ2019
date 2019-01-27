const PLAYER_MOVE_SPEED = 6;
const PLAYER_SHOOT_COOLDOWN = 0.3;

const INV_DRAW_POS = {
    x: 100,
    y: 540
};

const INV_DRAW_WIDTH = 600;
const INV_DRAW_HEIGHT = 60;

const INV_ITEM_COLOR = [
    "#ff0000",
    "#00ff00",
    "#0000ff"
];

let myPlayerID = -1;
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
            x: 20,
            y: 32,
            w: 24,
            h: 32
        },
        inventory: {
            selected: 0,
            items: []
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

function getPlayerWithID(id) {
    for(let i = 0; i < players.length; ++i) {
        if(players[i].id == id) {
            return players[i];
        }
    }

    return null;
}

function removePlayer(id) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id === id) {
            removeSprite(players[i].sprite);
            players.splice(i, 1);
        }
    }

    console.log("Couldn't find player to remove ", id);
    //throw "Couldn't find player to remove";
}

function setItemQuantity(playerID, type, quantity) {
    if(host) {
        socket.emit("set item quantity", playerID, type, quantity);
    }

    let player = getPlayerWithID(playerID);

    for(let i = 0; i < player.inventory.items.length; ++i) {
        if(player.inventory.items[i].type == type) {
            if(quantity <= 0) {
                player.inventory.items.splice(i, 1);
                return;
            }

            player.inventory.items[i].quantity = quantity;
            return;
        }
    }

    if(quantity <= 0) {
        return;
    }

    player.inventory.items.push({
        type: type,
        quantity: quantity
    });
}

function addItemToInventory(player, type, quantity) {
    for(let i = 0; i < player.inventory.items.length; ++i) {
        if(player.inventory.items[i].type == type) {
            setItemQuantity(player.id, type, player.inventory.items[i].quantity + quantity);
            return;
        }
    }

    setItemQuantity(player.id, type, quantity);
}

function setSelectedItem(playerID, index) {
    let player = getPlayerWithID(playerID);

    if(index > 9) {
        index = 9;
    }

    if(index < 0) {
        index = 0;
    }

    if(host) {
        socket.emit("set selected item", player.id, index);
    }

    player.inventory.selected = index;
}

function useSelectedItem(player) {
    if(player.inventory.selected >= player.inventory.items.length) {
        if(player.cooldown <= 0) {
            createPunch(player.x, player.y, stringToDirection(player.sprite.curAnimName));
            player.cooldown += PLAYER_SHOOT_COOLDOWN;
        }
        return;
    }

    let item = player.inventory.items[player.inventory.selected];

    if(item.quantity <= 0) {
        return;
    }

    if(item.type == ITEM_GUN) {
        if(player.cooldown <= 0) {
            createBullet(player.x, player.y, DIR_UP);
            player.cooldown += PLAYER_SHOOT_COOLDOWN;
        }
    } else if(item.type == ITEM_WALL) {
        if(player.cooldown <= 0) {
            // TODO: Place buildings
            setItemQuantity(player.id, item.type, item.quantity - 1);
            player.cooldown += PLAYER_SHOOT_COOLDOWN;
        }
    } else if(item.type == ITEM_BOMB) {
        if(player.cooldown <= 0) {
            createBomb(player.x, player.y);
            player.cooldown += PLAYER_SHOOT_COOLDOWN;
            setItemQuantity(player.id, item.type, item.quantity - 1);
        }
    }
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

            if(input.use) {
                useSelectedItem(players[i]);
            }

            setSelectedItem(players[i].id, input.invSelect);

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

function drawInventory() {
    let player = getPlayerWithID(myPlayerID);

    if(!player) {
        return;
    }

    ctx.fillStyle = "#f287c7";
    ctx.fillRect(INV_DRAW_POS.x, INV_DRAW_POS.y, INV_DRAW_WIDTH, INV_DRAW_HEIGHT);

    for(let i = 0; i < player.inventory.items.length; ++i) {
        let item = player.inventory.items[i];

        ctx.fillStyle = INV_ITEM_COLOR[item.type];
        ctx.fillRect(INV_DRAW_POS.x + i * 60, INV_DRAW_POS.y, 60, 60);
    }

    ctx.strokeStyle = "white";
    ctx.strokeRect(INV_DRAW_POS.x + player.inventory.selected * 60, INV_DRAW_POS.y, 60, 60);
}

function playerPickupTouchingItems() {
    if(!host) {
        throw "DO NOT CALL THIS OUTSIDE OF HOST";
    }

    for(let i = 0; i < players.length; ++i) {
        let player = players[i];
        let colItems = getCollidingObjects(player, player.x, player.y, items);

        for(let j = 0; j < colItems.length; ++j) {
            addItemToInventory(player, colItems[j].type, 1);
            removeItem(items.indexOf(colItems[j]));
        }
    }
}

function movePlayers() {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];

        if(player.cooldown > 0) {
            player.cooldown -= SEC_PER_FRAME;
        }

        moveCollide(player, true);
    }
}

function sendPlayers() {
    for(let i = 0; i < players.length; ++i) {
        const player = players[i];

        socket.emit("player state", player.id, player.x, player.y,
            player.sprite ? player.sprite.curAnimName : "up");
    }
}
