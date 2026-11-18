// ==========================================
// NANDINI'S MAGICAL KINGDOM - Particle Systems
// Butterflies, Rose Petals, Sparkles, Fountain Water, Floating Hearts & Fireworks
// ==========================================

import * as THREE from './libs/three.module.js';

export class ParticleManager {
    constructor(scene) {
        this.scene = scene;
        this.butterflies = [];
        this.fireworks = [];
        this.petals = null;
        this.sparkles = null;
        this.fountainSpray = null;
        this.floatingHearts = null;
        this.fountainActive = true;
        this.fountainBurst = 1.0;

        this.initPetals();
        this.initSparkles();
        this.initFountainSpray();
        this.initFloatingHearts();
        this.initButterflies();
    }

    // --- 1. Falling Rose and Cherry Blossom Petals ---
    initPetals() {
        const count = 300;
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const scales = new Float32Array(count);
        const rotations = new Float32Array(count * 3);
        const speeds = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 1] = 2 + Math.random() * 25;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

            scales[i] = 0.2 + Math.random() * 0.3;
            rotations[i * 3 + 0] = Math.random() * Math.PI;
            rotations[i * 3 + 1] = Math.random() * Math.PI;
            rotations[i * 3 + 2] = Math.random() * Math.PI;

            speeds[i * 3 + 0] = (Math.random() - 0.5) * 0.03; // drift x
            speeds[i * 3 + 1] = -(0.02 + Math.random() * 0.03); // fall y
            speeds[i * 3 + 2] = (Math.random() - 0.5) * 0.03; // drift z
        }

        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.userData = { scales, rotations, speeds, count };

        // Petal texture (heart / petal shape via canvas)
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ff9ebb';
        ctx.beginPath();
        ctx.ellipse(32, 32, 28, 16, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff6b9d';
        ctx.beginPath();
        ctx.ellipse(30, 30, 20, 10, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        const texture = new THREE.CanvasTexture(canvas);

        const mat = new THREE.PointsMaterial({
            size: 0.8,
            map: texture,
            transparent: true,
            opacity: 0.85,
            depthWrite: false,
            blending: THREE.NormalBlending
        });

        this.petals = new THREE.Points(geom, mat);
        this.scene.add(this.petals);
    }

    // --- 2. Twinkling Golden & Pink Sparkles / Fireflies ---
    initSparkles() {
        const count = 250;
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const phases = new Float32Array(count);

        const colGold = new THREE.Color('#ffe57f');
        const colPink = new THREE.Color('#ff80bf');
        const colWhite = new THREE.Color('#ffffff');

        for (let i = 0; i < count; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = 0.5 + Math.random() * 12;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

            const r = Math.random();
            const c = r < 0.4 ? colGold : (r < 0.8 ? colPink : colWhite);
            colors[i * 3 + 0] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;

            phases[i] = Math.random() * Math.PI * 2;
        }

        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geom.userData = { phases, count };

        // Circular glow texture
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.3, 'rgba(255,230,150,0.8)');
        grad.addColorStop(0.7, 'rgba(255,120,180,0.3)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);

        const mat = new THREE.PointsMaterial({
            size: 0.65,
            map: texture,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.sparkles = new THREE.Points(geom, mat);
        this.scene.add(this.sparkles);
    }

    // --- 3. Fountain Cascading Spray & Droplets ---
    initFountainSpray() {
        const count = 400;
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const lifetimes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Center fountain origin (x: -12, y: 3.2, z: 2)
            positions[i * 3 + 0] = -12;
            positions[i * 3 + 1] = 3.2;
            positions[i * 3 + 2] = 2;

            const angle = Math.random() * Math.PI * 2;
            const speed = 0.05 + Math.random() * 0.06;
            velocities[i * 3 + 0] = Math.cos(angle) * speed;
            velocities[i * 3 + 1] = 0.12 + Math.random() * 0.08; // upward burst
            velocities[i * 3 + 2] = Math.sin(angle) * speed;

            lifetimes[i] = Math.random();
        }

        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.userData = { velocities, lifetimes, count, origin: new THREE.Vector3(-12, 3.2, 2) };

        // Shimmer water droplet texture
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.5, 'rgba(180,230,255,0.8)');
        grad.addColorStop(1, 'rgba(100,200,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);

        const texture = new THREE.CanvasTexture(canvas);

        const mat = new THREE.PointsMaterial({
            size: 0.5,
            map: texture,
            transparent: true,
            opacity: 0.85,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.fountainSpray = new THREE.Points(geom, mat);
        this.scene.add(this.fountainSpray);
    }

    // --- 4. Floating Hearts in Love Garden & Heart Tree ---
    initFloatingHearts() {
        const count = 60;
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const scales = new Float32Array(count);
        const phases = new Float32Array(count);

        // Love garden center: (x: 14, z: 6)
        for (let i = 0; i < count; i++) {
            positions[i * 3 + 0] = 14 + (Math.random() - 0.5) * 16;
            positions[i * 3 + 1] = 0.5 + Math.random() * 10;
            positions[i * 3 + 2] = 6 + (Math.random() - 0.5) * 16;

            scales[i] = 0.5 + Math.random() * 0.7;
            phases[i] = Math.random() * Math.PI * 2;
        }

        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.userData = { scales, phases, count };

        // Heart canvas texture
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ff3366';
        ctx.beginPath();
        ctx.moveTo(32, 48);
        ctx.bezierCurveTo(32, 44, 12, 32, 12, 20);
        ctx.bezierCurveTo(12, 8, 24, 8, 32, 16);
        ctx.bezierCurveTo(40, 8, 52, 8, 52, 20);
        ctx.bezierCurveTo(52, 32, 32, 44, 32, 48);
        ctx.fill();

        // Inner glowing sheen
        ctx.fillStyle = '#ff99bb';
        ctx.beginPath();
        ctx.arc(24, 18, 5, 0, Math.PI * 2);
        ctx.fill();

        const texture = new THREE.CanvasTexture(canvas);

        const mat = new THREE.PointsMaterial({
            size: 1.1,
            map: texture,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            blending: THREE.NormalBlending
        });

        this.floatingHearts = new THREE.Points(geom, mat);
        this.scene.add(this.floatingHearts);
    }

    // --- 5. 3D Animated Flapping Butterflies ---
    initButterflies() {
        const wingColors = ['#ff85a1', '#fbc531', '#74b9ff', '#a29bfe', '#ff7675'];
        const butterflyCount = 12;

        for (let i = 0; i < butterflyCount; i++) {
            const group = new THREE.Group();

            // Wing geometry
            const wingShape = new THREE.Shape();
            wingShape.moveTo(0, 0);
            wingShape.bezierCurveTo(0.3, 0.4, 0.6, 0.6, 0.5, 0.9);
            wingShape.bezierCurveTo(0.2, 0.9, 0.1, 0.5, 0, 0);

            const wingGeom = new THREE.ShapeGeometry(wingShape);
            const color = wingColors[i % wingColors.length];
            const wingMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(color),
                roughness: 0.4,
                metalness: 0.1,
                side: THREE.DoubleSide
            });

            // Left wing
            const leftWing = new THREE.Mesh(wingGeom, wingMat);
            leftWing.scale.set(0.7, 0.7, 0.7);
            group.add(leftWing);

            // Right wing
            const rightWing = new THREE.Mesh(wingGeom, wingMat);
            rightWing.scale.set(-0.7, 0.7, 0.7);
            group.add(rightWing);

            // Small body
            const bodyGeom = new THREE.CylinderGeometry(0.02, 0.03, 0.3, 6);
            const bodyMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
            const body = new THREE.Mesh(bodyGeom, bodyMat);
            body.rotation.x = Math.PI / 2;
            group.add(body);

            // Path flight parameters
            const center = new THREE.Vector3(
                (Math.random() - 0.5) * 35,
                1.5 + Math.random() * 2.5,
                (Math.random() - 0.5) * 35
            );
            const radius = 2.5 + Math.random() * 4.0;
            const speed = 0.6 + Math.random() * 0.8;
            const flapSpeed = 12 + Math.random() * 8;
            const phase = Math.random() * Math.PI * 2;

            group.position.copy(center);
            group.userData = {
                isInteractive: true,
                type: 'butterfly',
                name: `Butterfly ${i + 1}`,
                center,
                radius,
                speed,
                flapSpeed,
                phase,
                leftWing,
                rightWing,
                scaredTimer: 0
            };

            this.butterflies.push(group);
            this.scene.add(group);
        }
    }

    // Trigger butterfly flutter react
    scareButterfly(butterfly) {
        butterfly.userData.scaredTimer = 4.0;
        butterfly.userData.radius += 3.0;
        butterfly.userData.center.y += 2.0;
    }

    // Trigger fountain burst
    triggerFountainSurge() {
        this.fountainBurst = 2.5;
    }

    // Launch celebratory fireworks
    launchFirework(originX = null, originZ = null) {
        const x = originX !== null ? originX : (Math.random() - 0.5) * 30;
        const y = 14 + Math.random() * 8;
        const z = originZ !== null ? originZ : (Math.random() - 0.5) * 30 - 5;

        const count = 180;
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const palette = [
            new THREE.Color('#ff007f'), // rose pink
            new THREE.Color('#ffd700'), // gold
            new THREE.Color('#ff4757'), // ruby
            new THREE.Color('#70a1ff'), // royal sky
            new THREE.Color('#2ed573'), // emerald
            new THREE.Color('#e056fd')  // fairy purple
        ];
        const burstColor = palette[Math.floor(Math.random() * palette.length)];

        for (let i = 0; i < count; i++) {
            positions[i * 3 + 0] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Spherical explosion velocity
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const speed = 0.08 + Math.random() * 0.16;

            velocities[i * 3 + 0] = Math.sin(phi) * Math.cos(theta) * speed;
            velocities[i * 3 + 1] = Math.cos(phi) * speed;
            velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;

            colors[i * 3 + 0] = burstColor.r;
            colors[i * 3 + 1] = burstColor.g;
            colors[i * 3 + 2] = burstColor.b;
        }

        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 0.8,
            vertexColors: true,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const firework = new THREE.Points(geom, mat);
        firework.userData = { velocities, age: 0, maxAge: 2.2, count };
        this.fireworks.push(firework);
        this.scene.add(firework);
    }

    // Animation update loop
    update(delta, time) {
        // 1. Update Petals
        if (this.petals) {
            const pos = this.petals.geometry.attributes.position.array;
            const { speeds, count } = this.petals.geometry.userData;
            for (let i = 0; i < count; i++) {
                pos[i * 3 + 0] += speeds[i * 3 + 0] + Math.sin(time + i) * 0.01;
                pos[i * 3 + 1] += speeds[i * 3 + 1];
                pos[i * 3 + 2] += speeds[i * 3 + 2] + Math.cos(time + i) * 0.01;

                if (pos[i * 3 + 1] < 0.2) {
                    pos[i * 3 + 1] = 20 + Math.random() * 5;
                    pos[i * 3 + 0] = (Math.random() - 0.5) * 60;
                    pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
                }
            }
            this.petals.geometry.attributes.position.needsUpdate = true;
        }

        // 2. Update Sparkles
        if (this.sparkles) {
            const pos = this.sparkles.geometry.attributes.position.array;
            const { phases, count } = this.sparkles.geometry.userData;
            for (let i = 0; i < count; i++) {
                pos[i * 3 + 1] += Math.sin(time * 2 + phases[i]) * 0.015;
                pos[i * 3 + 0] += Math.cos(time * 0.8 + phases[i]) * 0.008;
            }
            this.sparkles.geometry.attributes.position.needsUpdate = true;
        }

        // 3. Update Fountain Spray
        if (this.fountainSpray) {
            const pos = this.fountainSpray.geometry.attributes.position.array;
            const { velocities, lifetimes, count, origin } = this.fountainSpray.geometry.userData;
            const surge = this.fountainBurst;
            if (this.fountainBurst > 1.0) {
                this.fountainBurst -= delta * 0.8;
                if (this.fountainBurst < 1.0) this.fountainBurst = 1.0;
            }

            for (let i = 0; i < count; i++) {
                lifetimes[i] += delta * 1.2;
                pos[i * 3 + 0] += velocities[i * 3 + 0] * surge;
                pos[i * 3 + 1] += velocities[i * 3 + 1] * surge;
                pos[i * 3 + 2] += velocities[i * 3 + 2] * surge;

                // Gravity
                velocities[i * 3 + 1] -= delta * 0.22;

                if (lifetimes[i] > 1.4 || pos[i * 3 + 1] < origin.y - 1.2) {
                    lifetimes[i] = 0;
                    pos[i * 3 + 0] = origin.x;
                    pos[i * 3 + 1] = origin.y;
                    pos[i * 3 + 2] = origin.z;

                    const angle = Math.random() * Math.PI * 2;
                    const speed = 0.04 + Math.random() * 0.07;
                    velocities[i * 3 + 0] = Math.cos(angle) * speed;
                    velocities[i * 3 + 1] = 0.12 + Math.random() * 0.08;
                    velocities[i * 3 + 2] = Math.sin(angle) * speed;
                }
            }
            this.fountainSpray.geometry.attributes.position.needsUpdate = true;
        }

        // 4. Update Floating Hearts
        if (this.floatingHearts) {
            const pos = this.floatingHearts.geometry.attributes.position.array;
            const { phases, count } = this.floatingHearts.geometry.userData;
            for (let i = 0; i < count; i++) {
                pos[i * 3 + 1] += delta * 0.8; // float up
                pos[i * 3 + 0] += Math.sin(time + phases[i]) * 0.02; // sway x
                pos[i * 3 + 2] += Math.cos(time + phases[i]) * 0.02; // sway z

                if (pos[i * 3 + 1] > 14) {
                    pos[i * 3 + 1] = 0.5 + Math.random() * 1.5;
                    pos[i * 3 + 0] = 14 + (Math.random() - 0.5) * 16;
                    pos[i * 3 + 2] = 6 + (Math.random() - 0.5) * 16;
                }
            }
            this.floatingHearts.geometry.attributes.position.needsUpdate = true;
        }

        // 5. Update Butterflies
        this.butterflies.forEach(b => {
            const u = b.userData;
            const t = time * u.speed + u.phase;

            if (u.scaredTimer > 0) {
                u.scaredTimer -= delta;
                b.rotation.y += delta * 6;
                u.flapSpeed = 26;
            } else {
                u.flapSpeed = 14;
            }

            // Circular path with vertical bobbing
            const px = u.center.x + Math.cos(t) * u.radius;
            const pz = u.center.z + Math.sin(t) * u.radius;
            const py = u.center.y + Math.sin(t * 2.5) * 0.6;

            // Align rotation to movement direction
            const nextX = u.center.x + Math.cos(t + 0.05) * u.radius;
            const nextZ = u.center.z + Math.sin(t + 0.05) * u.radius;
            b.position.set(px, py, pz);
            b.lookAt(nextX, py, nextZ);

            // Flap wings
            const flap = Math.sin(time * u.flapSpeed) * 0.75;
            u.leftWing.rotation.y = flap;
            u.rightWing.rotation.y = -flap;
        });

        // 6. Update Fireworks
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const fw = this.fireworks[i];
            const u = fw.userData;
            u.age += delta;

            const pos = fw.geometry.attributes.position.array;
            for (let j = 0; j < u.count; j++) {
                pos[j * 3 + 0] += u.velocities[j * 3 + 0];
                pos[j * 3 + 1] += u.velocities[j * 3 + 1];
                pos[j * 3 + 2] += u.velocities[j * 3 + 2];

                // Gravity & drag
                u.velocities[j * 3 + 1] -= delta * 0.04;
                u.velocities[j * 3 + 0] *= 0.985;
                u.velocities[j * 3 + 2] *= 0.985;
            }
            fw.geometry.attributes.position.needsUpdate = true;

            // Fade out
            const progress = u.age / u.maxAge;
            fw.material.opacity = Math.max(0, 1.0 - progress);

            if (u.age >= u.maxAge) {
                this.scene.remove(fw);
                fw.geometry.dispose();
                fw.material.dispose();
                this.fireworks.splice(i, 1);
            }
        }
    }
}
