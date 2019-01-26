let resources = [];
const TREE = 2;
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
    switch (type) {
        case TREE:
            setHealth = 4;
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

function drawResoures() {
    for (let i = 0; i < resources.length; ++i) {
        ctx.drawImage(10, 10, 90, 100);
    }
}