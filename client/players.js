const PLAYER_MOVE_SPEED = 4;
const PLAYER_SHOOT_COOLDOWN = 0.3;
const PLAYER_NAMES = ["Brom", "Carac", "Borin", "Ulric", "Merek", "Sadon", "Logan", "Cedric"];
const PLAYER_MAX_LIFE = 30;

const INV_DRAW_POS = {
    x: 100,
    y: 540
};

const ROLE_DRAW_POS = {
    x: 50,
    y: 50
};

const HEALTH_BAR_DRAW_WIDTH = 50;
const HEALTH_BAR_DRAW_HEIGHT = 10;

const INV_DRAW_WIDTH = 600;
const INV_DRAW_HEIGHT = 60;

let myPlayerID = -1;
let role;
let players = [];

function createPlayer(id, x, y, isProtector) {
    let setName = null;

    if (PLAYER_NAMES.length > 0) {
        setName = PLAYER_NAMES[0];
        PLAYER_NAMES.shift();
    } else {
        setName = "ERROR_NO_NAME";
    }

    let player = {
        id: id,
        name: setName,
        x: x,
        y: y,
        dx: 0,
        dy: 0,
        life: PLAYER_MAX_LIFE,
        maxLife: PLAYER_MAX_LIFE,
        sprite: null,
        isProtector: isProtector,
        rect: {
            x: 20,
            y: 32,
            w: 24,
            h: 28
        },
        inventory: {
            selected: 0,
            items: []
        },
        cooldown: 0
    };

    loadImage("assets/rick.png", function (image) {
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
                },
                dead: {
                    startFrame: 36,
                    length: 1,
                    frameTime: 0.1
                }
            }
        });

        playAnim(player.sprite, "down");
    });

    players.push(player);
}

function getSpawnPoint(isProtector, forceInsideHome) {
    if (isProtector && (players.length === 1 || forceInsideHome)) {
        return {
            x: HEARTH_X,
            y: HEARTH_Y - 2 * TILE_SIZE
        };
    } else {
        return {
            x: HEARTH_X + HOUSE_BLOCKS_LEFT * TILE_SIZE + Math.floor(Math.random() * 10 * TILE_SIZE),
            y: HEARTH_Y + HOUSE_BLOCKS_DOWN * TILE_SIZE + Math.floor(Math.random() * 10 * TILE_SIZE)
        };
    }
}

function drawPlayerNames(cam) {
    ctx.font = "15px Arial";
    ctx.fillStyle = "blue";
    for (let i = 0; i < players.length; i++) {
        if (!players[i].sprite) {
            continue;
        }
        let name = players[i].name;
        let nameWidth = ctx.measureText(name).width;
        let center_x = players[i].sprite.x + players[i].sprite.info.frameWidth / 2;
        let x = center_x - (nameWidth / 2);
        let y = players[i].sprite.y - 5;
        ctx.fillText(name, x - cam.x, y - cam.y);
    }
}

function drawHealth(cam) {
    ctx.fillStyle = "red";
    for (let i = 0; i < players.length; i++) {
        if (!players[i].sprite) {
            continue;
        }

        if(players[i].life <= 0) {
            continue;
        }

        let center_x = players[i].sprite.x + players[i].sprite.info.frameWidth / 2;
        let x = center_x - (HEALTH_BAR_DRAW_WIDTH / 2);
        let y = players[i].sprite.y;

        ctx.strokeStyle = "white";
        ctx.strokeRect(x - cam.x, y - cam.y, HEALTH_BAR_DRAW_WIDTH, HEALTH_BAR_DRAW_HEIGHT);
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(x - cam.x, y - cam.y, Math.max(0, HEALTH_BAR_DRAW_WIDTH * (players[i].life / players[i].maxLife)), HEALTH_BAR_DRAW_HEIGHT);
    }
}

function getPlayerWithID(id) {
    for (let i = 0; i < players.length; ++i) {
        if (players[i].id == id) {
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
            return;
        }
    }

    console.log("Couldn't find player to remove ", id);
    //throw "Couldn't find player to remove";
}

