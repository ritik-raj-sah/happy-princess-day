// ==========================================
// NANDINI'S MAGICAL KINGDOM - Full Open-World Player Controller
// Real 3rd-Person Movement, Follow Camera, Mobile Joystick, Collision System, Staircase & 13-Room Palace
// ==========================================

import * as THREE from './libs/three.module.js';

export class ControlsManager {
    constructor(camera, domElement, characterManager, collisionSystem, onLocationChange) {
        this.camera = camera;
        this.domElement = domElement;
        this.charManager = characterManager;
        this.collision = collisionSystem;
        this.onLocationChange = onLocationChange;

        // ---- Movement Config ----
        this.walkSpeed = 5.0;
        this.runSpeed = 9.0;
        this.isRunning = false;

        // ---- Third-Person Camera Config (Grand Spacious Exploration) ----
        this.cameraYaw = 0;            // horizontal rotation around character
        this.cameraPitch = 0.42;       // vertical angle (radians, ~24° top-down for clear floor & room visibility)
        this.cameraDistance = 8.5;     // distance from character (spacious view)
        this.cameraHeightOffset = 2.0; // look target height
        this.cameraTargetPos = new THREE.Vector3(0, 6, 16);
        this.cameraCurrentPos = new THREE.Vector3(0, 6, 16);
        this.cameraCurrentLook = new THREE.Vector3(0, 2, 0);
        this.cameraMode = 'follow';    // Start immediately in follow mode for crisp direct control

        // Cinematic glide targets
        this.cinematicTargetPos = new THREE.Vector3(0, 16, 42);
        this.cinematicTargetLook = new THREE.Vector3(0, 6, -14);

        // ---- Input State ----
        this.joystickVector = new THREE.Vector2(0, 0);
        this.isJoystickActive = false;
        this.keys = { forward: false, backward: false, left: false, right: false, run: false };

        // Camera drag (right side of screen)
        this.cameraDragActive = false;
        this.cameraDragLastX = 0;
        this.cameraDragLastY = 0;

        // ---- Continuous Connected Locations ----
        this.locations = [
            { id: 'entrance',   name: '🏰 Kingdom Entrance',     charPos: [0, 0, 12],       pos: [0, 7, 20],        look: [0, 3, 10] },
            { id: 'castle',     name: '🏯 Royal Castle',          charPos: [0, 1.0, -5],     pos: [0, 7, 4],         look: [0, 4, -8] },
            { id: 'hall',       name: '🏛️ Grand Royal Hall',     charPos: [0, 1.0, -11],    pos: [0, 5.5, -9],      look: [0, 3.5, -17] },
            { id: 'livingRoom', name: '🛋️ Royal Living Room',    charPos: [-22, 1.0, -15],  pos: [-22, 5.0, -9],    look: [-22, 2.8, -16] },
            { id: 'diningRoom', name: '🍷 Dining Room',           charPos: [-22, 1.0, -29],  pos: [-22, 5.0, -23],   look: [-22, 2.8, -30] },
            { id: 'kitchen',    name: '🍳 Royal Kitchen',         charPos: [-22, 1.0, -44],  pos: [-22, 5.0, -38],   look: [-22, 2.8, -45] },
            { id: 'bedroom',    name: '🛏️ Princess Bedroom',      charPos: [22, 1.0, -15],   pos: [22, 5.0, -9],     look: [22, 2.8, -16] },
            { id: 'dressing',   name: '👗 Dressing Room',         charPos: [25, 1.0, -30],   pos: [25, 5.0, -24],    look: [25, 2.8, -31] },
            { id: 'bathroom',   name: '🛁 Royal Bathroom',        charPos: [13, 1.0, -30],   pos: [13, 5.0, -24],    look: [13, 2.8, -31] },
            { id: 'guestRoom',  name: '✨ Guest Bedroom',         charPos: [22, 1.0, -45],   pos: [22, 5.0, -39],    look: [22, 2.8, -46] },
            { id: 'giftRoom',   name: '🎁 Magical Gift Room',     charPos: [0, 1.0, -28],    pos: [0, 5.0, -22],     look: [0, 3.0, -29] },
            { id: 'photoRoom',  name: '📸 Memory Gallery',        charPos: [0, 1.0, -44],    pos: [0, 5.0, -38],     look: [0, 3.0, -45] },
            { id: 'upperFloor', name: '🔭 Royal Observatory',     charPos: [0, 6.0, -13],    pos: [0, 9.5, -8],      look: [0, 7.5, -16] },
            { id: 'balcony',    name: '🌅 Sunset Balcony',        charPos: [0, 6.0, -4.5],   pos: [0, 9.0, -9],      look: [0, 7.0, 5] },
            { id: 'garden',     name: '🌸 Fairytale Garden',      charPos: [8, 0, 4],        pos: [8, 5.5, 10],      look: [8, 2.5, 0] },
            { id: 'fountain',   name: '⛲ Royal Fountain',        charPos: [-12, 0, 6],      pos: [-12, 5, 11],      look: [-12, 2.5, 2] },
            { id: 'loveGarden', name: '💕 Love Garden',           charPos: [14, 0, 8],       pos: [14, 6.5, 14],     look: [14, 4.5, 4] }
        ];
        this.currentLocationIdx = 0;

        // UI Elements
        this.joystickBase = document.getElementById('joystick-base');
        this.joystickStick = document.getElementById('joystick-stick');

        this.initJoystick();
        this.initKeyboard();
        this.initRunButton();
        this.initCameraDrag();
        this.initLocationSlider();
        this.initDebugKey();
    }

