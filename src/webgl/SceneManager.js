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

    // Spatial scene progress (0 to 6)
    this.sceneIndex = 0;
    this.targetSceneIndex = 0;

    this.clock = new THREE.Clock();
    this.init();
  }

  init() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x06080c, 0.022);

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
    this.renderer.toneMappingExposure = 1.25;
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

    // 6. 3D Elements along the spatial corridor
    // Scene 01: The Core (at x = 0)
    this.core = new EWorldCore();
    this.scene.add(this.core.group);

    // Scene 02: SMP Monoliths (at x = 22)
    this.smpGroup = new THREE.Group();
    this.smpGroup.position.x = 22;
    this.createSMPMonoliths();
    this.scene.add(this.smpGroup);

    // Scene 03: RP Metropolis Grid (at x = 44)
    this.rpGroup = new THREE.Group();
    this.rpGroup.position.x = 44;
    this.createRPBuildings();
    this.scene.add(this.rpGroup);

    // Scene 04: Galaxy Constellation (at x = 66)
    this.galaxyGroup = new THREE.Group();
    this.galaxyGroup.position.x = 66;
    this.createGalaxyRing();
    this.scene.add(this.galaxyGroup);

    // Scene 05: Esports Trophy Monolith (at x = 88)
    this.esportsGroup = new THREE.Group();
    this.esportsGroup.position.x = 88;
    this.createEsportsPillars();
    this.scene.add(this.esportsGroup);

    // Scene 06: Creators Stage (at x = 110)
    this.creatorsGroup = new THREE.Group();
    this.creatorsGroup.position.x = 110;
    this.createCreatorsPlates();
    this.scene.add(this.creatorsGroup);

    // Scene 07: Gateway Core (at x = 132)
    this.gatewayGroup = new THREE.Group();
    this.gatewayGroup.position.x = 132;
    this.createGatewayPortal();
    this.scene.add(this.gatewayGroup);

    // Cosmic Particle Field
    this.particles = new ParticleField();
    this.scene.add(this.particles.group);

    // 7. Event Listeners
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('click', (e) => this.onClick(e));
  }

  // SMP floating voxel monoliths
  createSMPMonoliths() {
    const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x051d14,
      emissive: 0x00ffa3,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8
    });
    for (let i = 0; i < 9; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      this.smpGroup.add(mesh);
    }
  }

  // RP skyscraper silhouettes
  createRPBuildings() {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x14050a,
      emissive: 0xff3366,
      emissiveIntensity: 0.5,
      wireframe: true
    });
    for (let i = 0; i < 7; i++) {
      const h = 3 + Math.random() * 5;
      const geo = new THREE.BoxGeometry(0.8 + Math.random() * 0.8, h, 0.8 + Math.random() * 0.8);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((i - 3) * 1.5, h / 2 - 3, (Math.random() - 0.5) * 3);
      this.rpGroup.add(mesh);
    }
  }

  // Galaxy ring
  createGalaxyRing() {
    const geo = new THREE.TorusGeometry(3.5, 0.05, 16, 80);
    const mat = new THREE.MeshBasicMaterial({ color: 0x8a2be2, wireframe: true });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = Math.PI * 0.35;
    this.galaxyGroup.add(ring);
  }

  // Esports pillars
  createEsportsPillars() {
    const geo = new THREE.CylinderGeometry(0.1, 0.8, 4, 6);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1a1200,
      emissive: 0xffb703,
      emissiveIntensity: 0.7,
      metalness: 0.9,
      roughness: 0.1
    });
    const mesh = new THREE.Mesh(geo, mat);
    this.esportsGroup.add(mesh);
  }

  // Creators plates
  createCreatorsPlates() {
    const geo = new THREE.OctahedronGeometry(1.6, 0);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0
    });
    const mesh = new THREE.Mesh(geo, mat);
    this.creatorsGroup.add(mesh);
  }

  // Gateway warp ring
  createGatewayPortal() {
    const geo = new THREE.TorusGeometry(3.8, 0.15, 16, 100);
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

  setSpatialProgress(progress) {
    // progress is 0 to 6
    this.targetSceneIndex = progress;
  }

  render() {
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Damped lerp mouse coordinates
    this.mouse.x += (this.mouseTarget.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouseTarget.y - this.mouse.y) * 0.05;

    // Smooth spatial camera glide along X axis
    this.sceneIndex += (this.targetSceneIndex - this.sceneIndex) * 0.07;
    const targetCameraX = this.sceneIndex * 22;

    this.camera.position.x += (targetCameraX - this.camera.position.x) * 0.08;
    this.camera.position.y = this.mouse.y * 0.6;
    this.camera.position.z = 11 - Math.sin(this.sceneIndex * Math.PI) * 1.5;
    this.camera.lookAt(this.camera.position.x, 0, 0);

    // Update dynamic fluid ripples
    this.fluid.update();

    // Directional light tracks cursor
    this.dirLight.position.x = this.camera.position.x + this.mouse.x * 8;
    this.dirLight.position.y = this.mouse.y * 8 + 3;

    // Rotate 3D Core
    this.core.update(delta, time, this.mouse.x, this.mouse.y);

    // Rotate SMP monoliths
    if (this.smpGroup) {
      this.smpGroup.rotation.y += delta * 0.2;
      this.smpGroup.children.forEach((c, idx) => {
        c.rotation.x += delta * (0.3 + idx * 0.05);
        c.position.y += Math.sin(time * 2 + idx) * 0.005;
      });
    }

    // Rotate RP elements
    if (this.rpGroup) {
      this.rpGroup.rotation.y = Math.sin(time * 0.4) * 0.15;
    }

    // Rotate Galaxy ring
    if (this.galaxyGroup) {
      this.galaxyGroup.rotation.z += delta * 0.4;
      this.galaxyGroup.rotation.y += delta * 0.25;
    }

    // Rotate Esports & Gateway
    if (this.esportsGroup) {
      this.esportsGroup.rotation.y += delta * 0.8;
    }
    if (this.creatorsGroup) {
      this.creatorsGroup.rotation.x += delta * 0.5;
      this.creatorsGroup.rotation.y += delta * 0.7;
    }
    if (this.gatewayGroup) {
      this.gatewayGroup.rotation.z -= delta * 0.6;
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
