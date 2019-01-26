const HEARTH = {
    sprite: null,
    x: 0,
    y: 0,
    health: 20,
}

function initHearth(x, y) {
    loadImage("assets/hearth.png", function (image) {
        HEARTH.sprite = createSprite({
            image: image,
            frameWidth: 64,
            frameHeight: 64,

            anims: {
                crackle: {
                    startFrame: 0,
                    length: 5,
                    frameTime: 0.1
                }
            },
        });

        HEARTH.sprite.x = x;
        HEARTH.sprite.y = y;
        HEARTH.x = x;
        HEARTH.y = y;
        playAnim(HEARTH.sprite, "crackle");
    });
}