const DIR_UP = 0;
const DIR_DOWN = 1;
const DIR_LEFT = 2;
const DIR_RIGHT = 3;

function stringToDirection(string) {
    if (string === "down") {
        return DIR_DOWN;
    } else if (string === "up") {
        return DIR_UP;
    } else if (string === "left") {
        return DIR_LEFT;
    } else if (string === "right") {
        return DIR_RIGHT;
    } else {
        throw `No match for direction string ${string}`;
    }
}

