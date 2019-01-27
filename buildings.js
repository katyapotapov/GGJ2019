const HOUSE_X = 200;
const HOUSE_Y = 400;
const HOUSE_BLOCKS_LEFT = 10;
const HOUSE_BLOCKS_DOWN = 10;
const HOUSE_DOOR_X = 60;
const HOUSE_DOOR_Y = 30;

function createBuilding(x, y, l, w, doorX, doorY) {
    for (let i = 0; i < l; i++) {
        createWall(x + 32 * i, y, DIR_UP, 3);
        createWall(x + 32 * i, y + 32 * w, DIR_DOWN, 3);
    }
    for (let j = 0; j <= w; j++) {
        createWall(x, y + 32 * j, DIR_LEFT, 3);
        createWall(x + 32 * l, y + 32 * j, DIR_RIGHT, 3);
    }
}

function initDefaultBuilding() {
    createBuilding(HOUSE_X, HOUSE_Y, HOUSE_BLOCKS_LEFT, HOUSE_BLOCKS_DOWN,
        HOUSE_DOOR_X, HOUSE_DOOR_Y);
}
