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
}

function updateGame() {
    if(camera.shake.timer > 0) {
        camera.shake.timer -= SEC_PER_FRAME;
    }

    if(host) {
        if(players) {
            // Handle host player's input locally
            handleInput(hostPlayerID, input);
        }
        
        movePlayers();
        updatePlayerSpritePositions();
        updateBullets();

        sendPlayers();
        sendBullets();
    } else {
        sendInput();
        updatePlayerSpritePositions();
    }

    updateSprites();

    ++tickCount;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cam = {
        x: camera.x,
        y: camera.y
    };

    if(camera.shake.timer > 0) {
        cam.x += 2 * (Math.random() - 0.5) * camera.shake.magnitude;
        cam.y += 2 * (Math.random() - 0.5) * camera.shake.magnitude;
    }

    cam.x = Math.floor(cam.x);
    cam.y = Math.floor(cam.y);

    drawTilemap(cam);
    drawBullets(cam);
    drawSprites(cam);
}
