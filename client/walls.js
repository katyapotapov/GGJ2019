let walls = [];
let wallImage01 = null;

function initWalls() {
    loadImage("assets/wall01.png", function(image) {
        wallImage01 = image;
    });
}

function createWall(x, y, direction, life) {
    let wall = {
        x: x,
        y: y,
        direction: direction,
        life: 3,
        rect: {
            x: 0,
            y: 0,
            w: 32,
            h: 32
        }
    }

    if(host) {
        socket.emit("create wall", x, y, direction, life);
    }

    walls.push(wall);

    return wall;
}

function removeWall(index) {
    walls.splice(index, 1);
}

function setWallLife(index, life) {
    walls[index].life = life;
    if (walls[index].life === 0) {
        removeWall(index);
    }

    if(host) {
        socket.emit("set wall life", index, life)
    }
}

function drawWalls(cam) {
    for(let i = 0; i < walls.length; ++i) {
        let wall = walls[i];
        ctx.drawImage(wallImage01, wall.x - cam.x, wall.y - cam.y);
    }
}

function sendWalls() {
    for(let i = 0; i < walls.length; ++i) {
        socket.emit("wall state", i, walls[i].life);
    }
}

