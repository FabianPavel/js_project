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
let max = 2;

window.onload = function () {
    app = new PIXI.Application(
        {
            width: window.innerWidth - 20,
            height: window.innerHeight - 20,
            backgroundColor: 0xAAAAAA

        }
    );

    document.body.appendChild(app.view);

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
    bullet.anchor.set(0.5);

    enemy = PIXI.Sprite.from('../img/e.png');
    enemy.width = window.innerWidth / 20;
    enemy.height = window.innerHeight / 20;
    enemy.anchor.set(0.5);

    app.ticker.add(gameLoop);
    app.ticker.add(move);
    app.ticker.add(enemyMove);ý

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
        enemy.x += X * speed;
        enemy.y += Y * speed;


    }

    function move(){
        let toX = mouseX - bullet.x;
        let toY = mouseY - bullet.y;

        // Normalize
        let Length = Math.sqrt(toX * toX + toY * toY);
        toX = toX / Length;
        toY = toY / Length;

        // Move towards the player
        bullet.x += toX * speed;
        x += toX * speed;
        bullet.y += toY * speed;
        y += toY * speed;

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
        }
    }

    function gameLoop(){
        if(keys["87"] || keys["38"]){
            player.y -= 2;
        }
        if(keys["83"] || keys["40"]){
            player.y += 2;
        }
        if(keys["65"] || keys["37"]){
            player.x -= 2;
        }
        if(keys["68"] || keys["39"]){
            player.x += 2;
        }


    }

}