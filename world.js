// ==========================================
// NANDINI'S MAGICAL KINGDOM - Complete 3D World (Exterior)
// Castle, Towers, Roofs, Courtyard, Gate, Gazebo, Fountain, Love Garden, Heart Tree & Landscape
// ==========================================

import * as THREE from './libs/three.module.js';

export class WorldBuilder {
    constructor(scene, collisionSystem = null) {
        this.scene = scene;
        this.collision = collisionSystem;
        this.interactiveObjects = [];
        this.animatedFlags = [];
        this.castleGate = null;
        this.castleDoor = null;
        this.heartTree = null;
        this.waterMesh = null;
        this.gardenSwing = null;
        this.bloomingFlowers = [];
        this.streetLamps = [];

        // Materials cache
        this.materials = this.createMaterials();
    }

    setCollisionSystem(col) {
        this.collision = col;
        this.registerOutdoorColliders();
    }

    registerOutdoorColliders() {
        if (!this.collision) return;
        // Outdoor Fountain
        this.collision.addBox(-17, -7, -3, 7, 0, 3.5, { name: 'Fountain_Basin' });
        // Gazebo
        this.collision.addBox(7.2, 12.8, -6.8, -1.2, 0, 4.0, { name: 'Gazebo_Perimeter' });
        // Heart Tree Trunk
        this.collision.addBox(12.5, 15.5, 4.5, 7.5, 0, 8.0, { name: 'Heart_Tree_Trunk' });
        // Castle Front Terrace balustrades
        this.collision.addBox(-15, -4.5, -7.5, -5.0, 0, 4.0, { name: 'Terrace_Left' });
        this.collision.addBox(4.5, 15, -7.5, -5.0, 0, 4.0, { name: 'Terrace_Right' });
        // Entrance Gate pillars
        this.collision.addBox(-7.5, -4.5, 11.5, 12.5, 0, 6.0, { name: 'Gate_Post_Left' });
        this.collision.addBox(4.5, 7.5, 11.5, 12.5, 0, 6.0, { name: 'Gate_Post_Right' });
    }

    createMaterials() {
        return {
            castleWall: new THREE.MeshStandardMaterial({
                color: 0xfff6ea, // warm ivory / cream
                roughness: 0.6,
                metalness: 0.05
            }),
            castlePinkWall: new THREE.MeshStandardMaterial({
                color: 0xffd4e5, // pastel soft blush pink
                roughness: 0.55,
                metalness: 0.05
            }),
            castlePinkRoof: new THREE.MeshStandardMaterial({
                color: 0xff6b97, // candy rose fairytale pink
                roughness: 0.35,
                metalness: 0.1
            }),
            castleDeepPinkRoof: new THREE.MeshStandardMaterial({
                color: 0xe84378, // deep raspberry pink for accents
                roughness: 0.35,
                metalness: 0.12
            }),
            gold: new THREE.MeshStandardMaterial({
                color: 0xffd050, // royal shimmering gold
                roughness: 0.25,
                metalness: 0.75
            }),
            brass: new THREE.MeshStandardMaterial({
                color: 0xd4af37,
                roughness: 0.4,
                metalness: 0.6
            }),
            whiteMarble: new THREE.MeshStandardMaterial({
                color: 0xfbfbfb,
                roughness: 0.3,
                metalness: 0.05
            }),
            pathStone: new THREE.MeshStandardMaterial({
                color: 0xf5e6cc, // warm fairy path sand/pebble
                roughness: 0.85,
                metalness: 0.0
            }),
            grassLush: new THREE.MeshStandardMaterial({
                color: 0x76c968, // vibrant fairytale green
                roughness: 0.8,
                metalness: 0.0
            }),
            grassDark: new THREE.MeshStandardMaterial({
                color: 0x5aa850,
                roughness: 0.85,
                metalness: 0.0
            }),
            wood: new THREE.MeshStandardMaterial({
                color: 0x8b5a2b,
                roughness: 0.7,
                metalness: 0.05
            }),
            cherryLeaves: new THREE.MeshStandardMaterial({
                color: 0xffafcc, // cherry blossom pink
                roughness: 0.6,
                metalness: 0.0
            }),
            cherryLeavesLight: new THREE.MeshStandardMaterial({
                color: 0xffc8dd, // soft blossom
                roughness: 0.6,
                metalness: 0.0
            }),
            greenLeaves: new THREE.MeshStandardMaterial({
                color: 0x57a75a,
                roughness: 0.65,
                metalness: 0.0
            }),
            roseRed: new THREE.MeshStandardMaterial({
                color: 0xff2a55,
                roughness: 0.4,
                metalness: 0.05
            }),
            rosePink: new THREE.MeshStandardMaterial({
                color: 0xff70a6,
                roughness: 0.4,
                metalness: 0.05
            }),
            windowGlass: new THREE.MeshStandardMaterial({
                color: 0xffea9f,
                emissive: 0xffd560,
                emissiveIntensity: 0.4,
                roughness: 0.2,
                metalness: 0.3
            }),
            water: new THREE.MeshStandardMaterial({
                color: 0x50c0e9,
                roughness: 0.15,
                metalness: 0.2,
                transparent: true,
                opacity: 0.85
            }),
            lampGlow: new THREE.MeshBasicMaterial({
                color: 0xfff0aa
            })
        };
    }

    buildAll() {
        this.buildTerrainAndOcean();
        this.buildCastle();
        this.buildGazebo();
        this.buildRoyalFountain();
        this.buildEntranceGate();
        this.buildPathways();
        this.buildGardensAndTrees();
        this.buildLoveGarden();
        this.buildGardenSwing();
        this.buildBridgesAndDecorations();
        this.buildFloating3DTitle();
        this.registerOutdoorColliders();
    }

