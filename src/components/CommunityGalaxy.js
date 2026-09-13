import { soundManager } from '../audio/soundManager.js';

export function initCommunityGalaxy() {
  const canvas = document.getElementById('galaxy-canvas');
  const drawer = document.getElementById('galaxy-drawer');
  const drawerTitle = document.getElementById('galaxy-drawer-title');
  const drawerCategory = document.getElementById('galaxy-drawer-category');
  const drawerDesc = document.getElementById('galaxy-drawer-desc');
  const drawerStats = document.getElementById('galaxy-drawer-stats');
  const closeDrawerBtn = document.getElementById('galaxy-drawer-close');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  resize();
  window.addEventListener('resize', resize);

  // Nodes in the ecosystem
  const nodes = [
    {
      id: 'core',
      name: 'E-WORLD CORE',
      category: 'Ecosystem Nexus',
      radius: 34,
      color: '#00f0ff',
      glowColor: 'rgba(0, 240, 255, 0.6)',
      orbitRadius: 0,
      orbitSpeed: 0,
      angle: 0,
      desc: 'The central gravitational core connecting every gaming realm, tournament, and creator into one unified universe.',
      stats: '12,300+ Citizens • Infinite Worlds'
    },
    {
      id: 'community',
      name: 'Community Hub',
      category: 'Social Network',
      radius: 20,
      color: '#ffffff',
      glowColor: 'rgba(255, 255, 255, 0.5)',
      orbitRadius: 130,
      orbitSpeed: 0.0006,
      angle: 0.2,
      desc: 'The beating heart of E-World. Active 24/7 Discord channels, voice lounges, and community-driven events.',
      stats: '2,380+ Online • Level System Active'
    },
    {
      id: 'smp',
      name: 'E-World SMP',
      category: 'Minecraft Universe',
      radius: 24,
      color: '#00ffa3',
      glowColor: 'rgba(0, 255, 163, 0.6)',
      orbitRadius: 190,
      orbitSpeed: 0.00045,
      angle: 1.4,
      desc: 'High-performance survival multiplayer realm with custom world generation, player economy, and lore events.',
      stats: 'Version 1.21 • 82 Players Peak'
    },
    {
      id: 'rp',
      name: 'E-World RP',
      category: 'FiveM Realm',
      radius: 24,
      color: '#ff3366',
      glowColor: 'rgba(255, 51, 102, 0.6)',
      orbitRadius: 190,
      orbitSpeed: -0.0004,
      angle: 3.8,
      desc: 'Immersive roleplay city powered by custom FiveM scripts, realistic economy, and cinematic emergency services.',
      stats: 'Build b3095 • 126 Players Peak'
    },
    {
      id: 'events',
      name: 'Events & Ops',
      category: 'Community Ops',
      radius: 17,
      color: '#ffb703',
      glowColor: 'rgba(255, 183, 3, 0.5)',
      orbitRadius: 140,
      orbitSpeed: -0.0007,
      angle: 2.6,
      desc: 'Weekly server events, scavenger hunts, movie nights, and seasonal cross-game celebrations.',
      stats: '140+ Events Hosted'
    },
    {
      id: 'creators',
      name: 'Creators Guild',
      category: 'Talent & Media',
      radius: 18,
      color: '#a855f7',
      glowColor: 'rgba(168, 85, 247, 0.5)',
      orbitRadius: 210,
      orbitSpeed: 0.0003,
      angle: 4.8,
      desc: 'Partnered streamers and YouTube content creators producing stories, guides, and cinematics.',
      stats: '400K+ Combined Audience'
    },
    {
      id: 'tournaments',
      name: 'Competitive Arena',
      category: 'Esports League',
      radius: 19,
      color: '#0077fe',
      glowColor: 'rgba(0, 119, 254, 0.5)',
      orbitRadius: 220,
      orbitSpeed: -0.00035,
      angle: 5.5,
      desc: 'Sanctioned esports tournaments with prize pools, live broadcast casting, and competitive anti-cheat.',
      stats: 'CODM S&D • $1,500+ Prize Pools'
    },
    {
      id: 'giveaways',
      name: 'Giveaway Vault',
      category: 'Rewards',
      radius: 16,
      color: '#ec4899',
      glowColor: 'rgba(236, 72, 153, 0.5)',
      orbitRadius: 110,
      orbitSpeed: 0.0008,
      angle: 3.2,
      desc: 'Monthly Discord Nitro, gaming peripherals, VIP server passes, and in-game rare collectible drops.',
      stats: 'Weekly Vault Unlocks'
    },
    {
      id: 'staff',
      name: 'Staff & Security',
      category: 'Governance',
      radius: 16,
      color: '#f97316',
      glowColor: 'rgba(249, 115, 22, 0.5)',
      orbitRadius: 160,
      orbitSpeed: 0.0005,
      angle: 0.8,
      desc: 'Dedicated 24/7 moderation, community managers, and player support officers safeguarding the realms.',
      stats: '32 Active Team Members'
    },
    {
      id: 'development',
      name: 'Dev Lab',
      category: 'Engineering',
      radius: 16,
      color: '#06b6d4',
      glowColor: 'rgba(6, 182, 212, 0.5)',
      orbitRadius: 235,
      orbitSpeed: -0.00025,
      angle: 2.1,
      desc: 'Continuous engineering of proprietary server plugins, web telemetry bridges, and anti-lag optimizations.',
      stats: 'Daily Git Builds'
    }
  ];

  let hoveredNode = null;
  let selectedNode = null;
  let mouse = { x: -1000, y: -1000 };
  let rotationOffset = 0;
  let isDragging = false;
  let dragStartX = 0;

  // Interaction handlers
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    if (isDragging) {
      const deltaX = e.clientX - dragStartX;
      rotationOffset += deltaX * 0.003;
      dragStartX = e.clientX;
    }
  });

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStartX = e.clientX;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  canvas.addEventListener('click', () => {
    if (hoveredNode) {
      selectedNode = hoveredNode;
      soundManager.playNodeChime();
      openDrawer(selectedNode);
    }
  });

  function openDrawer(node) {
    if (!drawer) return;
    drawerTitle.textContent = node.name;
    drawerCategory.textContent = node.category;
    drawerDesc.textContent = node.desc;
    drawerStats.textContent = node.stats;
    drawer.classList.add('active');
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', () => {
      drawer.classList.remove('active');
      soundManager.playClick();
    });
  }

  // Render loop
  let lastTime = performance.now();

  function animate(now) {
    const dt = now - lastTime;
    lastTime = now;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // Background orbital grid rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    [110, 140, 190, 225].forEach((r) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    let currentHover = null;

    // Calculate node positions
    nodes.forEach((node) => {
      if (node.id !== 'core') {
        node.angle += node.orbitSpeed * (dt || 16);
      }

      const effectiveAngle = node.angle + rotationOffset;
      node.x = centerX + Math.cos(effectiveAngle) * node.orbitRadius;
      node.y = centerY + Math.sin(effectiveAngle) * node.orbitRadius;

      // Check hover
      const dx = mouse.x - node.x;
      const dy = mouse.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < node.radius + 6) {
        currentHover = node;
      }
    });

    if (currentHover !== hoveredNode) {
      hoveredNode = currentHover;
      if (hoveredNode) soundManager.playHover();
    }

    const core = nodes[0];

    // 1. Draw glowing energetic connection lines
    nodes.forEach((node) => {
      if (node.id === 'core') return;

      const isConnectedToHovered = hoveredNode && (hoveredNode.id === node.id || hoveredNode.id === 'core');
      ctx.beginPath();
      ctx.moveTo(core.x, core.y);

      // Curved bezier towards orbital position
      const midX = (core.x + node.x) / 2 + (node.y - core.y) * 0.15;
      const midY = (core.y + node.y) / 2 - (node.x - core.x) * 0.15;
      ctx.quadraticCurveTo(midX, midY, node.x, node.y);

      if (isConnectedToHovered) {
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // 2. Draw Nodes
    nodes.forEach((node) => {
      const isHovered = hoveredNode === node;
      const isSelected = selectedNode === node;
      const r = isHovered ? node.radius * 1.25 : node.radius;

      // Outer glow aura
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + (isHovered ? 12 : 6), 0, Math.PI * 2);
      ctx.fillStyle = node.glowColor;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = isHovered ? 25 : 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Core circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Border ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 2, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = isSelected ? 2.5 : 1;
      ctx.stroke();

      // Node label
      ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.8)';
      ctx.font = isHovered ? 'bold 12px JetBrains Mono' : '10px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, node.x, node.y + r + 15);
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
