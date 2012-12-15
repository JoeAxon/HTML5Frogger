var tileSize = 32;
var player = new vec2(7, 14);
var poffset = new vec2(0,0);
var canvasName = "froggerCanvas";
var lives = 3;
var houses = { 0:false, 1:false, 2:false, 3:false, 4:false };
var gameSeconds = 50;
var vehicles = new Array();

function vec2(x, y) {
	this.x = x;
	this.y = y;
}

var Colors = {
	Water : "#333375",
	Road  : "#000"
}

var GameState = {
	Playing  : 0,
	Paused   : 2,
	GameOver : 1,
	Won      : 3
};
var state = GameState.Playing;

function vehicle(image, pos, velocity, size) {
	this.image = image;
	this.pos = pos;
	this.velocity = velocity;
	this.size = size;
	this.tick = vehicleTick;
	this.draw = vehicleDraw;
	this.collides = vehicleCollidesWith;
}

function vehicleTick(delta) {
	this.pos.x += this.velocity.x * delta;
	this.pos.y += this.velocity.y * delta;
	if (this.collides()) {
		lives--;
		resetPlayer();
	}
	
	if (this.velocity.x < 0) {
		if (this.pos.x < -this.size) {
			this.pos.x = 448;
		}
	} else {
		if (this.pos.x > 448) {
			this.pos.x = -this.size;
		}
	}
}

function vehicleCollidesWith() {
	if (player.y == this.pos.y) {
		if (player.x * tileSize + poffset.x < this.pos.x + tileSize) {
			if (this.pos.x < player.x * tileSize + poffset.x + tileSize) {
				return true;
			}
		}
	}
}

function vehicleDraw() {
	context.drawImage(this.image, this.pos.x, this.pos.y * tileSize, this.size, tileSize);
}

// main entry point
function froggerOnLoad() {
	canvas = document.getElementById(canvasName);
	context = canvas.getContext("2d");
	
	var sources = {
		grass : "purple-grass.png",
		h1 : "house1.png",
		h2 : "house2.png",
		h3 : "house3.png",
		h4 : "house4.png",
		h5 : "house5.png",
		h6 : "house6.png",
		frog : "frog.png",
		turtle : "turtle.png",
		l1 : "log1.png",
		l2 : "log2.png",
		l3 : "log3.png",
		pinkcar : "pink-car.png",
		whitecar : "white-car.png",
		greencar : "green-car.png",
		yellowcar : "yellow-car.png",
		lorry : "lorry.png",
	};
	
	loadImages(sources, begin);
}

// Game loop
window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();
	  
document.onkeydown = keyhandler;

var keyup = false;
var keydown = false;
var keyleft = false;
var keyright = false;
var keyesc = false;

function keyhandler(e) {
	if (e.keyCode == 38) {
		keyup = true;
	}
	if (e.keyCode == 40) {
		keydown = true;
	}
	if (e.keyCode == 37) {
		keyleft = true;
	}
	if (e.keyCode == 39) {
		keyright = true;
	}
	if (e.keyCode == 27) {
		keyesc = true;
	}
}

function keyreset() {
	keyup = false;
	keydown = false;
	keyleft = false;
	keyright = false;
	keyesc = false;
}

// TODO: Revise level format
var level = 
	[
	// top of frog house
	["h1",0,1],["h2",1,1],["h3",2,1],["h1",3,1],["h2",4,1],["h3",5,1],["h1",6,1],["h2",7,1],["h3",8,1],["h1",9,1],["h2",10,1],["h3",11,1],["h1",12,1],["h2",13,1],
	// bottome of frog house
	["h4",0,2],["h5",1,2],["h6",2,2],["h4",3,2],["h5",4,2],["h6",5,2],["h4",6,2],["h5",7,2],["h6",8,2],["h4",9,2],["h5",10,2],["h6",11,2],["h4",12,2],["h5",13,2],
	// purple strip
	["grass",0,8],["grass",1,8],["grass",2,8],["grass",3,8],["grass",4,8],["grass",5,8],["grass",6,8],["grass",7,8],["grass",8,8],["grass",9,8],["grass",10,8], ["grass",11,8],["grass",12,8],["grass",13,8],
	// purple strip
	["grass",0,14],["grass",1,14],["grass",2,14],["grass",3,14],["grass",4,14],["grass",5,14],["grass",6,14],["grass",7,14],["grass",8,14],["grass",9,14],["grass",10,14], ["grass",11,14],["grass",12,14],["grass",13,14]
	]
;

