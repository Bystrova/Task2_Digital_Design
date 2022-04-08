"use strict";

var startButton = document.querySelector('.button-start');
var resetButton = document.querySelector('.button-reset');
var modal = document.querySelector('.modal');
var scoreElem = document.querySelector('.score');
var canvas = document.querySelector('.canvas');
var context = canvas.getContext('2d');
var CELL_SIZE = 10;
var MEAL_COLOR = "rgb(0, 0, 200)";
var SNEAK_COLOR = "rgb(0, 0, 0, 0.3)";
var SPEED = 200;
var DEFAULT_DIRECTION = 'right';
var DEFAULT_HEAD_COORDINATES = {
  x: 30,
  y: 50
};
var DEFAULT_SCORE = 'Score: 0';
var direction = '';
var intervalID;
var snakeCoordinates = [DEFAULT_HEAD_COORDINATES];

var getScore = function getScore() {
  var scoreStr = scoreElem.textContent;
  var scoreArr = scoreStr.split(' ');
  var scoreValue = Number(scoreArr[scoreArr.length - 1]);
  scoreValue += 10;
  scoreValue = String(scoreValue);
  scoreArr.splice(1, 1, scoreValue);
  scoreElem.textContent = scoreArr.join(' ');
};

var changeClass = function changeClass(someClass, someElement) {
  someElement.classList.add(someClass);
  window.addEventListener('click', function () {
    someElement.classList.remove(someClass);
  });
  window.addEventListener('keydown', function (evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      someElement.classList.remove(someClass);
    }
  });
};

var getRandom = function getRandom() {
  var min = 10;
  var max = 230;
  var randomInt = Math.round((Math.floor(Math.random() * (max - min + 1)) + min) / 10) * 10;
  return randomInt;
};

var setMeal = function setMeal() {
  mealX = getRandom();
  mealY = getRandom();

  var isMatch = function isMatch(coordinate) {
    return mealX === coordinate.x && mealY === coordinate.y;
  };

  var match = snakeCoordinates.some(isMatch);

  if (match) {
    setMeal();
  }
};

window.addEventListener('keydown', function (evt) {
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

var isCollision = function isCollision(coordX, coordY) {
  var flag = false;

  if (coordX === 0 || coordX === canvas.width - CELL_SIZE || coordY === 0 || coordY === canvas.height - CELL_SIZE) {
    flag = true;
  } else {
    snakeCoordinates.forEach(function (coordinate, item) {
      if (coordX === coordinate.x && coordY === coordinate.y && item !== 0) {
        flag = true;
      }
    });
  }

  return flag;
};

var draw = function draw() {
  var headX = snakeCoordinates[0].x;
  var headY = snakeCoordinates[0].y;

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
  snakeCoordinates.forEach(function (coordinate) {
    context.fillStyle = SNEAK_COLOR;
    context.fillRect(coordinate.x, coordinate.y, CELL_SIZE, CELL_SIZE);
  });
};

var handleStart = function handleStart() {
  direction = DEFAULT_DIRECTION;
  intervalID = setInterval(draw, SPEED);
  startButton.setAttribute('disabled', 'disabled');
};

var handleReset = function handleReset() {
  clearInterval(intervalID);
  snakeCoordinates.length = 0;
  snakeCoordinates.push(DEFAULT_HEAD_COORDINATES);
  direction = '';
  mealX = getRandom();
  mealY = getRandom();
  draw();
  startButton.removeAttribute('disabled', 'disabled');
  scoreElem.textContent = DEFAULT_SCORE;
};

var mealX = getRandom();
var mealY = getRandom();
setMeal(mealX, mealY);
draw();
startButton.addEventListener('click', handleStart);
resetButton.addEventListener('click', handleReset);