let bombs = [];
let explosions = [];
let bombImage = null;
let explosionImage = null;

function initBombs() {
    loadImage("assets/bomb3.png", function(image) {
        bombImage = image;
    });
}

function initExplosions() {
    loadImage("assets/explosion2.png", function(image) {
        explosionImage = image;
    });
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
    let explosion = {
        x: x,
        y: y
    }

    let index = explosions.length;
    explosions.push(explosion);

    loadImage("assets/explosion.png", function(image) {
        explosion.sprite = createSprite({
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

            onLoop: function(sprite) {
                removeExplosion(sprite.explosionIndex);
            }
        });

        playAnim(explosion.sprite, "explode");

        explosion.sprite.x = x-120;
        explosion.sprite.y = y-94;

        explosion.sprite.explosionIndex = index;
    });

    if(host) {
        socket.emit("create explosion", x, y);
    }

    return explosion;
}

function removeBomb(index) {
    bombs.splice(index, 1);

    if(host) {
        socket.emit("remove bomb", index);
    }
}

function removeExplosion(index) {
    removeSprite(explosions[index].sprite);
    explosions.splice(index, 1);

    if(host) {
        socket.emit("remove explosion", index);
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