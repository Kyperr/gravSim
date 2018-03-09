
// GameBoard code below

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 200;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');


    var gameEngine = new GameEngine();
    gameEngine.init(ctx);

    document.addEventListener("keydown", function (e) {
        console.log("keycode: " + e.keyCode)
        if (e.keyCode == 32) {
            gameEngine.togglePause();
        }

    }, false);

    document.addEventListener("keydown", function (e) {
        console.log("keycode: " + e.keyCode)
        if (e.keyCode == 82) {
            for (var i = 0; i < gameEngine.entities.length; i++) {
                gameEngine.entities[i].x = gameEngine.entities[i].startingX;
                gameEngine.entities[i].y = gameEngine.entities[i].startingY;
                gameEngine.entities[i].velocity.x = 0;
                gameEngine.entities[i].velocity.y = 0;
            }
        }

    }, false);

    canvas.addEventListener("mousedown", function (e) {
        gameEngine.beingCreated = new Body(gameEngine, 2, e.offsetX, e.offsetY);
        gameEngine.creating = true;
    }, false);

    canvas.addEventListener("mousemove", function (e) {
        if(gameEngine.creating){
            gameEngine.beingCreated.x = e.offsetX;
            gameEngine.beingCreated.y = e.offsetY;
            gameEngine.beingCreated.startingX = e.offsetX;
            gameEngine.beingCreated.startingY = e.offsetY;
        }
    });

    canvas.addEventListener("mouseup", function (e) {
        gameEngine.creating = false;
    }, false);

    var rad1 = 2;
    for (var i = 0; i < 0; i++) {
        (() => {
            var x = rad1 + Math.random() * (800 - rad1 * 2);
            var y = rad1 + Math.random() * (800 - rad1 * 2)
            var body = new Body(gameEngine, rad1, x, y);
            gameEngine.addEntity(body);
        })();
    }

    var rad2 = 10;
    for (var i = 0; i < 0; i++) {
        (() => {
            var x = rad2 + Math.random() * (800 - rad2 * 2);
            var y = rad2 + Math.random() * (800 - rad2 * 2)
            var body = new Body(gameEngine, rad2, x, y);
            gameEngine.addEntity(body);
        })();
    }

    gameEngine.start();
});
