// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();

const player = new Player();
let enemies = [ new Enemy(5, 5), new Enemy(-4, 3, 4), new Enemy(2, -5, 2) ];
const attackBtn = document.getElementById('btn-attack');
const restartBtn = document.getElementById('btn-restart');
let keys = { w: false, a: false, s: false, d: false, attack: false };

window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

attackBtn.addEventListener('touchstart', e => { e.preventDefault(); keys.attack = true; });
attackBtn.addEventListener('touchend', e => { e.preventDefault(); keys.attack = false; });

restartBtn.addEventListener('click', () => resetGame());

function resetGame() {
  Object.assign(player, new Player());
  enemies = [ new Enemy(5, 5), new Enemy(-4, 3, 4), new Enemy(2, -5, 2) ];
  restartBtn.style.display = 'none';
}

new VirtualJoystick((dx, dy) => {
  keys = { w: dy < -10, s: dy > 10, a: dx < -10, d: dx > 10, attack: keys.attack };
});

function drawEntity(e) {
  const scale = 100 / (e.z + 5);
  const screenX = canvas.width/2 + e.x * scale;
  const screenY = canvas.height/2 - e.y * scale;
  const size = e.size * scale;
  ctx.fillStyle = e.color;
  ctx.beginPath();
  ctx.arc(screenX, screenY, size/2, 0, Math.PI*2);
  ctx.fill();

  // health bar
  ctx.fillStyle = 'black';
  ctx.fillRect(screenX - size/2, screenY - size/2 - 10, size, 5);
  ctx.fillStyle = 'lime';
  const healthRatio = (e instanceof Player ? e.health/5 : e.health/3);
  ctx.fillRect(screenX - size/2, screenY - size/2 - 10, size * healthRatio, 5);
}

function gameLoop(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.move(keys);
  if (keys.attack) player.attack(timestamp);
  player.updateColor(timestamp);

  for (let enemy of enemies) {
    if (!enemy.isAlive()) continue;
    enemy.moveToward(player);
    if (distance(player, enemy) < 0.7 && timestamp - enemy.lastDamageTime > 500) {
      player.health--;
      enemy.lastDamageTime = timestamp;
    }
    if (player.isAttacking && distance(player, enemy) < 1 && timestamp - enemy.lastDamageTime > 500) {
      enemy.health--;
      enemy.lastDamageTime = timestamp;
    }
  }

  drawEntity(player);
  enemies.forEach(e => e.isAlive() && drawEntity(e));

  if (player.health <= 0) {
    ctx.fillStyle = 'white';
    ctx.font = '48px sans-serif';
    ctx.fillText('You Died!', canvas.width/2 - 100, canvas.height/2);
    restartBtn.style.display = 'block';
  }

  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
