let loadedImages = {};

function loadImage(filename, callback) {
    if (loadedImages[filename]) {
        callback(loadedImages[filename]);
        return;
    }

    let image = new Image();

    image.onload = function () {
        callback(image);
        loadedImages[filename] = image;
    };

    image.src = filename;
}

function clamp(v, min, max) {
    if (v < min) {
        return min;
    } else if (v > max) {
        return max;
    }

    return v;
}

function collideRects(ax, ay, aw, ah, bx, by, bw, bh) {
    if (aw < 0) {
        ax += aw;
        aw *= -1;
    }

    if (ah < 0) {
        ay += ah;
        ah *= -1;
    }

    if (bw < 0) {
        bx += bw;
        bw *= -1;
    }

    if (bh < 0) {
        by += bh;
        bh *= -1;
    }

    if (ax + aw < bx || bx + bw < ax) return false;
    if (ay + ah < by || by + bh < ay) return false;

    return true;
}

function collideCircles(ax, ay, arad, bx, by, brad) {
    const dx = (bx - ax);
    const dy = (by - ay);

    return dx * dx + dy * dy < (arad + brad) * (arad + brad);
}

function collideRectCircle(ax, ay, aw, ah, bx, by, radius) {
    const cx = ax + aw / 2;
    const cy = ay + ah / 2;

    let dx = (bx - cx);
    let dy = (by - cy);

    // Clamp dx and dy to half extents
    dx = clamp(dx, -aw / 2, aw / 2);
    dy = clamp(dy, -ah / 2, ah / 2);

    const px = cx + dx;
    const py = cy + dy;

    dx = (bx - px);
    dy = (by - py);

    return dx * dx + dy * dy < radius * radius;
}

function getCollidingObjects(object, x, y) {
    let col = [];

    for (let arg = 3; arg < arguments.length; ++arg) {
        let objects = arguments[arg];

        for (let i = 0; i < objects.length; ++i) {
            let obj = objects[i];

            if (obj == object) {
                continue;
            }

            if (collideRects(x + object.rect.x, y + object.rect.y, object.rect.w, object.rect.h,
                obj.x + obj.rect.x, obj.y + obj.rect.y, obj.rect.w, obj.rect.h)) {
                col.push(obj);
            }
        }
    }

    return col;
}

function getObjectsInRect(x, y, w, h) {
    let col = [];

    for (let arg = 3; arg < arguments.length; ++arg) {
        let objects = arguments[arg];

        for (let i = 0; i < objects.length; ++i) {
            let obj = objects[i];

            if (collideRects(x, y, w, h,
                obj.x + obj.rect.x, obj.y + obj.rect.y, obj.rect.w, obj.rect.h)) {
                col.push(obj);
            }
        }
    }

    return col;
}

function getObjectsInCircle(x, y, radius) {
    let col = [];

    for (let arg = 3; arg < arguments.length; ++arg) {
        let objects = arguments[arg];

        for (let i = 0; i < objects.length; ++i) {
            let obj = objects[i];

            if (collideRectCircle(obj.x + obj.rect.x, obj.y + obj.rect.y, obj.rect.w, obj.rect.h,
                x, y, radius)) {
                col.push(obj);
            }
        }
    }

    return col;
}

function randomNumInRange(x, y) {
    return Math.floor(Math.random() * (y - x) + x);
}
