const CANVASW = 1000;
const CANVASH = 500;
const CANVAS_BG = 'black';
const LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40;

const DROP_H = 20;
const DROP_W = 10;

const SHIP_W = 170;
const SHIP_H = 150;
const SHIP_SPEED = 3;


let canvas, ctx;
let drops = [];
let ship;
let shipX = 0, shipY = 0;

let left = false, right = false, up = false, down = false;

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
	for (var i = 0; i < 300; i++) 
	{
		drops[i] = { x: startX, y: startY, w:DROP_W, h:DROP_H };
		startX = Math.floor(Math.random() * CANVASW);
		startY = Math.floor(Math.random() * CANVASH);
	}

	ship = new Image();
	ship.src = './img/ship';

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
	}, false);
}

function draw()
{
	ctx.clearRect(0, 0, CANVASW, CANVASH);
	drawDrops(drops);
	drawShip();

	if (up)
	{
		shipY -= SHIP_SPEED;
	}
	else if (down)
	{
		shipY += SHIP_SPEED;
	}
	else if (right)
	{
		shipX += SHIP_SPEED;
	}
	else if (left)
	{
		shipX -= SHIP_SPEED;
	}

	requestAnimationFrame(draw);
}

function drawDrops(drop)
{
	ctx.beginPath();
	for (var i = 0; i < drop.length; i++) 
	{
	/*	ctx.moveTo(posX, posY);
		ctx.lineTo(Math.cos(posX)/2, posY); */
		ctx.moveTo(drop[i].x, drop[i].y);
		ctx.lineTo(drop[i].x + drop[i].w*2, drop[i].y);
		ctx.strokeStyle = getRandomColor();
		ctx.stroke();	
		if (drop[i].x > -10) drop[i].x -= 3;
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
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) 
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