const CANVASW = document.documentElement.clientWidth;
const CANVASH = document.documentElement.clientHeight;
const CANVAS_BG = 'black';
const LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40, SPACE = 32, KEYBOARD_P = 80;
// Блок констант

//Свойства капелек
const DROP_H = 20;
const DROP_W = 10;
let DROP_SPEED = 20;

//Свойства корабля
const SHIP_W = 170;
const SHIP_H = 150;
let SHIP_SPEED = 10;

// свойства пули
const BULLET_W = 40
const BULLET_H = 25;

// Свойства врага
const EMENY_W = 170;
const ENEMY_H = 150;

//Свойства взрыва
const BOOM_W = EMENY_W + 20;
const BOOM_H = ENEMY_H + 20;

//Свойства сердечка
const HEART_H = 100;
const HEART_W = 100;

// Свойства человечка
const HUMAN_W = 40;
const HUMAN_H = 100;

let canvas, ctx;
let drops = [];

//Свойства корабля
let ship;
let shipX = 0, shipY = 0;

// свойства пули
let bullet;
let bulletX = 0, bulletY = 0;

// Свойства врага
let enemy;
let enemyX = CANVASW + ENEMY_H;
let enemyY = CANVASH/2 - ENEMY_H/2;

// Массив врагов, скорость, сколько сейчас
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

function init() // Инициализация всего
{ 
	canvas = document.getElementById('cnv');
	ctx = canvas.getContext('2d');
	canvas.width = CANVASW;
	canvas.height = CANVASH;
	canvas.style.background = CANVAS_BG;

	let startX = 10, startY = 10;
	for (let i = 0; i < 300; i++)  // Инициализация капель
	{
		drops[i] = { x: startX, y: startY, w: DROP_W, h: DROP_H };
		startX = Math.floor(Math.random() * CANVASW);
		startY = Math.floor(Math.random() * CANVASH);
	}

	// Начало блока инициализации всех изображений
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
	// Конец блока инициализации всех изображений
  
  // Инициализация массива врагов с рандомизацией скорости и их позиции, каждому задаётся картинка,
  // А так же увеличевается количество текущих врагов
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
		else if (e.keyCode == KEYBOARD_P) // Если нажата P
		{
			if (pause) // Если стоит пауза
			{
				pause = false; // Пауза выключается
				DROP_SPEED = 20; // Скорость фона становится обычной
			}
			else // Не стоит пауза
			{
				p = true; // Индикатор нажатия p
				pause = true; // Пауза включается
			}
		}
		checkLives(); // попал ли корабль в человека
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

	humanX = Math.floor(Math.random() * CANVASW / 4) + HUMAN_W; // Рандомизация человечка
	humanY = Math.floor(Math.random() * CANVASH) - HUMAN_H;
	if (humanY < 0) humanY += HUMAN_H;

}

function draw() // Главная функция отрисовки
{
	ctx.clearRect(0, 0, CANVASW, CANVASH);
	drawDrops(drops); // Рисуем фон (капли)
	drawHuman(); // Рисуем человечка
	drawShip(); // Рисуем космический корабль
	drawScore(); // Рисуем счёт

	if (!end) // Если не проиграл
	{
		if (!pause) // если не пауза
		{
			drawEnemies(); // Рисуем противников
			drawLives(); // Рисуем жизни
      

      // начало блока обработки клавиш
			if (up && shipY > 0)
			{
				if (space)
					flyBullet();
				if (right && shipX < CANVASW - SHIP_W)
					shipX += SHIP_SPEED;
				if (left && shipX > 0)
					shipX -= SHIP_SPEED;

				shipY -= SHIP_SPEED;
			}
			else if (down && shipY < CANVASH - SHIP_H)
			{
				if (space)
					flyBullet();
				if (right && shipX < CANVASW - SHIP_W)
					shipX += SHIP_SPEED;
				if (left && shipX > 0)
					shipX -= SHIP_SPEED;

				shipY += SHIP_SPEED;
			}
			else if (right && shipX < CANVASW - SHIP_W)
			{
				if (space)
					flyBullet();
				if (up && shipY > 0)
					shipY -= SHIP_SPEED;
				if (down && shipY < CANVASH - SHIP_H)
					shipY += SHIP_SPEED;

				shipX += SHIP_SPEED;
			}
			else if (left && shipX > 0)
			{
				if (space)
					flyBullet();
				if (up && shipY > 0)
					shipY -= SHIP_SPEED;
				if (down && shipY < CANVASH - SHIP_H)
					shipY += SHIP_SPEED;
				shipX -= SHIP_SPEED;
			}
			else if (space)
			{
				flyBullet();
			}
			// конец блока обработки клавиш
		} else {
			drawPause(); // Если пауза, то пауза
			DROP_SPEED = 0; // Скорость капель 0 - останавливаются
		}
	} 
	else {
		gameOver(); // Если игра кончается то
		DROP_SPEED = 5; // Уменьшается скорость капель
		if (space) // Если нажат space перезагружется страница
			location.reload();
	}
	requestAnimationFrame(draw);
}

function drawDrops(drop) // Отрисовка капелек
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