    setCollisionSystem(col) {
        this.collision = col;
    }

    // ===========================
    // 1. VIRTUAL JOYSTICK (Mobile)
    // ===========================
    initJoystick() {
        if (!this.joystickBase || !this.joystickStick) return;
        const maxDist = 50;
        let baseRect = null;

        const getTouch = (e) => {
            for (let t of e.touches) {
                if (baseRect && t.clientX < window.innerWidth * 0.42 && t.clientY > window.innerHeight * 0.52) {
                    return t;
                }
            }
            return e.touches[0];
        };

        this.joystickBase.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isJoystickActive = true;
            baseRect = this.joystickBase.getBoundingClientRect();
            this._updateJoystick(e.touches[0].clientX, e.touches[0].clientY, baseRect, maxDist);
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!this.isJoystickActive) return;
            const t = getTouch(e);
            if (t) this._updateJoystick(t.clientX, t.clientY, baseRect, maxDist);
        }, { passive: false });

        window.addEventListener('touchend', (e) => {
            let stillActive = false;
            for (let t of e.touches) {
                if (t.clientX < window.innerWidth * 0.42 && t.clientY > window.innerHeight * 0.52) {
                    stillActive = true;
                    break;
                }
            }
            if (!stillActive) {
                this.isJoystickActive = false;
                this.joystickVector.set(0, 0);
                if (this.joystickStick) this.joystickStick.style.transform = 'translate(0px, 0px)';
            }
        });
    }

    _updateJoystick(clientX, clientY, baseRect, maxDist) {
        const cx = baseRect.left + baseRect.width / 2;
        const cy = baseRect.top  + baseRect.height / 2;
        let dx = clientX - cx;
        let dy = clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > maxDist) { dx = dx/dist * maxDist; dy = dy/dist * maxDist; }
        if (this.joystickStick) this.joystickStick.style.transform = `translate(${dx}px,${dy}px)`;
        this.joystickVector.set(dx / maxDist, dy / maxDist);
    }

    // ===========================
    // 2. KEYBOARD (Desktop)
    // ===========================
    initKeyboard() {
        window.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'KeyW': case 'ArrowUp':    this.keys.forward = true; break;
                case 'KeyS': case 'ArrowDown':  this.keys.backward = true; break;
                case 'KeyA': case 'ArrowLeft':  this.keys.left = true; break;
                case 'KeyD': case 'ArrowRight': this.keys.right = true; break;
                case 'ShiftLeft': case 'ShiftRight': this.keys.run = true; break;
            }
        });
        window.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'KeyW': case 'ArrowUp':    this.keys.forward = false; break;
                case 'KeyS': case 'ArrowDown':  this.keys.backward = false; break;
                case 'KeyA': case 'ArrowLeft':  this.keys.left = false; break;
                case 'KeyD': case 'ArrowRight': this.keys.right = false; break;
                case 'ShiftLeft': case 'ShiftRight': this.keys.run = false; break;
            }
        });
    }

    initDebugKey() {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'F2') {
                if (this.collision) {
                    const active = this.collision.toggleDebug();
                    console.log('Visual collision debug mode:', active ? 'ON' : 'OFF');
                }
            }
        });
        window.toggleDebugCollisions = () => {
            if (this.collision) return this.collision.toggleDebug();
        };
    }

    // ===========================
    // 3. RUN BUTTON (Mobile)
    // ===========================
    initRunButton() {
        const runBtn = document.getElementById('btn-run');
        if (runBtn) {
            runBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.isRunning = true; }, { passive: false });
            runBtn.addEventListener('touchend', () => { this.isRunning = false; });
            runBtn.addEventListener('mousedown', () => { this.isRunning = true; });
            runBtn.addEventListener('mouseup', () => { this.isRunning = false; });
        }
    }

    // ===========================
    // 4. CAMERA DRAG
    // ===========================
    initCameraDrag() {
        this.domElement.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                this.cameraDragActive = true;
                this.cameraDragLastX = e.clientX;
                this.cameraDragLastY = e.clientY;
            }
        });
        window.addEventListener('mousemove', (e) => {
            if (!this.cameraDragActive) return;
            const dx = e.clientX - this.cameraDragLastX;
            const dy = e.clientY - this.cameraDragLastY;
            this.cameraDragLastX = e.clientX;
            this.cameraDragLastY = e.clientY;
            if (this.cameraMode === 'follow') {
                this.cameraYaw -= dx * 0.012;
                this.cameraPitch = Math.max(-0.2, Math.min(0.8, this.cameraPitch + dy * 0.008));
            }
        });
        window.addEventListener('mouseup', () => { this.cameraDragActive = false; });

        this.domElement.addEventListener('touchstart', (e) => {
            for (let t of e.touches) {
                if (t.clientX > window.innerWidth * 0.42 && this.cameraMode === 'follow') {
                    this.cameraDragActive = true;
                    this.cameraDragLastX = t.clientX;
                    this.cameraDragLastY = t.clientY;
                    this._cameraDragTouchId = t.identifier;
                    break;
                }
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!this.cameraDragActive) return;
            for (let t of e.touches) {
                if (t.identifier === this._cameraDragTouchId) {
                    const dx = t.clientX - this.cameraDragLastX;
                    const dy = t.clientY - this.cameraDragLastY;
                    this.cameraDragLastX = t.clientX;
                    this.cameraDragLastY = t.clientY;
                    this.cameraYaw -= dx * 0.012;
                    this.cameraPitch = Math.max(-0.2, Math.min(0.8, this.cameraPitch + dy * 0.008));
                    break;
                }
            }
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            for (let t of e.changedTouches) {
                if (t.identifier === this._cameraDragTouchId) {
                    this.cameraDragActive = false;
                    break;
                }
            }
        });

        this.domElement.addEventListener('wheel', (e) => {
            this.cameraDistance = Math.max(3.0, Math.min(18.0, this.cameraDistance + e.deltaY * 0.02));
        }, { passive: true });
    }

    // ===========================
    // 5. LOCATION SLIDER
    // ===========================
    initLocationSlider() {
        const container = document.getElementById('location-pills');
        if (!container) return;
        container.innerHTML = '';
        this.locations.forEach((loc, idx) => {
            const pill = document.createElement('button');
            pill.className = `location-pill ${idx === 0 ? 'active' : ''}`;
            pill.textContent = loc.name;
            pill.addEventListener('click', () => this.goToLocation(idx));
            container.appendChild(pill);
        });

        const prevBtn = document.getElementById('btn-prev-loc');
        const nextBtn = document.getElementById('btn-next-loc');
        if (prevBtn) prevBtn.addEventListener('click', () => this.goToLocation((this.currentLocationIdx - 1 + this.locations.length) % this.locations.length));
        if (nextBtn) nextBtn.addEventListener('click', () => this.goToLocation((this.currentLocationIdx + 1) % this.locations.length));
    }

    goToLocation(index) {
        if (index < 0 || index >= this.locations.length) return;
        this.currentLocationIdx = index;
        const loc = this.locations[index];

        if (loc.charPos && this.charManager && this.charManager.princess) {
            this.charManager.standUp();
            this.charManager.princess.position.set(loc.charPos[0], loc.charPos[1], loc.charPos[2]);
            if (this.charManager.prince) {
                this.charManager.prince.position.set(loc.charPos[0] + 1.2, loc.charPos[1], loc.charPos[2]);
            }
        }

        this.cinematicTargetPos.set(...loc.pos);
        this.cinematicTargetLook.set(...loc.look);
        this.cameraMode = 'cinematic';

        document.querySelectorAll('.location-pill').forEach((p, i) => {
            p.classList.toggle('active', i === index);
            if (i === index) p.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        });

        const hud = document.getElementById('hud-location-name');
        if (hud) hud.textContent = loc.name;

        if (this.onLocationChange) this.onLocationChange(loc);
    }

    goToLocationById(id) {
        const idx = this.locations.findIndex(l => l.id === id);
        if (idx !== -1) this.goToLocation(idx);
    }

    // ===========================
    // 6. MAIN UPDATE LOOP
    // ===========================
    update(delta, time) {
        const princess = this.charManager && this.charManager.princess;
        const hasChar = !!princess;

        let inputX = 0;
        let inputZ = 0;

        if (this.isJoystickActive) {
            inputX = this.joystickVector.x;
            inputZ = this.joystickVector.y;
        } else {
            if (this.keys.forward)  inputZ -= 1;
            if (this.keys.backward) inputZ += 1;
            if (this.keys.left)     inputX -= 1;
            if (this.keys.right)    inputX += 1;
        }

        const inputMag = Math.hypot(inputX, inputZ);
        const moving = inputMag > 0.08;
        const running = moving && (this.isRunning || this.keys.run);

        if (moving && hasChar) {
            // Auto-stand if sitting or sleeping
            if (this.charManager.isSitting || this.charManager.isSleeping || this.charManager.isReading) {
                this.charManager.standUp();
            }

            const nx = inputX / inputMag;
            const nz = inputZ / inputMag;

            // Direction relative to camera yaw
            const cosYaw = Math.cos(this.cameraYaw);
            const sinYaw = Math.sin(this.cameraYaw);
            const worldX = nx * cosYaw + nz * sinYaw;
            const worldZ = -nx * sinYaw + nz * cosYaw;

            const speed = running ? this.runSpeed : this.walkSpeed;
            const currentPos = princess.position.clone();
            const targetPos = new THREE.Vector3(
                currentPos.x + worldX * speed * delta,
                currentPos.y,
                currentPos.z + worldZ * speed * delta
            );

            // True Physics Capsule-AABB Continuous Sliding Collision!
            let resolvedPos = targetPos;
            if (this.collision) {
                resolvedPos = this.collision.resolveMovement(currentPos, targetPos);
            }

            princess.position.x = resolvedPos.x;
            princess.position.z = resolvedPos.z;
            princess.position.y += (resolvedPos.y - princess.position.y) * Math.min(1, delta * 14);

            // Rotate character to face movement direction
            const targetAngle = Math.atan2(worldX, worldZ);
            const angleDiff = targetAngle - princess.rotation.y;
            const normalizedDiff = ((angleDiff + Math.PI) % (Math.PI * 2)) - Math.PI;
            princess.rotation.y += normalizedDiff * Math.min(1, delta * 12);

            // Ritik follows behind Nandini
            if (this.charManager.prince) {
                const prince = this.charManager.prince;
                const targetX = princess.position.x - Math.sin(princess.rotation.y) * 1.5;
                const targetZ = princess.position.z - Math.cos(princess.rotation.y) * 1.5;
                prince.position.x += (targetX - prince.position.x) * 0.12;
                prince.position.z += (targetZ - prince.position.z) * 0.12;
                prince.position.y = princess.position.y;
                prince.rotation.y += (princess.rotation.y - prince.rotation.y) * 0.12;
            }

            this.cameraMode = 'follow';
            this.charManager.isWalking = true;
            this.charManager.isRunning = running;
        } else {
            if (this.charManager) {
                this.charManager.isWalking = false;
                this.charManager.isRunning = false;
            }
        }

        // ---- Third-Person Camera Update ----
        const lerpSpeed = 1.0 - Math.exp(-delta * 6.0);

        if (this.cameraMode === 'follow' && hasChar) {
            const charPos = princess.position;
            const lookTarget = new THREE.Vector3(charPos.x, charPos.y + this.cameraHeightOffset, charPos.z);

            // Calculate desired camera position
            const camOffX = Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;
            const camOffY = Math.sin(this.cameraPitch) * this.cameraDistance + this.cameraHeightOffset;
            const camOffZ = Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;

            const desiredCamPos = new THREE.Vector3(
                charPos.x + camOffX,
                charPos.y + camOffY,
                charPos.z + camOffZ
            );

            // Prevent camera from clipping through interior walls and ceiling!
            let safeCamPos = desiredCamPos;
            if (this.collision) {
                safeCamPos = this.collision.resolveCameraPosition(charPos, desiredCamPos);
            }

            this.camera.position.lerp(safeCamPos, lerpSpeed);
            this.camera.lookAt(lookTarget);
        } else {
            this.camera.position.lerp(this.cinematicTargetPos, lerpSpeed * 0.7);
            this.cameraCurrentLook.lerp(this.cinematicTargetLook, lerpSpeed * 0.7);
            this.camera.lookAt(this.cameraCurrentLook);

            if (moving && hasChar) this.cameraMode = 'follow';
        }
    }
}