    // --- 1. Island Terrain and Sparkling Ocean ---
    buildTerrainAndOcean() {
        // Main Island Green Plateau
        const islandGeom = new THREE.CylinderGeometry(38, 42, 3, 48);
        const islandMesh = new THREE.Mesh(islandGeom, this.materials.grassLush);
        islandMesh.position.y = -1.5;
        islandMesh.receiveShadow = true;
        this.scene.add(islandMesh);

        // Surrounding Sand / Beach Shore
        const beachGeom = new THREE.CylinderGeometry(44, 48, 1.2, 48);
        const beachMat = new THREE.MeshStandardMaterial({ color: 0xf5deb3, roughness: 0.9 });
        const beachMesh = new THREE.Mesh(beachGeom, beachMat);
        beachMesh.position.y = -2.2;
        beachMesh.receiveShadow = true;
        this.scene.add(beachMesh);

        // Turquoise Ocean Plane
        const oceanGeom = new THREE.PlaneGeometry(350, 350, 40, 40);
        const oceanMat = new THREE.MeshStandardMaterial({
            color: 0x48bfe3,
            roughness: 0.1,
            metalness: 0.4,
            transparent: true,
            opacity: 0.8
        });
        const ocean = new THREE.Mesh(oceanGeom, oceanMat);
        ocean.rotation.x = -Math.PI / 2;
        ocean.position.y = -2.4;
        this.waterMesh = ocean;
        this.scene.add(ocean);

        // Cute low-poly clouds in the sky
        for (let i = 0; i < 18; i++) {
            const cloudGroup = new THREE.Group();
            const puffMat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.9,
                metalness: 0.0
            });
            for (let j = 0; j < 5; j++) {
                const puffGeom = new THREE.DodecahedronGeometry(2.5 + Math.random() * 2, 1);
                const puff = new THREE.Mesh(puffGeom, puffMat);
                puff.position.set((j - 2) * 2.2, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.5);
                cloudGroup.add(puff);
            }
            const angle = Math.random() * Math.PI * 2;
            const dist = 60 + Math.random() * 70;
            cloudGroup.position.set(Math.cos(angle) * dist, 28 + Math.random() * 20, Math.sin(angle) * dist);
            cloudGroup.userData = { speed: 0.02 + Math.random() * 0.03 };
            this.scene.add(cloudGroup);
        }
    }

    // --- 2. The Royal Castle (Grand Pink & Ivory Fairytale Palace) ---
    buildCastle() {
        const castleGroup = new THREE.Group();
        // Placed at z = -14 on the island
        castleGroup.position.set(0, 0, -14);

        // A. Castle Base Platform & Terrace
        const baseGeom = new THREE.BoxGeometry(26, 2, 22);
        const base = new THREE.Mesh(baseGeom, this.materials.whiteMarble);
        base.position.y = 1;
        base.receiveShadow = true;
        base.castShadow = true;
        castleGroup.add(base);

        // Terrace Front Steps
        const stepsGeom = new THREE.BoxGeometry(10, 1.0, 4);
        const steps = new THREE.Mesh(stepsGeom, this.materials.whiteMarble);
        steps.position.set(0, 0.5, 12);
        steps.receiveShadow = true;
        castleGroup.add(steps);

        // Red Carpet on Steps
        const carpetGeom = new THREE.BoxGeometry(4.5, 0.08, 14);
        const carpetMat = new THREE.MeshStandardMaterial({ color: 0xc9184a, roughness: 0.7 });
        const carpet = new THREE.Mesh(carpetGeom, carpetMat);
        carpet.position.set(0, 1.05, 6);
        castleGroup.add(carpet);

        // B. Main Palace Front Facade & Entrance Portal (Hollow interior connecting to Grand Hall)
        // Left Front Wall
        const leftFacadeGeom = new THREE.BoxGeometry(4.8, 12, 0.6);
        const leftFacade = new THREE.Mesh(leftFacadeGeom, this.materials.castleWall);
        leftFacade.position.set(-5.6, 7, 7.1);
        leftFacade.castShadow = true;
        leftFacade.receiveShadow = true;
        castleGroup.add(leftFacade);

        // Right Front Wall
        const rightFacade = new THREE.Mesh(leftFacadeGeom, this.materials.castleWall);
        rightFacade.position.set(5.6, 7, 7.1);
        rightFacade.castShadow = true;
        rightFacade.receiveShadow = true;
        castleGroup.add(rightFacade);

        // Top Lintel Above Doorway
        const lintelGeom = new THREE.BoxGeometry(6.4, 4.8, 0.6);
        const lintel = new THREE.Mesh(lintelGeom, this.materials.castleWall);
        lintel.position.set(0, 10.6, 7.1);
        lintel.castShadow = true;
        castleGroup.add(lintel);

        // Mansard Roof on Main Hall
        const mainRoofGeom = new THREE.ConeGeometry(12, 6, 4);
        const mainRoof = new THREE.Mesh(mainRoofGeom, this.materials.castlePinkRoof);
        mainRoof.position.set(0, 16, 0);
        mainRoof.rotation.y = Math.PI / 4;
        mainRoof.castShadow = true;
        castleGroup.add(mainRoof);

        // C. Central Grand Tower (The Tallest Spire)
        const centerTower = this.createTower(3.2, 22, 5.0, 9.0, 0, 0);
        castleGroup.add(centerTower);

        // D. Flanking Front Towers (Left & Right)
        const frontLeftTower = this.createTower(2.5, 16, 4.0, 7.5, -9, 8);
        const frontRightTower = this.createTower(2.5, 16, 4.0, 7.5, 9, 8);
        castleGroup.add(frontLeftTower);
        castleGroup.add(frontRightTower);

        // E. Flanking Rear Towers
        const backLeftTower = this.createTower(2.8, 19, 4.2, 8.0, -10, -8);
        const backRightTower = this.createTower(2.8, 19, 4.2, 8.0, 10, -8);
        castleGroup.add(backLeftTower);
        castleGroup.add(backRightTower);

        // F. Royal Entrance Portal & Double Doors
        const portalArchGeom = new THREE.TorusGeometry(3.2, 0.5, 12, 24, Math.PI);
        const portalArch = new THREE.Mesh(portalArchGeom, this.materials.gold);
        portalArch.position.set(0, 7, 7.2);
        castleGroup.add(portalArch);

        // Castle Door (Double Wooden / Gilded Door)
        const doorFrameGeom = new THREE.BoxGeometry(5.2, 6.5, 0.6);
        const doorFrame = new THREE.Mesh(doorFrameGeom, this.materials.whiteMarble);
        doorFrame.position.set(0, 4.25, 7.1);
        castleGroup.add(doorFrame);

        // Left Door Leaf
        const leftDoorPivot = new THREE.Group();
        leftDoorPivot.position.set(-2.2, 4.2, 7.3);
        const leftDoorGeom = new THREE.BoxGeometry(2.2, 5.8, 0.2);
        const leftDoor = new THREE.Mesh(leftDoorGeom, this.materials.wood);
        leftDoor.position.set(1.1, 0, 0);
        leftDoor.castShadow = true;
        leftDoorPivot.add(leftDoor);

        // Right Door Leaf
        const rightDoorPivot = new THREE.Group();
        rightDoorPivot.position.set(2.2, 4.2, 7.3);
        const rightDoorGeom = new THREE.BoxGeometry(2.2, 5.8, 0.2);
        const rightDoor = new THREE.Mesh(rightDoorGeom, this.materials.wood);
        rightDoor.position.set(-1.1, 0, 0);
        rightDoor.castShadow = true;
        rightDoorPivot.add(rightDoor);

        castleGroup.add(leftDoorPivot);
        castleGroup.add(rightDoorPivot);

        // Golden Door Handles / Heart Knocker
        const knockerGeom = new THREE.TorusGeometry(0.3, 0.08, 8, 16);
        const knockerL = new THREE.Mesh(knockerGeom, this.materials.gold);
        knockerL.position.set(-0.4, 4.2, 7.45);
        castleGroup.add(knockerL);

        const knockerR = new THREE.Mesh(knockerGeom, this.materials.gold);
        knockerR.position.set(0.4, 4.2, 7.45);
        castleGroup.add(knockerR);

        // Door interactivity
        doorFrame.userData = {
            isInteractive: true,
            type: 'castleDoor',
            name: 'Castle Royal Doors',
            prompt: 'Enter Princess Castle',
            leftPivot: leftDoorPivot,
            rightPivot: rightDoorPivot,
            isOpen: false
        };
        this.interactiveObjects.push(doorFrame);
        this.castleDoor = doorFrame;

        // G. Royal Balcony
        const balconyFloorGeom = new THREE.BoxGeometry(6, 0.6, 2.5);
        const balconyFloor = new THREE.Mesh(balconyFloorGeom, this.materials.whiteMarble);
        balconyFloor.position.set(0, 8.8, 8.0);
        balconyFloor.castShadow = true;
        castleGroup.add(balconyFloor);

        // Balcony Railing
        const railGeom = new THREE.BoxGeometry(6, 1.2, 0.15);
        const railing = new THREE.Mesh(railGeom, this.materials.gold);
        railing.position.set(0, 9.6, 9.2);
        castleGroup.add(railing);

        // Balcony Interactivity (for sunset view prompt)
        balconyFloor.userData = {
            isInteractive: true,
            type: 'balconyView',
            name: 'Royal Scenic Balcony',
            prompt: 'View Romantic Sunset'
        };
        this.interactiveObjects.push(balconyFloor);

        // H. Royal Windows (Warm glowing stained glass)
        const windowPositions = [
            [-5, 7, 7.1], [5, 7, 7.1],
            [-8, 10, 0], [8, 10, 0],
            [0, 11, 7.1]
        ];
        windowPositions.forEach(p => {
            const winGeom = new THREE.CylinderGeometry(0.8, 0.8, 2.2, 12);
            const win = new THREE.Mesh(winGeom, this.materials.windowGlass);
            win.position.set(p[0], p[1], p[2]);
            castleGroup.add(win);
        });

        // I. Castle Courtyard Topiary & Hedges
        const topiaryGeom = new THREE.SphereGeometry(1.0, 16, 16);
        const hedgeGeom = new THREE.BoxGeometry(5, 1.2, 1);

        for (let side of [-1, 1]) {
            const hedge = new THREE.Mesh(hedgeGeom, this.materials.greenLeaves);
            hedge.position.set(side * 8, 1.6, 6);
            castleGroup.add(hedge);

            for (let k = 0; k < 3; k++) {
                const potGeom = new THREE.CylinderGeometry(0.5, 0.4, 0.8, 12);
                const pot = new THREE.Mesh(potGeom, this.materials.whiteMarble);
                pot.position.set(side * (5 + k * 2.5), 1.4, 8.5);
                castleGroup.add(pot);

                const ball = new THREE.Mesh(topiaryGeom, this.materials.greenLeaves);
                ball.position.set(side * (5 + k * 2.5), 2.5, 8.5);
                ball.castShadow = true;
                castleGroup.add(ball);
            }
        }

        this.scene.add(castleGroup);
    }

    // Helper: Tower Generator with spire, battlements, and animated flags
    createTower(radius, height, roofRadius, roofHeight, x, z) {
        const towerGroup = new THREE.Group();
        towerGroup.position.set(x, 0, z);

        // Main cylindrical shaft
        const shaftGeom = new THREE.CylinderGeometry(radius * 0.9, radius, height, 24);
        const shaft = new THREE.Mesh(shaftGeom, this.materials.castleWall);
        shaft.position.y = height / 2;
        shaft.castShadow = true;
        shaft.receiveShadow = true;
        towerGroup.add(shaft);

        // Upper balcony corbel ring
        const corbelGeom = new THREE.CylinderGeometry(radius * 1.15, radius * 0.9, 1.2, 24);
        const corbel = new THREE.Mesh(corbelGeom, this.materials.castlePinkWall);
        corbel.position.y = height + 0.6;
        corbel.castShadow = true;
        towerGroup.add(corbel);

        // Conical Pink Roof Spire
        const roofGeom = new THREE.ConeGeometry(roofRadius, roofHeight, 24);
        const roof = new THREE.Mesh(roofGeom, this.materials.castlePinkRoof);
        roof.position.y = height + 1.2 + roofHeight / 2;
        roof.castShadow = true;
        towerGroup.add(roof);

        // Golden Spire Finial Needle
        const finialGeom = new THREE.CylinderGeometry(0.08, 0.15, 2.5, 8);
        const finial = new THREE.Mesh(finialGeom, this.materials.gold);
        finial.position.y = height + 1.2 + roofHeight + 1.2;
        towerGroup.add(finial);

        // Golden Ball on Spire
        const ballGeom = new THREE.SphereGeometry(0.35, 12, 12);
        const ball = new THREE.Mesh(ballGeom, this.materials.gold);
        ball.position.y = height + 1.2 + roofHeight + 2.5;
        towerGroup.add(ball);

        // Animated Royal Flag
        const flagGeom = new THREE.PlaneGeometry(1.6, 1.0, 10, 4);
        const flagMat = new THREE.MeshStandardMaterial({
            color: 0xff3b75,
            side: THREE.DoubleSide,
            roughness: 0.5
        });
        const flag = new THREE.Mesh(flagGeom, flagMat);
        flag.position.set(0.8, height + 1.2 + roofHeight + 2.0, 0);
        flag.userData = { baseGeom: flagGeom.clone() };
        towerGroup.add(flag);
        this.animatedFlags.push(flag);

        return towerGroup;
    }

    // --- 3. The Royal Gazebo / Pavilion (Key Reference Feature) ---
    buildGazebo() {
        const gazeboGroup = new THREE.Group();
        // Placed at (x: 10, z: -4) on the garden lawn
        gazeboGroup.position.set(10, 0, -4);

        // Octagonal Base Platform with Steps
        const baseGeom = new THREE.CylinderGeometry(4.2, 4.6, 0.6, 8);
        const base = new THREE.Mesh(baseGeom, this.materials.whiteMarble);
        base.position.y = 0.3;
        base.receiveShadow = true;
        gazeboGroup.add(base);

        // 8 Fluted White Columns
        const numCols = 8;
        const colRadius = 3.6;
        for (let i = 0; i < numCols; i++) {
            const angle = (i / numCols) * Math.PI * 2;
            const cx = Math.cos(angle) * colRadius;
            const cz = Math.sin(angle) * colRadius;

            const colGeom = new THREE.CylinderGeometry(0.18, 0.22, 4.0, 12);
            const col = new THREE.Mesh(colGeom, this.materials.whiteMarble);
            col.position.set(cx, 2.6, cz);
            col.castShadow = true;
            gazeboGroup.add(col);

            // Perimeter Railings between columns (leave one side open for entrance)
            if (i !== 4) {
                const nextAngle = ((i + 1) / numCols) * Math.PI * 2;
                const midX = (cx + Math.cos(nextAngle) * colRadius) / 2;
                const midZ = (cz + Math.sin(nextAngle) * colRadius) / 2;
                const dist = Math.hypot(cx - Math.cos(nextAngle) * colRadius, cz - Math.sin(nextAngle) * colRadius);

                const railGeom = new THREE.BoxGeometry(dist * 0.95, 0.9, 0.1);
                const rail = new THREE.Mesh(railGeom, this.materials.whiteMarble);
                rail.position.set(midX, 1.1, midZ);
                rail.lookAt(gazeboGroup.position.x + midX + Math.sin(angle), 1.1, gazeboGroup.position.z + midZ - Math.cos(angle));
                gazeboGroup.add(rail);
            }
        }

        // Faceted Pink Conical Roof
        const roofGeom = new THREE.ConeGeometry(4.8, 3.2, 8);
        const roof = new THREE.Mesh(roofGeom, this.materials.castlePinkRoof);
        roof.position.y = 6.2;
        roof.castShadow = true;
        gazeboGroup.add(roof);

        // Golden Roof Border Trim
        const trimGeom = new THREE.TorusGeometry(4.7, 0.12, 8, 8);
        const trim = new THREE.Mesh(trimGeom, this.materials.gold);
        trim.position.y = 4.6;
        trim.rotation.x = Math.PI / 2;
        gazeboGroup.add(trim);

        // Golden Finial
        const finialGeom = new THREE.SphereGeometry(0.35, 12, 12);
        const finial = new THREE.Mesh(finialGeom, this.materials.gold);
        finial.position.y = 8.0;
        gazeboGroup.add(finial);

        // Romantic Wooden Bench Inside Gazebo (Interactive!)
        const bench = this.createRomanticBench(0, 0.6, 0);
        bench.userData = {
            isInteractive: true,
            type: 'bench',
            name: 'Gazebo Romantic Bench',
            prompt: 'Sit in the Gazebo'
        };
        gazeboGroup.add(bench);
        this.interactiveObjects.push(bench);

        this.scene.add(gazeboGroup);
    }

    // --- 4. The Royal Fountain (Cascading Water & Wish Toss) ---
    buildRoyalFountain() {
        const fountainGroup = new THREE.Group();
        // Placed at (x: -12, z: 2)
        fountainGroup.position.set(-12, 0, 2);

        // Lower Large Basin
        const lowerBasinGeom = new THREE.CylinderGeometry(5.0, 5.4, 1.0, 32);
        const lowerBasin = new THREE.Mesh(lowerBasinGeom, this.materials.whiteMarble);
        lowerBasin.position.y = 0.5;
        lowerBasin.receiveShadow = true;
        fountainGroup.add(lowerBasin);

        // Water in Lower Basin
        const lowerWaterGeom = new THREE.CircleGeometry(4.7, 32);
        const lowerWater = new THREE.Mesh(lowerWaterGeom, this.materials.water);
        lowerWater.rotation.x = -Math.PI / 2;
        lowerWater.position.y = 0.9;
        fountainGroup.add(lowerWater);

        // Middle Tier Pedestal
        const pedGeom = new THREE.CylinderGeometry(1.0, 1.4, 2.0, 16);
        const ped = new THREE.Mesh(pedGeom, this.materials.whiteMarble);
        ped.position.y = 1.5;
        fountainGroup.add(ped);

        // Middle Tier Bowl
        const midBowlGeom = new THREE.CylinderGeometry(2.6, 2.0, 0.6, 24);
        const midBowl = new THREE.Mesh(midBowlGeom, this.materials.whiteMarble);
        midBowl.position.y = 2.4;
        midBowl.castShadow = true;
        fountainGroup.add(midBowl);

        // Water in Middle Bowl
        const midWaterGeom = new THREE.CircleGeometry(2.4, 24);
        const midWater = new THREE.Mesh(midWaterGeom, this.materials.water);
        midWater.rotation.x = -Math.PI / 2;
        midWater.position.y = 2.65;
        fountainGroup.add(midWater);

        // Top Spout Angel / Swan Golden Finial
        const topSpoutGeom = new THREE.ConeGeometry(0.4, 1.0, 12);
        const topSpout = new THREE.Mesh(topSpoutGeom, this.materials.gold);
        topSpout.position.y = 3.2;
        fountainGroup.add(topSpout);

        // Interactivity
        lowerBasin.userData = {
            isInteractive: true,
            type: 'fountain',
            name: 'Royal Wishing Fountain',
            prompt: 'Make a Wish & Splash'
        };
        this.interactiveObjects.push(lowerBasin);

        this.scene.add(fountainGroup);
    }

    // --- 5. Royal Entrance Gate & Golden Archway ---
    buildEntranceGate() {
        const gateGroup = new THREE.Group();
        // Placed at (x: 0, z: 12)
        gateGroup.position.set(0, 0, 12);

        // Stone Pillars (Left & Right)
        for (let side of [-1, 1]) {
            const pillarGeom = new THREE.BoxGeometry(1.4, 4.5, 1.4);
            const pillar = new THREE.Mesh(pillarGeom, this.materials.whiteMarble);
            pillar.position.set(side * 4.2, 2.25, 0);
            pillar.castShadow = true;
            pillar.receiveShadow = true;
            gateGroup.add(pillar);

            // Pillar Golden Caps
            const capGeom = new THREE.BoxGeometry(1.6, 0.4, 1.6);
            const cap = new THREE.Mesh(capGeom, this.materials.gold);
            cap.position.set(side * 4.2, 4.6, 0);
            gateGroup.add(cap);

            // Glowing Light Orb on Top
            const orbGeom = new THREE.SphereGeometry(0.45, 16, 16);
            const orb = new THREE.Mesh(orbGeom, this.materials.lampGlow);
            orb.position.set(side * 4.2, 5.15, 0);
            gateGroup.add(orb);

            // Warm Point Light
            const lampLight = new THREE.PointLight(0xffecc4, 1.2, 8);
            lampLight.position.set(side * 4.2, 5.15, 0);
            gateGroup.add(lampLight);
            this.streetLamps.push(lampLight);
        }

        // Curved Overhead Arch Sign ("Princess Nandini's Magical Kingdom")
        const archGeom = new THREE.TorusGeometry(4.2, 0.18, 8, 24, Math.PI);
        const arch = new THREE.Mesh(archGeom, this.materials.gold);
        arch.position.set(0, 4.5, 0);
        gateGroup.add(arch);

        // Royal Kingdom Signboard
        const signGeom = new THREE.BoxGeometry(4.2, 0.9, 0.1);
        const signMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
        const sign = new THREE.Mesh(signGeom, signMat);
        sign.position.set(0, 5.6, 0);
        gateGroup.add(sign);

        // Golden Gate Leaves (Pivoting)
        const leftGatePivot = new THREE.Group();
        leftGatePivot.position.set(-3.5, 0, 0);
        const leftGateMesh = this.createGateWroughtIron(3.5, 3.6);
        leftGateMesh.position.set(1.75, 1.8, 0);
        leftGatePivot.add(leftGateMesh);

        const rightGatePivot = new THREE.Group();
        rightGatePivot.position.set(3.5, 0, 0);
        const rightGateMesh = this.createGateWroughtIron(3.5, 3.6);
        rightGateMesh.position.set(-1.75, 1.8, 0);
        rightGatePivot.add(rightGateMesh);

        gateGroup.add(leftGatePivot);
        gateGroup.add(rightGatePivot);

        // Gate Interactivity
        sign.userData = {
            isInteractive: true,
            type: 'castleGate',
            name: 'Royal Kingdom Gates',
            prompt: 'Open Royal Gates',
            leftPivot: leftGatePivot,
            rightPivot: rightGatePivot,
            isOpen: false
        };
        this.interactiveObjects.push(sign);
        this.castleGate = sign;

        this.scene.add(gateGroup);
    }

    createGateWroughtIron(width, height) {
        const group = new THREE.Group();
        // Outer frame
        const frameGeom = new THREE.BoxGeometry(width, height, 0.1);
        const frameMat = this.materials.gold;

        // Vertical bars
        const bars = 7;
        for (let i = 0; i <= bars; i++) {
            const x = -width / 2 + (i / bars) * width;
            const barGeom = new THREE.CylinderGeometry(0.04, 0.04, height, 8);
            const bar = new THREE.Mesh(barGeom, frameMat);
            bar.position.x = x;
            group.add(bar);

            // Arrow spear tip on bars
            const spearGeom = new THREE.ConeGeometry(0.09, 0.3, 8);
            const spear = new THREE.Mesh(spearGeom, frameMat);
            spear.position.set(x, height / 2 + 0.15, 0);
            group.add(spear);
        }

        // Horizontal cross bars
        [-height / 3, 0, height / 3].forEach(y => {
            const crossGeom = new THREE.CylinderGeometry(0.04, 0.04, width, 8);
            const cross = new THREE.Mesh(crossGeom, frameMat);
            cross.rotation.z = Math.PI / 2;
            cross.position.y = y;
            group.add(cross);
        });

        return group;
    }

    // --- 6. Pathways & Courtyard Stone Paths ---
    buildPathways() {
        const pathGroup = new THREE.Group();

        // Main Entrance Boulevard (Gate to Castle Courtyard)
        const mainPathGeom = new THREE.PlaneGeometry(5.0, 26, 10, 20);
        const mainPath = new THREE.Mesh(mainPathGeom, this.materials.pathStone);
        mainPath.rotation.x = -Math.PI / 2;
        mainPath.position.set(0, 0.04, 0);
        mainPath.receiveShadow = true;
        pathGroup.add(mainPath);

        // Path branching left to Fountain
        const leftBranchGeom = new THREE.PlaneGeometry(3.5, 14);
        const leftBranch = new THREE.Mesh(leftBranchGeom, this.materials.pathStone);
        leftBranch.rotation.x = -Math.PI / 2;
        leftBranch.rotation.z = Math.PI / 3;
        leftBranch.position.set(-6, 0.04, 2);
        leftBranch.receiveShadow = true;
        pathGroup.add(leftBranch);

        // Path branching right to Gazebo & Love Garden
        const rightBranchGeom = new THREE.PlaneGeometry(3.5, 18);
        const rightBranch = new THREE.Mesh(rightBranchGeom, this.materials.pathStone);
        rightBranch.rotation.x = -Math.PI / 2;
        rightBranch.rotation.z = -Math.PI / 4;
        rightBranch.position.set(7, 0.04, 2);
        rightBranch.receiveShadow = true;
        pathGroup.add(rightBranch);

        // Street Lamps lining the pathways
        const lampPositions = [
            [-3.0, 0, 8], [3.0, 0, 8],
            [-3.0, 0, 0], [3.0, 0, 0],
            [-3.0, 0, -8], [3.0, 0, -8],
            [-10, 0, 6], [10, 0, 3]
        ];

        lampPositions.forEach((pos, idx) => {
            const lampGroup = new THREE.Group();
            lampGroup.position.set(pos[0], pos[1], pos[2]);

            // Post
            const postGeom = new THREE.CylinderGeometry(0.08, 0.12, 3.2, 8);
            const post = new THREE.Mesh(postGeom, this.materials.brass);
            post.position.y = 1.6;
            post.castShadow = true;
            lampGroup.add(post);

            // Lantern housing
            const lanternGeom = new THREE.OctahedronGeometry(0.35, 1);
            const lantern = new THREE.Mesh(lanternGeom, this.materials.lampGlow);
            lantern.position.y = 3.3;
            lampGroup.add(lantern);

            // Light
            const light = new THREE.PointLight(0xfff0c0, 0.8, 6);
            light.position.y = 3.3;
            lampGroup.add(light);
            this.streetLamps.push(light);

            lantern.userData = {
                isInteractive: true,
                type: 'lamp',
                name: `Royal Lantern ${idx + 1}`,
                prompt: 'Toggle Lantern Glow',
                light,
                isOn: true
            };
            this.interactiveObjects.push(lantern);

            pathGroup.add(lampGroup);
        });

        this.scene.add(pathGroup);
    }

    // --- 7. Fairytale Cherry Blossom Trees, Lollipop Trees & Wildflowers ---
    buildGardensAndTrees() {
        const gardenGroup = new THREE.Group();

        // A. Cherry Blossom Trees (Pastel Pink Puffs)
        const blossomTreeCoords = [
            [-16, 0, -10], [-20, 0, 0], [-18, 0, 10],
            [16, 0, -12], [22, 0, -2], [18, 0, 14],
            [-8, 0, 16], [8, 0, 18], [-24, 0, -16], [24, 0, -16]
        ];

        blossomTreeCoords.forEach(coords => {
            const tree = this.createBlossomTree(coords[0], coords[1], coords[2]);
            gardenGroup.add(tree);
        });

        // B. Stylized Stylized Green Lollipop Trees & Shrubs
        const greenTreeCoords = [
            [-12, 0, -18], [12, 0, -18],
            [-22, 0, 6], [20, 0, 8],
            [-6, 0, -6], [6, 0, -6]
        ];

        greenTreeCoords.forEach(coords => {
            const tree = this.createLollipopTree(coords[0], coords[1], coords[2]);
            gardenGroup.add(tree);
        });

        // C. Interactive Blooming Wildflowers
        const flowerCoords = [
            [-4, 0, 4], [-5, 0, 5], [-3.5, 0, 7],
            [4, 0, 5], [5.5, 0, 4], [4, 0, 7],
            [-10, 0, -2], [-14, 0, -4],
            [14, 0, 4], [16, 0, 2]
        ];

        flowerCoords.forEach((coords, i) => {
            const flower = this.createFlower(coords[0], coords[1], coords[2], i);
            gardenGroup.add(flower);
            this.bloomingFlowers.push(flower);
            this.interactiveObjects.push(flower);
        });

        // D. Floral Rose Arch
        const roseArch = this.createRoseArch(-1, 0, 6);
        gardenGroup.add(roseArch);

        this.scene.add(gardenGroup);
    }

    createBlossomTree(x, y, z) {
        const treeGroup = new THREE.Group();
        treeGroup.position.set(x, y, z);

        // Trunk
        const trunkGeom = new THREE.CylinderGeometry(0.4, 0.7, 4.5, 8);
        const trunk = new THREE.Mesh(trunkGeom, this.materials.wood);
        trunk.position.y = 2.25;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        // Fluffy Blossom Clusters
        const clusters = [
            [0, 5.0, 0, 2.6],
            [-1.4, 4.6, 0.8, 1.9],
            [1.5, 4.8, -0.6, 2.1],
            [0, 6.2, 0.4, 2.0],
            [-0.7, 5.8, -1.0, 1.8]
        ];

        clusters.forEach((c, i) => {
            const foliageGeom = new THREE.DodecahedronGeometry(c[3], 1);
            const foliageMat = i % 2 === 0 ? this.materials.cherryLeaves : this.materials.cherryLeavesLight;
            const foliage = new THREE.Mesh(foliageGeom, foliageMat);
            foliage.position.set(c[0], c[1], c[2]);
            foliage.castShadow = true;
            treeGroup.add(foliage);
        });

        return treeGroup;
    }

    createLollipopTree(x, y, z) {
        const treeGroup = new THREE.Group();
        treeGroup.position.set(x, y, z);

        const trunkGeom = new THREE.CylinderGeometry(0.25, 0.45, 3.5, 8);
        const trunk = new THREE.Mesh(trunkGeom, this.materials.wood);
        trunk.position.y = 1.75;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        const crownGeom = new THREE.SphereGeometry(1.8, 16, 16);
        const crown = new THREE.Mesh(crownGeom, this.materials.greenLeaves);
        crown.position.y = 4.2;
        crown.castShadow = true;
        treeGroup.add(crown);

        return treeGroup;
    }

    createFlower(x, y, z, index) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        // Stem
        const stemGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0x3e8e41 });
        const stem = new THREE.Mesh(stemGeom, stemMat);
        stem.position.y = 0.4;
        group.add(stem);

        // Petals
        const petalGroup = new THREE.Group();
        petalGroup.position.y = 0.8;
        const color = index % 3 === 0 ? this.materials.roseRed : (index % 3 === 1 ? this.materials.rosePink : this.materials.gold);

        for (let p = 0; p < 6; p++) {
            const pGeom = new THREE.SphereGeometry(0.18, 8, 8);
            pGeom.scale(1, 0.4, 1.8);
            const petal = new THREE.Mesh(pGeom, color);
            petal.rotation.y = (p / 6) * Math.PI * 2;
            petalGroup.add(petal);
        }

        // Center
        const centerGeom = new THREE.SphereGeometry(0.12, 8, 8);
        const center = new THREE.Mesh(centerGeom, this.materials.gold);
        petalGroup.add(center);

        group.add(petalGroup);

        group.userData = {
            isInteractive: true,
            type: 'flower',
            name: `Fairytale Rose ${index + 1}`,
            prompt: 'Tap to make flower bloom',
            petalGroup,
            isBloomed: false,
            scaleAnim: 1.0
        };

        return group;
    }

    createRoseArch(x, y, z) {
        const archGroup = new THREE.Group();
        archGroup.position.set(x, y, z);

        const frameGeom = new THREE.TorusGeometry(2.4, 0.14, 8, 24, Math.PI);
        const frame = new THREE.Mesh(frameGeom, this.materials.whiteMarble);
        frame.position.y = 2.4;
        archGroup.add(frame);

        // Rose flower clumps along arch
        for (let i = 0; i < 9; i++) {
            const angle = (i / 8) * Math.PI;
            const rx = Math.cos(angle) * 2.4;
            const ry = 2.4 + Math.sin(angle) * 2.4;

            const rose = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), this.materials.roseRed);
            rose.position.set(rx, ry, 0);
            archGroup.add(rose);
        }

        return archGroup;
    }

    // --- 8. The Love Garden & Grand Heart Tree ---
    buildLoveGarden() {
        const loveGroup = new THREE.Group();
        // Placed at (x: 14, z: 6)
        loveGroup.position.set(14, 0, 6);

        // A. Heart-shaped Stone Flowerbed
        const heartShape = new THREE.Shape();
        heartShape.moveTo(0, 0);
        heartShape.bezierCurveTo(0, 1.5, -2.5, 3.5, -4.5, 3.5);
        heartShape.bezierCurveTo(-7, 3.5, -7, 0, -7, 0);
        heartShape.bezierCurveTo(-7, -2.5, -3.5, -5.5, 0, -8);
        heartShape.bezierCurveTo(3.5, -5.5, 7, -2.5, 7, 0);
        heartShape.bezierCurveTo(7, 0, 7, 3.5, 4.5, 3.5);
        heartShape.bezierCurveTo(2.5, 3.5, 0, 1.5, 0, 0);

        const bedGeom = new THREE.ShapeGeometry(heartShape);
        const bedMat = new THREE.MeshStandardMaterial({ color: 0xff85a1, roughness: 0.6 });
        const bed = new THREE.Mesh(bedGeom, bedMat);
        bed.rotation.x = -Math.PI / 2;
        bed.scale.set(0.7, 0.7, 0.7);
        bed.position.set(0, 0.05, 0);
        loveGroup.add(bed);

        // B. The Grand Magical Heart Tree (Surprise Location 2)
        const heartTreeGroup = new THREE.Group();
        heartTreeGroup.position.set(0, 0, -2);

        // Graceful Trunk
        const trunkGeom = new THREE.CylinderGeometry(0.6, 1.1, 6.0, 12);
        const trunk = new THREE.Mesh(trunkGeom, this.materials.wood);
        trunk.position.y = 3.0;
        trunk.castShadow = true;
        heartTreeGroup.add(trunk);

        // Heart-shaped Foliage Canopy
        const heartFoliageShape = new THREE.Shape();
        heartFoliageShape.moveTo(0, 0);
        heartFoliageShape.bezierCurveTo(0, 2, -3, 4.5, -5, 4.5);
        heartFoliageShape.bezierCurveTo(-8, 4.5, -8, 0, -8, 0);
        heartFoliageShape.bezierCurveTo(-8, -3, -4, -6.5, 0, -9.5);
        heartFoliageShape.bezierCurveTo(4, -6.5, 8, -3, 8, 0);
        heartFoliageShape.bezierCurveTo(8, 0, 8, 4.5, 5, 4.5);
        heartFoliageShape.bezierCurveTo(3, 4.5, 0, 2, 0, 0);

        const extrudeSettings = { depth: 3.5, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.8, bevelThickness: 0.8 };
        const heartCanopyGeom = new THREE.ExtrudeGeometry(heartFoliageShape, extrudeSettings);
        const canopyMat = new THREE.MeshStandardMaterial({
            color: 0xff5c8a, // glowing romantic pink
            emissive: 0xff2a55,
            emissiveIntensity: 0.25,
            roughness: 0.4
        });
        const canopy = new THREE.Mesh(heartCanopyGeom, canopyMat);
        canopy.rotation.z = Math.PI;
        canopy.position.set(0, 11, -1.75);
        canopy.scale.set(0.7, 0.7, 0.7);
        canopy.castShadow = true;
        heartTreeGroup.add(canopy);

        // Romantic Bench under Heart Tree
        const loveBench = this.createRomanticBench(0, 0.5, 2.5);
        loveBench.userData = {
            isInteractive: true,
            type: 'heartTreeBench',
            name: "Nandini's Love Bench",
            prompt: 'Sit under the Magical Heart Tree'
        };
        loveGroup.add(loveBench);
        this.interactiveObjects.push(loveBench);

        // Heart Tree Interactivity
        canopy.userData = {
            isInteractive: true,
            type: 'heartTree',
            name: 'The Magical Heart Tree',
            prompt: 'Reveal Love Garden Memory'
        };
        this.interactiveObjects.push(canopy);
        this.heartTree = canopy;

        loveGroup.add(heartTreeGroup);
        this.scene.add(loveGroup);
    }

    createRomanticBench(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        // Bench Seat
        const seatGeom = new THREE.BoxGeometry(2.4, 0.15, 0.8);
        const seatMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
        const seat = new THREE.Mesh(seatGeom, seatMat);
        seat.position.y = 0.5;
        group.add(seat);

        // Pink Cushion
        const cushionGeom = new THREE.BoxGeometry(2.2, 0.12, 0.7);
        const cushionMat = new THREE.MeshStandardMaterial({ color: 0xff85a1, roughness: 0.6 });
        const cushion = new THREE.Mesh(cushionGeom, cushionMat);
        cushion.position.y = 0.6;
        group.add(cushion);

        // Backrest with Heart Carving
        const backGeom = new THREE.BoxGeometry(2.4, 0.8, 0.12);
        const back = new THREE.Mesh(backGeom, seatMat);
        back.position.set(0, 1.1, -0.35);
        group.add(back);

        // 4 Legs
        const legGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8);
        const legMat = this.materials.gold;
        for (let lx of [-1.0, 1.0]) {
            for (let lz of [-0.3, 0.3]) {
                const leg = new THREE.Mesh(legGeom, legMat);
                leg.position.set(lx, 0.25, lz);
                group.add(leg);
            }
        }

        return group;
    }

    // --- 9. Romantic Fairytale Garden Swing (Interactive!) ---
    buildGardenSwing() {
        const swingGroup = new THREE.Group();
        // Placed in the lush garden at (x: 6, z: 2)
        swingGroup.position.set(6, 0, 2);

        // A-Frame Wooden / Gilded Side Supports
        const supportGeom = new THREE.CylinderGeometry(0.08, 0.1, 4.5, 8);
        for (let side of [-1.8, 1.8]) {
            const legFront = new THREE.Mesh(supportGeom, this.materials.wood);
            legFront.position.set(side, 2.1, 0.8);
            legFront.rotation.x = 0.22;
            swingGroup.add(legFront);

            const legBack = new THREE.Mesh(supportGeom, this.materials.wood);
            legBack.position.set(side, 2.1, -0.8);
            legBack.rotation.x = -0.22;
            swingGroup.add(legBack);
        }

        // Top Golden Crossbeam
        const beamGeom = new THREE.CylinderGeometry(0.1, 0.1, 4.2, 8);
        const beam = new THREE.Mesh(beamGeom, this.materials.gold);
        beam.position.set(0, 4.2, 0);
        beam.rotation.z = Math.PI / 2;
        swingGroup.add(beam);

        // Swiveling Swing Pivot
        const swingPivot = new THREE.Group();
        swingPivot.position.set(0, 4.2, 0);

        // Two Golden Chains hanging down
        const chainGeom = new THREE.CylinderGeometry(0.02, 0.02, 3.2, 6);
        for (let side of [-1.1, 1.1]) {
            const chain = new THREE.Mesh(chainGeom, this.materials.gold);
            chain.position.set(side, -1.6, 0);
            swingPivot.add(chain);
        }

        // Wooden Seat with Soft Pink Velvet Cushion
        const seatGeom = new THREE.BoxGeometry(2.4, 0.12, 0.7);
        const seat = new THREE.Mesh(seatGeom, this.materials.wood);
        seat.position.set(0, -3.2, 0);
        swingPivot.add(seat);

        const cushionGeom = new THREE.BoxGeometry(2.2, 0.1, 0.65);
        const cushionMat = new THREE.MeshStandardMaterial({ color: 0xff6b97, roughness: 0.5 });
        const cushion = new THREE.Mesh(cushionGeom, cushionMat);
        cushion.position.set(0, -3.1, 0);
        swingPivot.add(cushion);

        swingGroup.add(swingPivot);
        this.gardenSwing = swingPivot;

        // Interactivity
        seat.userData = {
            isInteractive: true,
            type: 'swing',
            name: 'Romantic Garden Swing',
            prompt: 'Sit on Garden Swing 🌸',
            targetPos: new THREE.Vector3(6, 1.0, 2),
            targetRot: 0
        };
        this.interactiveObjects.push(seat);

        this.scene.add(swingGroup);
    }

    // --- 10. Bridges and Stone Accents ---
    buildBridgesAndDecorations() {
        // Small stone arched bridge near fountain stream
        const bridgeGroup = new THREE.Group();
        bridgeGroup.position.set(-8, 0, 8);
        bridgeGroup.rotation.y = -Math.PI / 4;

        const archGeom = new THREE.CylinderGeometry(2.5, 2.5, 2.0, 16, 1, false, 0, Math.PI);
        const arch = new THREE.Mesh(archGeom, this.materials.whiteMarble);
        arch.rotation.z = Math.PI / 2;
        arch.position.y = 0;
        bridgeGroup.add(arch);

        this.scene.add(bridgeGroup);
    }

    // --- 10. Floating 3D Title ("Cutie ❤️ Kuchupuchu" from reference video!) ---
    buildFloating3DTitle() {
        const titleGroup = new THREE.Group();
        titleGroup.position.set(0, 19.5, -12);

        // Canvas 2D texture for crystal clear floating text
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        ctx.font = 'bold 72px "Cinzel", "Playfair Display", "Georgia", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Glowing text shadow
        ctx.shadowColor = 'rgba(255, 105, 180, 0.9)';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Cutie  ❤️  Kuchupuchu', 512, 128);

        const texture = new THREE.CanvasTexture(canvas);
        const planeGeom = new THREE.PlaneGeometry(12, 3);
        const planeMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.95,
            side: THREE.DoubleSide
        });

        const titleMesh = new THREE.Mesh(planeGeom, planeMat);
        titleGroup.add(titleMesh);
        titleGroup.userData = { baseY: 19.5 };

        this.titleMesh = titleGroup;
        this.scene.add(titleGroup);
    }

    // Animation update loop for world elements
    update(delta, time) {
        // 1. Flutter castle flags
        this.animatedFlags.forEach((flag, idx) => {
            const pos = flag.geometry.attributes.position;
            const basePos = flag.userData.baseGeom.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                const u = basePos.getX(i);
                if (u > 0) {
                    const wave = Math.sin(time * 6 + u * 4 + idx) * 0.25 * (u / 1.6);
                    pos.setZ(i, wave);
                }
            }
            pos.needsUpdate = true;
        });

        // 2. Water ripple
        if (this.waterMesh) {
            this.waterMesh.rotation.z = Math.sin(time * 0.5) * 0.02;
        }

        // 3. Floating 3D title bobbing
        if (this.titleMesh) {
            this.titleMesh.position.y = this.titleMesh.userData.baseY + Math.sin(time * 2.0) * 0.35;
        }

        // 4. Blooming flowers animation
        this.bloomingFlowers.forEach(f => {
            if (f.userData.isBloomed && f.userData.scaleAnim < 1.6) {
                f.userData.scaleAnim += delta * 2.0;
                f.userData.petalGroup.scale.setScalar(f.userData.scaleAnim);
                f.userData.petalGroup.rotation.y += delta * 3.0;
            }
        });
        // 5. Gentle garden swing sway
        if (this.gardenSwing) {
            this.gardenSwing.rotation.x = Math.sin(time * 1.8) * 0.16;
        }
    }
}
