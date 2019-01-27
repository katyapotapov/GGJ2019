function createPunch(x, y, direction) {
    let xPunch, yPunch;
    loadImage("assets/slash3.png", function(image) {
        let sprite = createSprite({
            image: image,
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

        xPunch = x - 50;
        yPunch = y - 50;
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
    });

    if(host) {
        socket.emit("create punch", x, y, direction);

        let objects = getObjectsInRect(xPunch+64, yPunch+64, 32, 32, walls, resources);
        // createDebugRect(xPunch+64, yPunch+64, 32, 32, "black", 2);

        for (let i = 0; i < objects.length; ++i) {
            let obj = objects[i];
            let wallIndex = walls.indexOf(obj);
            let resourceIndex = resources.indexOf(obj);
            if (wallIndex >= 0) {
                console.log("Damaged wall: ", wallIndex);
                setWallLife(wallIndex, obj.life - 1);
                continue;
            } else if (resourceIndex >= 0) {
                console.log("Damaged resource: ", resourceIndex);
                setResourceLife(resourceIndex, obj.life - 1);
                continue;
            }
        }
    }
}
