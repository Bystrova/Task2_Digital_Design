const startButton = document.querySelector('.button-start');
const resetButton = document.querySelector('.button-reset');
const modal = document.querySelector('.modal');
const scoreElem = document.querySelector('.score');
const canvas = document.querySelector('.canvas');
const context = canvas.getContext('2d');
const CELL_SIZE = 10;
const MEAL_COLOR = "rgb(0, 0, 200)";
const SNEAK_COLOR = "rgb(0, 0, 0, 0.3)";
const SPEED = 200;
const DEFAULT_DIRECTION = 'right';
const DEFAULT_HEAD_COORDINATES = {
	x: 30,
	y: 50
};
const DEFAULT_SCORE = 'Score: 0';
let direction = '';
let intervalID;
const snakeCoordinates = [DEFAULT_HEAD_COORDINATES];

const getScore = () => {
	let scoreStr = scoreElem.textContent;
	let scoreArr = scoreStr.split(' ');
	let scoreValue = Number(scoreArr[scoreArr.length - 1]);
	scoreValue += 10;
	scoreValue = String(scoreValue)
	scoreArr.splice(1, 1, scoreValue);
	scoreElem.textContent = scoreArr.join(' ');
}

const changeClass = (someClass, someElement) => {
	someElement.classList.add(someClass);
	window.addEventListener('click', () => {
		someElement.classList.remove(someClass);
	});
	window.addEventListener('keydown', (evt) => {
		if (evt.key === 'Escape' || evt.key === 'Esc') {
			someElement.classList.remove(someClass);
		}
	})
}

const getRandom = () => {
	const min = 10;
	const max = 230;
	let randomInt = (Math.round((Math.floor(Math.random() * (max - min + 1)) + min) / 10)) * 10;
	return randomInt;
}

const setMeal = () => {
	mealX = getRandom();
	mealY = getRandom();
	const isMatch = (coordinate) => (mealX === coordinate.x) && (mealY === coordinate.y)
	let match = snakeCoordinates.some(isMatch);
	if (match) {
		setMeal();
	}
}

window.addEventListener('keydown', (evt) => {
	switch (evt.key) {
		case 'ArrowDown':
			if (direction !== 'up') {
				direction = 'down';
			}
			break;
		case 'ArrowUp':
			if (direction !== 'down') {
				direction = 'up';
			}
			break;
		case 'ArrowLeft':
			if (direction !== 'right') {
				direction = 'left';
			}
			break;
		case 'ArrowRight':
			if (direction !== 'left') {
				direction = 'right';
			}
			break;
	}
});

const isCollision = (coordX, coordY) => {
	let flag = false;
	if (coordX === 0 || coordX === canvas.width - CELL_SIZE || coordY === 0 || coordY === canvas.height - CELL_SIZE) {
		flag = true;
	} else {
		snakeCoordinates.forEach((coordinate, item) => {
			if (coordX === coordinate.x && coordY === coordinate.y && item !== 0) {
				flag = true;
			}
		})
	}
	return flag;
}

const draw = () => {
	let headX = snakeCoordinates[0].x;
	let headY = snakeCoordinates[0].y;

	switch (direction) {
		case 'down':
			headY += CELL_SIZE;
			break;
		case 'up':
			headY -= CELL_SIZE;
			break;
		case 'right':
			headX += CELL_SIZE;
			break;
		case 'left':
			headX -= CELL_SIZE;
			break;
	}

	snakeCoordinates.unshift({
		x: headX,
		y: headY
	});

	if (headX === mealX && headY === mealY) {
		setMeal();
		getScore();
	} else {
		snakeCoordinates.pop();
	}

	if (isCollision(headX, headY)) {
		clearInterval(intervalID);
		changeClass('show', modal);
	}

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = MEAL_COLOR;
	context.fillRect(mealX, mealY, CELL_SIZE, CELL_SIZE);

	snakeCoordinates.forEach((coordinate) => {
		context.fillStyle = SNEAK_COLOR;
		context.fillRect(coordinate.x, coordinate.y, CELL_SIZE, CELL_SIZE);
	});
};

const handleStart = () => {
	direction = DEFAULT_DIRECTION;
	intervalID = setInterval(draw, SPEED);
	startButton.setAttribute('disabled', 'disabled');
}

const handleReset = () => {
	clearInterval(intervalID);
	snakeCoordinates.length = 0;
	snakeCoordinates.push(DEFAULT_HEAD_COORDINATES);
	direction = '';
	mealX = getRandom();
	mealY = getRandom();
	draw();
	startButton.removeAttribute('disabled', 'disabled');
	scoreElem.textContent = DEFAULT_SCORE;
}

let mealX = getRandom();
let mealY = getRandom();
setMeal(mealX, mealY);
draw();
startButton.addEventListener('click', handleStart);
resetButton.addEventListener('click', handleReset);