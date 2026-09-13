import { SceneManager } from './webgl/SceneManager.js';
import { initLoader } from './components/Loader.js';
import { initLiquidCursor } from './components/LiquidCursor.js';
import { initNavbar } from './components/Navbar.js';
import { initHeroSection } from './components/HeroSection.js';
import { initChooseYourWorld } from './components/ChooseYourWorld.js';
import { initCommunityGalaxy } from './components/CommunityGalaxy.js';
import { initLiveActivity } from './components/LiveActivity.js';
import { initShowcase } from './components/Showcase.js';
import { initEventsSection } from './components/EventsSection.js';
import { initCreatorSpotlight } from './components/CreatorSpotlight.js';
import { initTimeline } from './components/Timeline.js';
import { initTeamSection } from './components/TeamSection.js';
import { initDiscordCTA } from './components/DiscordCTA.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize WebGL 3D Background Engine
  const canvasContainer = document.getElementById('webgl-canvas-container');
  let sceneManager = null;
  if (canvasContainer) {
    sceneManager = new SceneManager(canvasContainer);
    sceneManager.start();
  }

  // 2. Initialize Liquid Magnetic Cursor & Spatial Tilt
  const cursorEngine = initLiquidCursor();

  // 3. Initialize Navbar & Environmental Atmosphere
  initNavbar();

  // 4. Initialize Hero Holographic Typography
  initHeroSection();

  // 5. Initialize Choose Your World Portals (SMP & RP)
  initChooseYourWorld();

  // 6. Initialize Community Galaxy Node Network
  initCommunityGalaxy();

  // 7. Initialize Live Telemetry & Event Ticker
  initLiveActivity();

  // 8. Initialize Showcase Perspective Gallery & Number Counters
  initShowcase();

  // 9. Initialize Events Matrix & Live Countdown
  initEventsSection();

  // 10. Initialize Creator Spotlight & Application System
  initCreatorSpotlight();

  // 11. Initialize Draggable History Timeline
  initTimeline();

  // 12. Initialize Staff Council Matrix
  initTeamSection();

  // 13. Initialize Discord Command Console
  initDiscordCTA();

  // Re-attach cursor interactivity after dynamic elements render
  if (cursorEngine && cursorEngine.attachInteractivity) {
    cursorEngine.attachInteractivity();
  }

  // 14. Initialize Preloader
  initLoader(() => {
    // Post-boot adjustments
    if (cursorEngine && cursorEngine.attachInteractivity) {
      cursorEngine.attachInteractivity();
    }
  });
});
