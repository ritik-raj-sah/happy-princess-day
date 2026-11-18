// ==========================================
// NANDINI'S MAGICAL KINGDOM - Main Engine Coordinator
// Three.js Scene, Renderer, Camera, Lighting, Loop & Event Bus
// ==========================================

import * as THREE from './libs/three.module.js';
import { CollisionSystem } from './physics.js';
import { WorldBuilder } from './world.js';
import { CastleInterior } from './interior.js';
import { ParticleManager } from './particles.js';
import { CharacterManager } from './characters.js';
import { InteractionManager } from './interactions.js';
import { ControlsManager } from './controls.js';
import { StoryController } from './story.js';
import { audioManager } from './audio.js';

class MagicalKingdomApp {
    constructor() {
        this.container = document.getElementById('webgl-container');
        this.clock = new THREE.Clock();

        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.collision = null;
        this.world = null;
        this.interior = null;
        this.particles = null;
        this.characters = null;
        this.interactions = null;
        this.controls = null;
        this.story = null;

        this.dirLight = null;
        this.hemiLight = null;

        this.isTourRunning = false;
        this.tourTimer = null;

        try {
            this.init();
        } catch (e) {
            console.error('Initialization error:', e);
            const loader = document.getElementById('loading-screen');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => loader.style.display = 'none', 500);
            }
        }
    }

    init() {
        // 1. Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xb5e2fa); // Fairytale sky blue
        this.scene.fog = new THREE.FogExp2(0xb5e2fa, 0.0022); // Crystal-clear atmosphere, bright interiors

        // 2. Camera (Wide-angle 65° FOV for expansive room views)
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(65, aspect, 0.5, 600);
        this.camera.position.set(0, 10, 22);
        this.camera.lookAt(0, 2, 0);

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.28;
        this.container.appendChild(this.renderer.domElement);

        // 4. Fairytale Lighting
        this.setupLighting();

        // 5. Build Subsystems with True Physics & Collision
        this.collision = new CollisionSystem(this.scene);

        this.world = new WorldBuilder(this.scene, this.collision);
        this.world.buildAll();

        this.interior = new CastleInterior(this.scene, this.collision);
        this.interior.buildAll();

        this.particles = new ParticleManager(this.scene);
        this.characters = new CharacterManager(this.scene);

        // 6. Story & Celebration Manager
        this.story = new StoryController({
            onEnterKingdom: () => {
                // Glide camera down from sky to the entrance path behind Princess Nandini
                this.controls.goToLocationById('entrance');
                document.getElementById('hud-controls').classList.add('visible');
                // Show camera drag hint
                const hint = document.getElementById('camera-hint');
                if (hint) {
                    hint.classList.add('visible');
                    setTimeout(() => hint.classList.remove('visible'), 4000);
                }
                // Switch to follow mode
                setTimeout(() => { this.controls.cameraMode = 'follow'; }, 1500);
            },
            onFireworksBurst: () => {
                this.particles.launchFirework();
            }
        });

        // 7. Controls & Sliding Navigator (Integrated with Collision System)
        this.controls = new ControlsManager(
            this.camera,
            this.renderer.domElement,
            this.characters,
            this.collision,
            (location) => {
                this.onLocationChanged(location);
            }
        );

        // 8. Interaction Manager
        const allInteractive = [
            ...this.world.interactiveObjects,
            ...this.interior.interactiveObjects,
            this.characters.princess,
            this.characters.prince,
            this.characters.cat,
            ...this.particles.butterflies
        ].filter(Boolean);

        this.interactions = new InteractionManager(
            this.scene,
            this.camera,
            this.renderer.domElement,
            {
                onEnterCastle: () => {
                    this.controls.goToLocationById('hall');
                },
                onScareButterfly: (b) => {
                    this.particles.scareButterfly(b);
                },
                onFountainWish: () => {
                    this.particles.triggerFountainSurge();
                },
                onOpenGift: () => {
                    this.particles.launchFirework(0, -28);
                },
                onHeartTree: () => {
                    this.particles.launchFirework(14, 6);
                },
                onBalconyView: () => {
                    this.controls.goToLocationById('balcony');
                },
                onSit: (benchObj) => {
                    this.characters.setSitting(true);
                },
                onNavigateRoom: (roomKey) => {
                    this.controls.goToLocationById(roomKey);
                },
                onOpenPhoto: (id) => {
                    this.story.openPhotoGallery(id);
                }
            }
        );
        this.interactions.setCharacterManager(this.characters);
        this.interactions.setCollisionSystem(this.collision);
        this.interactions.setInteractiveObjects(allInteractive);

        // 9. UI Action Buttons
        this.setupUI();

        // 10. Resize Listener
        window.addEventListener('resize', () => this.onWindowResize());

        // Hide loader
        const loader = document.getElementById('loading-screen');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => loader.style.display = 'none', 800);
            }, 600);
        }

        // Start animation loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    setupLighting() {
        // Warm Ambient Light - Bright and inviting throughout
        const ambient = new THREE.AmbientLight(0xfff8ee, 0.92);
        this.scene.add(ambient);

        // Sky & Ground Hemisphere Light
        this.hemiLight = new THREE.HemisphereLight(0xffe4f0, 0x82d973, 0.75);
        this.hemiLight.position.set(0, 50, 0);
        this.scene.add(this.hemiLight);

        // Fairytale Directional Sun
        this.dirLight = new THREE.DirectionalLight(0xfffaea, 1.4);
        this.dirLight.position.set(30, 45, 25);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.dirLight.shadow.camera.near = 0.5;
        this.dirLight.shadow.camera.far = 120;
        const d = 40;
        this.dirLight.shadow.camera.left = -d;
        this.dirLight.shadow.camera.right = d;
        this.dirLight.shadow.camera.top = d;
        this.dirLight.shadow.camera.bottom = -d;
        this.dirLight.shadow.bias = -0.0005;
        this.scene.add(this.dirLight);
    }

    setupUI() {
        // Audio Mute Toggle
        const audioBtn = document.getElementById('btn-audio-toggle');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                const muted = audioManager.toggleMute();
                audioBtn.textContent = muted ? '🔇' : '🎵';
                audioBtn.classList.toggle('muted', muted);
            });
        }

        // Action Button on Mobile HUD is handled by InteractionManager (Contextual Smart Actions)

        // Guided Tour Mode Button
        const tourBtn = document.getElementById('btn-guided-tour');
        if (tourBtn) {
            tourBtn.addEventListener('click', () => {
                this.toggleGuidedTour();
            });
        }

        // Sunset Balcony Trigger
        const sunsetBtn = document.getElementById('btn-sunset-view');
        if (sunsetBtn) {
            sunsetBtn.addEventListener('click', () => {
                this.controls.goToLocationById('balcony');
            });
        }

        // Quality Toggle (Battery Saver / High Graphics)
        const qualityBtn = document.getElementById('btn-quality-toggle');
        if (qualityBtn) {
            let isHigh = true;
            qualityBtn.addEventListener('click', () => {
                isHigh = !isHigh;
                qualityBtn.textContent = isHigh ? '⚡ HQ' : '🔋 Eco';
                this.renderer.setPixelRatio(isHigh ? Math.min(window.devicePixelRatio, 2) : 1);
                this.renderer.shadowMap.enabled = isHigh;
            });
        }
    }

    toggleGuidedTour() {
        this.isTourRunning = !this.isTourRunning;
        const tourBtn = document.getElementById('btn-guided-tour');
        if (tourBtn) {
            tourBtn.classList.toggle('active', this.isTourRunning);
            tourBtn.textContent = this.isTourRunning ? '⏹️ Stop Tour' : '🚀 Guided Tour';
        }

        if (this.isTourRunning) {
            let step = 0;
            const tourSteps = [
                'entrance', 'castle', 'hall', 'livingRoom', 'diningRoom', 'kitchen',
                'bedroom', 'dressing', 'bathroom', 'guestRoom', 'giftRoom', 'photoRoom',
                'upperFloor', 'balcony', 'garden', 'fountain', 'loveGarden'
            ];
            
            const nextStep = () => {
                if (!this.isTourRunning) return;
                this.controls.goToLocationById(tourSteps[step]);
                audioManager.playSparkle();
                step = (step + 1) % tourSteps.length;
                this.tourTimer = setTimeout(nextStep, 6000);
            };
            nextStep();
        } else {
            if (this.tourTimer) clearTimeout(this.tourTimer);
        }
    }

    onLocationChanged(loc) {
        // Change sky atmosphere if balcony
        if (loc.id === 'balcony') {
            this.scene.background = new THREE.Color(0xff8576); // Sunset coral
            this.scene.fog.color = new THREE.Color(0xff8576);
            if (this.dirLight) this.dirLight.color.setHex(0xffaa77);
        } else {
            this.scene.background = new THREE.Color(0xb5e2fa); // Fairytale sky
            this.scene.fog.color = new THREE.Color(0xb5e2fa);
            if (this.dirLight) this.dirLight.color.setHex(0xfffaea);
        }
    }

    onWindowResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }

    animate() {
        requestAnimationFrame(this.animate);

        const delta = Math.min(this.clock.getDelta(), 0.1);
        const time = this.clock.getElapsedTime();

        // Update subsystems
        if (this.world) this.world.update(delta, time);
        if (this.interior) this.interior.update(delta, time);
        if (this.particles) this.particles.update(delta, time);
        if (this.characters) this.characters.update(delta, time);
        if (this.controls) this.controls.update(delta, time);

        // Smart proximity detection & Contextual Action HUD update
        if (this.interactions) this.interactions.updateProximity();

        this.renderer.render(this.scene, this.camera);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.app = new MagicalKingdomApp();
});
