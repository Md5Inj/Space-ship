const CANVASW = document.documentElement.clientWidth;
const CANVASH = document.documentElement.clientHeight;
const CANVAS_BG = 'black';
const LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40, SPACE = 32, KEYBOARD_P = 80;

const DROP_H = 20;
const DROP_W = 10;
let DROP_SPEED = 20;

const SHIP_W = 170;
const SHIP_H = 150;
let SHIP_SPEED = 10;

const BULLET_W = 40, BULLET_H = 25;

const EMENY_W = 170;
const ENEMY_H = 150;

const BOOM_W = EMENY_W + 20;
const BOOM_H = ENEMY_H + 20;

const HEART_H = 100;
const HEART_W = 100;

const HUMAN_W = 40;
const HUMAN_H = 100;

let canvas, ctx;
let drops = [];

let ship;
let shipX = 0, shipY = 0;

let bullet;
let bulletX = 0, bulletY = 0;

let enemy;
let enemyX = CANVASW + ENEMY_H;
let enemyY = CANVASH/2 - ENEMY_H/2;

let enemies = [];
let enemySpeed = 0;
let nowEnemies = 0; 
let enemiesHighSpeed = 20;

let boom;

let Score = 0;
let lastScore = 0;
let lastEnemy = -1;

let lives = 3;
let heart;

let human;
let humanX = 50, humanY = 50;
let showHuman = 1;

let left = false, right = false, up = false, down = false, space = false, p = false;

let end = false;
let pause = false;

window.addEventListener('load', () => {
	init();
	draw();
}, false);

function init()
{
	canvas = document.getElementById('cnv');
	ctx = canvas.getContext('2d');
	canvas.width = CANVASW;
	canvas.height = CANVASH;
	canvas.style.background = CANVAS_BG;

	let startX = 10, startY = 10;
	for (let i = 0; i < 300; i++) 
	{
		drops[i] = { x: startX, y: startY, w: DROP_W, h: DROP_H };
		startX = Math.floor(Math.random() * CANVASW);
		startY = Math.floor(Math.random() * CANVASH);
	}

	ship = new Image();
	ship.src = './img/ship';

	bullet = new Image();
	bullet.src = './img/laser.png';

	enemy = new Image();
	enemy.src = './img/enemy.png';

	boom = new Image();
	boom.src = './img/boom';

	heart = new Image();
	heart.src = './img/heart.png';

	human = new Image();
	human.src = './img/kosm.png';

	let y = 0;
	let x = 0;
	for (let i = 0; i < 3; i++) {
		y = Math.floor(Math.random() * CANVASH) - ENEMY_H;
		enemySpeed = Math.floor(Math.random() * enemiesHighSpeed) + 5;
		x = (CANVASW + ENEMY_H);
		if (y < 0) y += ENEMY_H;
		enemies.push({img: new Image(), x: x,  y: y, status: 1, speed: enemySpeed});
		enemies[enemies.length-1].img.src = "./img/enemy.png";
		nowEnemies++;
	}

	document.addEventListener('keydown', (e) => {
		if (e.keyCode == LEFT)
		{
			left = true;
		}
		else if (e.keyCode == RIGHT)
		{
			right = true;
		} 
		else if (e.keyCode == UP)
		{
			up = true;
		}
		else if (e.keyCode == DOWN)
		{
			down = true;
		}
		else if (e.keyCode == SPACE)
		{
			space = true;
		} 
		else if (e.keyCode == KEYBOARD_P)
		{
			if (pause)
			{
				pause = false;
				DROP_SPEED = 20;
			}
			else
			{
				p = true;
				pause = true;
			}
		}
		checkLives();
	}, false);

	document.addEventListener('keyup', (e) => {
		if (e.keyCode == LEFT)
		{
			left = false;
		}
		else if (e.keyCode == RIGHT)
		{
			right = false;
		} 
		else if (e.keyCode == UP)
		{
			up = false;
		}
		else if (e.keyCode == DOWN)
		{
			down = false;
		}
		else if (e.keyCode == SPACE)
		{
			space = false;
		}
		else if (e.keyCode == KEYBOARD_P)
		{
			p = false;
		}
	}, false);

	humanX = Math.floor(Math.random() * CANVASW / 4) + HUMAN_W;
	humanY = Math.floor(Math.random() * CANVASH) - HUMAN_H;
	if (humanY < 0) humanY += HUMAN_H;

}

function draw()
{
	ctx.clearRect(0, 0, CANVASW, CANVASH);
	drawDrops(drops);
	drawHuman();
	drawShip();
	drawScore();

	if (!end)
	{
		if (!pause)
		{
			drawEnemies();
			drawLives();

			if (up && shipY > 0)
			{
				if (space)
					flyBullet();
				shipY -= SHIP_SPEED;
			}
			else if (down && shipY < CANVASH - SHIP_H)
			{
				if (space)
					flyBullet();
				shipY += SHIP_SPEED;
			}
			else if (right && shipX < CANVASW - SHIP_W)
			{
				if (space)
					flyBullet();
				shipX += SHIP_SPEED;
			}
			else if (left && shipX > 0)
			{
				if (space)
					flyBullet();
				shipX -= SHIP_SPEED;
			}
			else if (space)
			{
				flyBullet();
			}

			enemyX -= 2;
		} else {
			drawPause();
			DROP_SPEED = 0;
		}
	} 
	else {
		gameOver();
		DROP_SPEED = 5;
		if (space)
			location.reload();
	}
	requestAnimationFrame(draw);
}

