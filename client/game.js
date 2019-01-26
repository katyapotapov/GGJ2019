let camera = {
    x: 0,
    y: 0,
    shake: {
        timer: 0,
        magnitude: 0
    }
};

function shakeCamera(duration, magnitude) {
    camera.shake.timer = duration;
    camera.shake.magnitude = magnitude;
}

function initGame() {
}

function updateGame() {
    if(camera.shake.timer > 0) {
        camera.shake.timer -= SEC_PER_FRAME;
    }

    updatePlayers();
    
    if(host) {
        handleInput(clientID, input);
        sendPlayers();
    } else {
        sendInput();
    }

    updateSprites();
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
    drawSprites(cam);
}
