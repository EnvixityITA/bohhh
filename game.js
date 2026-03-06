const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.7;

const tanks = [];
const bullets = [];

class Tank {
  constructor(x, y, team) {
    this.x = x;
    this.y = y;
    this.team = team; // 'blue' o 'red'
    this.size = 30;
    this.color = team === 'blue' ? 'blue' : 'red';
    this.health = 100;
    this.speed = 1.5;
    this.reload = 0;
  }

  move() {
    // Cerca il nemico più vicino
    let enemies = tanks.filter(t => t.team !== this.team && t.health > 0);
    if (enemies.length === 0) return;
    let target = enemies.reduce((prev, curr) => 
      distance(this, curr) < distance(this, prev) ? curr : prev
    );
    let angle = Math.atan2(target.y - this.y, target.x - this.x);
    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;

    // Sparo automatico
    if (this.reload <= 0) {
      bullets.push(new Bullet(this.x, this.y, angle, this.team));
      this.reload = 60; // frame di ricarica
    } else {
      this.reload--;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    // Health bar
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x - this.size/2, this.y - this.size/2 - 10, this.size * (this.health/100), 5);
  }
}

class Bullet {
  constructor(x, y, angle, team) {
    this.x = x;
    this.y = y;
    this.dx = Math.cos(angle) * 5;
    this.dy = Math.sin(angle) * 5;
    this.size = 5;
    this.team = team;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
    // Collisione con i nemici
    tanks.forEach(t => {
      if (t.team !== this.team && t.health > 0 && distance(this, t) < (t.size/2 + this.size)) {
        t.health -= 20;
        this.toRemove = true;
      }
    });
    // Rimuovi se fuori schermo
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.toRemove = true;
  }

  draw() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
  }
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Clicca per piazzare i carri armati
canvas.addEventListener('click', (e) => {
  const team = e.clientX < canvas.width / 2 ? 'blue' : 'red';
  tanks.push(new Tank(e.clientX, e.clientY, team));
});

// Ciclo principale
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  tanks.forEach(t => {
    if (t.health > 0) {
      t.move();
      t.draw();
    }
  });

  bullets.forEach((b, i) => {
    b.move();
    b.draw();
    if (b.toRemove) bullets.splice(i, 1);
  });

  // Controlla vittoria
  let blueAlive = tanks.some(t => t.team === 'blue' && t.health > 0);
  let redAlive = tanks.some(t => t.team === 'red' && t.health > 0);
  if (!blueAlive || !redAlive) {
    ctx.fillStyle = 'white';
    ctx.font = '50px sans-serif';
    ctx.textAlign = 'center';
    let winner = blueAlive ? 'Blu' : 'Rosso';
    ctx.fillText(`${winner} vince!`, canvas.width/2, canvas.height/2);
  } else {
    requestAnimationFrame(gameLoop);
  }
}

gameLoop();
