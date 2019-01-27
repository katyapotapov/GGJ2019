const HOUSE_X = 200;
const HOUSE_Y = 400;
const HOUSE_BLOCKS_LEFT = 10;
const HOUSE_BLOCKS_DOWN = 10;
const HOUSE_DOOR_BLOCK_WALL = DIR_UP;
const HOUSE_DOOR_BLOCK_DIST = 5;

// doorWall: which wall is the door on
// doorDist: how far is the wall from the upper left corner of the wall
function createBuilding(x, y, l, w, doorWall, doorDist) {
    for (let i = 1; i < l; i++) {
        if (doorWall !== DIR_UP || doorDist !== i) {
            createWall(x + 32 * i, y, DIR_UP, 10);
        }
        if (doorWall !== DIR_DOWN || doorDist !== i) {
        createWall(x + 32 * i, y + 32 * w, DIR_DOWN, 10);
        }
    }
    for (let j = 0; j <= w; j++) {
        if (doorWall !== DIR_LEFT || doorDist !== j) {
            createWall(x, y + 32 * j, DIR_LEFT, 10);
        }
        if (doorWall !== DIR_RIGHT || doorDist !== j) {
            createWall(x + 32 * l, y + 32 * j, DIR_RIGHT, 10);
        }
    }
}

function initDefaultBuilding() {
    createBuilding(HOUSE_X, HOUSE_Y, HOUSE_BLOCKS_LEFT, HOUSE_BLOCKS_DOWN,
        HOUSE_DOOR_BLOCK_WALL, HOUSE_DOOR_BLOCK_DIST);
}
