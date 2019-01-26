"use strict";

const SWEEP_SAMPLES = 5;

function moveCollide(e, sweep) { 
    function collide(x, y) {
        return collideTileMap(x + e.rect.x, y + e.rect.y, e.rect.w, e.rect.h) ||
               getFirstCollidingObject(e, x, y, walls);
    }

    if(collide(e.x + e.dx, e.y)) {
        if(sweep) {
            let mx = e.dx / SWEEP_SAMPLES;

            for(let i = 0; i < SWEEP_SAMPLES; ++i) { 
                if(collide(e.x + mx, e.y)) {
                    e.dx = 0;
                    break;
                } else {
                    e.x += mx;
                }
            }
        } else {
            e.dx = 0;
        }
    } else {
        e.x += e.dx;
    }

    if(collide(e.x, e.y + e.dy)) {
        if(sweep) {
            let my = e.dy / SWEEP_SAMPLES;

            for(let i = 0; i < SWEEP_SAMPLES; ++i) { 
                if(collide(e.x, e.y + my)) {
                    e.dy = 0;
                    break;
                } else {
                    e.y += my;
                }
            }
        } else {
            e.dy = 0;
        }
    } else {
        e.y += e.dy;
    }
}
