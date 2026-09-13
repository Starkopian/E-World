import * as THREE from 'three';

export class EWorldCore {
  constructor() {
    this.group = new THREE.Group();
    this.init();
  }

  init() {
    // 1. Central Core Sphere - Chrome & Glass Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(2.2, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x080808,
      emissive: 0xefff00,
      emissiveIntensity: 0.15,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.group.add(this.coreMesh);

    // 2. Wireframe Energy Cage over core
    const wireGeo = new THREE.IcosahedronGeometry(2.35, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xefff00,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    this.wireMesh = new THREE.Mesh(wireGeo, wireMat);
    this.group.add(this.wireMesh);

    // 3. Central 3D "E" Emblem
    this.emblemGroup = new THREE.Group();
    const emblemMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0xefff00,
      emissiveIntensity: 0.4
    });

    // Vertical spine of E
    const spineGeo = new THREE.BoxGeometry(0.35, 2.0, 0.35);
    const spine = new THREE.Mesh(spineGeo, emblemMat);
    spine.position.x = -0.6;
    this.emblemGroup.add(spine);

    // Top bar of E
    const topBarGeo = new THREE.BoxGeometry(1.2, 0.35, 0.35);
    const topBar = new THREE.Mesh(topBarGeo, emblemMat);
    topBar.position.set(0.0, 0.825, 0);
    this.emblemGroup.add(topBar);

    // Middle bar of E
    const midBarGeo = new THREE.BoxGeometry(0.9, 0.3, 0.35);
    const midBar = new THREE.Mesh(midBarGeo, emblemMat);
    midBar.position.set(-0.15, 0.0, 0);
    this.emblemGroup.add(midBar);

    // Bottom bar of E
    const botBarGeo = new THREE.BoxGeometry(1.2, 0.35, 0.35);
    const botBar = new THREE.Mesh(botBarGeo, emblemMat);
    botBar.position.set(0.0, -0.825, 0);
    this.emblemGroup.add(botBar);

    this.emblemGroup.position.z = 2.6;
    this.emblemGroup.scale.setScalar(1.5);
    this.emblemGroup.children.forEach(part => { part.userData.home = part.position.clone(); });
    this.group.add(this.emblemGroup);

    // 4. Orbital Ring 1: SMP Realm (Emerald Glow)
    const ring1Geo = new THREE.TorusGeometry(3.6, 0.04, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xefff00,
      emissive: 0xefff00,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8
    });
    this.ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    this.ring1.rotation.x = Math.PI * 0.35;
    this.ring1.rotation.y = Math.PI * 0.15;
    this.group.add(this.ring1);

    // 5. Orbital Ring 2: RP Realm (Crimson / Sunset Glow)
    const ring2Geo = new THREE.TorusGeometry(4.2, 0.04, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xefff00,
      emissive: 0xefff00,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8
    });
    this.ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    this.ring2.rotation.x = -Math.PI * 0.4;
    this.ring2.rotation.z = Math.PI * 0.25;
    this.group.add(this.ring2);

    // 6. Orbital Ring 3: Community Outer Ring (Cyan Glow)
    const ring3Geo = new THREE.TorusGeometry(4.8, 0.03, 16, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0xefff00,
      transparent: true,
      opacity: 0.4
    });
    this.ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    this.ring3.rotation.y = Math.PI * 0.5;
    this.group.add(this.ring3);

    // 7. Satellites / Beacons orbiting on rings
    // Beacon 1: SMP (Emerald cube nod to Minecraft)
    const beacon1Geo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const beacon1Mat = new THREE.MeshStandardMaterial({
      color: 0xefff00,
      emissive: 0xefff00,
      emissiveIntensity: 1.0,
      roughness: 0.1
    });
    this.beaconSMP = new THREE.Mesh(beacon1Geo, beacon1Mat);
    this.group.add(this.beaconSMP);

    // Beacon 2: RP (Sleek diamond nod to FiveM luxury)
    const beacon2Geo = new THREE.OctahedronGeometry(0.25, 0);
    const beacon2Mat = new THREE.MeshStandardMaterial({
      color: 0xefff00,
      emissive: 0xefff00,
      emissiveIntensity: 1.0,
      roughness: 0.1
    });
    this.beaconRP = new THREE.Mesh(beacon2Geo, beacon2Mat);
    this.group.add(this.beaconRP);

    // 8. Core Point Light
    this.coreLight = new THREE.PointLight(0xefff00, 3, 15);
    this.group.add(this.coreLight);
  }

  update(delta, time, mouseX = 0, mouseY = 0) {
    const scroll = Math.min(1, window.scrollY / window.innerHeight);
    const spread = Math.max(0, 1 - time / 1.6) * 3 + scroll * 1.4;
    this.emblemGroup.children.forEach((part, i) => {
      part.position.copy(part.userData.home);
      part.position.x += (i % 2 ? 1 : -1) * spread;
      part.position.y += (i - 1.5) * spread;
    });
    // Gentle floating bob
    this.group.position.y = Math.sin(time * 1.5) * 0.2;

    // Slow organic rotation
    this.coreMesh.rotation.y += delta * 0.3;
    this.coreMesh.rotation.x = Math.sin(time * 0.8) * 0.15;
    this.wireMesh.rotation.y -= delta * 0.2;
    this.wireMesh.rotation.z += delta * 0.1;

    // Counter-rotating orbital rings
    this.ring1.rotation.z += delta * 0.5;
    this.ring1.rotation.y += delta * 0.2;
    this.ring2.rotation.z -= delta * 0.4;
    this.ring2.rotation.x += delta * 0.15;
    this.ring3.rotation.y += delta * 0.3;

    // Animate orbiting beacons
    const angle1 = time * 0.9;
    const r1 = 3.6;
    this.beaconSMP.position.set(
      Math.cos(angle1) * r1,
      Math.sin(angle1) * r1 * 0.5,
      Math.sin(angle1) * r1 * 0.7
    );
    this.beaconSMP.rotation.x += delta * 2;
    this.beaconSMP.rotation.y += delta * 2;

    const angle2 = -time * 0.7 + 2.0;
    const r2 = 4.2;
    this.beaconRP.position.set(
      Math.sin(angle2) * r2 * 0.8,
      Math.cos(angle2) * r2 * 0.6,
      Math.cos(angle2) * r2
    );
    this.beaconRP.rotation.y += delta * 1.5;

    // Pulse core light intensity
    this.coreLight.intensity = 2.5 + Math.sin(time * 3) * 0.8;

    // 3D follow effect: Tilt core slightly towards mouse
    const targetRotX = mouseY * 0.4;
    const targetRotY = mouseX * 0.6;
    this.group.rotation.x += (targetRotX - this.group.rotation.x) * 0.05;
    this.group.rotation.y += (targetRotY - this.group.rotation.y) * 0.05;
  }
}
