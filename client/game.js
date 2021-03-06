let host = false;

let camera = {
    x: 0,
    y: 0,
    shake: {
        timer: 0,
        magnitude: 0
    }
};

let tickCount = 0;

function shakeCamera(duration, magnitude) {
    camera.shake.timer = duration;
    camera.shake.magnitude = magnitude;
}

function requestHost() {
    if (!host) {
        socket.emit("request host");
    }
}

function initGame() {
    initItems();
    initBullets();
    initWalls();
    initResources();
    initBombs();
    initExplosions();
    initPunch();
    initResources();
    initDefaultHearth();

    setTimeout(function () {
        let server = window.prompt("What server do you want to connect to?", "ws://fathomless-eyrie-61762.herokuapp.com");

        socket = io(server);
        registerSocketCallbacks();
    }, 2000);
}

let generateRandResourcesIntervalID;

function initHost() {
    initDefaultBuilding();
    initDefaultResources();

    generateRandResourcesIntervalID = setInterval(generateRandResources, 10000);
}

function damageObjects(objects, damage) {
    if (!objects) return;
    for (let i = 0; i < objects.length; ++i) {
        let obj = objects[i];

        let wallIndex = walls.indexOf(obj);
        let resourceIndex = wallIndex >= 0 ? -1 : resources.indexOf(obj);
        let playerIndex = (resourceIndex >= 0 || wallIndex >= 0) ? -1 : players.indexOf(obj);
        if (wallIndex >= 0) {
            setWallLife(wallIndex, obj.life - damage);
            continue;
        } else if (resourceIndex >= 0) {
            setResourceLife(resourceIndex, obj.life - damage);
        } else if (playerIndex >= 0) {
            players[playerIndex].life -= damage;
        } else {
            setHearthLife(obj.life - damage);
        }
    }
}

function resetGame() {
    if(!host) throw "ONLY CALL THIS ON HOST YOU DUMMY";

    setHearthLife(HEARTH_START_LIFE);
    setHearthMagicWood(0);

    magicWoodDropCounter = randomNumInRange(magicWoodDropCounterMin,
                                            magicWoodDropCounterMax);

    for(let i = 0; i < players.length; ++i) {
        players[i].life = PLAYER_MAX_LIFE;

        for(let j = 0; j < players[i].inventory.items.length; ++j) {
            setItemQuantity(players[i].id, players[i].inventory.items[j].type, 0);
        }
    }

    for(let i = 0; i < resources.length; ++i) {
        setResourceLife(i, 0, true);
    }

    for(let i = 0; i < items.length; ++i) {
        removeItem(i);
    }

    for(let i = 0; i < bombs.length; ++i) {
        removeBomb(i);
    }

    for(let i = 0; i < bullets.length; ++i) {
        removeBullet(i);
    }

    for(let i = 0; i < walls.length; ++i) {
        setWallLife(i, 0, true);
    }

    socket.emit("reset game");

    clearInterval(generateRandResourcesIntervalID);

    initHost();
}

function updateGame() {
    if (!socket) {
        return;
    }

    if (camera.shake.timer > 0) {
        camera.shake.timer -= SEC_PER_FRAME;
    }

    updateDebugRects();

    let myPlayer = getPlayerWithID(myPlayerID);

    if (host) {
        if (myPlayer && myPlayer.life > 0) {
            // Handle host player's input locally
            handleInput(myPlayerID, input);
        }

        if(HEARTH.magicWood >= 5 || (HEARTH.life <= 0)) {
            if(input.up) {
                resetGame();
            }
        }

        movePlayers();
        playerPickupTouchingItems();
        updatePlayerSpritePositions(true);
        updateBullets();
        updateBombs();

        updateAndSendHearth();

        if (tickCount >= 3) {
            sendPlayers();
            sendBullets();

            tickCount = 0;
        }
    } else {
        bufferInput();
        if (tickCount >= 1) {
            if (myPlayer && myPlayer.life > 0 && (!myPlayer.isProtector || HEARTH.life > 0)) {
                sendInput();
            }
        }

        predictUpdatePlayer();
        updatePlayerSpritePositions(true);
    }

    updateSprites();

    if (myPlayer && myPlayer.life <= 0) {
        if (input.left) {
            camera.x -= 300 * SEC_PER_FRAME;
        }

        if (input.right) {
            camera.x += 300 * SEC_PER_FRAME;
        }

        if (input.up) {
            camera.y -= 300 * SEC_PER_FRAME;
        }

        if (input.down) {
            camera.y += 300 * SEC_PER_FRAME;
        }
    }

    if (myPlayer && myPlayer.life > 0) {
        if (host) {
            camera.x += (myPlayer.x + myPlayer.rect.x + myPlayer.rect.w / 2 - camera.x - canvas.width / 2) * 0.1;
            camera.y += (myPlayer.y + myPlayer.rect.y + myPlayer.rect.h / 2 - camera.y - canvas.height / 2) * 0.1;
        }
    }

    if (camera.x < 0) {
        camera.x = 0;
    }

    if (camera.x >= tileMap.width * TILE_SIZE - canvas.width) {
        camera.x = tileMap.width * TILE_SIZE - canvas.width;
    }

    if (camera.y < 0) {
        camera.y = 0;
    }

    if (camera.y >= tileMap.height * TILE_SIZE - canvas.height) {
        camera.y = tileMap.height * TILE_SIZE - canvas.height;
    }

    ++tickCount;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let myPlayer = getPlayerWithID(myPlayerID);

    if (myPlayer && HEARTH.life <= 0) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let text;

        if (myPlayer.isProtector) {
            text = "THE HEARTH IS NO MORE! YOU LOSE!";
        } else {
            text = "THE HEARTH IS NO MORE! YOU WIN!";
        }

        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, canvas.height / 2);
        return;
    }

    if (myPlayer && HEARTH.magicWood >= 5) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let text;

        if (myPlayer.isProtector) {
            text = "YOU'VE REKINDLED THE HEARTH! YOU WIN!";
        } else {
            text = "THE PROTECTORS HAVE REKINDLED THE HEARTH! YOU LOSE!";
        }

        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, canvas.height / 2);
        return;
    }

    const cam = {
        x: camera.x,
        y: camera.y
    };

    if (camera.shake.timer > 0) {
        cam.x += 2 * (Math.random() - 0.5) * camera.shake.magnitude;
        cam.y += 2 * (Math.random() - 0.5) * camera.shake.magnitude;
    }

    cam.x = Math.floor(cam.x);
    cam.y = Math.floor(cam.y);

    drawTilemap(cam);
    drawWalls(cam);
    drawResources(cam);
    drawItems(cam);
    drawBombs(cam);
    drawBullets(cam);
    drawSprites(cam);
    drawHearthLife(cam);

    drawStatus(cam);
    drawDebugRects(cam);
    drawPlayerNames(cam);
    drawHealth(cam);

    if (myPlayer && myPlayer.life <= 0) {
        drawMinimap();
        return;
    }

    if (myPlayer && !myPlayer.isProtector) {
        drawMinimap();
    }

    drawInventory();

    if (!socket) {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Loading...", canvas.width / 2 - ctx.measureText("Loading...").width / 2, canvas.height / 2);

        return;
    }
}
