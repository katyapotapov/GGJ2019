let bullets = [];
let bulletImage = null;

function initBullets() {
    loadImage("assets/bullet.png", function(image) {
        bulletImage = image;
    });
}

function createBullet(x, y, direction) {
    let bullet = {
        x: x,
        y: y,
        direction: direction,
        life: 120
    }

    if(host) {
        socket.emit("create bullet", x, y, direction);
    }

    bullets.push(bullet);

    return bullet;
}

function removeBullet(index) {
    bullets.splice(index, 1);

    if(host) {
        socket.emit("remove bullet", index);
    }
}

function handleBulletState(index, x, y) {
    bullets[index].x += (x - bullets[index].x) * 0.4;
    bullets[index].y += (y - bullets[index].y) * 0.4;
}

function updateBullets() { 
    for(let i = 0; i < bullets.length; ++i) {
        if (bullets[i].life == 0){
            removeBullet(i);
        } else {
            if (bullets[i].direction == DIR_LEFT) {
                bullets[i].x -= 1;
            }
            else if (bullets[i].direction == DIR_RIGHT) {
                bullets[i].x += 1;
            }
            else if (bullets[i].direction == DIR_UP) {
                bullets[i].y -= 1;
            }
            else if (bullets[i].direction == DIR_DOWN) {
                bullets[i].y += 1;
            }

            bullets[i].life -=1;
        }
    }
}

function drawBullets(cam) {
    for(let i = 0; i < bullets.length; ++i) {
        let bullet = bullets[i];
        ctx.drawImage(bulletImage, bullet.x - cam.x, bullet.y - cam.y);
    }
}

function sendBullets() {
    for(let i = 0; i < bullets.length; ++i) {
        socket.emit("bullet state", i, bullets[i].x, bullets[i].y);
    }
}
