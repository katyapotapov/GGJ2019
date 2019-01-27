function createPunch(x, y) {
    loadImage("assets/slash3.png", function(image) {
        let sprite = createSprite({
            image: image,
            frameWidth: 177,
            frameHeight: 139,

            anims: {
                slash: {
                    startFrame: 0,
                    length: 5,
                    frameTime: 0.05
                }
            },

            onLoop: removeSprite
        });

        playAnim(sprite, "slash");

        sprite.x = x;
        sprite.y = y;
    });

    if(host) {
        socket.emit("create punch", x, y);   
    }
}