function begin(images) {
	imageAssets = images;
	// Set up entities
	turtle = new movingEntity(-6, -128);
	log1 =   new movingEntity(3, 192);
	log2 =   new movingEntity(7, 192);
	
	var pSpeed = new vec2(-5, 0);
	vehicles.push(new vehicle(imageAssets.pinkcar, new vec2(44,  11), pSpeed, 32));
	vehicles.push(new vehicle(imageAssets.pinkcar, new vec2(108, 11), pSpeed, 32));
	vehicles.push(new vehicle(imageAssets.pinkcar, new vec2(236, 11), pSpeed, 32));
	vehicles.push(new vehicle(imageAssets.pinkcar, new vec2(300, 11), pSpeed, 32));
	vehicles.push(new vehicle(imageAssets.pinkcar, new vec2(428, 11), pSpeed, 32));
	
	var wSpeed = new vec2(5, 0);
	vehicles.push(new vehicle(imageAssets.whitecar, new vec2(44,  10), wSpeed, 32));
	vehicles.push(new vehicle(imageAssets.whitecar, new vec2(300,  10), wSpeed, 32));
	
	var gSpeed = new vec2(8, 0);
	vehicles.push(new vehicle(imageAssets.greencar, new vec2(44,  12), gSpeed, 32));
	
	var ySpeed = new vec2(15, 0);
	vehicles.push(new vehicle(imageAssets.yellowcar, new vec2(44,  13), ySpeed, 32));
	
	var lSpeed = new vec2(-3, 0);
	vehicles.push(new vehicle(imageAssets.lorry, new vec2(44,  9), lSpeed, 54));
	vehicles.push(new vehicle(imageAssets.lorry, new vec2(300,  9), lSpeed, 54));
	
	// Enter the game loop
	time = gameSeconds * 10;
	gameLoop(0);
}

function movingEntity(speed, resetBound) {
	this.speed = speed;
	this.resetBound = resetBound;
	this.offset = new vec2(0,0);
	this.tick = movingEntityTick;
}

function movingEntityTick(delta) {
	this.offset.x += delta * this.speed;
	if (this.speed < 0) {
		if (this.offset.x < this.resetBound) {
			this.offset.x = 0;
		}
	} else {
		if (this.offset.x > this.resetBound) {
			this.offset.x = 0;
		}
	}
}

function resetGame() {
	resetPlayer();
	lives = 3;
	time = gameSeconds * 10;
}

function resetPlayer() {
	player = new vec2(7, 14);
	poffset = new vec2(0,0);
}

function gameLoop(delta) {
	previousTick = new Date();
	
	switch (state) {
		case GameState.Start:
			resetGame();
			state = GameState.Playing;
			break;
		case GameState.Playing:
			doPlayingState(delta);
			break;
		case GameState.Paused:
			doPausedState(delta);
			break;
		case GameState.GameOver:
			doGameOverState(delta);
			break;
	}
	
	requestAnimFrame(function() {
		var newDate = new Date();
		gameLoop((newDate.getTime() - previousTick.getTime()) / 100);
	});
}

function doPausedState(delta) {
	context.fillStyle = '#9C9898';
	context.font = '32px Courier';
	context.textBaseline = 'top';
	context.fillText('Paused', 0, 0);
	if (keyesc) {
		state = GameState.Playing;
	}
	
	keyreset();
}

function doPlayingState(delta) {
	this.time-= delta;
	drawLevel();
	drawPlayer();
	drawTime();
	
	// Update
	turtle.tick(delta);
	log1.tick(delta);
	log2.tick(delta);
	for (i = 0; i < vehicles.length; i++) {
		vehicles[i].tick(delta);
	}
	
	tickPlayer(delta);
	if (keyesc) {
		state = GameState.Paused;
	}
	if (time < 0) {
		state = GameState.GameOver;
	}
	if (houses[0] && houses[1] && houses[2] && houses[3] && houses[4]) {
		state = GameState.Won;
	}
	keyreset();
}

function doGameOverState(delta) {
	context.fillStyle = "#000";
	context.fillRect(0, 0, 448, 512);
	context.fillStyle = '#9C9898';
	context.font = '64px Courier';
	context.textBaseline = 'top';
	context.fillText('Game Over', 40, 0);
	
	if (keyesc) {
		state = GameState.Start;
	}
	
	keyreset();
}

function drawTime() {
	context.fillStyle = '#9C9898';
	context.font = '32px Courier';
	context.textBaseline = 'top';
	context.fillText(Math.round(time/10), 400, 480);
}

