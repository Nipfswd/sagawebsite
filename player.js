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
    this.attackTimer = 0;
  }

  move(keys) {
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
        this.color = '#ff5500';
      } else {
        this.isAttacking = false;
        this.color = '#00aaff';
      }
    }
  }
}