function getRandomColor()  // Рандом цвет из словаря letters
{
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) 
  {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawShip() // Отрисовка корабля
{
	ctx.beginPath();
	ctx.drawImage(ship, shipX, shipY, SHIP_W, SHIP_H);
	ctx.closePath();
}

function flyBullet() { // "Лети, пуля!"
	bulletX = shipX + SHIP_W; // Пуля по х-у
	bulletY = (shipY + SHIP_H/2) - BULLET_H + 12; // Пуля по y-ку
	ctx.beginPath();
	while (bulletX <= CANVASW) // Отрисовка пули до конца ширины канваса
	{
		ctx.drawImage(bullet, bulletX, bulletY, BULLET_W, BULLET_H);
		bulletX += 10;
	}

	let enemy = colisionDetect(); // Берём объект в который попали
	if (enemy != null) // Если попали
		drawBoom(enemy.x, enemy.y); // Отрисовываем взрыв
	ctx.closePath();
}

function drawEnemies() { // Вывод на экран противников
	ctx.beginPath();
	let y = 0; // Для расчёта позиции противника по оси Y
	if (nowEnemies < 3) // Если сейчас меньше 3-х врагов
	{
			y = Math.floor(Math.random() * CANVASH) - ENEMY_H; // Расчёт позиции по Y
			enemySpeed = Math.floor(Math.random() * enemiesHighSpeed)  + 5; // Рандомизация по Y
			if (y < 0) y += ENEMY_H; // Если враг вышел за края
			enemies.push({img: new Image(), x: CANVASW + ENEMY_H,  y: y, status: 1, speed: enemySpeed});
			// Добавление в массив объекта, который содержит картинку, координаты по х и у, статус(показывать его или нет)
			// а так же скорость
			enemies[enemies.length-1].img.src = "./img/enemy.png";
			// Так как это по-любому последний то обратимся к нему так и установим картинку
			nowEnemies++;
	}

	// Отрисовка врагов и логика с жизнями
	for (let i = 0; i < enemies.length; i++) {
		if (enemies[i].status != 0) // Если его можно показывать 
			ctx.drawImage(enemies[i].img, enemies[i].x, enemies[i].y, EMENY_W, ENEMY_H);
		enemies[i].x -= enemies[i].speed;  // Передвижения
		if (enemies[i].x < 0 && enemies[i].status == 1) { // Если ты пропустил врага
			if (lives == 1) end = true; // И кол-во жизней 0 - конец
			enemies[i].status = 0; // Если нет, то он пропадает и жизни с количеством текущих противников уменьшается
			lives--;
			nowEnemies--;
		}
	}
	
	ctx.closePath();
}

function colisionDetect() { // Проверка на то, попала ли пуля во врага
	for (var i = 0; i < enemies.length; i++) {
		// Проверка на координатное попадание и на то показывается ли этот враг
		if (enemies[i].y <= bulletY && enemies[i].y + EMENY_W > bulletY && enemies[i].status == 1)
		{
			// Если попал во врага то он не показывается, счёт увеличевается на 1
			enemies[i].status = 0; 
			Score++;
			if (Score > lastScore && (Score % 20 == 0)) // Если счёт кратен 20 (каждые 20 очков)
			{
				SHIP_SPEED += 3; // Увеличение скорости корабля
				enemiesHighSpeed += 3; // Увеличение скорости врагов
				showHuman = 1; // Дополнительная жизнь
			}
			nowEnemies--;	// Количество врагов на мониторе уменьшается
			return enemies[i]; // Возвращается конкретный враг
 			lastScore = Score; // Для проверки которая в условии
		}
	}
	return null; // Если не попал
}

function drawBoom(x, y) { // Взрыв при попадании
	ctx.beginPath();
	ctx.drawImage(boom, x, y, BOOM_W, BOOM_H);
	ctx.closePath();	
}

function drawScore() { // Вывод очков
	ctx.font = "30px Arial";
	ctx.fillStyle = "white";
	ctx.strokeText("Score: " + Score, 10, 50);
	ctx.fillText("Score: " + Score, 10, 50);
}

function gameOver() { // Когда проиграл
	ctx.globalAlpha = 0.5; // Глобальная прозрачность
	ctx.font = "50px Arial";
	ctx.fillStyle = "red";
	ctx.strokeText("Game over ", CANVASW/2 - 110, CANVASH/2 - 50);
	ctx.fillText("Game over ", CANVASW/2 - 110, CANVASH/2 - 50);	
	if (document.cookie != "") // Сохранение лучшего результата в куки
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

function drawPause() { // Текст, который показывается при паузе 
	ctx.font = "50px Arial";
	ctx.fillStyle = "white";
	ctx.strokeText("Paused. Press p to continue", CANVASW/2 - 300, CANVASH/2 - 50);
	ctx.fillText("Paused. Press p to continue", CANVASW/2 - 300, CANVASH/2 - 50);
}

function drawLives() { // Отрисовка жизней. отрисовывается сердечко, цифра и обводка к цифре
	ctx.beginPath();
	ctx.font = "60px Arial";
	ctx.drawImage(heart, CANVASW - HEART_W - 130, 20, HEART_W, HEART_H);
	ctx.strokeText(lives, CANVASW - HEART_W - 40, 90);
	ctx.fillText(lives, CANVASW - HEART_W - 40, 90);
	ctx.closePath();
}

function drawHuman() { // Отрисовка человечка
	if (showHuman)
	{
		ctx.beginPath();
		ctx.drawImage(human, humanX, humanY, HUMAN_W, HUMAN_H);
		ctx.closePath();
	}
}

function checkLives() { // Функция для проверки попадает ли корабль в человечка
	if (showHuman)
	{
		// Чек на вход в координаты
		if (shipX + SHIP_W >= humanX && shipX <= humanX + HUMAN_W && shipY + SHIP_H >= humanY && shipY <= humanY)
		{
			lives++;
			// Сверху - увеличение жизней. Снизу - Рандом нового положения
			humanX = Math.floor(Math.random() * CANVASW / 2) + HUMAN_W;
			humanY = Math.floor(Math.random() * CANVASH) - HUMAN_H;
			if (humanY < 0) humanY += HUMAN_H;
			showHuman = 0;
		}
	}
}