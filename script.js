const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;

let birdY = canvas.height / 2;
let birdV = 0;
let flapState = true;
let floatingTexts = [];
let gravity = 0.1;
let lift = -6;
let pipes = [];
let score = 0;
let highScore = 0;
let successSound;
let difficulty = 'slow';
let gameSpeed = 2;
let flapSound, crashSound, birdImage;

function loadAssets() {
  birdImage = new Image();
  birdImage.src = 'assets/bird.png';
  flapSound = new Audio('assets/flap.wav');
  crashSound = new Audio('assets/crash.wav');
  successSound = new Audio('assets/success.wav');
}

function setDifficulty(level) {
  if (level === 'easy') {
    gameSpeed = 0.8;
    gravity = 0.15;
    return;
  }
  difficulty = level;
  if (level === 'slow') gameSpeed = 1;
  else if (level === 'medium') gameSpeed = 1.5;
  else if (level === 'high') gameSpeed = 2;
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
  flapState = !flapState;
  const wingOffset = flapState ? 0 : 4;
  ctx.save();
  ctx.translate(50, birdY);
  ctx.drawImage(birdImage, 0, wingOffset, 34, 24, 0, 0, 34, 24);
  ctx.restore();

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const t = floatingTexts[i];
    ctx.fillStyle = "yellow";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(t.text, t.x, t.y);
    t.y -= 1;
    t.alpha -= 0.01;
    if (t.alpha <= 0) floatingTexts.splice(i, 1);
  }
}
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
    const bottom = canvas.height - top - 125;
    pipes.push({ x: canvas.width, top, bottom });
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= gameSpeed;

    if (pipes[i].x + 40 < 0) {
      pipes.splice(i, 1);
    floatingTexts.push({ text: "+1", x: 60, y: birdY - 10, alpha: 1 });
    successSound.play();
    if (score > highScore) highScore = score;
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
  ctx.fillText("Score: " + score + " | High: " + highScore, 10, 25);
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
