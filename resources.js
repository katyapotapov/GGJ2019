let resources = [];
const BROWN_TREE = 1;
const GREEN_TREE = 2;
const ROCK = 3;
const DIRT = 4;
const RESOURCE_IMAGES = {
    brownTree: null,
    greenTree: null,
    rock: null,
};

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
    resources.push(createResource(BROWN_TREE, 50, 50));
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
        height: setHeight,
        health: setHealth,
    };
    return resource;
}

//TODO: Add item to players inventory when resource dies
function updateResource() {
    for (let i = 0; i < resources.length; ++i) {
        if (resources[i].health == 0) {
            resources.splice(i, 1);
            continue;
        }
    }
}

function drawResources(cam) {
    if (!RESOURCE_IMAGES.greenTree || !RESOURCE_IMAGES.brownTree || !RESOURCE_IMAGES.rock) {
        return;
    }
    for (let i = 0; i < resources.length; ++i) {
        let resource = resources[i];
        if (resource.type == BROWN_TREE) {
            ctx.drawImage(RESOURCE_IMAGES.greenTree, resource.x - cam.x, resource.y - cam.y);
        } else if (resource.type == GREEN_TREE) {

        } else if (resource.type == ROCK) {

        } else if (resource.type == DIRT) {

        }
    }
}
