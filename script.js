const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;

let birdY = canvas.height / 2;
let birdV = 0;
let gravity = 0.4;
let lift = -8;
let pipes = [];
let score = 0;
let difficulty = 'slow';
let gameSpeed = 2;
let flapSound, crashSound, birdImage;

function loadAssets() {
  birdImage = new Image();
  birdImage.src = 'assets/bird.png';
  flapSound = new Audio('assets/flap.wav');
  crashSound = new Audio('assets/crash.wav');
}

function setDifficulty(level) {
  difficulty = level;
  if (level === 'slow') gameSpeed = 2;
  else if (level === 'medium') gameSpeed = 3;
  else if (level === 'high') gameSpeed = 4;
}

function flap() {
  birdV = lift;
  flapSound.play();
}

document.addEventListener('keydown', flap);
canvas.addEventListener('click', flap);

function resetGame() {
  birdY = canvas.height / 2;
  birdV = 0;
  score = 0;
  pipes = [];
}

function drawBird() {
  ctx.drawImage(birdImage, 50, birdY, 34, 24);
}

function drawPipes() {
  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    ctx.fillStyle = '#228B22';
    ctx.fillRect(p.x, 0, 40, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, 40, p.bottom);
  }
}

function updatePipes() {
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    const top = Math.random() * (canvas.height / 2);
    const bottom = canvas.height - top - 100;
    pipes.push({ x: canvas.width, top, bottom });
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= gameSpeed;

    if (pipes[i].x + 40 < 0) {
      pipes.splice(i, 1);
      score++;
    }
  }
}

function checkCollision() {
  for (let p of pipes) {
    if (
      50 + 34 > p.x && 50 < p.x + 40 &&
      (birdY < p.top || birdY + 24 > canvas.height - p.bottom)
    ) {
      crashSound.play();
      resetGame();
    }
  }

  if (birdY > canvas.height || birdY < 0) {
    crashSound.play();
    resetGame();
  }
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px sans-serif";
  ctx.fillText("Score: " + score, 10, 25);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  birdV += gravity;
  birdY += birdV;

  drawBird();
  updatePipes();
  drawPipes();
  checkCollision();
  drawScore();

  requestAnimationFrame(gameLoop);
}

loadAssets();
setDifficulty('slow');
gameLoop();
