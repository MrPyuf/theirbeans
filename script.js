const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

// Load high score from localStorage
let highScore = localStorage.getItem("highScore") || 0;
highScoreEl.innerText = highScore;

let gamePaused = false;
let score = 0;

// Ball properties
let ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 10,
    dx: 4,
    dy: -4
};

// Paddle properties
let paddle = {
    width: 100,
    height: 10,
    x: (canvas.width - 100) / 2,
    speed: 7,
    dx: 0
};

// Bricks properties
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 80;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 50;
const brickOffsetLeft = 30;

const colors = ["#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#00FFFF"]; // Colors for different hit points

let bricks = [];

function initBricks() {
    bricks = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[r] = [];
        for (let c = 0; c < brickColumnCount; c++) {
            let hits = Math.floor(Math.random() * 3) + 1; // Bricks need 1-3 hits to break
            bricks[r][c] = { x: 0, y: 0, hits };
        }
    }
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFF";
    ctx.fill();
    ctx.closePath();
}

// Draw paddle
function drawPaddle() {
    ctx.fillStyle = "#FFF";
    ctx.fillRect(paddle.x, canvas.height - paddle.height - 10, paddle.width, paddle.height);
}

// Draw bricks
function drawBricks() {
    for (let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < brickColumnCount; c++) {
            if (bricks[r][c].hits > 0) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[r][c].x = brickX;
                bricks[r][c].y = brickY;

                ctx.fillStyle = colors[bricks[r][c].hits - 1];
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

// Move paddle
function movePaddle() {
    paddle.x += paddle.dx;

    if (paddle.x < 0) {
        paddle.x = 0;
    } else if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

// Collision detection
function collisionDetection() {
    for (let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < brickColumnCount; c++) {
            let brick = bricks[r][c];
            if (brick.hits > 0) {
                if (
                    ball.x > brick.x &&
                    ball.x < brick.x + brickWidth &&
                    ball.y > brick.y &&
                    ball.y < brick.y + brickHeight
                ) {
                    ball.dy = -ball.dy;
                    brick.hits--;
                    score += 10;
                    scoreEl.innerText = score;

                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem("highScore", highScore);
                        highScoreEl.innerText = highScore;
                    }
                }
            }
        }
    }
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }

    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // Paddle collision
    if (
        ball.y + ball.radius > canvas.height - paddle.height - 10 &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        ball.dy = -ball.dy;
    }

    // Brick collision
    collisionDetection();

    // Game over
    if (ball.y + ball.radius > canvas.height) {
        resetGame();
    }
}

// Reset game
function resetGame() {
    score = 0;
    scoreEl.innerText = score;
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 4;
    ball.dy = -4;
    paddle.x = (canvas.width - 100) / 2;
    initBricks();
}

// Update game
function update() {
    if (!gamePaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        movePaddle();
        moveBall();
    }

    requestAnimationFrame(update);
}

// Key handlers
function keyDown(e) {
    if (e.key === "ArrowLeft") paddle.dx = -paddle.speed;
    if (e.key === "ArrowRight") paddle.dx = paddle.speed;
    if (e.key === "p") gamePaused = !gamePaused;
    if (e.key === "r") resetGame();
}

function keyUp(e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") paddle.dx = 0;
}

// Event listeners
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
pauseBtn.addEventListener("click", () => (gamePaused = !gamePaused));
restartBtn.addEventListener("click", resetGame);

// Start game
initBricks();
update();
