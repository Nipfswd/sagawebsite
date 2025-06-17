// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const background = new Background(80); // <-- Use the background.js class

// Player
class Player {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.size = 50;
    this.speed = 5;
    this.color = '#00aaff';
    this.health = 100;
    this.isAttacking = false;
    this.attackDuration = 300;
    this.attackTimer = 0;
  }

  move(keys) {
    if (keys.w) this.y -= this.speed;
    if (keys.s) this.y += this.speed;
    if (keys.a) this.x -= this.speed;
    if (keys.d) this.x += this.speed;

    // Keep inside screen
    this.x = Math.max(this.size / 2, Math.min(canvas.width - this.size / 2, this.x));
    this.y = Math.max(this.size / 2, Math.min(canvas.height - this.size / 2, this.y));
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
  }

  updateAttack(timestamp, keys) {
    if (keys.attack && !this.isAttacking) {
      this.isAttacking = true;
      this.attackTimer = timestamp;
    }
    if (this.isAttacking) {
      if (timestamp - this.attackTimer < this.attackDuration) {
        this.color = '#ff5500';
      } else {
        this.isAttacking = false;
        this.color = '#00aaff';
      }
    }
  }
}

// Enemy
class Enemy {
  constructor() {
    this.size = 40;
    this.reset();
    this.color = '#ff3333';
    this.health = 50;
    this.attackCooldown = 0;
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
  }

  moveTowards(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 2) {
      this.x += dx / dist;
      this.y += dy / dist;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
  }

  takeDamage() {
    this.health -= 10;
    if (this.health <= 0) {
      this.health = 50;
      this.reset();
    }
  }
}

// Game logic
const player = new Player();
const enemies = Array.from({ length: 5 }, () => new Enemy());
let keys = { w: false, a: false, s: false, d: false, attack: false };
let lastDamageTime = 0;
let gameOver = false;

// Joystick logic
const joystick = document.getElementById('joystick');
const knob = document.getElementById('joystick-knob');
const attackBtn = document.getElementById('btn-attack');
const maxDistance = 50;
let dragging = false;

function updateKeys(dx, dy) {
  keys = { w: false, a: false, s: false, d: false, attack: keys.attack };
  const dist = Math.sqrt(dx*dx + dy*dy);
  if (dist < 10) return;
  const angle = Math.atan2(dy, dx);
  if (angle < -Math.PI/4 && angle > -3*Math.PI/4) keys.w = true;
  if (angle > Math.PI/4 && angle < 3*Math.PI/4) keys.s = true;
  if (angle > 3*Math.PI/4 || angle < -3*Math.PI/4) keys.a = true;
  if (angle > -Math.PI/4 && angle < Math.PI/4) keys.d = true;
}

joystick.addEventListener('touchstart', e => { e.preventDefault(); dragging = true; });
joystick.addEventListener('touchmove', e => {
  if (!dragging) return;
  e.preventDefault();
  const touch = e.targetTouches[0];
  let rect = joystick.getBoundingClientRect();
  let dx = touch.clientX - (rect.left + rect.width/2);
  let dy = touch.clientY - (rect.top + rect.height/2);
  const dist = Math.sqrt(dx*dx + dy*dy);
  if (dist > maxDistance) {
    dx = dx / dist * maxDistance;
    dy = dy / dist * maxDistance;
  }
  knob.style.transform = `translate(${dx}px, ${dy}px)`;
  updateKeys(dx, dy);
});
joystick.addEventListener('touchend', e => {
  e.preventDefault();
  dragging = false;
  knob.style.transform = 'translate(-50%, -50%)';
  keys = { w: false, a: false, s: false, d: false, attack: keys.attack };
});
attackBtn.addEventListener('touchstart', e => {
  e.preventDefault();
  keys.attack = true;
  attackBtn.style.background = 'rgba(255, 0, 0, 0.9)';
});
attackBtn.addEventListener('touchend', e => {
  e.preventDefault();
  keys.attack = false;
  attackBtn.style.background = 'rgba(255, 0, 0, 0.6)';
});

// Game loop
function gameLoop(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.updateAndDraw(ctx);

  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over', canvas.width/2 - 100, canvas.height/2);
    ctx.font = '24px Arial';
    ctx.fillText('Tap to restart', canvas.width/2 - 80, canvas.height/2 + 50);
    requestAnimationFrame(gameLoop);
    return;
  }

  player.move(keys);
  player.updateAttack(timestamp, keys);
  player.draw();

  // Enemy logic
  enemies.forEach(enemy => {
    enemy.moveTowards(player);
    enemy.draw();

    // Handle attack & collision
    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < (player.size + enemy.size) / 2) {
      if (player.isAttacking) {
        enemy.takeDamage();
      } else {
        if (timestamp - lastDamageTime > 500) { // .5 seconds cooldown
          player.health -= 10;
          lastDamageTime = timestamp;
          if (player.health <= 0) {
            gameOver = true;
          }
        }
      }
    }
  });

  // Draw health bar
  ctx.fillStyle = 'red';
  ctx.fillRect(20, 20, player.health * 2, 20);
  ctx.strokeStyle = 'white';
  ctx.strokeRect(20, 20, 200, 20);

  requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', () => {
  if (gameOver) {
    player.health = 100;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    enemies.forEach(e => e.reset());
    gameOver = false;
  }
});

requestAnimationFrame(gameLoop);
