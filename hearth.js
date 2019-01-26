HEARTH = {
    sprite: null,
    x: 0,
    y: 0,
    health: 20,
}

function initHearth() {
    loadImage("assets/hearth.png", function (image) {
        HEARTH.sprite = image;
    });
}

function drawHearth() {

}