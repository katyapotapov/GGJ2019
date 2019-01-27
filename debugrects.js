let debugRects = [];

function createDebugRect(x, y, w, h, fill, duration) {
    if(!duration) {
        duration = -1;
    }

    let rect = {
        x: x,
        y: y,
        w: w,
        h: h,
        fill: fill,
        time: duration
    };

    debugRects.push(rect);

    return rect;
}

function removeDebugRect(index) {
    debugRects.splice(index, 1);
}

function updateDebugRects() {
    for(let i = 0; i < debugRects.length; ++i) {
        if(debugRects[i].time > 0) {
            debugRects[i].time -= SEC_PER_FRAME;
            if(debugRects[i].time <= 0) {
                removeDebugRect(i);
            }
        }
    }
}

function drawDebugRects(cam) {
    for(let i = 0; i < debugRects.length; ++i) {
        ctx.fillStyle = debugRects[i].fill;
        ctx.fillRect(debugRects[i].x - cam.x, debugRects[i].y - cam.y, debugRects[i].w, debugRects[i].h);
    }
}
