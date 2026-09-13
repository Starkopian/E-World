import * as THREE from 'three';
import { EWorldCore } from './EWorldCore.js';
import { ParticleField } from './ParticleField.js';
import { FluidSimulation } from './FluidSimulation.js';

export class SceneManager {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Mouse coordinates (interpolated with damping)
    this.mouseTarget = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };

    // Vertical tree scroll progress (0.0 at root to 1.0 at apex crown)
    this.treeProgress = 0;
    this.targetTreeProgress = 0;

    this.clock = new THREE.Clock();
    this.init();
  }

  init() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x06080c, 0.02);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(48, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 0, 11);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    this.container.appendChild(this.renderer.domElement);

    // 4. Fluid Simulation Engine
    this.fluid = new FluidSimulation(this.width, this.height);

    // 5. Lighting
    this.ambientLight = new THREE.AmbientLight(0x0a1018, 2.8);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0x00f0ff, 4.0);
    this.dirLight.position.set(5, 6, 8);
    this.scene.add(this.dirLight);

    this.rimLight = new THREE.DirectionalLight(0xff3366, 2.5);
    this.rimLight.position.set(-8, -4, -3);
    this.scene.add(this.rimLight);

    this.smpLight = new THREE.DirectionalLight(0x00ffa3, 2.5);
    this.smpLight.position.set(8, -4, -3);
    this.scene.add(this.smpLight);

    // 6. 3D Elements arranged along the vertical tree spine (Y-axis descent)
    // Node 01: Root Core (at y = 0)
    this.core = new EWorldCore();
    this.core.group.position.set(0, 0, 0);
    this.scene.add(this.core.group);

    // Node 02: SMP Branch (at y = -16, x = -3)
    this.smpGroup = new THREE.Group();
    this.smpGroup.position.set(-3.5, -16, -1);
    this.createSMPMonoliths();
    this.scene.add(this.smpGroup);

    // Node 03: RP Branch (at y = -32, x = 3.5)
    this.rpGroup = new THREE.Group();
    this.rpGroup.position.set(3.5, -32, -1);
    this.createRPBuildings();
    this.scene.add(this.rpGroup);

    // Node 04: Galaxy Junction (at y = -48, x = 0)
    this.galaxyGroup = new THREE.Group();
    this.galaxyGroup.position.set(0, -48, 0);
    this.createGalaxyRing();
    this.scene.add(this.galaxyGroup);

    // Node 05: Esports Branch (at y = -64, x = -3.5)
    this.esportsGroup = new THREE.Group();
    this.esportsGroup.position.set(-3.5, -64, -1);
    this.createEsportsPillars();
    this.scene.add(this.esportsGroup);

    // Node 06: Creators Branch (at y = -80, x = 3.5)
    this.creatorsGroup = new THREE.Group();
    this.creatorsGroup.position.set(3.5, -80, -1);
    this.createCreatorsPlates();
    this.scene.add(this.creatorsGroup);

    // Node 07: Crown Gateway (at y = -96, x = 0)
    this.gatewayGroup = new THREE.Group();
    this.gatewayGroup.position.set(0, -96, 0);
    this.createGatewayPortal();
    this.scene.add(this.gatewayGroup);

    // Vertical Central Glowing Tree Trunk Guide in 3D
    this.createTreeEnergyStem();

    // Cosmic Particle Field
    this.particles = new ParticleField();
    this.scene.add(this.particles.group);

    // 7. Event Listeners
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('click', (e) => this.onClick(e));
  }

  // 3D Glowing energy trunk line in Three.js
  createTreeEnergyStem() {
    const points = [];
    const totalSegments = 100;
    for (let i = 0; i <= totalSegments; i++) {
      const y = -(i / totalSegments) * 96;
      const x = Math.sin(i * 0.3) * 0.4;
      const z = Math.cos(i * 0.25) * 0.4 - 1.5;
      points.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 120, 0.04, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.7
    });
    this.treeStem = new THREE.Mesh(tubeGeo, tubeMat);
    this.scene.add(this.treeStem);
  }

  createSMPMonoliths() {
    const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x051d14,
      emissive: 0x00ffa3,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8
    });
    for (let i = 0; i < 7; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      this.smpGroup.add(mesh);
    }
  }

  createRPBuildings() {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x14050a,
      emissive: 0xff3366,
      emissiveIntensity: 0.6,
      wireframe: true
    });
    for (let i = 0; i < 6; i++) {
      const h = 2.5 + Math.random() * 4;
      const geo = new THREE.BoxGeometry(0.8, h, 0.8);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((i - 2.5) * 1.2, h / 2 - 2, (Math.random() - 0.5) * 2);
      this.rpGroup.add(mesh);
    }
  }

  createGalaxyRing() {
    const geo = new THREE.TorusGeometry(3.2, 0.06, 16, 80);
    const mat = new THREE.MeshBasicMaterial({ color: 0x8a2be2, wireframe: true });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = Math.PI * 0.35;
    this.galaxyGroup.add(ring);
  }

  createEsportsPillars() {
    const geo = new THREE.CylinderGeometry(0.1, 0.7, 3.5, 6);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1a1200,
      emissive: 0xffb703,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });
    const mesh = new THREE.Mesh(geo, mat);
    this.esportsGroup.add(mesh);
  }

  createCreatorsPlates() {
    const geo = new THREE.OctahedronGeometry(1.5, 0);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0
    });
    const mesh = new THREE.Mesh(geo, mat);
    this.creatorsGroup.add(mesh);
  }

  createGatewayPortal() {
    const geo = new THREE.TorusGeometry(3.6, 0.15, 16, 100);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.2
    });
    const mesh = new THREE.Mesh(geo, mat);
    this.gatewayGroup.add(mesh);
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.fluid.resize(this.width, this.height);
  }

  onMouseMove(e) {
    this.mouseTarget.x = (e.clientX / this.width) * 2 - 1;
    this.mouseTarget.y = -(e.clientY / this.height) * 2 + 1;
    this.fluid.onMouseMove(e.clientX, e.clientY, this.width, this.height);
  }

  onClick(e) {
    const normX = e.clientX / this.width;
    const normY = e.clientY / this.height;
    this.fluid.addDrop(normX, normY, 1.8);
  }

  setTreeScrollProgress(progress) {
    // progress is 0.0 to 1.0
    this.targetTreeProgress = Math.max(0, Math.min(1, progress));
  }

  render() {
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Damped mouse interpolation
    this.mouse.x += (this.mouseTarget.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouseTarget.y - this.mouse.y) * 0.05;

    // Smooth tree vertical descent
    this.treeProgress += (this.targetTreeProgress - this.treeProgress) * 0.06;
    const targetCameraY = -this.treeProgress * 96;

    // Subtly sway camera left/right to focus on active branch
    const swayX = Math.sin(this.treeProgress * Math.PI * 5) * 1.5;

    this.camera.position.y += (targetCameraY - this.camera.position.y) * 0.07;
    this.camera.position.x = swayX + this.mouse.x * 0.6;
    this.camera.position.z = 11 + Math.sin(this.treeProgress * Math.PI * 6) * 1.0;
    this.camera.lookAt(swayX * 0.5, this.camera.position.y, 0);

    // Update dynamic fluid ripples
    this.fluid.update();

    // Directional light tracks camera & cursor
    this.dirLight.position.x = this.camera.position.x + this.mouse.x * 6;
    this.dirLight.position.y = this.camera.position.y + this.mouse.y * 6 + 3;

    // Rotate 3D Core
    this.core.update(delta, time, this.mouse.x, this.mouse.y);

    // Rotate SMP monoliths
    if (this.smpGroup) {
      this.smpGroup.rotation.y += delta * 0.3;
      this.smpGroup.children.forEach((c, idx) => {
        c.rotation.x += delta * (0.2 + idx * 0.05);
      });
    }

    // Rotate RP elements
    if (this.rpGroup) {
      this.rpGroup.rotation.y = Math.sin(time * 0.5) * 0.2;
    }

    // Rotate Galaxy ring
    if (this.galaxyGroup) {
      this.galaxyGroup.rotation.z += delta * 0.4;
      this.galaxyGroup.rotation.y += delta * 0.3;
    }

    // Rotate Esports & Gateway
    if (this.esportsGroup) {
      this.esportsGroup.rotation.y += delta * 0.7;
    }
    if (this.creatorsGroup) {
      this.creatorsGroup.rotation.x += delta * 0.5;
      this.creatorsGroup.rotation.y += delta * 0.6;
    }
    if (this.gatewayGroup) {
      this.gatewayGroup.rotation.z -= delta * 0.5;
    }

    // Update particles
    this.particles.update(delta, time, this.mouse.x, this.mouse.y);

    this.renderer.render(this.scene, this.camera);
  }

  start() {
    const loop = () => {
      this.render();
      requestAnimationFrame(loop);
    };
    loop();
  }
}
