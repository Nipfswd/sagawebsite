export function setupInput(keys) {
  const joystick = document.getElementById('joystick');
  const knob = document.getElementById('joystick-knob');
  const attackBtn = document.getElementById('btn-attack');

  let dragging = false;
  const maxDistance = 50;

  function updateKeys(dx, dy) {
    keys.w = keys.a = keys.s = keys.d = false;
    const distance = Math.sqrt(dx*dx + dy*dy);
    if(distance < 10) return;
    const angle = Math.atan2(dy, dx);
    if(angle < -Math.PI/4 && angle > -3*Math.PI/4) keys.w = true;
    if(angle > Math.PI/4 && angle < 3*Math.PI/4) keys.s = true;
    if(angle > 3*Math.PI/4 || angle < -3*Math.PI/4) keys.a = true;
    if(angle > -Math.PI/4 && angle < Math.PI/4) keys.d = true;
  }

  joystick.addEventListener('touchstart', e => { e.preventDefault(); dragging = true; });
  joystick.addEventListener('touchmove', e => {
    if (!dragging) return;
    e.preventDefault();
    const touch = e.targetTouches[0];
    const rect = joystick.getBoundingClientRect();
    let dx = touch.clientX - (rect.left + rect.width/2);
    let dy = touch.clientY - (rect.top + rect.height/2);
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist > maxDistance) { dx = dx / dist * maxDistance; dy = dy / dist * maxDistance; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    updateKeys(dx, dy);
  });
  joystick.addEventListener('touchend', e => {
    e.preventDefault();
    dragging = false;
    knob.style.transform = 'translate(-50%, -50%)';
    keys.w = keys.a = keys.s = keys.d = false;
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
}
