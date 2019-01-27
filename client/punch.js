let slashImage = null;

function initPunch() {
    loadImage("assets/slash3.png", function(image) {
        slashImage = image;
    });
}

function createPunch(x, y, direction) {
    let sprite = createSprite({
        image: slashImage,
        frameWidth: 177,
        frameHeight: 139,

        anims: {
            slash: {
                startFrame: 0,
                length: 5,
                frameTime: 0.05
            }
        },

        onLoop: removeSprite
    });

    playAnim(sprite, "slash");

    let xPunch = x - 50;
    let yPunch = y - 50;
    if (direction === DIR_DOWN) {
        yPunch += 32;
    } else if (direction === DIR_UP) {
        yPunch -= 32;
    } else if (direction === DIR_LEFT) {
        xPunch -= 32;
    } else if (direction === DIR_RIGHT) {
        xPunch += 32;
    } else {
        throw "Direction is invalid";
    }

    sprite.x = xPunch;
    sprite.y = yPunch;

    if(host) {
        socket.emit("create punch", x, y, direction);

        let objects = getObjectsInRect(xPunch+64, yPunch+64, 32, 32, walls, resources, [HEARTH], players);
        // createDebugRect(xPunch+64, yPunch+64, 32, 32, "black", 2);
        damageObjects(objects, 1);
    }
}