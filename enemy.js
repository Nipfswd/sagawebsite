<<<<<<< HEAD
export class Enemy {
  constructor(canvas) {
    this.canvas = canvas;
    this.size = 40;
    this.color = '#ff3333';
    this.health = 50;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
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

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
  }

  takeDamage() {
    this.health -= 10;
    if (this.health <= 0) {
      this.reset();
      this.health = 50;
=======
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
>>>>>>> origin/main
    }
  }
}
