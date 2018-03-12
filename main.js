
// GameBoard code below
var socket = io.connect("http://24.16.255.56:8888");

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

    socket.on("load", function (data) {
        console.log(data)
        gameEngine.entities = [];
        var dataArray = JSON.parse(data.data);
        for(i = 0; i < dataArray.length; i++){
            var dat = dataArray[i];
            var body = new Body(gameEngine, 0, 0, 0);
                    
            body.radius = dat.radius;
            body.color = dat.color;
            body.x = dat.x;
            body.y = dat.y;
            body.startingX = dat.startingX;
            body.startingY = dat.startingY;
            body.timeCreated = dat.timeCreated;
            body.velocity = dat.velocity;

            gameEngine.entities.push(body);
        }
    });

    document.addEventListener("keydown", function (e) {
        console.log("keycode: " + e.keyCode)
        if (e.keyCode == 32) {
            gameEngine.togglePause();
        }

    }, false);

    document.addEventListener("keydown", function (e) {
        console.log("keycode: " + e.keyCode)
        if (e.keyCode == 82) {
            gameEngine.timeElapsed = 0;
            for (var i = 0; i < gameEngine.entities.length; i++) {
                gameEngine.entities[i].x = gameEngine.entities[i].startingX;
                gameEngine.entities[i].y = gameEngine.entities[i].startingY;
                gameEngine.entities[i].velocity.x = 0;
                gameEngine.entities[i].velocity.y = 0;
            }
        }
        if(e.keyCode == 76){
            socket.emit("load", { studentname: "Daniel McBride", statename: "theState" });
        }
        if(e.keyCode == 83){
            var msg = JSON.stringify(gameEngine.entities, (k, v) => {
                console.log("k: " + k);
                console.log(v.constructor.name);
                console.log(v);
                if(v.constructor.name === 'GameEngine'){
                    return undefined;
                }
                return v;
            });
            console.log(msg);
            socket.emit("save", { studentname: "Daniel McBride", statename: "theState", data: msg });
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
