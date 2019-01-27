const ITEM_GUN = 0;
const ITEM_BOMB = 1;
const ITEM_WALL = 2;
const ITEM_WOOD = 3;
const ITEM_MAGIC_WOOD = 4;
const ITEM_IMAGES = [null, null, null, null, null];
const MAX_AMT_OF_ITEMS = 20;
const magicWoodDropCounterMin = 0;
const magicWoodDropCounterMax = 3;

let items = [];
let magicWoodDropCounter = 0;

function initItems() {
    loadImage("assets/crossbow.png", function (image) {
        ITEM_IMAGES[ITEM_GUN] = image;
    });

    loadImage("assets/bomb3.png", function (image) {
        ITEM_IMAGES[ITEM_BOMB] = image;
    });

    loadImage("assets/stones.png", function (image) {
        ITEM_IMAGES[ITEM_WALL] = image;
    });

    loadImage("assets/wood.png", function (image) {
        ITEM_IMAGES[ITEM_WOOD] = image;
    });
    loadImage("assets/magicwood.png", function (image) {
        ITEM_IMAGES[ITEM_MAGIC_WOOD] = image;
    });
    magicWoodDropCounter = randomNumInRange(magicWoodDropCounterMin,
        magicWoodDropCounterMin);
}

function createItem(type, x, y) {
    let item = {
        x: x,
        y: y,
        type: type,
        // TODO(Apaar): Set rect based on item type
        rect: {
            x: 0,
            y: 0,
            w: 32,
            h: 32
        }
    };

    if (host) {
        socket.emit("create item", type, x, y);
    }

    items.push(item);
}

function removeItem(index) {
    items.splice(index, 1);

    if (host) {
        socket.emit("remove item", index);
    }
}

function drawItems(cam) {
    for (let i = 0; i < items.length; ++i) {
        let item = items[i];

        if (!ITEM_IMAGES[item.type]) {
            continue;
        }

        ctx.drawImage(ITEM_IMAGES[item.type], item.x - cam.x, item.y - cam.y);
    }
}
