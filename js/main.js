const CANVASW = 1000;
const CANVASH = 500;
const CANVAS_BG = 'black';
const LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40, SPACE = 32;

const DROP_H = 20;
const DROP_W = 10;
const DROP_SPEED = 20;

const SHIP_W = 170;
const SHIP_H = 150;
const SHIP_SPEED = 10;

const BULLET_W = 40, BULLET_H = 25;

const EMENY_W = 170;
const ENEMY_H = 150;

const BOOM_W = EMENY_W + 20;
const BOOM_H = ENEMY_H + 20;

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

let boom;

let Score = 0;

let left = false, right = false, up = false, down = false, space = false;

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

	let y = 0;
	for (let i = 0; i < 3; i++) {
		y = Math.floor(Math.random() * CANVASH) - ENEMY_H;
		enemies.push({img: new Image(), x: CANVASW + ENEMY_H,  y: y, status: 1});
		enemies[enemies.length-1].img.src = "./img/enemy.png";
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
	}, false);
}

function draw()
{
	ctx.clearRect(0, 0, CANVASW, CANVASH);
	drawDrops(drops);
	drawShip();
	drawEnemies();
	drawScore();

	if (up && shipY > 0)
	{
		shipY -= SHIP_SPEED;
	}
	else if (down && shipY < CANVASH - SHIP_H)
	{
		shipY += SHIP_SPEED;
	}
	else if (right && shipX < CANVASW - SHIP_W)
	{
		shipX += SHIP_SPEED;
	}
	else if (left && shipX > 0)
	{
		shipX -= SHIP_SPEED;
	}
	else if (space)
	{
		flyBullet();
	}

	enemyX -= 2;

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
	if (Score != 0 && (Score % 3 == 0))
	{
			y = Math.floor(Math.random() * CANVASH) - ENEMY_H;
			enemies.push({img: new Image(), x: CANVASW + ENEMY_H,  y: y, status: 1});
			enemies[enemies.length-1].img.src = "./img/enemy.png";
	}

	for (let i = 0; i < enemies.length; i++) {
		if (enemies[i].status != 0)
			ctx.drawImage(enemies[i].img, enemies[i].x, enemies[i].y, EMENY_W, ENEMY_H);
		enemies[i].x -= 3;
	}
	
	ctx.closePath();
}

function colisionDetect() {
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i].y <= bulletY && enemies[i].y + EMENY_W > bulletY && enemies[i].status == 1)
		{
			enemies[i].status = 0;
			Score++;
			return enemies[i];
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
