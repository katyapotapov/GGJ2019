let bombs = [];
let explosions = [];
let bombImage = null;
let explosionImage = null;

function initBombs() {
    loadImage("assets/bomb2.png", function(image) {
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
        y: y,
        timer: 60
    }

    if(host) {
        socket.emit("create explosion", x, y);
    }

    explosions.push(explosion);

    return explosion;
}

function removeBomb(index) {
    bombs.splice(index, 1);

    if(host) {
        socket.emit("remove bomb", index);
    }
}

function removeExplosion(index) {
    explosions.splice(index, 1);

    if(host) {
        socket.emit("remove explosion", index);
    }
}

function updateBombs() { 
    for(let i = 0; i < bombs.length; ++i) {
        if (bombs[i].timer == 0){
            removeBomb(i);
            createExplosion(bombs[i].x,bombs[i].y);
        } 
        bombs[i].timer -= 1;
    }
}

function updateExplosions() { 
    for(let i = 0; i < explosions.length; ++i) {
        if (explosions[i].timer == 0){
            removeExplosion(i);
        } 
        explosions[i].timer -= 1;
    }
}


function drawBombs(cam) {
    for(let i = 0; i < bombs.length; ++i) {
        let bomb = bombs[i];
        ctx.drawImage(bombImage, bomb.x - cam.x, bomb.y - cam.y);
    }
}

function drawExplosions(cam) {
    for(let i = 0; i < explosions.length; ++i) {
        let explosion = explosions[i];
        ctx.drawImage(explosionImage, explosion.x - cam.x, explosion.y - cam.y);
    }
}


