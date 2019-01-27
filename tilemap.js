const TILE_SIZE = 32;

const MAIN_LAYER_NAME = "Main";
const OBJECT_LAYER_NAME = "Objects";

const OBJECT_TILESET_NAME = "objects";

const PLAYER_OBJECT_TYPE = "player";

let tileMap = null;

function onTileMapLoaded(name, data) {
    tileMap = data;

    loadImage("assets/" + tileMap.tilesets[0].image, function(image) {
        tileMap.image = image;
    });

    for(let i = 0; i < tileMap.layers.length; ++i) {
        let layer = tileMap.layers[i];

        if(layer.name == MAIN_LAYER_NAME) {
            tileMap.mainLayer = layer;
        } else if(layer.name == OBJECT_LAYER_NAME) {
            tileMap.objectLayer = layer;
        }
    }
    // Cache tilesets
    for(let i = 0; i < tileMap.tilesets.length; ++i) {
        let tileset = tileMap.tilesets[i];

        if(tileset.name == OBJECT_TILESET_NAME) {
            tileMap.objectTileset = tileset;
        }
    }

    // Load the entity information
    for(let i = 0; i < tileMap.objectLayer.objects.length; ++i) {
        let object = tileMap.objectLayer.objects[i];

        if(!object.type) {
            let tile = tileMap.objectTileset.tiles[(object.gid - tileMap.objectTileset.firstgid).toString()];
            object.type = tile.type;
        }
    }
}

function collideTileMap(x, y, w, h) {
    let left = Math.floor(x / TILE_SIZE);
    let right = Math.ceil((x + w) / TILE_SIZE);
    let top = Math.floor(y / TILE_SIZE);
    let bottom = Math.ceil((y + h) / TILE_SIZE);

    if(right < left) {
        let temp = right;
        right = left;
        left = temp;
    }

    if(bottom < top) {
        let temp = bottom;
        bottom = top;
        top = temp;
    }

    for(let yy = top; yy < bottom; ++yy) {
        if(yy < 0) continue;
        if(yy >= tileMap.mainLayer.height) break;

        for(let xx = left; xx < right; ++xx) {
            if(xx < 0) continue;
            if(xx >= tileMap.mainLayer.width) break;

            if(tileMap.mainLayer.data[xx + yy * tileMap.mainLayer.width] == 0) {
                continue;
            }

            return true;
        }
    }

    return false;
}

function drawTilemap(camera) {
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Draw tilemap
    if(tileMap && tileMap.image) {
        for(let layer = 0; layer < tileMap.layers.length; ++layer) {
            if(tileMap.layers[layer].type != "tilelayer") {
                continue;
            }

            for(let y = Math.floor(camera.y / TILE_SIZE); y <= Math.ceil(camera.y / TILE_SIZE) + canvas.height / TILE_SIZE; ++y) {
                if(y < 0 || y >= tileMap.height) {
                    continue;
                }

                for(let x = Math.floor(camera.x / TILE_SIZE); x <= Math.ceil(camera.x / TILE_SIZE) + canvas.width / TILE_SIZE; ++x) {
                    if(x < 0 || x >= tileMap.width) {
                        continue;
                    }

                    let tile = tileMap.layers[layer].data[x + y * tileMap.width];

                    if(tile == 0) {
                        continue;
                    }

                    tile -= 1;

                    const columns = Math.floor(tileMap.image.width / TILE_SIZE);

                    ctx.drawImage(tileMap.image, tile % columns * TILE_SIZE,
                        Math.floor(tile / columns) * TILE_SIZE,
                        TILE_SIZE, TILE_SIZE,
                        x * TILE_SIZE, y * TILE_SIZE,
                        TILE_SIZE, TILE_SIZE);
                }
            }
        }
    }

    ctx.restore();
}
