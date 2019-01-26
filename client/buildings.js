function createBuilding(x, y, l, w, doorX, doorY) {
    for (let i = 0; i < l; i++) {
        createWall(x+32*i, y, DIR_UP, 3);
        createWall(x+32*i, y+32*w, DIR_DOWN, 3);
    }
    for (let j = 0; j <= w; j++) {
        createWall(x, y+32*j, DIR_LEFT, 3);
        createWall(x+32*l, y+32*j, DIR_RIGHT, 3);
    }
}

function initDefaultBuilding() {
    createBuilding(200, 400, 10, 10, 60, 30);
}
