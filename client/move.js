"use strict";

const SWEEP_SAMPLES = 5;

function moveCollide(e, sweep, callback) {
    function collide(x, y) {
        if(collideTileMap(x + e.rect.x, y + e.rect.y, e.rect.w, e.rect.h)) {
            return true;
        }

        let objects = getCollidingObjects(e, x, y, walls, resources, [HEARTH], players);

        if (objects.length === 1 && objects[0].id && (objects[0].id === e.ownerID)) {
            return false;
        }

        if(objects.length > 0) {
            return objects;
        }

        return false;
    }

    let res = collide(e.x + e.dx, e.y);

    if(res) {
        if(sweep) {
            let mx = e.dx / SWEEP_SAMPLES;

            for(let i = 0; i < SWEEP_SAMPLES; ++i) {
                res = collide(e.x + mx, e.y);

                if(res) {
                    if(callback) {
                        if(res instanceof Array) {
                            callback(res);
                        } else {
                            callback();
                        }
                    }

                    e.dx = 0;
                    break;
                } else {
                    e.x += mx;
                }
            }
        } else {
            e.dx = 0;
            if(callback) {
                if(res instanceof Array) {
                    callback(res);
                } else {
                    callback();
                }
            }
        }
    } else {
        e.x += e.dx;
    }

    res = collide(e.x, e.y + e.dy);

    if(res) {
        if(sweep) {
            let my = e.dy / SWEEP_SAMPLES;

            for(let i = 0; i < SWEEP_SAMPLES; ++i) {
                res = collide(e.x, e.y + my);

                if(res) {
                    if(callback) {
                        if(res instanceof Array) {
                            callback(res);
                        } else {
                            callback();
                        }
                    }

                    e.dy = 0;
                    break;
                } else {
                    e.y += my;
                }
            }
        } else {
            e.dy = 0;

            if(callback) {
                if(res instanceof Array) {
                    callback(res);
                } else {
                    callback();
                }
            }
        }
    } else {
        e.y += e.dy;
    }
}