function setItemQuantity(playerID, type, quantity) {
    if (host) {
        socket.emit("set item quantity", playerID, type, quantity);
    }

    let player = getPlayerWithID(playerID);

    for (let i = 0; i < player.inventory.items.length; ++i) {
        if (player.inventory.items[i].type == type) {
            if (quantity <= 0) {
                player.inventory.items.splice(i, 1);
                return;
            }

            player.inventory.items[i].quantity = quantity;
            return;
        }
    }

    if (quantity <= 0) {
        return;
    }

    if (host) {
        if (player.inventory.selected == player.inventory.items.length) {
            setSelectedItem(player.id, player.inventory.selected + 1);
        }
    }

    player.inventory.items.push({
        type: type,
        quantity: quantity
    });
}

function addItemToInventory(player, type, quantity) {
    for (let i = 0; i < player.inventory.items.length; ++i) {
        if (player.inventory.items[i].type == type) {
            setItemQuantity(player.id, type, player.inventory.items[i].quantity + quantity);
            return;
        }
    }

    setItemQuantity(player.id, type, quantity);
}

function setSelectedItem(playerID, index) {
    let player = getPlayerWithID(playerID);

    if (index > 9) {
        index = 9;
    }

    if (index < 0) {
        index = 0;
    }

    if (host) {
        socket.emit("set selected item", player.id, index);
    }

    player.inventory.selected = index;
}

function useSelectedItem(player, direction) {
    if (player.inventory.selected >= player.inventory.items.length) {
        if (player.cooldown <= 0) {
            createPunch(player.x, player.y, direction);
            player.cooldown += PLAYER_SHOOT_COOLDOWN;
        }
        return;
    }

    let item = player.inventory.items[player.inventory.selected];
    let player_center_x = player.x + (player.sprite.info.frameWidth) / 2;
    let player_center_y = player.y + (player.sprite.info.frameHeight) / 2;

    if (item.quantity <= 0) {
        return;
    }

    if (item.type == ITEM_GUN) {
        if (player.cooldown <= 0) {
            createBullet(player.x + 26, player.y + 32, player.id, direction);
            player.cooldown += PLAYER_SHOOT_COOLDOWN;
            setItemQuantity(player.id, item.type, item.quantity - 1);
        }
    } else if (item.type == ITEM_WALL) {
        if (player.cooldown <= 0) {
            let x;
            let y;
            if (direction == DIR_UP) {
                x = Math.floor(player_center_x / TILE_SIZE) * TILE_SIZE;
                y = Math.floor((player.y + player.dy) / TILE_SIZE) * TILE_SIZE;
            } else if (direction == DIR_DOWN) {
                x = Math.floor(player_center_x / TILE_SIZE) * TILE_SIZE;
                y = ((Math.floor((player.y + player.dy) + player.sprite.info.frameHeight) / TILE_SIZE) + 1) * TILE_SIZE;
            } else if (direction == DIR_RIGHT) {
                x = (Math.floor((player.x + player.dx) / TILE_SIZE) + 2) * TILE_SIZE;
                y = Math.floor(player_center_y / TILE_SIZE) * TILE_SIZE;
                if (player.x > x - TILE_SIZE - 12) {
                    player.x = x - TILE_SIZE - 12;
                }
            } else if (direction == DIR_LEFT) {
                x = Math.floor((player.x + player.dx) / TILE_SIZE) * TILE_SIZE;
                y = Math.floor(player_center_y / TILE_SIZE) * TILE_SIZE;

                if (player.x < x + 12) {
                    player.x = x + 12;
                }
            }

            let xx = Math.floor(x / TILE_SIZE) * TILE_SIZE;
            let yy = Math.floor(y / TILE_SIZE) * TILE_SIZE;

            if (createWall(xx, yy, direction, WALL_LIFE)) {
                setItemQuantity(player.id, item.type, item.quantity - 1);
                player.cooldown += WALL_PLACE_COOLDOWN;
            }
        }
    } else if (item.type == ITEM_BOMB) {
        if (!bombImage) {
            return;
        }
        if (player.cooldown <= 0) {
            let x = 0;
            let y = 0;
            if (direction == DIR_UP) {
                x = player_center_x - bombImage.width / 2;
                y = player.y - 5;
            } else if (direction == DIR_DOWN) {
                x = player_center_x - bombImage.width / 2;
                y = player.y + (player.sprite.info.frameHeight) - 10;
            } else if (direction == DIR_LEFT) {
                x = player.x;
                y = player_center_y - bombImage.height / 2;
            } else if (direction == DIR_RIGHT) {
                x = player.x + 40;
                y = player_center_y - bombImage.height / 2;
            }

            createBomb(x, y);
            player.cooldown += PLAYER_SHOOT_COOLDOWN;
            setItemQuantity(player.id, item.type, item.quantity - 1);
        }
    } else if (item.type == ITEM_WOOD || item.type == ITEM_MAGIC_WOOD) {
        if (player.cooldown <= 0) {
            if (distanceSquared(player.x, player.y, HEARTH.x, HEARTH.y) < HEARTH_FEED_RADIUS * HEARTH_FEED_RADIUS) {
                console.log("FEEDING THE HEARTH");
                if (item.type == ITEM_WOOD) {
                    setHearthLife(HEARTH.life + 5);
                } else {
                    setHearthLife(HEARTH.life + 10);
                    setHearthMagicWood(HEARTH.magicWood + 1);
                }
                setItemQuantity(player.id, item.type, item.quantity - 1);
                player.cooldown += PLAYER_SHOOT_COOLDOWN;
            }
        }
    }
}

