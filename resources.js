let resources = [];
const MAX_AMT_OF_RESOURCES = 100;
const TREE = 1;
const ROCK = 2;
const RESOURCE_IMAGES = {
    tree: null,
    rock: null,
};
const FORBIDDEN_X = HOUSE_X;
const FORBIDDEN_Y = HOUSE_Y;
const FORBIDDEN_WIDTH = HOUSE_BLOCKS_LEFT * TILE_SIZE;
const FORBIDDEN_HEIGHT = HOUSE_BLOCKS_DOWN * TILE_SIZE;

function initResources() {
    loadImage("assets/greentree.png", function (image) {
        RESOURCE_IMAGES.tree = image;
    });
    loadImage("assets/rock.png", function (image) {
        RESOURCE_IMAGES.rock = image;
    });
}

function initDefaultResources() {
    for (let i = 0; i < 100; ++i) {
        generateRandResources();
    }
}

function createResource(type, x, y) {
    let setHealth;
    let setrect;
    switch (type) {
        case TREE:
            setHealth = 5;
            setrect = {
                x: 0,
                y: 0,
                w: RESOURCE_IMAGES.tree.width,
                h: RESOURCE_IMAGES.tree.height
            };
            break;
        case ROCK:
            setHealth = 6;
            setrect = {
                x: 0,
                y: 0,
                w: RESOURCE_IMAGES.rock.width,
                h: RESOURCE_IMAGES.rock.height
            };
            break;

    }
    let resource = {
        type: type,
        x: x,
        y: y,
        life: setHealth,
        rect: setrect
    };


    resources.push(resource);

    if (host) {
        socket.emit("create resource", type, x, y);
    }
}

function generateRandResources() {
    if (resources.length >= MAX_AMT_OF_RESOURCES) {
        return;
    }
    const mapWidth = tileMap.width * TILE_SIZE - 100;
    const mapHeight = tileMap.height * TILE_SIZE - 100;

    let x = 0;
    let y = 0;
    let type = ROCK;
    let width = 0;
    let height = 0;

    x = randomNumInRange(0, 9);
    if (x < 3) {
        type = TREE;
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

        if (x > FORBIDDEN_X && x < (FORBIDDEN_X + FORBIDDEN_WIDTH)) {
            if (y > FORBIDDEN_Y && y < (FORBIDDEN_Y + FORBIDDEN_HEIGHT)) {
                continue;
            }
        }

        let objects = getObjectsInRect(x, y, width, height, walls, resources, players, items);
        if (objects.length != 0) {
            continue;
        }
        createResource(type, x, y);
        return;
    }
}

function removeResource(index) {
    if (host) {
        if (resources[index].type == TREE) {
            if (magicWoodDropCounter <= 0) {
                createItem(ITEM_MAGIC_WOOD, resources[index].x + resources[index].rect.w / 2,
                    resources[index].y + resources[index].rect.h / 2);
                magicWoodDropCounter = randomNumInRange(magicWoodDropCounterMin,
                    magicWoodDropCounterMax);
            } else {
                createItem(ITEM_WOOD, resources[index].x + resources[index].rect.w / 2,
                    resources[index].y + resources[index].rect.h / 2);
                magicWoodDropCounter--;
            }
        } else {
            createItem(ITEM_WALL, resources[index].x + resources[index].rect.w / 2, resources[index].y + resources[index].rect.h / 2);
        }
    }

    resources.splice(index, 1);
}

//TODO: Add item to players inventory when resource dies
function setResourceLife(index, life) {
    resources[index].life = life;
    if (resources[index].life <= 0) {
        removeResource(index);
    }

    if (host) {
        socket.emit("set resource life", index, life);
    }
}

function drawResources(cam) {
    if (!RESOURCE_IMAGES.tree || !RESOURCE_IMAGES.rock) {
        return;
    }
    for (let i = 0; i < resources.length; ++i) {
        let resource = resources[i];
        if (resource.type == TREE) {
            ctx.drawImage(RESOURCE_IMAGES.tree, resource.x - cam.x, resource.y - cam.y);
        } else if (resource.type == ROCK) {
            ctx.drawImage(RESOURCE_IMAGES.rock, resource.x - cam.x, resource.y - cam.y);
        }
    }
}
