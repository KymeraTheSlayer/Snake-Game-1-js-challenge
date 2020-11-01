//Snake Game    ~~~~~~~>    o      o   o o o   o      o

const gameSize = 20; //tamanho
const multiplier = gameSize / 2;
const gameSpeed = 50;

let canvas;
let context;
canvas = document.getElementById('canvas');
context = canvas.getContext('2d');
canvas.width = Math.round((window.innerWidth - 100) / multiplier) * multiplier; //X
canvas.height = Math.round((window.innerHeight - 100) / multiplier) * multiplier; //Y

const gameCenter = { x: Math.round((canvas.width / 2) / multiplier) * multiplier, y: Math.round((canvas.height / 2) / multiplier) * multiplier };

let appleExists = false;
let appleCoords = { x: null, y: null };

let snake = []; // {x, y}
let movementDirection = { x: -1, y: 0 };
let newMovementDirection = false;

let score = 0;
const scoreText = document.querySelector('#score');
const startPageDiv = document.querySelector('.startPage');
const startBtn = startPageDiv.querySelector('#startButton');
startBtn.textContent = 'Start game';
const gameDiv = document.querySelector('.game');
const eatApplePoints = 100;

var gameRunning;
function startGame(){
    snake = [{ x: gameCenter.x, y: gameCenter.y},{ x: gameCenter.x + multiplier, y: gameCenter.y},{ x: gameCenter.x + multiplier * 2, y: gameCenter.y},{ x: gameCenter.x + multiplier * 3, y: gameCenter.y},{ x: gameCenter.x + multiplier * 4, y: gameCenter.y}]; // {x, y}
    movementDirection = { x: -1, y: 0 };
    gameRunning = setInterval(gameLoop, gameSpeed);
    startPageDiv.style.display = 'none';
    score = 0;
    scoreText.innerText = score;
}

//listeners
window.addEventListener('keydown', handleKeyPress);

function handleKeyPress(e) {
    if (newMovementDirection) {
        return;
    }
    if (e.keyCode === 65 || e.keyCode === 37) {//A
        if (movementDirection.x !== -1) {
            newMovementDirection = true;
        }
        if (movementDirection.x !== 1) {
            movementDirection = { x: -1, y: 0 };
        }

    }
    else if (e.keyCode === 83 || e.keyCode === 40) {//S
        if (movementDirection.y !== 1) {
            newMovementDirection = true;
        }
        if (movementDirection.y !== -1) {
            movementDirection = { x: 0, y: 1 };
        }
    }
    else if (e.keyCode === 68 || e.keyCode === 39) {//D
        if (movementDirection.x !== 1) {
            newMovementDirection = true;
        }
        if (movementDirection.x !== -1) {
            movementDirection = { x: 1, y: 0 };
        }
    }
    else if (e.keyCode === 87 || e.keyCode === 38) {//W
        if (movementDirection.y !== -1) {
            newMovementDirection = true;
        }
        if (movementDirection.y !== 1) {
            movementDirection = { x: 0, y: -1 };
        }
    }
};

function gameLoop() {
    let grow = false;
    context.clearRect(0, 0, canvas.width, canvas.height);
    grow = handleEatApple();
    handleMovement(grow);
    handleSnakeColision();
    handleApples();
    handleSnake();

    newMovementDirection = false;
}

function handleMovement(grow) {
    let lastValue = { x: 0, y: 0 };
    let newValue = null;
    //move +1 position
    snake = snake.map(snakeBody => {
        lastValue = snakeBody;
        snakeBody = (newValue === null) ? {//if snakehead
            x: (snakeBody.x + movementDirection.x * multiplier),
            y: (snakeBody.y + movementDirection.y * multiplier)
        } : newValue;
        newValue = lastValue;
        return snakeBody;
    });
    if (grow) {
        snake.push(newValue);
    }
}

function handleSnake() {
    drawSnake();
}

function drawSnake() {
    snake.forEach(snakeBody => {
        context.beginPath();
        context.fillStyle = '#BADA55';
        context.arc(snakeBody.x, snakeBody.y, multiplier, 0, 2 * Math.PI);
        context.fill();
    })
}

function handleApples() {
    if (!appleExists) {
        appleCoords = {
            x: Math.round(Math.random() * (canvas.width - gameSize) / multiplier) * multiplier + multiplier,
            y: Math.round(Math.random() * (canvas.height - gameSize) / multiplier) * multiplier + multiplier
        }
    }
    //draw
    context.beginPath();
    context.fillStyle = '#FF0000';
    context.arc(appleCoords.x, appleCoords.y, multiplier, 0, 2 * Math.PI);
    context.fill();
    appleExists = true;
}

function handleEatApple() {
    if (snake[0].x === appleCoords.x && snake[0].y === appleCoords.y) {
        appleExists = false;
        appleCoords = { x: null, y: null };
        score += eatApplePoints;
        scoreText.innerText = score;
        return true;
    }
    return false;
}

function handleSnakeColision() {
    let snakeHead = { x: snake[0].x, y: snake[0].y};
    if(snakeHead.x < 0 || snakeHead.y < 0 || snakeHead.x > canvas.width || snakeHead.y > canvas.height){
        gameOver();
    }
    snake.forEach((snakeBody, i) => {
        if (i === 0) {
            return;
        }
        if (snakeBody.x === snakeHead.x && snakeBody.y === snakeHead.y) {
            gameOver();
        }
    })
}

function gameOver(){
    clearInterval(gameRunning);
    scoreText.innerText = score + ", Game Over";
    startPageDiv.style.display = 'flex';
    startBtn.textContent = 'Restart game';
}