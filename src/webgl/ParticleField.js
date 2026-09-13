import * as THREE from 'three';

export class ParticleField {
  constructor() {
    this.group = new THREE.Group();
    this.particleCount = 1400;
    this.init();
  }

  init() {
    // 1. Digital Dust / Starfield
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const scales = new Float32Array(this.particleCount);

    const cyan = new THREE.Color(0x00f0ff);
    const emerald = new THREE.Color(0x00ffa3);
    const crimson = new THREE.Color(0xff3366);
    const white = new THREE.Color(0xe2e8f0);

    for (let i = 0; i < this.particleCount; i++) {
      // Spread across deep space volume
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5;

      scales[i] = Math.random() * 2.5 + 0.8;

      // Color distribution: mostly starlight with occasional cyan, emerald, crimson sparks
      const rand = Math.random();
      let c = white;
      if (rand > 0.85) c = cyan;
      else if (rand > 0.72) c = emerald;
      else if (rand > 0.60) c = crimson;

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Custom circular soft particle texture via canvas
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(0,240,255,0.7)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.35,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.points = new THREE.Points(geometry, material);
    this.group.add(this.points);

    // 2. Liquid Reflective Grid Surface Below Core (y = -4)
    const gridGeo = new THREE.PlaneGeometry(60, 60, 40, 40);
    const gridMat = new THREE.MeshStandardMaterial({
      color: 0x050811,
      roughness: 0.1,
      metalness: 0.95,
      wireframe: true,
      emissive: 0x002233,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.25
    });

    this.gridMesh = new THREE.Mesh(gridGeo, gridMat);
    this.gridMesh.rotation.x = -Math.PI / 2;
    this.gridMesh.position.y = -4.5;
    this.group.add(this.gridMesh);
  }

  update(delta, time, mouseX = 0, mouseY = 0) {
    // Slowly rotate particle field
    this.points.rotation.y = time * 0.02 + mouseX * 0.1;
    this.points.rotation.x = Math.sin(time * 0.03) * 0.05 + mouseY * 0.05;

    // Liquid surface wave motion
    if (this.gridMesh) {
      const pos = this.gridMesh.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        const z = Math.sin(u * 0.2 + time * 1.5) * Math.cos(v * 0.2 + time * 1.2) * 0.35;
        pos.setZ(i, z);
      }
      this.gridMesh.geometry.attributes.position.needsUpdate = true;
    }
  }
}