function handleInput(id, input) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == id) {
            if (input.left) {
                players[i].dx = -PLAYER_MOVE_SPEED;
                playAnim(players[i].sprite, "left");
            } else if (input.right) {
                players[i].dx = PLAYER_MOVE_SPEED;
                playAnim(players[i].sprite, "right");
            } else {
                players[i].dx = 0;
            }

            if (input.up) {
                players[i].dy = -PLAYER_MOVE_SPEED;
                playAnim(players[i].sprite, "up");
            } else if (input.down) {
                players[i].dy = PLAYER_MOVE_SPEED;
                playAnim(players[i].sprite, "down");
            } else {
                players[i].dy = 0;
            }

            if (host) {
                if (input.useUp) {
                    useSelectedItem(players[i], DIR_UP);
                } else if (input.useDown) {
                    useSelectedItem(players[i], DIR_DOWN);
                } else if (input.useLeft) {
                    useSelectedItem(players[i], DIR_LEFT);
                } else if (input.useRight) {
                    useSelectedItem(players[i], DIR_RIGHT);
                }

                if (input.invSelect >= 0) {
                    setSelectedItem(players[i].id, input.invSelect);
                }

                players[i].inputSequenceNumber = input.sequenceNumber;
            }

            return;
        }
    }

    throw "Couldn't find player for input";
}

function handlePlayerState(id, x, y, anim, sequenceNumber, name, life) {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];

        if (player.id != id) {
            continue;
        }

        player.life = life;
        player.name = name;

        if (id == myPlayerID) {
            // Client side prediction
            player.x = x;
            player.y = y;

            player.serverSequenceNumber = sequenceNumber;
        } else {
            player.x = x;
            player.y = y;
        }

        playAnim(player.sprite, anim);
    }
}

function predictUpdatePlayer() {
    let player = getPlayerWithID(myPlayerID);

    if (!player || !player.serverSequenceNumber || player.life <= 0) {
        return;
    }

    inputBuffer = inputBuffer.filter(function (input) {
        return input.sequenceNumber >= player.serverSequenceNumber;
    });

    for (let i = 0; i < inputBuffer.length; ++i) {
        handleInput(myPlayerID, inputBuffer[i]);
        moveCollide(player, true);
    }

    inputBuffer.length = 0;

    camera.x += (player.x + player.rect.x + player.rect.w / 2 - camera.x - canvas.width / 2) * 0.1;
    camera.y += (player.y + player.rect.y + player.rect.h / 2 - camera.y - canvas.height / 2) * 0.1;
}

