const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const scoreEl = document.getElementById('score');

let gamePaused = false;
let score = 0;

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 10,
    dx: 4,
    dy: -4
};

// Paddle properties
const paddle = {
    width: 100,
    height: 10,
    x: (canvas.width - 100) / 2,
    speed: 8,
    dx: 0
};

// Brick properties
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 50;
const brickOffsetLeft = 30;

const bricks = [];
for (let r = 0; r < brickRowCount; r++) {
    bricks[r] = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[r][c] = { x: 0, y: 0, status: 1 };
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, canvas.height - paddle.height - 10, paddle.width, paddle.height);
}

function drawBricks() {
    for (let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < brickColumnCount; c++) {
            if (bricks[r][c].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[r][c].x = brickX;
                bricks[r][c].y = brickY;
                ctx.fillStyle = '#fff';
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

function movePaddle() {
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx *= -1;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }
    if (ball.y + ball.radius > canvas.height) {
        resetGame();
    }
    
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width &&
        ball.y + ball.radius > canvas.height - paddle.height - 10) {
        ball.dy *= -1;
    }
}

function detectCollision() {
    for (let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < brickColumnCount; c++) {
            const brick = bricks[r][c];
            if (brick.status === 1) {
                if (ball.x > brick.x && ball.x < brick.x + brickWidth &&
                    ball.y > brick.y && ball.y < brick.y + brickHeight) {
                    ball.dy *= -1;
                    brick.status = 0;
                    score += 10;
                    scoreEl.innerText = score;
                }
            }
        }
    }
}

function update() {
    if (gamePaused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    movePaddle();
    moveBall();
    detectCollision();
    requestAnimationFrame(update);
}

function resetGame() {
    document.location.reload();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') paddle.dx = -paddle.speed;
    if (e.key === 'ArrowRight') paddle.dx = paddle.speed;
});

document.addEventListener('keyup', () => paddle.dx = 0);

pauseBtn.addEventListener('click', () => {
    gamePaused = !gamePaused;
    pauseBtn.innerText = gamePaused ? 'Resume' : 'Pause';
    if (!gamePaused) update();
});

resetBtn.addEventListener('click', resetGame);

update();
