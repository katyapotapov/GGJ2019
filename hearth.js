const HEARTH_FEED_RADIUS = 64;
const HEARTH_LOSS_PER_SEC = 1 / 2;
const HEARTH_START_LIFE = 500;

const HEARTH_X = Math.floor((HOUSE_X + HOUSE_BLOCKS_LEFT * TILE_SIZE / 2) / TILE_SIZE) * TILE_SIZE;
const HEARTH_Y = Math.floor((HOUSE_Y + HOUSE_BLOCKS_DOWN * TILE_SIZE / 2) / TILE_SIZE) * TILE_SIZE;

const HEARTH = {
    sprite: null,
    x: 0,
    y: 0,
    life: HEARTH_START_LIFE,
    magicWood: 0,
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

function initDefaultHearth() {
    initHearth(HEARTH_X, HEARTH_Y);
}

function setHearthLife(life) {
    if (HEARTH.life > 0) {
        HEARTH.life = life;
    }

    if (host) {
        socket.emit("set hearth life", life);
    }

    if (HEARTH.life <= 0) {
        removeHearth();
    }
}

function setHearthMagicWood(amount) {
    if (HEARTH.magicWood >= 0) {
        HEARTH.magicWood = amount;
    }

    if (host) {
        socket.emit("set hearth magic wood", amount);
    }
}

function removeHearth() {
}

function updateAndSendHearth() {
    let life = HEARTH.life;

    if (life > 0) {
        life -= HEARTH_LOSS_PER_SEC * SEC_PER_FRAME;

        if (Math.ceil(life) != Math.ceil(HEARTH.life)) {
            // We only send this message when the hearth changes a significant digit
            setHearthLife(life);
        } else {
            HEARTH.life = life;
        }
    }
}

function drawHearthLife(cam) {
    if (!HEARTH || !HEARTH.sprite) {
        return;
    }
    let lifeDrawn = Math.ceil(HEARTH.life);
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "blue";

    ctx.fillText(
        lifeDrawn,
        HEARTH.x - cam.x + (HEARTH.sprite.info.frameWidth) / 2 - 12,
        HEARTH.y - cam.y + HEARTH.sprite.info.frameHeight - 55
    ); //Added some magic numbers to adjust pos of text
    ctx.fillStyle = "purple";
    ctx.fillText(
        HEARTH.magicWood,
        HEARTH.x - cam.x + (HEARTH.sprite.info.frameWidth) / 2 - 5,
        HEARTH.y - cam.y + HEARTH.sprite.info.frameHeight + 30
    ); //Added some magic numbers to adjust pos of text
}
