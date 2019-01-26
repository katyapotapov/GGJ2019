const PLAYER_MOVE_SPEED = 6;
const PLAYER_SHOOT_COOLDOWN = 0.4;

const PLAYER_GUN_OFFSET = {
    x: 85,
    y: 36
};
const PLAYER_GUN_OFFSET_FLIPPED = {
    x: 34,
    y: 36
};

const CAMERA_SPEED_FACTOR = 0.1;

let player = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    rect: {
        x: 16,
        y: 32,
        w: 32,
        h: 32
    },
    cooldownTimer: 0
};

function initPlayer(x, y) {
    player.x = x;
    player.y = y;

    loadImage("assets/rick.png", function(image) {
        player.sprite = createSprite({
            image: image,
            frameWidth: 64,
            frameHeight: 64,

            anims: {
                up: {
                    startFrame: 1,
                    length: 8,
                    frameTime: 0.1
                },
                left: {
                    startFrame: 10,
                    length: 8,
                    frameTime: 0.1
                },
                down: {
                    startFrame: 19,
                    length: 8,
                    frameTime: 0.1
                },
                right: {
                    startFrame: 28,
                    length: 8,
                    frameTime: 0.1
                }
            }
        });

        playAnim(player.sprite, "down");
    });
}

function updatePlayer() {
    if(input.left) {
        player.dx = -PLAYER_MOVE_SPEED;
        playAnim(player.sprite, "left");
    } else if(input.right) {
        player.dx = PLAYER_MOVE_SPEED;
        playAnim(player.sprite, "right");
    } else {
        player.dx = 0;
    }

    if(input.up) {
        player.dy = -PLAYER_MOVE_SPEED;
        playAnim(player.sprite, "up");
    } else if(input.down) {
        player.dy = PLAYER_MOVE_SPEED;
        playAnim(player.sprite, "down");
    } else {
        player.dy = 0;
    }

    if(player.cooldownTimer > 0) {
        player.cooldownTimer -= SEC_PER_FRAME;
    }

    function shoot(color) {
        if(player.cooldownTimer > 0) {
            return;
        }

        const offset = player.sprite.flip ? PLAYER_GUN_OFFSET_FLIPPED : PLAYER_GUN_OFFSET;

        createWave(player.x + offset.x, player.y + offset.y, player.sprite.flip ? -1 : 1, color);
        player.cooldownTimer += PLAYER_SHOOT_COOLDOWN;
    }

    let playerRect = player.rect;

    moveCollideTileMap(player, true);

    if(player.sprite) {
        player.sprite.x = player.x;
        player.sprite.y = player.y;
    }

    let cx = player.x - canvas.width / 2 + playerRect.x + playerRect.w / 2
    let cy = player.y - canvas.height / 2 + playerRect.y + playerRect.h / 2;

    camera.x += (cx - camera.x) * CAMERA_SPEED_FACTOR;
    camera.y += (cy - camera.y) * CAMERA_SPEED_FACTOR;
}

function debugDrawPlayer(camera) {  
    if(!player.sprite) {
        return;
    }

    const offset = player.sprite.flip ? PLAYER_GUN_OFFSET_FLIPPED : PLAYER_GUN_OFFSET;

    ctx.fillStyle = "red";
    //ctx.fillRect(player.x + offset.x - camera.x, player.y + offset.y - camera.y, 4, 4);  
    //ctx.fillRect(player.x + player.rect.x - camera.x, player.y + player.rect.y - camera.y, player.rect.w, player.rect.h);
}
