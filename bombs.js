let bombs = [];
let bombImage = null;

function initBombs() {
    loadImage("assets/bomb3.png", function(image) {
        bombImage = image;
    });
}

function initExplosions() {
}

function createBomb(x, y) {
    let bomb = {
        x: x,
        y: y,
        timer: 120
    }

    if(host) {
        socket.emit("create bomb", x, y);
    }

    bombs.push(bomb);

    return bomb;
}

function createExplosion(x, y) {
    loadImage("assets/explosion.png", function(image) {
        let sprite = createSprite({
            image: image,
            frameWidth: 240,
            frameHeight: 188,

            anims: {
                explode: {
                    startFrame: 0,
                    length: 9,
                    frameTime: 0.05
                }
            },

            onLoop: removeSprite
        });

        playAnim(sprite, "explode");

        sprite.x = x-120;
        sprite.y = y-94;
    });

    if(host) {
        socket.emit("create explosion", x, y);

        let objects = getObjectsInCircle(x, y, 120, walls, resources, [HEARTH]);

        for(let i = 0; i < objects.length; ++i) {
            let obj = objects[i];

            let wallIndex = walls.indexOf(obj);
            let resourceIndex = resources.indexOf(obj);
            if(wallIndex >= 0) {
                setWallLife(wallIndex, obj.life - 1);
                continue;
            } else if (resourceIndex >= 0) {
                setResourceLife(resourceIndex, obj.life - 1);
            } else {
                setHearthLife(obj.life - 1);
            }
        }
    }
}

function removeBomb(index) {
    bombs.splice(index, 1);

    if(host) {
        socket.emit("remove bomb", index);
    }
}

function updateBombs() {
    for(let i = 0; i < bombs.length; ++i) {
        if (bombs[i].timer == 0){
            createExplosion(bombs[i].x,bombs[i].y);
            removeBomb(i);
        } else {
            bombs[i].timer -= 1;
        }
    }
}

function drawBombs(cam) {
    if (!bombImage){ return; }
    for(let i = 0; i < bombs.length; ++i) {
        let bomb = bombs[i];
        ctx.drawImage(bombImage, bomb.x - cam.x, bomb.y - cam.y);
    }
}
