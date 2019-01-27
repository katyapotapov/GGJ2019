const MINIMAP_X = 600;
const MINIMAP_Y = 0;
const MINIMAP_WIDTH = 200;
const MINIMAP_HEIGHT = 200;

function drawMinimap() {
    if(!tileMap) {
        return;
    }

    const MIP_WIDTH = MINIMAP_WIDTH / tileMap.width;
    const MIP_HEIGHT = MINIMAP_HEIGHT / tileMap.height;

    ctx.fillStyle = "darkgreen";
    ctx.fillRect(MINIMAP_X, MINIMAP_Y, MINIMAP_WIDTH, MINIMAP_HEIGHT);

    ctx.fillStyle = "white";
    for(let y = 0; y < tileMap.height; ++y) {
        for(let x = 0; x < tileMap.width; ++x) {
            if(tileMap.mainLayer.data[x + y * tileMap.width] > 0) {
                ctx.fillRect(x * MIP_WIDTH + MINIMAP_X, y * MIP_HEIGHT + MINIMAP_Y, MIP_WIDTH, MIP_HEIGHT);
            }
        }
    }

    ctx.fillStyle = "gray";
    for(let i = 0; i < walls.length; ++i) {
        let wallX = Math.floor(walls[i].x / TILE_SIZE) * MIP_WIDTH + MINIMAP_X;
        let wallY = Math.floor(walls[i].y / TILE_SIZE) * MIP_HEIGHT + MINIMAP_Y;

        ctx.fillRect(wallX, wallY, MIP_WIDTH, MIP_HEIGHT);
    }

    for(let i = 0; i < players.length; ++i) {
        let player = players[i];

        if(player.isProtector) {
            ctx.fillStyle = "blue";
        } else {
            ctx.fillStyle = "red";
        }
        
        ctx.fillRect((players[i].x / (tileMap.width * TILE_SIZE)) * MINIMAP_WIDTH + MINIMAP_X,
                     (players[i].y / (tileMap.height * TILE_SIZE)) * MINIMAP_HEIGHT + MINIMAP_Y,
                     MIP_WIDTH * 2, MIP_HEIGHT * 2);
    }

    ctx.fillStyle = "yellow";
    ctx.fillRect((HEARTH.x / (tileMap.width * TILE_SIZE)) * MINIMAP_WIDTH + MINIMAP_X,
                 (HEARTH.y / (tileMap.height * TILE_SIZE)) * MINIMAP_HEIGHT + MINIMAP_Y,
                 MIP_WIDTH * 2, MIP_HEIGHT * 2);
}
