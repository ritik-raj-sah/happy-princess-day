// ==========================================
// NANDINI'S MAGICAL KINGDOM - 3D Stylized Characters
// Princess Nandini, Ritik & Cute Orange Tabby Cat
// Rigged with Idle, Walk, Sit, Wave & Romantic Meeting Animations
// ==========================================

import * as THREE from './libs/three.module.js';

export class CharacterManager {
    constructor(scene) {
        this.scene = scene;
        this.princess = null;
        this.prince = null;
        this.cat = null;

        this.isWalking = false;
        this.isRunning = false;
        this.isSitting = false;
        this.isSleeping = false;
        this.isReading = false;
        this.isReaching = false;
        this.isWaving = false;
        this.isMeeting = false;
        this.walkCycle = 0;
        this.waveTimer = 0;
        this.meetingTimer = 0;
        this.reachTimer = 0;
        this.currentSeat = null;
        this.currentBed = null;

        this.materials = this.createMaterials();
        this.buildCharacters();
    }

    createMaterials() {
        return {
            // Realistic personalized skin tones matching real photos
            skinPrincess: new THREE.MeshStandardMaterial({ color: 0xba8666, roughness: 0.55 }), // Warm golden-honey complexion
            skinPrince: new THREE.MeshStandardMaterial({ color: 0x754c36, roughness: 0.65 }),   // Warm rich bronze/brown complexion
            hairDark: new THREE.MeshStandardMaterial({ color: 0x141110, roughness: 0.45 }),     // Natural dark brown/black wavy hair
            hairPrince: new THREE.MeshStandardMaterial({ color: 0x171311, roughness: 0.5 }),    // Textured curly/wavy dark hair
            facialHair: new THREE.MeshStandardMaterial({ color: 0x12100f, roughness: 0.7 }),    // Stylish mustache & goatee
            bindiMat: new THREE.MeshBasicMaterial({ color: 0x111111 }),                          // Traditional black bindi
            lipsPrincess: new THREE.MeshStandardMaterial({ color: 0xa84e5b, roughness: 0.45 }),  // Warm rose/terracotta lipstick
            lipsPrince: new THREE.MeshStandardMaterial({ color: 0x583428, roughness: 0.6 }),    // Natural warm tone
            blushPrincess: new THREE.MeshBasicMaterial({ color: 0xdc6b7c }),                     // Soft warm cheek glow
            eyeWhite: new THREE.MeshBasicMaterial({ color: 0xfdfdfd }),
            eyePupil: new THREE.MeshBasicMaterial({ color: 0x18110d }),
            eyeHighlight: new THREE.MeshBasicMaterial({ color: 0xffffff }),
            eyeliner: new THREE.MeshBasicMaterial({ color: 0x0f0c0b }),
            eyebrowDark: new THREE.MeshBasicMaterial({ color: 0x13100e }),
            gold: new THREE.MeshStandardMaterial({ color: 0xffd15c, roughness: 0.25, metalness: 0.8 }),
            goldZari: new THREE.MeshStandardMaterial({ color: 0xf5cb62, roughness: 0.3, metalness: 0.7 }),
            ruby: new THREE.MeshStandardMaterial({ color: 0xff1e56, roughness: 0.2 }),
            pinkDress: new THREE.MeshStandardMaterial({
                color: 0xff6b97,
                roughness: 0.4,
                metalness: 0.08
            }),
            pinkDressTrim: new THREE.MeshStandardMaterial({
                color: 0xffc2d4,
                roughness: 0.5
            }),
            whiteShirt: new THREE.MeshStandardMaterial({ color: 0xfbf8f3, roughness: 0.55 }), // Elegant linen/cotton shirt
            shirtButton: new THREE.MeshStandardMaterial({ color: 0xe8e2d8, roughness: 0.3, metalness: 0.2 }),
            navyPants: new THREE.MeshStandardMaterial({ color: 0x1a2132, roughness: 0.6 }),
            shoes: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 }),
            catFur: new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.7 }),
            catWhite: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }),
            roseRed: new THREE.MeshStandardMaterial({ color: 0xe8175d, roughness: 0.3 })
        };
    }

    buildCharacters() {
        this.buildPrincess();
        this.buildPrince();
        this.buildCat();
    }

    // --- 1. Princess Nandini (Personalized 3D Avatar) ---
    buildPrincess() {
        const group = new THREE.Group();
        group.position.set(-0.8, 0, 7.5);

        // Character Root / Torso
        const torsoGeom = new THREE.CylinderGeometry(0.28, 0.32, 0.8, 16);
        const torso = new THREE.Mesh(torsoGeom, this.materials.pinkDress);
        torso.position.y = 1.35;
        torso.castShadow = true;
        group.add(torso);

        // Golden Sweetheart Neckline Trim & Golden Waist Belt
        const waistBeltGeom = new THREE.CylinderGeometry(0.33, 0.33, 0.08, 16);
        const waistBelt = new THREE.Mesh(waistBeltGeom, this.materials.gold);
        waistBelt.position.y = 0.98;
        group.add(waistBelt);

        const neckTrimGeom = new THREE.TorusGeometry(0.28, 0.03, 8, 16);
        const neckTrim = new THREE.Mesh(neckTrimGeom, this.materials.gold);
        neckTrim.position.set(0, 1.7, 0);
        neckTrim.rotation.x = Math.PI / 2;
        group.add(neckTrim);

        // Royal Ballgown Skirt (Layered Bell)
        const skirtGroup = new THREE.Group();
        skirtGroup.position.set(0, 1.0, 0);

        const skirtGeom = new THREE.ConeGeometry(0.96, 1.15, 24, 1, true);
        const skirt = new THREE.Mesh(skirtGeom, this.materials.pinkDress);
        skirt.position.y = -0.55;
        skirt.castShadow = true;
        skirtGroup.add(skirt);

        // Skirt Lower Golden Zari Border Trim
        const zariBorderGeom = new THREE.TorusGeometry(0.96, 0.045, 8, 24);
        const zariBorder = new THREE.Mesh(zariBorderGeom, this.materials.goldZari);
        zariBorder.position.y = -1.02;
        zariBorder.rotation.x = Math.PI / 2;
        skirtGroup.add(zariBorder);

        const frillGeom = new THREE.TorusGeometry(0.97, 0.07, 8, 24);
        const frill = new THREE.Mesh(frillGeom, this.materials.pinkDressTrim);
        frill.position.y = -1.1;
        frill.rotation.x = Math.PI / 2;
        skirtGroup.add(frill);

        group.add(skirtGroup);

        // Head Group (Allows clean rotation & natural movement)
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 2.05, 0);

        // Head Mesh (Warm Golden-Tan Skin Tone)
        const headGeom = new THREE.SphereGeometry(0.35, 20, 20);
        headGeom.scale(1.0, 1.05, 1.02);
        const head = new THREE.Mesh(headGeom, this.materials.skinPrincess);
        head.castShadow = true;
        headGroup.add(head);

        // Neck
        const neckGeom = new THREE.CylinderGeometry(0.12, 0.14, 0.25, 12);
        const neck = new THREE.Mesh(neckGeom, this.materials.skinPrincess);
        neck.position.set(0, -0.32, 0);
        headGroup.add(neck);

        // Delicate Golden Chain & Circular Pendant Necklace (matching photos)
        const neckChainGeom = new THREE.TorusGeometry(0.14, 0.015, 8, 20);
        const neckChain = new THREE.Mesh(neckChainGeom, this.materials.gold);
        neckChain.position.set(0, -0.34, 0);
        neckChain.rotation.x = Math.PI / 2;
        headGroup.add(neckChain);

        const pendantGeom = new THREE.CylinderGeometry(0.045, 0.045, 0.015, 16);
        const pendant = new THREE.Mesh(pendantGeom, this.materials.gold);
        pendant.position.set(0, -0.42, 0.14);
        pendant.rotation.x = Math.PI / 4;
        headGroup.add(pendant);

        // --- Nandini's Facial Features ---
        // 1. Almond-shaped Eyes with White Sclera, Dark Iris, and Specular Glints
        for (let side of [-1, 1]) {
            const eyeX = side * 0.13;

            // Sclera
            const scleraGeom = new THREE.SphereGeometry(0.055, 10, 10);
            scleraGeom.scale(1.0, 0.65, 0.3);
            const sclera = new THREE.Mesh(scleraGeom, this.materials.eyeWhite);
            sclera.position.set(eyeX, 0.03, 0.32);
            headGroup.add(sclera);

            // Dark Brown Pupil/Iris
            const pupilGeom = new THREE.SphereGeometry(0.038, 10, 10);
            pupilGeom.scale(1.0, 0.95, 0.3);
            const pupil = new THREE.Mesh(pupilGeom, this.materials.eyePupil);
            pupil.position.set(eyeX, 0.03, 0.338);
            headGroup.add(pupil);

            // Catchlight / Twinkle dot
            const glintGeom = new THREE.SphereGeometry(0.012, 6, 6);
            const glint = new THREE.Mesh(glintGeom, this.materials.eyeHighlight);
            glint.position.set(eyeX + 0.012, 0.045, 0.35);
            headGroup.add(glint);

            // Winged Eyeliner (upper lash line curving out)
            const lashGeom = new THREE.TorusGeometry(0.055, 0.012, 6, 12, Math.PI * 0.7);
            const lash = new THREE.Mesh(lashGeom, this.materials.eyeliner);
            lash.position.set(eyeX, 0.042, 0.33);
            lash.rotation.z = side * -0.15;
            headGroup.add(lash);

            // Elegant Arched Eyebrow
            const browGeom = new THREE.BoxGeometry(0.12, 0.024, 0.015);
            const brow = new THREE.Mesh(browGeom, this.materials.eyebrowDark);
            brow.position.set(eyeX, 0.125, 0.325);
            brow.rotation.z = side * -0.12;
            headGroup.add(brow);

            // Soft Rosy Blush on Cheekbones
            const blushGeom = new THREE.SphereGeometry(0.065, 10, 10);
            blushGeom.scale(1.3, 0.7, 0.2);
            const blush = new THREE.Mesh(blushGeom, this.materials.blushPrincess);
            blush.position.set(side * 0.2, -0.06, 0.29);
            headGroup.add(blush);

            // Ears & Golden Stud/Drop Earrings (as in photos)
            const earGeom = new THREE.SphereGeometry(0.065, 8, 8);
            earGeom.scale(0.5, 1.0, 0.7);
            const ear = new THREE.Mesh(earGeom, this.materials.skinPrincess);
            ear.position.set(side * 0.35, 0.0, -0.02);
            headGroup.add(ear);

            const earringStudGeom = new THREE.SphereGeometry(0.03, 8, 8);
            const earringStud = new THREE.Mesh(earringStudGeom, this.materials.gold);
            earringStud.position.set(side * 0.37, -0.05, -0.01);
            headGroup.add(earringStud);

            const earringDropGeom = new THREE.CylinderGeometry(0.015, 0.035, 0.08, 8);
            const earringDrop = new THREE.Mesh(earringDropGeom, this.materials.gold);
            earringDrop.position.set(side * 0.37, -0.11, -0.01);
            headGroup.add(earringDrop);
        }

        // 2. The Iconic Black Bindi (as seen in her photos!)
        const bindiGeom = new THREE.CylinderGeometry(0.024, 0.024, 0.008, 16);
        const bindi = new THREE.Mesh(bindiGeom, this.materials.bindiMat);
        bindi.position.set(0, 0.125, 0.352);
        bindi.rotation.x = Math.PI / 2;
        headGroup.add(bindi);

        // 3. Cute Sculpted Nose
        const noseGeom = new THREE.ConeGeometry(0.04, 0.09, 8);
        const nose = new THREE.Mesh(noseGeom, this.materials.skinPrincess);
        nose.position.set(0, -0.01, 0.36);
        nose.rotation.x = 0.2;
        headGroup.add(nose);

        // 4. Warm Rose / Terracotta Lips with Gentle Sweet Smile
        const lipUpperGeom = new THREE.TorusGeometry(0.06, 0.022, 8, 16, Math.PI * 0.85);
        const lipUpper = new THREE.Mesh(lipUpperGeom, this.materials.lipsPrincess);
        lipUpper.position.set(0, -0.13, 0.33);
        lipUpper.rotation.x = 0.35;
        headGroup.add(lipUpper);

        const lipLowerGeom = new THREE.SphereGeometry(0.045, 8, 8);
        lipLowerGeom.scale(1.4, 0.55, 0.7);
        const lipLower = new THREE.Mesh(lipLowerGeom, this.materials.lipsPrincess);
        lipLower.position.set(0, -0.155, 0.332);
        headGroup.add(lipLower);

        // --- Nandini's Long Voluminous Wavy/Curly Hair ---
        const hairGroup = new THREE.Group();

        // Main skull cap
        const hairTopGeom = new THREE.SphereGeometry(0.38, 18, 18);
        const hairTop = new THREE.Mesh(hairTopGeom, this.materials.hairDark);
        hairTop.position.set(0, 0.07, -0.05);
        hairTop.scale.set(1.02, 1.05, 1.06);
        hairGroup.add(hairTop);

        // Soft side-parting hair volume & waves framing forehead
        const bangLeftGeom = new THREE.SphereGeometry(0.18, 12, 12);
        bangLeftGeom.scale(1.4, 0.7, 0.9);
        const bangLeft = new THREE.Mesh(bangLeftGeom, this.materials.hairDark);
        bangLeft.position.set(-0.16, 0.22, 0.22);
        bangLeft.rotation.z = -0.25;
        hairGroup.add(bangLeft);

        const bangRightGeom = new THREE.SphereGeometry(0.2, 12, 12);
        bangRightGeom.scale(1.5, 0.75, 0.95);
        const bangRight = new THREE.Mesh(bangRightGeom, this.materials.hairDark);
        bangRight.position.set(0.18, 0.21, 0.2);
        bangRight.rotation.z = 0.3;
        hairGroup.add(bangRight);

        // Long cascading wavy tresses flowing down her back
        for (let bx of [-0.22, -0.08, 0.08, 0.22]) {
            const backStrandGeom = new THREE.CylinderGeometry(0.09, 0.06, 1.1, 8);
            const backStrand = new THREE.Mesh(backStrandGeom, this.materials.hairDark);
            backStrand.position.set(bx, -0.45, -0.26);
            backStrand.rotation.x = -0.15;
            backStrand.rotation.z = bx * 0.2;
            hairGroup.add(backStrand);

            // Wavy tips
            const tipGeom = new THREE.SphereGeometry(0.07, 8, 8);
            const tip = new THREE.Mesh(tipGeom, this.materials.hairDark);
            tip.position.set(bx, -1.0, -0.32);
            hairGroup.add(tip);
        }

        // Signature side cascading curls draped over her shoulders (as seen in selfies & Diwali photos!)
        // Right shoulder cascading wavy curls
        for (let k = 0; k < 3; k++) {
            const frontWaveGeom = new THREE.SphereGeometry(0.11 - k * 0.015, 10, 10);
            frontWaveGeom.scale(0.85, 1.5, 0.85);
            const frontWave = new THREE.Mesh(frontWaveGeom, this.materials.hairDark);
            frontWave.position.set(0.31 - k * 0.03, -0.22 - k * 0.24, 0.18 - k * 0.04);
            frontWave.rotation.z = 0.2 + (k % 2 === 0 ? 0.15 : -0.15);
            hairGroup.add(frontWave);
        }

        // Left shoulder soft curl
        for (let k = 0; k < 2; k++) {
            const frontWaveLGeom = new THREE.SphereGeometry(0.1 - k * 0.015, 10, 10);
            frontWaveLGeom.scale(0.8, 1.4, 0.8);
            const frontWaveL = new THREE.Mesh(frontWaveLGeom, this.materials.hairDark);
            frontWaveL.position.set(-0.31 + k * 0.02, -0.22 - k * 0.22, 0.16);
            frontWaveL.rotation.z = -0.2;
            hairGroup.add(frontWaveL);
        }

        // Royal Golden Tiara / Crown with Ruby Gem
        const tiaraGeom = new THREE.CylinderGeometry(0.24, 0.22, 0.12, 16, 1, true);
        const tiara = new THREE.Mesh(tiaraGeom, this.materials.gold);
        tiara.position.set(0, 0.42, 0.02);
        hairGroup.add(tiara);

        for (let p = 0; p < 5; p++) {
            const angle = (p - 2) * 0.32;
            const px = Math.sin(angle) * 0.23;
            const pz = Math.cos(angle) * 0.23;
            const spikeH = p === 2 ? 0.26 : 0.18;
            const spikeGeom = new THREE.ConeGeometry(0.04, spikeH, 6);
            const spike = new THREE.Mesh(spikeGeom, this.materials.gold);
            spike.position.set(px, 0.48 + spikeH / 2, pz);
            hairGroup.add(spike);
        }

        const tiaraGem = new THREE.SphereGeometry(0.045, 8, 8);
        const gem = new THREE.Mesh(tiaraGem, this.materials.ruby);
        gem.position.set(0, 0.52, 0.24);
        hairGroup.add(gem);

        headGroup.add(hairGroup);
        group.add(headGroup);

        // Arms (Pivots)
        const armGeom = new THREE.CylinderGeometry(0.075, 0.07, 0.65, 8);

        const leftArmPivot = new THREE.Group();
        leftArmPivot.position.set(-0.35, 1.65, 0);
        const leftArm = new THREE.Mesh(armGeom, this.materials.skinPrincess);
        leftArm.position.y = -0.32;
        leftArmPivot.add(leftArm);

        // Golden bangle on left wrist
        const bangleGeom = new THREE.TorusGeometry(0.08, 0.015, 6, 12);
        const bangleL = new THREE.Mesh(bangleGeom, this.materials.gold);
        bangleL.position.y = -0.52;
        bangleL.rotation.x = Math.PI / 2;
        leftArmPivot.add(bangleL);
        group.add(leftArmPivot);

        const rightArmPivot = new THREE.Group();
        rightArmPivot.position.set(0.35, 1.65, 0);
        const rightArm = new THREE.Mesh(armGeom, this.materials.skinPrincess);
        rightArm.position.y = -0.32;
        rightArmPivot.add(rightArm);

        // Golden bangle on right wrist
        const bangleR = new THREE.Mesh(bangleGeom, this.materials.gold);
        bangleR.position.y = -0.52;
        bangleR.rotation.x = Math.PI / 2;
        rightArmPivot.add(bangleR);
        group.add(rightArmPivot);

        // Legs
        const legGeom = new THREE.CylinderGeometry(0.09, 0.08, 0.8, 8);
        const leftLeg = new THREE.Mesh(legGeom, this.materials.skinPrincess);
        leftLeg.position.set(-0.18, 0.4, 0);
        group.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeom, this.materials.skinPrincess);
        rightLeg.position.set(0.18, 0.4, 0);
        group.add(rightLeg);

        group.userData = {
            isInteractive: false,
            type: 'characterPrincess',
            name: 'Princess Nandini',
            leftArmPivot,
            rightArmPivot,
            skirtGroup,
            head: headGroup,
            leftLeg,
            rightLeg,
            baseY: 0
        };

        this.princess = group;
        this.scene.add(group);
    }

    // --- 2. Ritik (Personalized 3D Avatar) ---
    buildPrince() {
        const group = new THREE.Group();
        group.position.set(0.8, 0, 7.5);

        // Torso / Crisp Linen Shirt (White/Cream as in photo 2)
        const torsoGeom = new THREE.CylinderGeometry(0.33, 0.35, 0.9, 16);
        const torso = new THREE.Mesh(torsoGeom, this.materials.whiteShirt);
        torso.position.y = 1.45;
        torso.castShadow = true;
        group.add(torso);

        // Shirt Collar (stylish folded collar flaps)
        for (let side of [-1, 1]) {
            const collarGeom = new THREE.BoxGeometry(0.14, 0.08, 0.03);
            const collar = new THREE.Mesh(collarGeom, this.materials.whiteShirt);
            collar.position.set(side * 0.11, 1.84, 0.26);
            collar.rotation.z = side * 0.4;
            collar.rotation.y = side * -0.25;
            group.add(collar);
        }

        // Golden chain necklace peeking out from collar (as in photos)
        const princeChainGeom = new THREE.TorusGeometry(0.13, 0.015, 6, 16);
        const princeChain = new THREE.Mesh(princeChainGeom, this.materials.gold);
        princeChain.position.set(0, 1.76, 0.16);
        princeChain.rotation.x = Math.PI / 2.5;
        group.add(princeChain);

        // Shirt Front Placket & Buttons
        const placketGeom = new THREE.BoxGeometry(0.06, 0.75, 0.02);
        const placket = new THREE.Mesh(placketGeom, this.materials.whiteShirt);
        placket.position.set(0, 1.42, 0.34);
        group.add(placket);

        for (let b = 0; b < 3; b++) {
            const btnGeom = new THREE.CylinderGeometry(0.018, 0.018, 0.01, 8);
            const btn = new THREE.Mesh(btnGeom, this.materials.shirtButton);
            btn.position.set(0, 1.62 - b * 0.18, 0.352);
            btn.rotation.x = Math.PI / 2;
            group.add(btn);
        }

        // Leather Belt & Golden Buckle
        const beltGeom = new THREE.CylinderGeometry(0.355, 0.355, 0.12, 16);
        const belt = new THREE.Mesh(beltGeom, this.materials.shoes);
        belt.position.y = 1.0;
        group.add(belt);

        const buckleGeom = new THREE.BoxGeometry(0.2, 0.14, 0.38);
        const buckle = new THREE.Mesh(buckleGeom, this.materials.gold);
        buckle.position.y = 1.0;
        group.add(buckle);

        // Head Group
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 2.15, 0);

        // Head Mesh (Warm Bronze/Brown South Asian Skin Tone)
        const headGeom = new THREE.SphereGeometry(0.36, 20, 20);
        headGeom.scale(1.0, 1.06, 1.04);
        const head = new THREE.Mesh(headGeom, this.materials.skinPrince);
        head.castShadow = true;
        headGroup.add(head);

        // Neck
        const neckGeom = new THREE.CylinderGeometry(0.14, 0.16, 0.28, 12);
        const neck = new THREE.Mesh(neckGeom, this.materials.skinPrince);
        neck.position.set(0, -0.34, 0);
        headGroup.add(neck);

        // --- Ritik's Facial Features ---
        // 1. Eyes with expressive dark gaze and catchlights
        for (let side of [-1, 1]) {
            const eyeX = side * 0.135;

            // Sclera
            const scleraGeom = new THREE.SphereGeometry(0.052, 10, 10);
            scleraGeom.scale(1.0, 0.62, 0.3);
            const sclera = new THREE.Mesh(scleraGeom, this.materials.eyeWhite);
            sclera.position.set(eyeX, 0.04, 0.33);
            headGroup.add(sclera);

            // Dark Pupil/Iris
            const pupilGeom = new THREE.SphereGeometry(0.038, 10, 10);
            pupilGeom.scale(1.0, 0.95, 0.3);
            const pupil = new THREE.Mesh(pupilGeom, this.materials.eyePupil);
            pupil.position.set(eyeX, 0.04, 0.348);
            headGroup.add(pupil);

            // Catchlight dot
            const glintGeom = new THREE.SphereGeometry(0.011, 6, 6);
            const glint = new THREE.Mesh(glintGeom, this.materials.eyeHighlight);
            glint.position.set(eyeX + 0.012, 0.052, 0.36);
            headGroup.add(glint);

            // Strong, Defined Dark Eyebrows (prominent in photos!)
            const browGeom = new THREE.BoxGeometry(0.14, 0.036, 0.02);
            const brow = new THREE.Mesh(browGeom, this.materials.eyebrowDark);
            brow.position.set(eyeX, 0.135, 0.34);
            brow.rotation.z = side * -0.08;
            headGroup.add(brow);

            // Ears
            const earGeom = new THREE.SphereGeometry(0.07, 8, 8);
            earGeom.scale(0.5, 1.0, 0.7);
            const ear = new THREE.Mesh(earGeom, this.materials.skinPrince);
            ear.position.set(side * 0.36, 0.02, -0.02);
            headGroup.add(ear);
        }

        // 2. Sculpted Nose Bridge
        const noseGeom = new THREE.ConeGeometry(0.045, 0.11, 8);
        const nose = new THREE.Mesh(noseGeom, this.materials.skinPrince);
        nose.position.set(0, -0.01, 0.375);
        nose.rotation.x = 0.22;
        headGroup.add(nose);

        // 3. Signature Stylish Mustache (curved across upper lip, exactly as in photos!)
        for (let side of [-1, 1]) {
            const mustacheGeom = new THREE.TorusGeometry(0.075, 0.024, 8, 16, Math.PI * 0.7);
            const mustache = new THREE.Mesh(mustacheGeom, this.materials.facialHair);
            mustache.position.set(side * 0.045, -0.10, 0.355);
            mustache.rotation.z = side * -0.55;
            mustache.rotation.x = 0.3;
            headGroup.add(mustache);
        }

        // 4. Groomed Chin Beard / Goatee / Stubble (as seen along jaw & chin in photos!)
        const chinBeardGeom = new THREE.BoxGeometry(0.16, 0.12, 0.08);
        const chinBeard = new THREE.Mesh(chinBeardGeom, this.materials.facialHair);
        chinBeard.position.set(0, -0.28, 0.26);
        chinBeard.rotation.x = 0.2;
        headGroup.add(chinBeard);

        // Subtle jawline stubble contours
        for (let side of [-1, 1]) {
            const jawStubbleGeom = new THREE.BoxGeometry(0.18, 0.04, 0.14);
            const jawStubble = new THREE.Mesh(jawStubbleGeom, this.materials.facialHair);
            jawStubble.position.set(side * 0.22, -0.24, 0.12);
            jawStubble.rotation.z = side * 0.35;
            headGroup.add(jawStubble);
        }

        // 5. Lips under mustache
        const lipsGeom = new THREE.BoxGeometry(0.12, 0.035, 0.04);
        const lips = new THREE.Mesh(lipsGeom, this.materials.lipsPrince);
        lips.position.set(0, -0.155, 0.34);
        headGroup.add(lips);

        // --- Ritik's Textured Curly/Wavy Hairstyle (Volume on Top, Tapered on Sides) ---
        const hairGroup = new THREE.Group();

        // Shorter base hair around back and sides
        const hairBaseGeom = new THREE.SphereGeometry(0.38, 18, 18);
        const hairBase = new THREE.Mesh(hairBaseGeom, this.materials.hairPrince);
        hairBase.position.set(0, 0.07, -0.06);
        hairBase.scale.set(0.98, 1.02, 1.02);
        hairGroup.add(hairBase);

        // High-volume wavy/curly cluster on top (creating his signature curly mop/quiff!)
        const curlClusters = [
            // Center & Front curly quiff
            { x: 0, y: 0.35, z: 0.10, s: 0.17 },
            { x: -0.09, y: 0.34, z: 0.14, s: 0.15 },
            { x: 0.09, y: 0.34, z: 0.14, s: 0.15 },
            { x: 0, y: 0.36, z: 0.21, s: 0.14 },
            { x: -0.11, y: 0.32, z: 0.23, s: 0.13 },
            { x: 0.11, y: 0.32, z: 0.23, s: 0.13 },
            // Crown & Mid-top volume
            { x: -0.14, y: 0.33, z: 0.0, s: 0.16 },
            { x: 0.14, y: 0.33, z: 0.0, s: 0.16 },
            { x: 0, y: 0.36, z: -0.06, s: 0.17 },
            { x: -0.12, y: 0.31, z: -0.14, s: 0.15 },
            { x: 0.12, y: 0.31, z: -0.14, s: 0.15 },
            // Back texture
            { x: 0, y: 0.24, z: -0.22, s: 0.14 }
        ];

        curlClusters.forEach(c => {
            const curlGeom = new THREE.DodecahedronGeometry(c.s, 1);
            const curl = new THREE.Mesh(curlGeom, this.materials.hairPrince);
            curl.position.set(c.x, c.y, c.z);
            curl.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            hairGroup.add(curl);
        });

        headGroup.add(hairGroup);
        group.add(headGroup);

        // Arms (Pivots)
        const armGeom = new THREE.CylinderGeometry(0.085, 0.08, 0.7, 8);

        const leftArmPivot = new THREE.Group();
        leftArmPivot.position.set(-0.4, 1.75, 0);
        const leftArm = new THREE.Mesh(armGeom, this.materials.whiteShirt);
        leftArm.position.y = -0.35;
        leftArmPivot.add(leftArm);

        // Golden wristwatch on left wrist
        const watchGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.04, 12);
        const watch = new THREE.Mesh(watchGeom, this.materials.gold);
        watch.position.y = -0.58;
        leftArmPivot.add(watch);
        group.add(leftArmPivot);

        const rightArmPivot = new THREE.Group();
        rightArmPivot.position.set(0.4, 1.75, 0);
        const rightArm = new THREE.Mesh(armGeom, this.materials.whiteShirt);
        rightArm.position.y = -0.35;
        rightArmPivot.add(rightArm);
        group.add(rightArmPivot);

        // Tailored Navy Pants & Legs
        const leftLegPivot = new THREE.Group();
        leftLegPivot.position.set(-0.18, 0.95, 0);
        const legGeom = new THREE.CylinderGeometry(0.11, 0.095, 0.9, 8);
        const leftLeg = new THREE.Mesh(legGeom, this.materials.navyPants);
        leftLeg.position.y = -0.45;
        leftLeg.castShadow = true;
        leftLegPivot.add(leftLeg);
        group.add(leftLegPivot);

        const rightLegPivot = new THREE.Group();
        rightLegPivot.position.set(0.18, 0.95, 0);
        const rightLeg = new THREE.Mesh(legGeom, this.materials.navyPants);
        rightLeg.position.y = -0.45;
        rightLeg.castShadow = true;
        rightLegPivot.add(rightLeg);
        group.add(rightLegPivot);

        // Polished Leather Shoes
        const shoeGeom = new THREE.BoxGeometry(0.2, 0.14, 0.32);
        const leftShoe = new THREE.Mesh(shoeGeom, this.materials.shoes);
        leftShoe.position.set(0, -0.9, 0.06);
        leftLegPivot.add(leftShoe);

        const rightShoe = new THREE.Mesh(shoeGeom, this.materials.shoes);
        rightShoe.position.set(0, -0.9, 0.06);
        rightLegPivot.add(rightShoe);

        group.userData = {
            isInteractive: false,
            type: 'characterPrince',
            name: 'Ritik',
            leftArmPivot,
            rightArmPivot,
            leftLegPivot,
            rightLegPivot,
            head: headGroup,
            baseY: 0
        };

        this.prince = group;
        this.scene.add(group);
    }

    // --- 3. The Cute Orange Tabby Cat (from reference video!) ---
    buildCat() {
        const group = new THREE.Group();
        // Walking happily beside them!
        group.position.set(1.7, 0, 7.3);

        // Body
        const bodyGeom = new THREE.BoxGeometry(0.4, 0.32, 0.65);
        const body = new THREE.Mesh(bodyGeom, this.materials.catFur);
        body.position.y = 0.3;
        body.castShadow = true;
        group.add(body);

        // Cute Cat Head
        const headGeom = new THREE.SphereGeometry(0.22, 12, 12);
        const head = new THREE.Mesh(headGeom, this.materials.catFur);
        head.position.set(0, 0.45, 0.35);
        head.castShadow = true;
        group.add(head);

        // Pointy Ears
        for (let side of [-1, 1]) {
            const earGeom = new THREE.ConeGeometry(0.08, 0.16, 4);
            const ear = new THREE.Mesh(earGeom, this.materials.catFur);
            ear.position.set(side * 0.12, 0.64, 0.35);
            group.add(ear);
        }

        // Cat Eyes & Pink Nose
        const eyeGeom = new THREE.SphereGeometry(0.035, 6, 6);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x2ecc71 });
        const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
        leftEye.position.set(-0.08, 0.48, 0.54);
        group.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
        rightEye.position.set(0.08, 0.48, 0.54);
        group.add(rightEye);

        // 4 Little White Paws / Legs
        const legGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 6);
        for (let lx of [-0.14, 0.14]) {
            for (let lz of [-0.22, 0.22]) {
                const leg = new THREE.Mesh(legGeom, this.materials.catWhite);
                leg.position.set(lx, 0.1, lz);
                group.add(leg);
            }
        }

        // Animated Wagging Tail
        const tailPivot = new THREE.Group();
        tailPivot.position.set(0, 0.35, -0.32);
        const tailGeom = new THREE.CylinderGeometry(0.035, 0.045, 0.45, 6);
        const tail = new THREE.Mesh(tailGeom, this.materials.catFur);
        tail.position.set(0, 0.2, -0.1);
        tail.rotation.x = -Math.PI / 4;
        tailPivot.add(tail);
        group.add(tailPivot);

        group.userData = {
            isInteractive: false,
            type: 'catPet',
            name: 'Royal Kitten 🐾',
            tailPivot,
            baseY: 0
        };

        this.cat = group;
        this.scene.add(group);
    }

    createCharacterTag(text) {
        const canvas = document.createElement('canvas');
        canvas.width = 384;
        canvas.height = 96;
        const ctx = canvas.getContext('2d');

        // Rounded pill background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.strokeStyle = '#ff6b97';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(16, 16, 352, 64, 32);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 30px "Cinzel", "Playfair Display", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#b81447';
        ctx.fillText(text, 192, 48);

        const texture = new THREE.CanvasTexture(canvas);
        const plane = new THREE.PlaneGeometry(2.0, 0.5);
        const mat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });

        return new THREE.Mesh(plane, mat);
    }

    // Trigger wave animation
    triggerWave() {
        this.isWaving = true;
        this.waveTimer = 3.0;
    }

    // Trigger romantic meeting scene
    triggerMeeting() {
        this.isMeeting = true;
        this.meetingTimer = 6.0;
    }

    // Trigger arm reach / interact animation
    triggerReach() {
        this.isReaching = true;
        this.reachTimer = 0.8;
    }

    // Set sitting pose on a specific chair/sofa/bench
    sitOn(targetPos, targetRotY, seatObject) {
        if (!this.princess) return;
        this.wakeUp();
        this.isSitting = true;
        this.isWalking = false;
        this.isRunning = false;
        this.currentSeat = seatObject;

        const sitY = (targetPos && targetPos.y !== undefined) ? targetPos.y : 0.6;
        this.princess.position.set(targetPos.x, sitY, targetPos.z);
        if (targetRotY !== undefined) this.princess.rotation.set(0, targetRotY, 0);

        if (this.princess.userData.leftLeg) this.princess.userData.leftLeg.rotation.x = Math.PI / 2.2;
        if (this.princess.userData.rightLeg) this.princess.userData.rightLeg.rotation.x = Math.PI / 2.2;

        // Prince sits nearby or stands lovingly beside
        if (this.prince) {
            const sideOffset = 1.3;
            const px = targetPos.x + Math.cos(targetRotY || 0) * sideOffset;
            const pz = targetPos.z - Math.sin(targetRotY || 0) * sideOffset;
            this.prince.position.set(px, sitY, pz);
            if (targetRotY !== undefined) this.prince.rotation.set(0, targetRotY, 0);
            if (this.prince.userData.leftLegPivot) this.prince.userData.leftLegPivot.rotation.x = Math.PI / 2.2;
            if (this.prince.userData.rightLegPivot) this.prince.userData.rightLegPivot.rotation.x = Math.PI / 2.2;
        }
    }

    // Stand up from sitting
    standUp() {
        if (!this.isSitting && !this.isSleeping) return;
        this.isSitting = false;
        this.isSleeping = false;
        this.isReading = false;
        this.currentSeat = null;
        this.currentBed = null;

        const baseY = this.princess.userData.baseY !== undefined ? this.princess.userData.baseY : 1.0;
        this.princess.position.y = baseY;
        this.princess.rotation.set(0, this.princess.rotation.y, 0);

        if (this.princess.userData.leftLeg) this.princess.userData.leftLeg.rotation.x = 0;
        if (this.princess.userData.rightLeg) this.princess.userData.rightLeg.rotation.x = 0;

        if (this.prince) {
            this.prince.position.y = this.prince.userData.baseY !== undefined ? this.prince.userData.baseY : 1.0;
            this.prince.rotation.set(0, this.prince.rotation.y, 0);
            if (this.prince.userData.leftLegPivot) this.prince.userData.leftLegPivot.rotation.x = 0;
            if (this.prince.userData.rightLegPivot) this.prince.userData.rightLegPivot.rotation.x = 0;
        }
    }

    // Sleep on bed
    sleepOn(targetPos, targetRotY, bedObject) {
        if (!this.princess) return;
        this.standUp();
        this.isSleeping = true;
        this.isSitting = false;
        this.isWalking = false;
        this.isRunning = false;
        this.currentBed = bedObject;

        const bedHeight = (targetPos && targetPos.y !== undefined) ? targetPos.y : 1.5;
        this.princess.position.set(targetPos.x, bedHeight, targetPos.z);
        // Lie horizontally on bed: tilt -90 degrees
        this.princess.rotation.set(-Math.PI / 2, 0, (targetRotY || 0));

        // Ritik stands beside the bed watching over her lovingly
        if (this.prince) {
            const sideX = targetPos.x + 2.2 * Math.cos((targetRotY || 0) + Math.PI / 2);
            const sideZ = targetPos.z + 2.2 * Math.sin((targetRotY || 0) + Math.PI / 2);
            this.prince.position.set(sideX, this.prince.userData.baseY || 1.0, sideZ);
            this.prince.rotation.set(0, (targetRotY || 0) - Math.PI / 2, 0);
        }
    }

    // Wake up from sleeping
    wakeUp() {
        if (!this.isSleeping) return;
        this.standUp();
    }

    // Reading book interaction
    readBook(targetPos, targetRotY) {
        if (!this.princess) return;
        this.isReading = true;
        if (targetPos) this.princess.position.set(targetPos.x, targetPos.y || (this.princess.userData.baseY || 1.0), targetPos.z);
        if (targetRotY !== undefined) this.princess.rotation.set(0, targetRotY, 0);
    }

    stopReading() {
        this.isReading = false;
        if (this.princess && this.princess.userData.leftArmPivot) this.princess.userData.leftArmPivot.rotation.x = 0;
        if (this.princess && this.princess.userData.rightArmPivot) this.princess.userData.rightArmPivot.rotation.x = 0;
    }

    // Legacy helper for toggle
    setSitting(sit) {
        if (sit) {
            this.sitOn(this.princess.position, this.princess.rotation.y);
        } else {
            this.standUp();
        }
    }

    // Move character by direction vector
    move(dx, dz, delta) {
        if (!this.princess || !this.prince) return;
        const speed = 5.0;
        const moveX = dx * speed * delta;
        const moveZ = dz * speed * delta;

        this.princess.position.x += moveX;
        this.princess.position.z += moveZ;

        this.prince.position.x += moveX;
        this.prince.position.z += moveZ;

        if (this.cat) {
            this.cat.position.x += moveX;
            this.cat.position.z += moveZ;
        }

        // Orient facing movement
        if (Math.hypot(dx, dz) > 0.01) {
            const angle = Math.atan2(dx, dz);
            this.princess.rotation.y = angle;
            this.prince.rotation.y = angle;
            if (this.cat) this.cat.rotation.y = angle;
            this.isWalking = true;
        }
    }

    update(delta, time) {
        // Idle breathing & dress sway
        const breathe = Math.sin(time * 2.5) * 0.03;

        if (this.princess) {
            this.princess.userData.head.position.y = 2.05 + breathe;
            this.princess.userData.skirtGroup.rotation.z = Math.sin(time * 1.8) * 0.04;
        }

        if (this.prince) {
            this.prince.userData.head.position.y = 2.15 + breathe;
        }

        // Cat tail wagging
        if (this.cat && this.cat.userData.tailPivot) {
            this.cat.userData.tailPivot.rotation.y = Math.sin(time * 6.0) * 0.45;
        }

        // Walking / Running animation (smooth, state-driven)
        if (this.isWalking || this.isRunning) {
            // Run cycle is faster & bigger
            const cycleSpeed = this.isRunning ? 18 : 10;
            const swingAmp   = this.isRunning ? 0.95 : 0.6;
            this.walkCycle += delta * cycleSpeed;
            const swing = Math.sin(this.walkCycle) * swingAmp;

            if (this.prince) {
                this.prince.userData.leftLegPivot.rotation.x  =  swing;
                this.prince.userData.rightLegPivot.rotation.x = -swing;
                this.prince.userData.leftArmPivot.rotation.x  = -swing * 0.7;
                this.prince.userData.rightArmPivot.rotation.x  = swing * 0.7;
                // Slight forward lean when running
                this.prince.rotation.x += (this.isRunning ? -0.12 : 0 - this.prince.rotation.x) * 0.1;
            }

            if (this.princess) {
                this.princess.userData.leftArmPivot.rotation.x  = -swing * 0.5;
                this.princess.userData.rightArmPivot.rotation.x  = swing * 0.5;
                this.princess.userData.skirtGroup.rotation.y = swing * (this.isRunning ? 0.25 : 0.15);
            }
        } else {
            // Smooth decay to idle pose
            const decay = 0.82;
            if (this.prince && !this.isSitting) {
                this.prince.userData.leftLegPivot.rotation.x  *= decay;
                this.prince.userData.rightLegPivot.rotation.x *= decay;
                this.prince.userData.leftArmPivot.rotation.x  *= decay;
                this.prince.userData.rightArmPivot.rotation.x *= decay;
                this.prince.rotation.x *= decay;
            }
            if (this.princess) {
                this.princess.userData.leftArmPivot.rotation.x  *= decay;
                this.princess.userData.rightArmPivot.rotation.x *= decay;
                this.princess.userData.skirtGroup.rotation.y    *= decay;
            }
        }

        // Reading animation
        if (this.isReading && this.princess) {
            if (this.princess.userData.leftArmPivot) this.princess.userData.leftArmPivot.rotation.x = -0.85;
            if (this.princess.userData.rightArmPivot) this.princess.userData.rightArmPivot.rotation.x = -0.85;
            if (this.princess.userData.head) this.princess.userData.head.rotation.x = 0.28;
        }

        // Reaching / interacting animation
        if (this.isReaching) {
            this.reachTimer -= delta;
            if (this.princess && this.princess.userData.rightArmPivot) {
                this.princess.userData.rightArmPivot.rotation.x = -1.3;
            }
            if (this.reachTimer <= 0) {
                this.isReaching = false;
                if (this.princess && this.princess.userData.rightArmPivot) {
                    this.princess.userData.rightArmPivot.rotation.x = 0;
                }
            }
        }

        // Sleeping animation (gentle chest breathing)
        if (this.isSleeping && this.princess) {
            const sleepBreathe = Math.sin(time * 1.8) * 0.035;
            if (this.princess.userData.head) {
                this.princess.userData.head.position.y = 2.05 + sleepBreathe;
            }
        }

        // Waving animation
        if (this.isWaving) {
            this.waveTimer -= delta;
            const wave = Math.sin(time * 14.0) * 0.5;
            if (this.princess) {
                this.princess.userData.rightArmPivot.rotation.z = 2.4 + wave;
            }
            if (this.waveTimer <= 0) {
                this.isWaving = false;
                if (this.princess) this.princess.userData.rightArmPivot.rotation.z = 0;
            }
        }

        // Romantic meeting sequence
        if (this.isMeeting) {
            this.meetingTimer -= delta;
            // Ritik bows slightly & presents rose
            if (this.prince) {
                this.prince.rotation.x = 0.2;
                this.prince.userData.rightArmPivot.rotation.x = -1.2;
            }
            if (this.meetingTimer <= 0) {
                this.isMeeting = false;
                if (this.prince) {
                    this.prince.rotation.x = 0;
                    this.prince.userData.rightArmPivot.rotation.x = 0;
                }
            }
        }
    }
}
