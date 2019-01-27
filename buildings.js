const TILEMAP_WIDTH = 100*32;
const TILEMAP_HEIGHT = 100*32;

const HOUSE_BLOCKS_LEFT = 10;
const HOUSE_BLOCKS_DOWN = 10;
const HOUSE_X = TILEMAP_WIDTH / 2 - HOUSE_BLOCKS_LEFT * TILE_SIZE / 2;
const HOUSE_Y = TILEMAP_HEIGHT / 2  - HOUSE_BLOCKS_DOWN * TILE_SIZE / 2;
const HOUSE_DOOR_BLOCK_WALL = DIR_UP;
const HOUSE_DOOR_BLOCK_DIST = 5;

// doorWall: which wall is the door on
// doorDist: how far is the wall from the upper left corner of the wall
function createBuilding(x, y, l, w, doorWall, doorDist) {
    for (let i = 1; i < l; i++) {
        if (doorWall !== DIR_UP || doorDist !== i) {
            createWall(x + TILE_SIZE * i, y, DIR_UP, 10);
        }
        if (doorWall !== DIR_DOWN || doorDist !== i) {
        createWall(x + TILE_SIZE * i, y + TILE_SIZE * w, DIR_DOWN, 10);
        }
    }
    for (let j = 0; j <= w; j++) {
        if (doorWall !== DIR_LEFT || doorDist !== j) {
            createWall(x, y + TILE_SIZE * j, DIR_LEFT, 10);
        }
        if (doorWall !== DIR_RIGHT || doorDist !== j) {
            createWall(x + TILE_SIZE * l, y + TILE_SIZE * j, DIR_RIGHT, 10);
        }
    }
}

function initDefaultBuilding() {
    createBuilding(Math.floor(HOUSE_X / TILE_SIZE) * TILE_SIZE, Math.floor(HOUSE_Y / TILE_SIZE) * TILE_SIZE, HOUSE_BLOCKS_LEFT, HOUSE_BLOCKS_DOWN,
        HOUSE_DOOR_BLOCK_WALL, HOUSE_DOOR_BLOCK_DIST);
}
