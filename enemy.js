// enemy.js
class Enemy {
  constructor(x, y, health = 3) {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.size = 1;
    this.color = 'red';
    this.health = health;
    this.lastDamageTime = 0;
  }

  isAlive() {
    return this.health > 0;
  }

  moveToward(player) {
    let dx = player.x - this.x;
    let dy = player.y - this.y;
    let dist = Math.sqrt(dx*dx + dy*dy);
    if (dist > 0.5) {
      this.x += dx/dist * 0.05;
      this.y += dy/dist * 0.05;
    }
  }
}