function drawDrops(drop)
{
	ctx.beginPath();
	for (let i = 0; i < drop.length; i++) 
	{
		ctx.moveTo(drop[i].x, drop[i].y);
		ctx.lineTo(drop[i].x + drop[i].w*2, drop[i].y);
		ctx.strokeStyle = getRandomColor();
		ctx.stroke();	
		if (drop[i].x > -10) drop[i].x -= DROP_SPEED;
		else 
		{
			drop[i].x = CANVASW;
			drop[i].y = Math.floor(Math.random() * CANVASH);
		}
	}

	ctx.closePath();
}

function getRandomColor() 
{
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) 
  {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawShip()
{
	ctx.beginPath();
	ctx.drawImage(ship, shipX, shipY, SHIP_W, SHIP_H);
	ctx.closePath();
}

function flyBullet() {
	bulletX = shipX + SHIP_W;
	bulletY = (shipY + SHIP_H/2) - BULLET_H + 12;
	ctx.beginPath();
	while (bulletX <= CANVASW)
	{
		ctx.drawImage(bullet, bulletX, bulletY, BULLET_W, BULLET_H);
		bulletX += 10;
	}

	let enemy = colisionDetect();
	if (enemy != null)
		drawBoom(enemy.x, enemy.y);
	ctx.closePath();
}

function drawEnemies() {
	ctx.beginPath();
	let y = 0;
	if (nowEnemies < 3)
	{
			y = Math.floor(Math.random() * CANVASH) - ENEMY_H;
			enemySpeed = Math.floor(Math.random() * enemiesHighSpeed)  + 5; 
			if (y < 0) y += ENEMY_H;
			enemies.push({img: new Image(), x: CANVASW + ENEMY_H,  y: y, status: 1, speed: enemySpeed});
			enemies[enemies.length-1].img.src = "./img/enemy.png";
			nowEnemies++;
	}

	for (let i = 0; i < enemies.length; i++) {
		if (enemies[i].status != 0)
			ctx.drawImage(enemies[i].img, enemies[i].x, enemies[i].y, EMENY_W, ENEMY_H);
		enemies[i].x -= enemies[i].speed;
		if (enemies[i].x < 0 && enemies[i].status == 1) {
			if (lives == 1) end = true;
			enemies[i].status = 0;
			lives--;
			nowEnemies--;
		}
	}
	
	ctx.closePath();
}

function colisionDetect() {
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i].y <= bulletY && enemies[i].y + EMENY_W > bulletY && enemies[i].status == 1)
		{
			enemies[i].status = 0;
			Score++;
			if (Score > lastScore && (Score % 20 == 0))
			{
				SHIP_SPEED += 3;
				enemiesHighSpeed += 3;
				showHuman = 1;
			}
			nowEnemies--;	
			return enemies[i];
			lastScore = Score;
		}
	}
	return null;
}

function drawBoom(x, y) {
	ctx.beginPath();
	ctx.drawImage(boom, x, y, BOOM_W, BOOM_H);
	ctx.closePath();	
}

function drawScore() {
	ctx.font = "30px Arial";
	ctx.fillStyle = "white";
	ctx.strokeText("Score: " + Score, 10, 50);
	ctx.fillText("Score: " + Score, 10, 50);
}

function gameOver() {
	ctx.globalAlpha = 0.5;
	ctx.font = "50px Arial";
	ctx.fillStyle = "red";
	ctx.strokeText("Game over ", CANVASW/2 - 110, CANVASH/2 - 50);
	ctx.fillText("Game over ", CANVASW/2 - 110, CANVASH/2 - 50);	
	if (document.cookie != "")
	{
		if ((+document.cookie) < Score)
		{
			ctx.fillStyle = "green";
			ctx.strokeText("New high score!!! ", CANVASW/2 - 110, CANVASH/2 - 100);
			ctx.fillText("New high score!!! ", CANVASW/2 - 110, CANVASH/2 - 100);
			document.cookie = Score.toString();
		} 
		else {
			ctx.strokeText("High score: " + document.cookie, CANVASW/2 - 130, CANVASH/2 - 100);
			ctx.fillText("High score: " + document.cookie, CANVASW/2 - 130, CANVASH/2 - 100);
		}
	} else {
		ctx.fillStyle = "green";
		ctx.strokeText("New high score!!! ", CANVASW/2 - 130, CANVASH/2 - 100);
		ctx.fillText("New high score!!! ", CANVASW/2 - 130, CANVASH/2 - 100);
		document.cookie = Score.toString();		
	}
}

function drawPause() {
	ctx.font = "50px Arial";
	ctx.fillStyle = "white";
	ctx.strokeText("Paused. Press p to continue", CANVASW/2 - 300, CANVASH/2 - 50);
	ctx.fillText("Paused. Press p to continue", CANVASW/2 - 300, CANVASH/2 - 50);
}

function drawLives() {
	ctx.beginPath();
	ctx.font = "60px Arial";
	ctx.drawImage(heart, CANVASW - HEART_W - 130, 20, HEART_W, HEART_H);
	ctx.strokeText(lives, CANVASW - HEART_W - 40, 90);
	ctx.fillText(lives, CANVASW - HEART_W - 40, 90);
	ctx.closePath();
}

function drawHuman() {
	if (showHuman)
	{
		ctx.beginPath();
		ctx.drawImage(human, humanX, humanY, HUMAN_W, HUMAN_H);
		ctx.closePath();
	}
}

function checkLives() {
	if (showHuman)
	{
		if (shipX + SHIP_W >= humanX && shipX <= humanX + HUMAN_W && shipY + SHIP_H >= humanY && shipY <= humanY)
		{
			lives++;
			humanX = Math.floor(Math.random() * CANVASW / 2) + HUMAN_W;
			humanY = Math.floor(Math.random() * CANVASH) - HUMAN_H;
			if (humanY < 0) humanY += HUMAN_H;
			showHuman = 0;
		}
	}
}