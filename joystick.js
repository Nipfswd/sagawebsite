// joystick.js
class VirtualJoystick {
  constructor(callback) {
    this.joystick = document.getElementById('joystick');
    this.knob = document.getElementById('joystick-knob');
    this.maxDistance = 50;
    this.callback = callback;
    this.init();
  }

  init() {
    this.joystick.addEventListener('touchstart', e => e.preventDefault());
    this.joystick.addEventListener('touchmove', e => {
      e.preventDefault();
      const touch = e.targetTouches[0];
      const rect = this.joystick.getBoundingClientRect();
      let dx = touch.clientX - (rect.left + rect.width/2);
      let dy = touch.clientY - (rect.top + rect.height/2);
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist > this.maxDistance) {
        dx = dx / dist * this.maxDistance;
        dy = dy / dist * this.maxDistance;
      }
      this.knob.style.transform = `translate(${dx}px, ${dy}px)`;
      this.callback(dx, dy);
    });

    this.joystick.addEventListener('touchend', e => {
      e.preventDefault();
      this.knob.style.transform = 'translate(-50%, -50%)';
      this.callback(0, 0);
    });
  }
}
