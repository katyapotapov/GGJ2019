const BULLET_MOVE_SPEED = 10;

let bullets = [];
let bulletImageLeft = null;
let bulletImageRight = null;
let bulletImageUp = null;
let bulletImageDown = null;

function initBullets() {
    loadImage("assets/bullet_left.png", function(image) {
        bulletImageLeft = image;
    });
    loadImage("assets/bullet_right.png", function(image) {
        bulletImageRight = image;
    });
    loadImage("assets/bullet_up.png", function(image) {
        bulletImageUp = image;
    });
    loadImage("assets/bullet_down.png", function(image) {
        bulletImageDown = image;
    });
}

function createBullet(x, y, direction) {
    let w, h;

    let bullet = {
        x: x,
        y: y,
        dx: 0,
        dy: 0,
        direction: direction,
        life: 120,
        rect: {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        }
    };

    if (direction === DIR_UP) {
        bullet.rect.w = 10;
        bullet.rect.h = 13;
        bullet.dy = -BULLET_MOVE_SPEED;
    } else if (direction === DIR_DOWN) {
        bullet.rect.w = 10;
        bullet.rect.h = 13;
        bullet.dy = BULLET_MOVE_SPEED;
    } else if (direction === DIR_LEFT) {
        bullet.rect.w = 13;
        bullet.rect.h = 10;
        bullet.dx = -BULLET_MOVE_SPEED;
    } else if (direction === DIR_RIGHT) {
        bullet.rect.w = 13;
        bullet.rect.h = 10;
        bullet.dx = BULLET_MOVE_SPEED;
    } else {
        throw "Bullet direction not defined correctly";
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
        let bullet = bullets[i];
        if (bullet.life == 0){
            removeBullet(i);
        } else {
            moveCollide(bullet, false, function(objects) {
                if (objects) {
                    for(let i = 0; i < objects.length; ++i) {
                        let obj = objects[i];

                        let wallIndex = walls.indexOf(obj);
                        let resourceIndex = resources.indexOf(obj);
                        if(wallIndex >= 0) {
                            console.log("Damaged wall: ", wallIndex);
                            setWallLife(wallIndex, obj.life - 1);
                            continue;
                        } else if (resourceIndex >= 0) {
                            console.log("Damaged resource: ", resourceIndex);
                            setResourceLife(resourceIndex, obj.life - 1);
                        } else {
                            console.log("Damaged hearth!");
                            setHearthLife(obj.life - 1);
                        }
                    }
                }
                removeBullet(i);
            });

            bullet.life -=1;
        }
    }
}

function drawBullets(cam) {
    for(let i = 0; i < bullets.length; ++i) {
        let bullet = bullets[i];
        if (bullet.direction === DIR_UP) {
            ctx.drawImage(bulletImageUp, bullet.x - cam.x, bullet.y - cam.y);
        } else if (bullet.direction === DIR_DOWN) {
            ctx.drawImage(bulletImageDown, bullet.x - cam.x, bullet.y - cam.y);
        } else if (bullet.direction === DIR_LEFT) {
            ctx.drawImage(bulletImageLeft, bullet.x - cam.x, bullet.y - cam.y);
        } else if (bullet.direction === DIR_RIGHT) {
            ctx.drawImage(bulletImageRight, bullet.x - cam.x, bullet.y - cam.y);
        } else {
            throw "Couldn't match bullet to direction";
        }
    }
}

function sendBullets() {
    for(let i = 0; i < bullets.length; ++i) {
        socket.emit("bullet state", i, bullets[i].x, bullets[i].y);
    }
}