function tickPlayer(delta) {
	// Handle movement on moving entities
	switch (player.y) {
		case 4:
		case 7:
			poffset.x += turtle.speed * delta;
			break;
		case 5:
			poffset.x += log2.speed * delta;
			break;
		case 6:
			poffset.x += log1.speed * delta;
			break;
	}
	// Keep the player.x mostly accurate
	if (poffset.x >= 32) {
		player.x++;
		poffset.x -= 32;
	} else if (poffset.x <= -32) {
		player.x--;
		poffset.x += 32;
	}
	
	// Handle keyboard input
	if(keyup) {
		player.y--;
	}
	if (keydown) {
		player.y++;
	}
	if (keyleft) {
		player.x--;
	}
	if (keyright) {
		player.x++;
	}
	
	// ---- GameOver checks ----
	// -------------------------
	// Horizontal bounding check
	if ((player.x + 1) * tileSize > canvas.width) {
		if (lives == 0) {
			state = GameState.GameOver;
		} else {
			resetPlayer();
			lives--;
		}
	} else if (player.x < 0) {
		if (lives == 0) {
			state = GameState.GameOver;
		} else {
			resetPlayer();
			lives--;
		}
	}
	
	if (player.y == 2)  {
		if (player.x == 0 || player.x == 1) {
			houses[0] = true;
		}
		if (player.x == 3 || player.x == 4) {
			houses[1] = true;
		}
		if (player.x == 6 || player.x == 7) {
			houses[2] = true;
		}
		if (player.x == 9 || player.x == 10) {
			houses[3] = true;
		}
		if (player.x == 12 || player.x == 13) {
			houses[4] = true;
		}
		resetPlayer();
	}
}

function drawPlayer() {
	drawTileOffset(imageAssets.frog, player, poffset);
}

function drawLevel() {
	// Road
	context.fillStyle = Colors.Road;
	context.fillRect(0, 288, 448, 228);
	
	// Water
	context.fillStyle = Colors.Water;
	context.fillRect(0, 0, 448, 256);
	
	for(var tile in level) {
		drawTile(imageAssets[level[tile][0]], new vec2(level[tile][1], level[tile][2]));
	}
	
	var off = new vec2(16, 0);
	for(i = 0; i < 5; i++) {
		if (houses[i]) {
			drawTileOffset(imageAssets.frog, new vec2(i * 3, 2), off);
		}
	}
	
	drawTurtles();
	drawLogs();
	for (i = 0; i < vehicles.length; i++) {
		vehicles[i].draw();
	}
	drawLives();
}

function drawLives() {
	for(i = 0; i < lives; i++) {
		drawTile(imageAssets.frog, new vec2(i, 15));
	}
}

function drawTurtles() {
	for (i = 0; i < 13; i++) {
		drawTileOffset(imageAssets.turtle, new vec2(i + Math.floor(i/3) + 1, 7), turtle.offset);
	}
	for (i = 0; i < 10; i++) {
		drawTileOffset(imageAssets.turtle, new vec2(i + Math.floor(i/2) * 2 - .7, 4), turtle.offset);
	}
}

function drawLogs() {
	// draw logs
	for (i = 0; i < 3; i++) {
		drawTileOffset(imageAssets.l1, new vec2(i * 6 - 3, 6), log1.offset);
		drawTileOffset(imageAssets.l2, new vec2(i * 6 - 2, 6), log1.offset);
		drawTileOffset(imageAssets.l3, new vec2(i * 6 - 1, 6), log1.offset);
	}
	for (i = 0; i < 4; i++) {
		drawTileOffset(imageAssets.l1, new vec2(i * 6 - 5, 5), log2.offset);
		drawTileOffset(imageAssets.l2, new vec2(i * 6 - 4, 5), log2.offset);
		drawTileOffset(imageAssets.l2, new vec2(i * 6 - 3, 5), log2.offset);
		drawTileOffset(imageAssets.l2, new vec2(i * 6 - 2, 5), log2.offset);
		drawTileOffset(imageAssets.l3, new vec2(i * 6 - 1, 5), log2.offset);
	}
}

function drawTileOffset(image, pos, offset) {
	context.drawImage(image, pos.x * tileSize + offset.x, pos.y * tileSize + offset.y);
}

function drawTile(image, pos) {
	context.drawImage(image, pos.x * tileSize, pos.y * tileSize);
}

function loadImages(sources, callback) {
	var images = {};
	var loadedImages = 0;
	var numImages = 0;
	for(var src in sources) { ++numImages; }
	for(var src in sources) {
		images[src] = new Image();
		images[src].onload = function() {
			if (++loadedImages >= numImages) {
				callback(images);
			}
		};
		images[src].src = "img/" + sources[src];
	}
}
