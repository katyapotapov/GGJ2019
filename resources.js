let resources = [];
const BROWN_TREE = 1;
const GREEN_TREE = 2;
const ROCK = 3;
const RESOURCE_IMAGES = {
    brownTree: null,
    greenTree: null,
    rock: null,
};
const FORBIDDEN_X = HOUSE_X;
const FORBIDDEN_Y = HOUSE_Y;
const FORBIDDEN_WIDTH = HOUSE_BLOCKS_LEFT * TILE_SIZE;
const FORBIDDEN_HEIGHT = HOUSE_BLOCKS_DOWN * TILE_SIZE;

function initResources() {
    loadImage("assets/browntree.png", function (image) {
        RESOURCE_IMAGES.brownTree = image;
    });
    loadImage("assets/greentree.png", function (image) {
        RESOURCE_IMAGES.greenTree = image;
    });
    loadImage("assets/rock.png", function (image) {
        RESOURCE_IMAGES.rock = image;
    });
}

function initDefaultResources() {
    for (let i = 0; i < 1000; ++i) {
        console.log("Gen resource");
        generateRandResources();
    }
}

function createResource(type, x, y) {
    let setHealth;
    switch (type) {
        case BROWN_TREE:
            setHealth = 4;
            break;
        case GREEN_TREE:
            setHealth = 5;
            break;
        case ROCK:
            setHealth = 6;
            break;
        case DIRT:
            setHealth = 2;
            break;
    }
    let resource = {
        type: type,
        x: x,
        y: y,
        life: setHealth
    };

    resources.push(resource);

    if (host) {
        socket.emit("create resource", type, x, y);
    }
}

function generateRandResources() {
    const mapWidth = tileMap.width * TILE_SIZE;
    const mapHeight = tileMap.height * TILE_SIZE;

    let x = 0;
    let y = 0;
    let type = ROCK;
    let width = 0;
    let height = 0;

    x = randomNumInRange(0, 9);
    if (x < 3) {
        x = randomNumInRange(0, 1);
        if (x == 0) {
            type = GREEN_TREE;
        } else {
            type = BROWN_TREE;
        }
    }
    if (type == ROCK) {
        width = 80;
        height = 65;
    } else {
        width = 120;
        height = 140;
    }

    for (let i = 0; i < 50; i++) {
        let x = randomNumInRange(0, mapWidth);
        let y = randomNumInRange(0, mapHeight);
        console.log(x);
        console.log(y);

        if (x > FORBIDDEN_X && x < (FORBIDDEN_X + FORBIDDEN_WIDTH)) {
            continue;
        }
        if (y > FORBIDDEN_Y && y < (FORBIDDEN_Y + FORBIDDEN_HEIGHT)) {
            continue;
        }
        let objects = getObjectsInRect(x, y, width, height, walls, resources, players);
        if (objects.length != 0) {
            continue;
        }
        createResource(type, x, y);
        console.log(resources);
        return;
    }
}

function removeResource(index) {
    resources.splice(index, 1);
}

//TODO: Add item to players inventory when resource dies
function setResourceLife(index, life) {
    resources[index].life = life;
    if (resources[index].life == 0) {
        removeResource(index);
    }

    if (host) {
        socket.emit("set resource life", index, life);
    }
}

function drawResources(cam) {
    if (!RESOURCE_IMAGES.greenTree || !RESOURCE_IMAGES.brownTree || !RESOURCE_IMAGES.rock) {
        return;
    }
    for (let i = 0; i < resources.length; ++i) {
        let resource = resources[i];
        if (resource.type == BROWN_TREE) {
            ctx.drawImage(RESOURCE_IMAGES.brownTree, resource.x - cam.x, resource.y - cam.y);
        } else if (resource.type == GREEN_TREE) {
            ctx.drawImage(RESOURCE_IMAGES.greenTree, resource.x - cam.x, resource.y - cam.y);
        } else if (resource.type == ROCK) {
            ctx.drawImage(RESOURCE_IMAGES.rock, resource.x - cam.x, resource.y - cam.y);
        }
    }
}
