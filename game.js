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

function initGame() {
    initBullets();
    initWalls();
    initResources();
}

function updateGame() {
    if (camera.shake.timer > 0) {
        camera.shake.timer -= SEC_PER_FRAME;
    }

    if (host) {
        if (players) {
            // Handle host player's input locally
            handleInput(myPlayerID, input);
        }

        movePlayers();
        updatePlayerSpritePositions();
        updateBullets();

        if (tickCount == 1) {
            sendPlayers();
            sendBullets();
            tickCount = 0;
        }
    } else {
        if (tickCount == 1) {
            sendInput();
            tickCount = 0;
        }
        updatePlayerSpritePositions();
    }

    updateSprites();

    let myPlayer = getPlayerWithID(myPlayerID);

    if(myPlayer) {
        if(host) {
            if(myPlayer.inventory.items.length == 0) {
                addItem(myPlayer, ITEM_GUN, 1);
                addItem(myPlayer, ITEM_BOMB, 10);
            }
        }

        camera.x += (myPlayer.x + myPlayer.rect.x + myPlayer.rect.w / 2 - camera.x - canvas.width / 2) * 0.1;
        camera.y += (myPlayer.y + myPlayer.rect.y + myPlayer.rect.h / 2 - camera.y - canvas.height / 2) * 0.1;
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
    drawInventory();
}
