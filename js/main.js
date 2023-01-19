const s = document.getElementById("score");

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
            width: window.innerWidth - 20, //make size of canvas relative to screen size, needs to be -20, so it fits to screen without slider
            height: window.innerHeight - 100, //-100 due to score counter above canvas
            backgroundColor: 0xAAAAAA //set color to gray

        }
    );

    document.querySelector("#game").appendChild(app.view); //attach canvas to div with id game

    player = PIXI.Sprite.from('./img/ghost.png'); //loads picture from player

    player.width = window.innerWidth / 22;
    player.height = window.innerHeight / 20
    player.anchor.set(0.5); //center object
    player.x = app.view.width / 2;
    player.y = app.view.height / 2;

    app.stage.addChild(player); //show object on screen

    bullet = PIXI.Sprite.from('./img/projectile.png');
    bullet.width = window.innerWidth / 50;
    bullet.height = window.innerHeight / 50;
    bullet.x = player.x;
    bullet.y = player.y;
    bullet.anchor.set(0.5);

    enemy = PIXI.Sprite.from('./img/e.png');
    enemy.width = window.innerWidth / 30;
    enemy.height = window.innerHeight / 31;
    enemy.anchor.set(0.6);

    //runs these functions on every tick
    app.ticker.add(gameLoop);
    app.ticker.add(move);
    app.ticker.add(enemyMove);

    window.addEventListener("keydown", keysDown);
    window.addEventListener("keyup", keysUp);
    window.addEventListener("pointerdown", fireBullet);

    function keysDown(e){
        keys[e.keyCode] = true; //if key is pressed writes it's keycode into object with value true
    }
    function keysUp(e){
        keys[e.keyCode] = false; //after letting the key rewrite it's value to false
    }

    setInterval(function() {
        if(enemies < max) {
            //generates random x and y coordinates in canvas to spawn enemy
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
        //calculates how far object is from mouse click
        let toX = mouseX - bullet.x;
        let toY = mouseY - bullet.y;

        let Length = Math.sqrt(toX * toX + toY * toY);
        toX = toX / Length;
        toY = toY / Length;

        // Move towards the position of mouseclick
        bullet.x += toX * bSpeed;
        x += toX * bSpeed;
        bullet.y += toY * bSpeed;
        y += toY * bSpeed;

        //console.log(Math.ceil(x), Math.ceil(y), mouseX, mouseY);
        //checks if bullet is near to coordinates of mouse click (in most of the cases it's not perfect so there needs to be cases within small radius)
        if(Math.ceil(x) === mouseX && Math.ceil(y) === mouseY || Math.ceil(x - 1) === mouseX && Math.ceil(y) === mouseY || Math.ceil(x + 1) === mouseX && Math.ceil(y) === mouseY
            || Math.ceil(x) === mouseX && Math.ceil(y + 1) === mouseY || Math.ceil(x) === mouseX && Math.ceil(y - 1) === mouseY || Math.ceil(x - 1) === mouseX && Math.ceil(y - 1) === mouseY){
            bullets = 0;
            app.stage.removeChild(bullet); //remove bullet from screen
        }

    }

    function fireBullet(e){
        if(bullets === 0){ //ensure that player can shoot only one bullet at time

            bullet.x = player.x + 2;
            bullet.y = player.y + 2;

            app.stage.addChild(bullet);
            //paint bullet to screen on player coordinates


            //gets coordinates of mouse
            mouseX = Math.ceil(e.pageX);
            mouseY = Math.ceil(e.pageY);

            x = bullet.x;
            y = bullet.y;

            bullets = 1;
            interact ++;
        }
    }

    function collision(a, b){
        let aBox = a.getBounds(); //create invisible box around objects
        let bBox = b.getBounds();

        //control if aBox collides with bBox at all
        return aBox.x + aBox.width - 12 > bBox.x &&
            aBox.x < bBox.x + bBox.width - 12 &&
            aBox.y + aBox.height - 12 > bBox.y &&
            aBox.y < bBox.y + bBox.height - 12;
    }


    function gameLoop(){
        if(keys["87"] || keys["38"]){   //move player in right direction,   87 == W, 38 == arrow up
            player.y -= speed;
            interact++;
        }
        if(keys["83"] || keys["40"]){ //83 == S, 40 === arrow down
            player.y += speed;
            interact++;
        }
        if(keys["65"] || keys["37"]){ //65 == A, 37 == arrow left
            player.x -= speed;
            interact++;
        }
        if(keys["68"] || keys["39"]){ //68 == D, 39 == arrow right
            player.x += speed;
            interact++;
        }


        if(collision(bullet, enemy) && interact !== 0){ //if bullet collides with enemy
            score++;
            max++; //spawns new enemy
            bullet.x = player.x + 2;
            bullet.y = player.y + 2;
            app.stage.removeChild(bullet); //remove bullet from screen
            bullets = 0;
            s.innerHTML = `SCORE: ${score}`; //renew score counter
        }

        if(collision(player, enemy) && interact !== 0){ //if enemy collides with player, stop all functions from reactivating every tick
            app.ticker.remove(gameLoop);
            app.ticker.remove(enemyMove);
            app.ticker.remove(move);
        }

    }

}
