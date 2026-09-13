import * as THREE from 'three';
import { EWorldCore } from './EWorldCore.js';
import { ParticleField } from './ParticleField.js';

export class SceneManager {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Mouse coordinates (target and smoothly interpolated)
    this.mouseTarget = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };

    // Scroll state
    this.scrollY = 0;
    this.scrollProgress = 0;

    this.clock = new THREE.Clock();
    this.init();
  }

  init() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050608, 0.025);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 1000);
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
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting
    this.ambientLight = new THREE.AmbientLight(0x081018, 2.5);
    this.scene.add(this.ambientLight);

    // Cursor tracking directional key light
    this.dirLight = new THREE.DirectionalLight(0x00f0ff, 3.5);
    this.dirLight.position.set(5, 5, 8);
    this.scene.add(this.dirLight);

    // Subtle warm rim light for cinematic contrast
    this.rimLight = new THREE.DirectionalLight(0xff3366, 2.0);
    this.rimLight.position.set(-6, -4, -2);
    this.scene.add(this.rimLight);

    // Secondary emerald rim light
    this.smpLight = new THREE.DirectionalLight(0x00ffa3, 1.8);
    this.smpLight.position.set(6, -4, -3);
    this.scene.add(this.smpLight);

    // 5. 3D Elements
    this.core = new EWorldCore();
    this.scene.add(this.core.group);

    this.particles = new ParticleField();
    this.scene.add(this.particles.group);

    // 6. Event Listeners
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });

    // Initial scroll setup
    this.onScroll();
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  onMouseMove(e) {
    this.mouseTarget.x = (e.clientX / this.width) * 2 - 1;
    this.mouseTarget.y = -(e.clientY / this.height) * 2 + 1;
  }

  onScroll() {
    this.scrollY = window.scrollY;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    this.scrollProgress = Math.min(1, Math.max(0, this.scrollY / maxScroll));
  }

  render() {
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Smooth lerp mouse coordinates
    this.mouse.x += (this.mouseTarget.x - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouseTarget.y - this.mouse.y) * 0.06;

    // Cinematic cursor lighting follow
    this.dirLight.position.x = this.mouse.x * 10;
    this.dirLight.position.y = this.mouse.y * 10 + 2;

    // Camera movement based on scroll and mouse
    const heroScroll = Math.min(1, this.scrollY / (window.innerHeight * 0.8));
    
    // As user scrolls, camera gently moves back and core elevates
    const targetCamZ = 11 + heroScroll * 4;
    const targetCamY = -heroScroll * 2;
    this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.05;
    this.camera.position.y += (targetCamY - this.camera.position.y) * 0.05;
    
    // Subtly tilt camera towards mouse
    this.camera.position.x = this.mouse.x * 0.8;
    this.camera.lookAt(0, targetCamY * 0.5, 0);

    // Update 3D objects
    this.core.update(delta, time, this.mouse.x, this.mouse.y);
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
