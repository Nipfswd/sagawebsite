<<<<<<< HEAD
export class Player {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.size = 50;
    this.speed = 5;
    this.color = '#00aaff';
    this.health = 100;
    this.isAttacking = false;
    this.attackDuration = 300;
=======
// player.js
class Player {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.size = 1;
    this.color = '#00aaff';
    this.health = 5;
    this.isAttacking = false;
>>>>>>> origin/main
    this.attackTimer = 0;
  }

  move(keys) {
<<<<<<< HEAD
    if (keys.w) this.y -= this.speed;
    if (keys.s) this.y += this.speed;
    if (keys.a) this.x -= this.speed;
    if (keys.d) this.x += this.speed;

    this.x = Math.max(this.size / 2, Math.min(this.canvas.width - this.size / 2, this.x));
    this.y = Math.max(this.size / 2, Math.min(this.canvas.height - this.size / 2, this.y));
  }

  updateAttack(timestamp, keys) {
    if (keys.attack && !this.isAttacking) {
      this.isAttacking = true;
      this.attackTimer = timestamp;
    }
    if (this.isAttacking) {
      if (timestamp - this.attackTimer < this.attackDuration) {
=======
    if (this.health <= 0) return;
    if (keys.w) this.y += 0.1;
    if (keys.s) this.y -= 0.1;
    if (keys.a) this.x -= 0.1;
    if (keys.d) this.x += 0.1;
  }

  attack(timestamp) {
    if (!this.isAttacking) {
      this.isAttacking = true;
      this.attackTimer = timestamp;
    }
  }

  updateColor(timestamp) {
    if (this.isAttacking) {
      if (timestamp - this.attackTimer < 300) {
>>>>>>> origin/main
        this.color = '#ff5500';
      } else {
        this.isAttacking = false;
        this.color = '#00aaff';
      }
    }
  }
<<<<<<< HEAD

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
  }
=======
>>>>>>> origin/main
}
