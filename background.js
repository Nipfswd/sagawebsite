// background.js

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speed = Math.random() * 0.5 + 0.2;
    this.alpha = Math.random() * 0.5 + 0.3;
  }

  update() {
    this.y += this.speed;
    if (this.y > canvas.height) this.reset();
  }

  draw(ctx) {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Background {
  constructor(numParticles = 50) {
    this.particles = Array.from({ length: numParticles }, () => new Particle());
  }

  updateAndDraw(ctx) {
    for (let p of this.particles) {
      p.update();
      p.draw(ctx);
    }
  }
}
