const LEFT_KEY = "a";
const RIGHT_KEY = "d";
const UP_KEY = "w";
const DOWN_KEY = "s";
const USE_KEY = "j";

let input = {
    up: false,
    down: false,
    left: false,
    right: false,
    use: false,
    invSelect: 0
};

function setKeyState(key, down) {
    if(key == LEFT_KEY) {
        input.left = down;
    } else if(key == RIGHT_KEY) {
        input.right = down;
    } else if(key == UP_KEY) {
        input.up = down;
    } else if(key == DOWN_KEY) {
        input.down = down;
    } else if(key == USE_KEY) {
        input.use = down;
    } else if(down) {
        if(key == "1") {
            input.invSelect = 0;
        } else if(key == "2") {
            input.invSelect = 1;
        } else if(key == "3") {
            input.invSelect = 2;
        } else if(key == "4") {
            input.invSelect = 3;
        } else if(key == "5") {
            input.invSelect = 4;
        } else if(key == "6") {
            input.invSelect = 5;
        } else if(key == "7") {
            input.invSelect = 6;
        } else if(key == "8") {
            input.invSelect = 7;
        } else if(key == "9") {
            input.invSelect = 8;
        } else if(key == "0") {
            input.invSelect = 9;
        }
    }
}

window.addEventListener("keydown", function(e) {
    setKeyState(e.key, true);
});

window.addEventListener("keyup", function(e) {
    setKeyState(e.key, false);
});

function sendInput() {
    socket.emit("player input", input);
}
