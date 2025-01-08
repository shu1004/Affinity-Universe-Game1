const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const distanceElement = document.getElementById('distance');
const bestScoreElement = document.getElementById('bestScore');

let plane = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 110,
    width: 70,
    height: 100,
    speed: 5,
};

let keys = {};
let obstacles = [];
let distance = 0;
let bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0;
let gameOver = false;

const backgroundImage = new Image();
backgroundImage.src = 'bg.png';

const planeImage = new Image();
planeImage.src = 'person.png';

const obstacleImage = new Image();
obstacleImage.src = 'obstacle.png';

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawPlane() {
    ctx.drawImage(planeImage, plane.x, plane.y, plane.width, plane.height);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updateObstacles() {
    let size = Math.random() * 50+20;
    if (Math.random() < 0.03) {
        obstacles.push({
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: size,
            height: size/6*5,
            speed: Math.random() * 2 + 2,
        });
    }
    obstacles.forEach(obstacle => {
        obstacle.y += obstacle.speed;
    });
    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);
}

function detectCollision() {
    for (let obstacle of obstacles) {
        if (
            plane.x < obstacle.x + obstacle.width &&
            plane.x + plane.width > obstacle.x &&
            plane.y < obstacle.y + obstacle.height &&
            plane.y + plane.height > obstacle.y
        ) {
            gameOver = true;
            alert('GAME OVER: ' + distance);
            if (distance > bestScore) {
                bestScore = distance;
                localStorage.setItem('bestScore', bestScore);
            }
            document.location.reload();
        }
    }
}

function updateScore() {
    if (!gameOver) {
        distance += 1;
        distanceElement.innerText = 'DISTANCE: ' + distance;
        bestScoreElement.innerText = 'BEST: ' + bestScore;
    }
}

function movePlane() {
    if (keys['ArrowLeft'] && plane.x > 0) {
        plane.x -= plane.speed;
    }
    if (keys['ArrowRight'] && plane.x < canvas.width - plane.width) {
        plane.x += plane.speed;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    movePlane();
    drawPlane();
    drawObstacles();
    updateObstacles();
    detectCollision();
    updateScore();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function runGame() {
    gameLoop();
}

runGame();