function updatePlayerSpritePositions(interpolate) {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];

        if (player.sprite) {
            if (player.life <= 0) {
                playAnim(player.sprite, "dead");
            }

            if (interpolate) {
                player.sprite.x += (player.x - player.sprite.x) * 0.2;
                player.sprite.y += (player.y - player.sprite.y) * 0.2;
            } else {
                player.sprite.x = player.x;
                player.sprite.y = player.y;
            }
        }
    }
}

function drawInventory() {
    let player = getPlayerWithID(myPlayerID);

    if (!player) {
        return;
    }

    ctx.fillStyle = "#a1a1a1";
    ctx.fillRect(INV_DRAW_POS.x, INV_DRAW_POS.y, INV_DRAW_WIDTH, INV_DRAW_HEIGHT);
    ctx.strokeStyle = "white";
    ctx.strokeRect(INV_DRAW_POS.x + player.inventory.selected * 60, INV_DRAW_POS.y, 60, 60);

    for (let i = 0; i < player.inventory.items.length; ++i) {
        let item = player.inventory.items[i];
        if (!ITEM_IMAGES[item.type]) {
            continue;
        }

        ctx.drawImage(ITEM_IMAGES[item.type], INV_DRAW_POS.x + i * 60 + 14, INV_DRAW_POS.y + 14);

        ctx.font = "10px Arial";
        ctx.fillStyle = "blue";
        let amt = item.quantity.toString();
        let amtWidth = ctx.measureText(amt).width;
        ctx.fillText(amt,
            INV_DRAW_POS.x + i * 60 + 58 - amtWidth,
            INV_DRAW_POS.y + 58,
        );
    }
}

function drawStatus(cam) {
    let player = getPlayerWithID(myPlayerID);

    if (!player) {
        return;
    }

    ctx.font = "20px Monospace";
    let text = player.isProtector ? "Protector" : "Homewrecker";
    let textWidth = ctx.measureText(text).width;
    let textHeight = parseInt(ctx.font);
    let margins = 6;

    ctx.strokeStyle = "white";
    ctx.strokeRect(ROLE_DRAW_POS.x - margins / 2, ROLE_DRAW_POS.y - textHeight - margins / 2, textWidth + margins, textHeight + margins);

    ctx.fillStyle = player.isProtector ? "blue" : "red";
    ctx.fillRect(ROLE_DRAW_POS.x - margins / 2, ROLE_DRAW_POS.y - textHeight - margins / 2, textWidth + margins, textHeight + margins);

    ctx.fillStyle = "white";
    ctx.fillText(
        text,
        ROLE_DRAW_POS.x,
        ROLE_DRAW_POS.y);
}

function playerPickupTouchingItems() {
    if (!host) {
        throw "DO NOT CALL THIS OUTSIDE OF HOST";
    }

    for (let i = 0; i < players.length; ++i) {
        let player = players[i];
        let colItems = getCollidingObjects(player, player.x, player.y, items);

        for (let j = 0; j < colItems.length; ++j) {
            if (colItems[j].type == ITEM_GUN) {
                addItemToInventory(player, colItems[j].type, 30);
                j
            } else {
                addItemToInventory(player, colItems[j].type, 1);
            }

            removeItem(items.indexOf(colItems[j]));
        }
    }
}

function movePlayers() {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];

        if (player.cooldown > 0) {
            player.cooldown -= SEC_PER_FRAME;
        }

        moveCollide(player, true);
    }
}

function sendPlayers() {
    for (let i = 0; i < players.length; ++i) {
        const player = players[i];

        socket.emit("player state", player.id, player.x, player.y,
            player.sprite ? player.sprite.curAnimName : "up",
            player.inputSequenceNumber ? player.inputSequenceNumber : 0,
            player.name, player.life);
    }
}
