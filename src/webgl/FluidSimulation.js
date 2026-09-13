import * as THREE from 'three';

export class FluidSimulation {
  constructor(width, height) {
    this.width = Math.floor(width / 2);
    this.height = Math.floor(height / 2);

    // 2D Offscreen Canvas for Fast Ripple Physics Simulation
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');

    // Create Three.js dynamic CanvasTexture
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    // Ripple Points Array
    this.ripples = [];
    this.maxRipples = 32;

    // Mouse velocity tracking
    this.lastMouse = { x: 0, y: 0 };
    this.velocity = 0;
  }

  addDrop(normX, normY, strength = 1.0) {
    const x = normX * this.width;
    const y = normY * this.height;

    this.ripples.push({
      x,
      y,
      radius: 2,
      maxRadius: Math.min(this.width, this.height) * 0.45,
      alpha: Math.min(1.0, strength * 0.9),
      speed: 4.5 + strength * 2.0
    });

    if (this.ripples.length > this.maxRipples) {
      this.ripples.shift();
    }
  }

  onMouseMove(clientX, clientY, winW, winH) {
    const dx = clientX - this.lastMouse.x;
    const dy = clientY - this.lastMouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    this.velocity = Math.min(dist / 12, 2.5);

    if (dist > 8) {
      const normX = clientX / winW;
      const normY = clientY / winH;
      this.addDrop(normX, normY, this.velocity * 0.5);
      this.lastMouse = { x: clientX, y: clientY };
    }
  }

  update() {
    // Clear with slight decay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += r.speed;
      r.alpha *= 0.94;

      if (r.alpha < 0.01 || r.radius > r.maxRadius) {
        this.ripples.splice(i, 1);
        continue;
      }

      // Draw concentric wave ring
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(0, 240, 255, ${r.alpha})`;
      this.ctx.lineWidth = Math.max(1, 4 * (1 - r.radius / r.maxRadius));
      this.ctx.stroke();

      // Outer refraction echo
      if (r.radius > 15) {
        this.ctx.beginPath();
        this.ctx.arc(r.x, r.y, r.radius * 0.8, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(255, 51, 102, ${r.alpha * 0.4})`;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
    }

    this.texture.needsUpdate = true;
  }

  resize(w, h) {
    this.width = Math.floor(w / 2);
    this.height = Math.floor(h / 2);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }
}
