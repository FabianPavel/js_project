let app;
let player;
let bullet;
let enemy;

let keys = {};
let bullets = 0;
let mouseX;
let mouseY;
let speed = 2;
let x;
let y;
let enemies = 0;
let max = 1;
let score = 0;
let interact = 0;
let eSpeed = 1.8;
let bSpeed = 2.2;

window.onload = function () {
    app = new PIXI.Application(
        {
            width: window.innerWidth - 20,
            height: window.innerHeight - 100,
            backgroundColor: 0xAAAAAA

        }
    );

    document.querySelector("#game").appendChild(app.view);
    player = PIXI.Sprite.from('../img/ghost.png');
    player.width = window.innerWidth / 20;
    player.height = window.innerHeight / 18;
    player.anchor.set(0.5);
    player.x = app.view.width / 2;
    player.y = app.view.height / 2;

    app.stage.addChild(player);

    bullet = PIXI.Sprite.from('../img/ball.png');
    bullet.width = window.innerWidth / 50;
    bullet.height = window.innerHeight / 50;
    bullet.x = player.x;
    bullet.y = player.y
    bullet.anchor.set(0.5);

    enemy = PIXI.Sprite.from('../img/e.png');
    enemy.width = window.innerWidth / 25;
    enemy.height = window.innerHeight / 26;
    enemy.anchor.set(0.6);

    app.ticker.add(gameLoop);
    app.ticker.add(move);
    app.ticker.add(enemyMove);

    window.addEventListener("keydown", keysDown);
    window.addEventListener("keyup", keysUp);
    window.addEventListener("pointerdown", fireBullet);

    function keysDown(e){
        keys[e.keyCode] = true;
    }
    function keysUp(e){
        keys[e.keyCode] = false;
    }

    setInterval(function() {
        if(enemies < max) {
            enemy.x = Math.floor(Math.random() * app.view.width);
            enemy.y = Math.floor(Math.random() * app.view.height);

            app.stage.addChild(enemy);

            enemies++;
        }
    }, 400);


    function enemyMove(){
        let X = player.x - enemy.x;
        let Y = player.y - enemy.y;

        // Normalize
        let Length = Math.sqrt(X * X + Y * Y);
        X = X / Length;
        Y = Y / Length;

        // Move towards the player
        enemy.x += X * eSpeed;
        enemy.y += Y * eSpeed;


    }

    function move(){
        let toX = mouseX - bullet.x;
        let toY = mouseY - bullet.y;

        // Normalize
        let Length = Math.sqrt(toX * toX + toY * toY);
        toX = toX / Length;
        toY = toY / Length;

        // Move towards the player
        bullet.x += toX * bSpeed;
        x += toX * bSpeed;
        bullet.y += toY * bSpeed;
        y += toY * bSpeed;

        //console.log(Math.ceil(x), Math.ceil(y), mouseX, mouseY);
        if(Math.ceil(x) === mouseX && Math.ceil(y) === mouseY || Math.ceil(x - 1) === mouseX && Math.ceil(y) === mouseY || Math.ceil(x + 1) === mouseX && Math.ceil(y) === mouseY
            || Math.ceil(x) === mouseX && Math.ceil(y + 1) === mouseY || Math.ceil(x) === mouseX && Math.ceil(y - 1) === mouseY || Math.ceil(x - 1) === mouseX && Math.ceil(y - 1) === mouseY){
            bullets = 0;
            app.stage.removeChild(bullet);
        }

    }

    function fireBullet(e){
        if(bullets === 0){

            bullet.x = player.x + 2;
            bullet.y = player.y + 2;

            app.stage.addChild(bullet);

            mouseX = Math.ceil(e.pageX);
            mouseY = Math.ceil(e.pageY);

            x = bullet.x;
            y = bullet.y;

            bullets = 1;
            interact ++;
        }
    }

    function collision(a, b){
        let aBox = a.getBounds();
        let bBox = b.getBounds();

        return aBox.x + aBox.width - 15 > bBox.x &&
            aBox.x < bBox.x + bBox.width - 15 &&
            aBox.y + aBox.height - 15 > bBox.y &&
            aBox.y < bBox.y + bBox.height - 15;
    }


    function gameLoop(){
        if(keys["87"] || keys["38"]){
            player.y -= speed;
            interact++;
        }
        if(keys["83"] || keys["40"]){
            player.y += speed;
            interact++;
        }
        if(keys["65"] || keys["37"]){
            player.x -= speed;
            interact++;
        }
        if(keys["68"] || keys["39"]){
            player.x += speed;
            interact++;
        }


        if(collision(bullet, enemy) && interact !== 0){
            score++;
            console.log(score);
            max++;
            bullet.x = player.x + 2;
            bullet.y = player.y + 2;
            app.stage.removeChild(bullet);
            bullets = 0;
        }

        if(collision(player, enemy) && interact !== 0){
            app.ticker.remove(gameLoop);
            app.ticker.remove(enemyMove);
            app.ticker.remove(move);
        }

    }

}
