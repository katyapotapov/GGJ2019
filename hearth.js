const HEARTH = {
    sprite: null,
    x: 0,
    y: 0,
    life: 200,
    rect: {
        x: 0,
        y: 0,
        w: 64,
        h: 64
    }
}

function initHearth(x, y) {
    loadImage("assets/hearth.png", function (image) {
        HEARTH.sprite = createSprite({
            image: image,
            frameWidth: 64,
            frameHeight: 64,

            anims: {
                crackle: {
                    startFrame: 0,
                    length: 5,
                    frameTime: 0.1
                }
            },
        });

        HEARTH.sprite.x = x;
        HEARTH.sprite.y = y;
        HEARTH.x = x;
        HEARTH.y = y;
        playAnim(HEARTH.sprite, "crackle");
    });
}

function setHearthLife(life) {
    HEARTH.life = life;

    if (host) {
        socket.emit("set hearth life", life);
    }

    if (HEARTH.life === 0) {
        removeHearth();
    }
}

function removeHearth() {
    console.log("Homewreckers won :(");
}

function drawHearthLife(cam) {
    if (!HEARTH || !HEARTH.sprite) {
        return;
    }
    let lifeDrawn = Math.floor(HEARTH.life);
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "blue";

    ctx.fillText(
        lifeDrawn,
        HEARTH.x - cam.x + (HEARTH.sprite.info.frameWidth) / 2 - 12,
        HEARTH.y - cam.y + HEARTH.sprite.info.frameHeight - 55); //Added some magic numbers to adjust pos of text
}
