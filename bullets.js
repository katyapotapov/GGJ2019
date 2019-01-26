let bullets = [];
let bulletImage = 

function initBullets(){}

function createBullet(x,y,direction){
    let bullet = {
        x: x,
        y: y,
        direction: direction,
        life:120
    }
}

function updateBullet(){
    for(let i = 0; i < bullets.length; ++i) {
        if (bullets[i].life == 0){
            bullets.splice(i,1);
        } else {
            if (bullets[i].direction = 'Left') {
                bullets[i].x -= 1;
            }
            else if (bullets[i].direction = 'Right') {
                bullets[i].x += 1;
            }
            else if (bullets[i].direction = 'Up') {
                bullets[i].y += 1;
            }
            else if (bullets[i].direction = 'Down') {
                bullets[i].y -= 1;
            }
            bullets[i].life -=1;
        }
    }
}


function drawBullets(){
    for(let i = 0; i < bullets.length; ++i) {
        ctx.drawImage(bulletImage,)
    }
}
