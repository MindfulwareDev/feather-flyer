window.onload = function() {
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
let level = 1;
let powerUps = [];
let powerUpPhase = 0;
let highScore = 0;
let topScores = [];
let achievements = [];
let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
let gameOver = false;
let successSound;
let backgroundMusic;
let menuVisible = true;
let paused = false;
let darkMode = false;
let highScore = 0;
let successSound;
let backgroundMusic;
let menuVisible = true;
let paused = false;
let darkMode = false;
let difficulty = 'slow';
let gameSpeed = 2;
let flapSound, crashSound, birdImage;

function loadAssets() {
  const birdList = ['bird', 'bird2', 'bird3'];
  birdList.forEach(name => {
    const img = new Image();
    img.src = `assets/${name}.png`;
    birdImages[name] = img;
  });
  // Assign selected bird image after loading
  birdImage = birdImages[selectedBird];

  soundEffects.flap = new Audio('assets/flap.wav');
  soundEffects.crash = new Audio('assets/crash.wav');
  soundEffects.success = new Audio('assets/success.wav');
  soundEffects.music = new Audio('assets/music.wav');
  soundEffects.music.loop = true;

  flapSound = soundEffects.flap;
  crashSound = soundEffects.crash;
  successSound = soundEffects.success;
  backgroundMusic = soundEffects.music;

  birdImage = new Image();
  // Assign selected bird image after loading
  birdImage = birdImages[selectedBird];
  birdImage.src = 'assets/bird.png';
  flapSound = new Audio('assets/flap.wav');
  crashSound = new Audio('assets/crash.wav');
  successSound = new Audio('assets/success.wav');
  backgroundMusic = new Audio('assets/music.wav');
  backgroundMusic.loop = true;
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
  gameOver = true;
  topScores.push(score);
  topScores = [...new Set(topScores)].sort((a, b) => b - a).slice(0, 5);
  leaderboard.push(score);
  leaderboard = [...new Set(leaderboard)].sort((a, b) => b - a).slice(0, 5);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  document.getElementById('gameOverScreen').style.display = 'block';
  saveGameState();
  const badgeList = document.getElementById('achievementBadges');
  badgeList.innerHTML = achievements.map(a => `<li>🏅 ${a}</li>`).join('');
  const list = document.getElementById('topScoresList');
  list.innerHTML = topScores.map(s => `<li>${s}</li>`).join('');
  const leaderList = document.getElementById('leaderboardList');
  leaderList.innerHTML = leaderboard.map(s => `<li>${s}</li>`).join('');
}
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

    // Achievements
    if (score >= 10 && !achievements.includes('Scored 10')) {
      achievements.push('Scored 10');
      unlockedBirds.add('bird2');
    }
    if (score >= 25 && !achievements.includes('Scored 25')) {
      achievements.push('Scored 25');
      unlockedBirds.add('bird3');
    }
    if (score >= 50 && !achievements.includes('Scored 50')) achievements.push('Scored 50');
      score++;
    if (score % 5 === 0) level++;
    if (Math.random() < 0.2) {
      powerUps.push({ x: canvas.width, y: Math.random() * canvas.height });
    }
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
  ctx.fillText(`Score: ${score} | High: ${highScore} | Level: ${level}`, 10, 25);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  birdV += gravity;
  birdY += birdV;

  drawBird();
  updatePipes();
  updatePowerUps();
  drawPipes();
  checkCollision();
  drawPowerUps();
  drawScore();
  powerUpPhase += 0.05;

  if (!gameOver && !menuVisible && !paused) requestAnimationFrame(gameLoop);
}

function selectBird(birdName) {
  selectedBird = birdName;
  // Assign selected bird image after loading
  birdImage = birdImages[selectedBird];
}
setDifficulty('slow');
gameLoop();


function restartGame() {
  resetGameInternal();
  gameLoop();
}
  birdY = canvas.height / 2;
  birdV = 0;
  score = 0;
  pipes = [];
  gameOver = false;
  document.getElementById('gameOverScreen').style.display = 'none';
  gameLoop();
}


function startGame() {
  menuVisible = false;
  document.getElementById('mainMenu').style.display = 'none';
  backgroundMusic.play();
  resetGameInternal();
  gameLoop();
}

function resetGameInternal() {
  birdY = canvas.height / 2;
  birdV = 0;
  score = 0;
  pipes = [];
  gameOver = false;
  document.getElementById('gameOverScreen').style.display = 'none';
}


function togglePause() {
  paused = !paused;
  if (!paused) {
    gameLoop();
  }
}

function setVolume(value) {
  const volume = parseFloat(value);
  if (backgroundMusic) backgroundMusic.volume = volume;
  if (flapSound) flapSound.volume = volume;
  if (crashSound) crashSound.volume = volume;
  if (successSound) successSound.volume = volume;
}


// Mobile touch input
canvas.addEventListener('touchstart', function(e) {
  e.preventDefault();
  if (!menuVisible && !gameOver && !paused) flap();
}, { passive: false });

// Fullscreen toggle
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}


function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark", darkMode);
}


function drawPowerUps() {
  ctx.fillStyle = "gold";
  powerUps.forEach(p => {
    ctx.beginPath();
    const offset = Math.sin(powerUpPhase + p.x * 0.01) * 3;
    p.y += offset;
    ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function updatePowerUps() {
  for (let i = powerUps.length - 1; i >= 0; i--) {
    powerUps[i].x -= gameSpeed;
    if (powerUps[i].x + 6 < 0) powerUps.splice(i, 1);
    else if (50 < powerUps[i].x + 6 && 50 + 34 > powerUps[i].x &&
             birdY < powerUps[i].y + 6 && birdY + 24 > powerUps[i].y - 6) {
      score += 3;
      powerUps.splice(i, 1);
    }
  }
}


function shareToTwitter() {
  const text = encodeURIComponent(`I scored ${score} in Feather Flyer! Try to beat me!`);
  const url = encodeURIComponent("https://mindfulwaredev.github.io/feather-flyer/");
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareToFacebook() {
  const url = encodeURIComponent("https://mindfulwaredev.github.io/feather-flyer/");
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}


function saveGameState() {
  const state = {
    highScore,
    leaderboard,
    achievements,
    selectedBird,
    unlockedBirds: Array.from(unlockedBirds)
  };
  localStorage.setItem("featherFlyerSave", JSON.stringify(state));
}

function loadGameState() {
  const saved = JSON.parse(localStorage.getItem("featherFlyerSave"));
  if (saved) {
    highScore = saved.highScore || 0;
    leaderboard = saved.leaderboard || [];
    achievements = saved.achievements || [];
    selectedBird = saved.selectedBird || 'bird';
    unlockedBirds = new Set(saved.unlockedBirds || ['bird']);
  }
}

loadGameState();
  loadAssets();

};
