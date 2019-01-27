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
    initHearth(200, 200);
}

function initHost() {
    initDefaultBuilding();
    initDefaultResources();

    createItem(ITEM_GUN, 800, 300);

    for (let i = 0; i < 20; ++i) {
        createItem(ITEM_BOMB, 1000 + i * 100, 300);
    }
}

function updateGame() {
    if (camera.shake.timer > 0) {
        camera.shake.timer -= SEC_PER_FRAME;
    }

    updateDebugRects();

    if (host) {
        if (players) {
            // Handle host player's input locally
            handleInput(myPlayerID, input);
        }

        movePlayers();
        playerPickupTouchingItems();
        updatePlayerSpritePositions(true);
        updateBullets();
        updateBombs();

        if (tickCount >= 2) {
            sendPlayers();
            sendBullets();
            tickCount = 0;
        }
    } else {
        sendInput();
        predictUpdatePlayer();
        updatePlayerSpritePositions(true);
    }

    updateSprites();

    let myPlayer = getPlayerWithID(myPlayerID);

    if (myPlayer) {
        if (host) {
            if (myPlayer.inventory.items.length == 0) {
                addItemToInventory(myPlayer, ITEM_GUN, 1);
                addItemToInventory(myPlayer, ITEM_BOMB, 100);
            }

            camera.x += (myPlayer.x + myPlayer.rect.x + myPlayer.rect.w / 2 - camera.x - canvas.width / 2) * 0.1;
            camera.y += (myPlayer.y + myPlayer.rect.y + myPlayer.rect.h / 2 - camera.y - canvas.height / 2) * 0.1;
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
    }

    ++tickCount;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    drawBullets(cam);
    drawWalls(cam);
    drawSprites(cam);
    drawResources(cam);
    drawBombs(cam);
    drawItems(cam);
    drawHearthLife(cam);
    drawDebugRects(cam);
    drawPlayerNames(cam);
    drawInventory();
}
