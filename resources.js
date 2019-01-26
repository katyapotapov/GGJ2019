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
}

function createResource(type) {
    let setHealth;
    let setWidth;
    let setHeight;
    switch (type) {
        case BROWN_TREE:
            setHealth = 4;
            setWidth = 100;
            setHeight = 100;
            break;
        case GREEN_TREE:
            setHealth = 5;
            setWidth = 100;
            setHeight = 100;
            break;
        case ROCK:
            setHealth = 6;
            setWidth = 100;
            setHeight = 100;
            break;
        case DIRT:
            setHealth = 2;
            setWidth = 100;
            setHeight = 100;
            break;
    }
    let resource = {
        type: type,
        x: x,
        y: y,
        width: setWidth,
        height: setHeight,
        health: setHealth
    };
}

//TODO: Add item to players inventory when resource dies
function updateResource() {
    for (let i = 0; i < resources.length; ++i) {
        if (resources[i].health == 0) {
            resources.splice(i, 1);
            continue;
        }
        resources[i].health--;
    }
}

function drawResoures(cam) {
    for (let i = 0; i < resources.length; ++i) {
        let resource = resources[i];
        if (resource.type == BROWN_TREE) {
            ctx.drawImage(RESOURCE_IMAGES.greenTree, resource.x - cam.x, resource.y - cam.y, resource.height, resource.width);
        } else if (resource.type == GREEN_TREE) {

        } else if (resource.type == ROCK) {

        } else if (resource.type == DIRT) {

        }
    }
}
