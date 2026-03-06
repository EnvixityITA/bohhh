const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 30,
  speed: 5,
  color: 'red'
};

// Proiettili
const bullets = [];
const keys = {};

// Eventi tastiera
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);
document.addEventListener('click', e => shoot(e.clientX, e.clientY));

function shoot(targetX, targetY) {
  const angle = Math.atan2(targetY - player.y, targetX - player.x);
  bullets.push({
    x: player.x,
    y: player.y,
    dx: Math.cos(angle) * 10,
    dy: Math.sin(angle) * 10,
    size: 5
  });
}

function update() {
  // Movimento player
  if (keys['w'] || keys['ArrowUp']) player.y -= player.speed;
  if (keys['s'] || keys['ArrowDown']) player.y += player.speed;
  if (keys['a'] || keys['ArrowLeft']) player.x -= player.speed;
  if (keys['d'] || keys['ArrowRight']) player.x += player.speed;

  // Aggiorna proiettili
  bullets.forEach((b, i) => {
    b.x += b.dx;
    b.y += b.dy;
    if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) bullets.splice(i, 1);
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();

  // Proiettili
  ctx.fillStyle = 'yellow';
  bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
