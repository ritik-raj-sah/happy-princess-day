// ==========================================
// NANDINI'S MAGICAL KINGDOM - Reconstructed 3D Architectural Palace & Interior
// Architecturally Sound, Spacious 13-Room Layout with Real Physical Walls, Hinged Doors & Collision
// ==========================================

import * as THREE from './libs/three.module.js';

export class CastleInterior {
    constructor(scene, collisionSystem = null) {
        this.scene = scene;
        this.collision = collisionSystem;
        this.group = new THREE.Group();
        this.group.position.set(0, 0, 0);

        this.interactiveObjects = [];
        this.doors = [];
        this.lights = [];

        this.materials = this.createMaterials();
    }

    setCollisionSystem(col) {
        this.collision = col;
    }

    createMaterials() {
        return {
            wallCream: new THREE.MeshStandardMaterial({ color: 0xfff9f2, roughness: 0.6 }),
            wallPink: new THREE.MeshStandardMaterial({ color: 0xffdbe7, roughness: 0.55 }),
            wallDamask: new THREE.MeshStandardMaterial({ color: 0xffccd9, roughness: 0.5 }),
            wallSkyBlue: new THREE.MeshStandardMaterial({ color: 0xdff0fc, roughness: 0.55 }),
            wallDining: new THREE.MeshStandardMaterial({ color: 0xffe8df, roughness: 0.6 }),
            wallTile: new THREE.MeshStandardMaterial({ color: 0xf0f7fa, roughness: 0.2, metalness: 0.1 }),
            floorMarble: new THREE.MeshStandardMaterial({ color: 0xf5f2ec, roughness: 0.25, metalness: 0.1 }),
            floorWood: new THREE.MeshStandardMaterial({ color: 0xa06535, roughness: 0.5, metalness: 0.05 }),
            floorKitchenTile: new THREE.MeshStandardMaterial({ color: 0xded8cf, roughness: 0.35 }),
            floorBathTile: new THREE.MeshStandardMaterial({ color: 0xbce3eb, roughness: 0.2, metalness: 0.15 }),
            gold: new THREE.MeshStandardMaterial({ color: 0xffd15c, roughness: 0.25, metalness: 0.8 }),
            redVelvet: new THREE.MeshStandardMaterial({ color: 0xba1339, roughness: 0.8 }),
            royalBlue: new THREE.MeshStandardMaterial({ color: 0x1f4e79, roughness: 0.75 }),
            pinkSilk: new THREE.MeshStandardMaterial({ color: 0xff85a1, roughness: 0.4 }),
            whiteLace: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, transparent: true, opacity: 0.85 }),
            woodDark: new THREE.MeshStandardMaterial({ color: 0x5a3214, roughness: 0.6 }),
            woodDoor: new THREE.MeshStandardMaterial({ color: 0x7a431d, roughness: 0.55 }),
            mirror: new THREE.MeshStandardMaterial({ color: 0xdff9fb, roughness: 0.05, metalness: 0.95 }),
            glass: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, transparent: true, opacity: 0.4 }),
            metalChrome: new THREE.MeshStandardMaterial({ color: 0xdcdde1, roughness: 0.2, metalness: 0.85 }),
            glowYellow: new THREE.MeshBasicMaterial({ color: 0xfffae6 }),
            fireGlow: new THREE.MeshBasicMaterial({ color: 0xff6b35 }),
            waterStream: new THREE.MeshStandardMaterial({ color: 0x54a0ff, roughness: 0.1, transparent: true, opacity: 0.75 })
        };
    }

    buildAll() {
        // Interior Ambient Fill Light for crystal-clear palatial illumination
        const interiorFill = new THREE.AmbientLight(0xfff5ea, 1.0);
        this.group.add(interiorFill);

        // --- 1. Master Palace Floors & Ceilings ---
        this.buildPalaceSlabs();

        // --- 2. Ground Floor Architectural Walls (Non-Overlapping) ---
        this.buildExteriorEnclosureWalls();
        this.buildInteriorDividingWalls();

        // --- 3. Functional Hinged Doors with Physics ---
        this.buildDoors();

        // --- 4. Grand Staircase & Upper Floor Mezzanine ---
        this.buildGrandStaircase();
        this.buildUpperFloor();

        // --- 5. Furnish All 13 Connected Rooms (Clutter-Free with >3.5m Walkways) ---
        this.furnishFoyer();
        this.furnishLivingRoom();
        this.furnishDiningRoom();
        this.furnishKitchen();
        this.furnishPrincessBedroom();
        this.furnishDressingRoom();
        this.furnishBathroom();
        this.furnishGuestBedroom();
        this.furnishGiftRoom();
        this.furnishPhotoGallery();

        this.scene.add(this.group);
    }

    // ==========================================
    // 1. MASTER PALACE SLABS (Floors & Ceilings)
    // ==========================================
    buildPalaceSlabs() {
        const floorY = 1.0;
        const totalW = 64;  // x: -32 to +32
        const totalD = 45;  // z: -52 to -7
        const centerZ = -29.5;

        // Ground Floor Base Slab
        const floorGeom = new THREE.BoxGeometry(totalW, 0.4, totalD);
        const floorMesh = new THREE.Mesh(floorGeom, this.materials.floorMarble);
        floorMesh.position.set(0, floorY - 0.2, centerZ);
        floorMesh.receiveShadow = true;
        this.group.add(floorMesh);

        // Individual room specialized floors
        // Living room wood floor
        const livingFloorGeom = new THREE.PlaneGeometry(20, 15);
        const livingFloor = new THREE.Mesh(livingFloorGeom, this.materials.floorWood);
        livingFloor.rotation.x = -Math.PI / 2;
        livingFloor.position.set(-22, floorY + 0.01, -14.5);
        this.group.add(livingFloor);

        // Bedroom wood floor
        const bedFloorGeom = new THREE.PlaneGeometry(20, 16);
        const bedFloor = new THREE.Mesh(bedFloorGeom, this.materials.floorWood);
        bedFloor.rotation.x = -Math.PI / 2;
        bedFloor.position.set(22, floorY + 0.01, -15);
        this.group.add(bedFloor);

        // Kitchen tile floor
        const kitchenFloorGeom = new THREE.PlaneGeometry(20, 15);
        const kitchenFloor = new THREE.Mesh(kitchenFloorGeom, this.materials.floorKitchenTile);
        kitchenFloor.rotation.x = -Math.PI / 2;
        kitchenFloor.position.set(-22, floorY + 0.01, -44.5);
        this.group.add(kitchenFloor);

        // Bathroom tile floor
        const bathFloorGeom = new THREE.PlaneGeometry(10, 15);
        const bathFloor = new THREE.Mesh(bathFloorGeom, this.materials.floorBathTile);
        bathFloor.rotation.x = -Math.PI / 2;
        bathFloor.position.set(13, floorY + 0.01, -30.5);
        this.group.add(bathFloor);

        // Main Palace Roof/Ceiling Slab (Grand 7.5m palatial ceiling height, y = 8.5)
        // Leave opening over Foyer (x: [-8, 8], z: [-20, -7]) for Grand Chandelier and Staircase!
        // West Wing Ceiling
        const ceilingWestGeom = new THREE.BoxGeometry(24, 0.4, totalD);
        const ceilingWest = new THREE.Mesh(ceilingWestGeom, this.materials.wallCream);
        ceilingWest.position.set(-20, 8.5, centerZ);
        this.group.add(ceilingWest);

        // East Wing Ceiling
        const ceilingEast = new THREE.Mesh(ceilingWestGeom, this.materials.wallCream);
        ceilingEast.position.set(20, 8.5, centerZ);
        this.group.add(ceilingEast);

        // Central North Wing Ceiling (Gift Room & Photo Room)
        const ceilingNorthGeom = new THREE.BoxGeometry(16, 0.4, 32);
        const ceilingNorth = new THREE.Mesh(ceilingNorthGeom, this.materials.wallCream);
        ceilingNorth.position.set(0, 8.5, -36);
        this.group.add(ceilingNorth);
    }

    // ==========================================
    // 2. EXTERIOR ENCLOSURE WALLS
    // ==========================================
    buildExteriorEnclosureWalls() {
        const floorY = 1.0;
        const wallH = 7.5;
        const thick = 0.4;

        // --- South Exterior Front Wall (z = -7.0) ---
        // Left section (Living Room front): x: [-32, -2.4]
        this.addSolidWall(-32, -7.0, -2.4, -7.0, thick, floorY, wallH, this.materials.wallCream, 'Wall_Ext_South_West');
        // Right section (Bedroom front): x: [2.4, 32]
        this.addSolidWall(2.4, -7.0, 32, -7.0, thick, floorY, wallH, this.materials.wallCream, 'Wall_Ext_South_East');
        // Entrance Lintel above double doors (x: [-2.4, 2.4], from y = 5.0 to y = 8.5)
        this.addWallSegment(0, 6.75, -7.0, 4.8, 3.5, thick, this.materials.wallCream);

        // --- West Exterior Wall (x = -32.0, z: [-52, -7]) ---
        this.addSolidWall(-32.0, -52.0, -32.0, -7.0, thick, floorY, wallH, this.materials.wallCream, 'Wall_Ext_West');

        // --- East Exterior Wall (x = +32.0, z: [-52, -7]) ---
        this.addSolidWall(32.0, -52.0, 32.0, -7.0, thick, floorY, wallH, this.materials.wallCream, 'Wall_Ext_East');

        // --- North Exterior Wall (z = -52.0, x: [-32, 32]) ---
        this.addSolidWall(-32.0, -52.0, 32.0, -52.0, thick, floorY, wallH, this.materials.wallCream, 'Wall_Ext_North');
    }

    // ==========================================
    // 3. INTERIOR DIVIDING WALLS (With Exact Door Openings)
    // ==========================================
    buildInteriorDividingWalls() {
        const floorY = 1.0;
        const wallH = 7.5;
        const thick = 0.4;

        // --- A. WEST WING DIVIDERS ---
        // 1. Divider between West Corridor (x = -12) and West Rooms (Living, Dining, Kitchen)
        this.addSolidWall(-12.0, -7.0, -12.0, -13.2, thick, floorY, wallH, this.materials.wallPink, 'Wall_West_Corr_1');
        this.addSolidWall(-12.0, -15.8, -12.0, -28.2, thick, floorY, wallH, this.materials.wallDining, 'Wall_West_Corr_2');
        this.addSolidWall(-12.0, -30.8, -12.0, -43.2, thick, floorY, wallH, this.materials.wallTile, 'Wall_West_Corr_3');
        this.addSolidWall(-12.0, -45.8, -12.0, -52.0, thick, floorY, wallH, this.materials.wallTile, 'Wall_West_Corr_4');

        // Door lintels on West Corridor (height 3.9m above doorways)
        this.addWallSegment(-12.0, 6.55, -14.5, thick, 3.9, 2.6, this.materials.wallPink);
        this.addWallSegment(-12.0, 6.55, -29.5, thick, 3.9, 2.6, this.materials.wallDining);
        this.addWallSegment(-12.0, 6.55, -44.5, thick, 3.9, 2.6, this.materials.wallTile);

        // 2. Divider between Living Room and Dining Room (z = -22.0, x: [-32, -12])
        this.addSolidWall(-32.0, -22.0, -23.4, -22.0, thick, floorY, wallH, this.materials.wallPink, 'Wall_Living_Dining_1');
        this.addSolidWall(-20.6, -22.0, -12.0, -22.0, thick, floorY, wallH, this.materials.wallPink, 'Wall_Living_Dining_2');
        this.addWallSegment(-22.0, 6.55, -22.0, 2.8, 3.9, thick, this.materials.wallPink);

        // 3. Divider between Dining Room and Kitchen (z = -37.0, x: [-32, -12])
        this.addSolidWall(-32.0, -37.0, -23.3, -37.0, thick, floorY, wallH, this.materials.wallDining, 'Wall_Dining_Kitchen_1');
        this.addSolidWall(-20.7, -37.0, -12.0, -37.0, thick, floorY, wallH, this.materials.wallDining, 'Wall_Dining_Kitchen_2');
        this.addWallSegment(-22.0, 6.55, -37.0, 2.6, 3.9, thick, this.materials.wallDining);

        // --- B. CENTRAL SPINE WALLS (x = -8.0 and x = 8.0) ---
        // Dividing Central Spine from West Corridor (x = -8.0)
        this.addSolidWall(-8.0, -7.0, -8.0, -12.0, thick, floorY, wallH, this.materials.wallCream, 'Wall_Spine_West_1');
        this.addSolidWall(-8.0, -15.0, -8.0, -27.7, thick, floorY, wallH, this.materials.wallDamask, 'Wall_Spine_West_2');
        this.addSolidWall(-8.0, -30.3, -8.0, -52.0, thick, floorY, wallH, this.materials.wallDamask, 'Wall_Spine_West_3');
        this.addWallSegment(-8.0, 6.55, -13.5, thick, 3.9, 3.0, this.materials.wallCream);
        this.addWallSegment(-8.0, 6.55, -29.0, thick, 3.9, 2.6, this.materials.wallDamask);

        // Dividing Central Spine from East Corridor (x = +8.0)
        this.addSolidWall(8.0, -7.0, 8.0, -12.0, thick, floorY, wallH, this.materials.wallCream, 'Wall_Spine_East_1');
        this.addSolidWall(8.0, -15.0, 8.0, -27.7, thick, floorY, wallH, this.materials.wallDamask, 'Wall_Spine_East_2');
        this.addSolidWall(8.0, -30.3, 8.0, -52.0, thick, floorY, wallH, this.materials.wallDamask, 'Wall_Spine_East_3');
        this.addWallSegment(8.0, 6.55, -13.5, thick, 3.9, 3.0, this.materials.wallCream);
        this.addWallSegment(8.0, 6.55, -29.0, thick, 3.9, 2.6, this.materials.wallDamask);

        // Divider between Magical Gift Room and Photo Gallery (z = -36.0, x: [-8, 8])
        this.addSolidWall(-8.0, -36.0, -2.0, -36.0, thick, floorY, wallH, this.materials.wallDamask, 'Wall_Gift_Gallery_1');
        this.addSolidWall(2.0, -36.0, 8.0, -36.0, thick, floorY, wallH, this.materials.wallDamask, 'Wall_Gift_Gallery_2');
        this.addWallSegment(0, 6.55, -36.0, 4.0, 3.9, thick, this.materials.wallDamask);

        // --- C. EAST WING DIVIDERS ---
        // 1. Divider between East Corridor (x = 12.0) and East Rooms
        this.addSolidWall(12.0, -7.0, 12.0, -13.7, thick, floorY, wallH, this.materials.wallPink, 'Wall_East_Corr_1');
        this.addSolidWall(12.0, -16.3, 12.0, -28.8, thick, floorY, wallH, this.materials.wallDamask, 'Wall_East_Corr_2');
        this.addSolidWall(12.0, -31.2, 12.0, -43.2, thick, floorY, wallH, this.materials.wallSkyBlue, 'Wall_East_Corr_3');
        this.addSolidWall(12.0, -45.8, 12.0, -52.0, thick, floorY, wallH, this.materials.wallSkyBlue, 'Wall_East_Corr_4');

        // Door lintels on East Corridor
        this.addWallSegment(12.0, 6.55, -15.0, thick, 3.9, 2.6, this.materials.wallPink);
        this.addWallSegment(12.0, 6.55, -30.0, thick, 3.9, 2.4, this.materials.wallDamask);
        this.addWallSegment(12.0, 6.55, -44.5, thick, 3.9, 2.6, this.materials.wallSkyBlue);

        // 2. Divider between Bedroom and Dressing Room (z = -23.0, x: [12, 32])
        this.addSolidWall(12.0, -23.0, 20.8, -23.0, thick, floorY, wallH, this.materials.wallPink, 'Wall_Bed_Dress_1');
        this.addSolidWall(23.2, -23.0, 32.0, -23.0, thick, floorY, wallH, this.materials.wallPink, 'Wall_Bed_Dress_2');
        this.addWallSegment(22.0, 6.55, -23.0, 2.4, 3.9, thick, this.materials.wallPink);

        // 3. Divider between Bathroom (x: [8, 18]) and Dressing Room (x: [18, 32]) (x = 18.0, z: [-38, -23])
        this.addSolidWall(18.0, -23.0, 18.0, -28.9, thick, floorY, wallH, this.materials.wallTile, 'Wall_Bath_Dress_1');
        this.addSolidWall(18.0, -31.1, 18.0, -38.0, thick, floorY, wallH, this.materials.wallTile, 'Wall_Bath_Dress_2');
        this.addWallSegment(18.0, 6.55, -30.0, thick, 3.9, 2.2, this.materials.wallTile);

        // 4. Divider between Dressing/Bathroom and Guest Bedroom (z = -38.0, x: [12, 32])
        this.addSolidWall(12.0, -38.0, 32.0, -38.0, thick, floorY, wallH, this.materials.wallSkyBlue, 'Wall_Dress_Guest');
    }

    // Helper: Add solid wall segment to visual mesh AND register physics collider
    addSolidWall(x1, z1, x2, z2, thickness = 0.4, minY = 1.0, height = 5.5, mat = this.materials.wallCream, name = 'Wall') {
        const halfThick = thickness / 2;
        const minX = Math.min(x1, x2) - (x1 === x2 ? halfThick : 0);
        const maxX = Math.max(x1, x2) + (x1 === x2 ? halfThick : 0);
        const minZ = Math.min(z1, z2) - (z1 === z2 ? halfThick : 0);
        const maxZ = Math.max(z1, z2) + (z1 === z2 ? halfThick : 0);

        const w = maxX - minX;
        const d = maxZ - minZ;
        const cx = (minX + maxX) / 2;
        const cz = (minZ + maxZ) / 2;

        const geom = new THREE.BoxGeometry(w, height, d);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(cx, minY + height / 2, cz);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.group.add(mesh);

        // Register with Physics/Collision System!
        if (this.collision) {
            this.collision.addBox(minX, maxX, minZ, maxZ, minY, minY + height, { name: name });
        }
    }

    // Helper: Add lintel or architectural wall block
    addWallSegment(cx, cy, cz, w, h, d, mat) {
        const geom = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(cx, cy, cz);
        mesh.castShadow = true;
        this.group.add(mesh);
    }

    // ==========================================
    // 4. REAL FUNCTIONING HINGED DOORS WITH PHYSICS
    // ==========================================
    buildDoors() {
        const baseY = 1.0;

        // 1. Grand Castle Front Entrance Double Doors (z = -7.0, x = 0)
        this.createHingedDoubleDoor({
            x: 0, y: baseY, z: -7.0,
            width: 4.4, height: 4.0,
            name: 'Grand Palace Front Doors',
            rotY: 0
        });

        // 2. Living Room Door (x = -12.0, z = -14.5)
        this.createSingleHingedDoor({
            x: -12.0, y: baseY, z: -14.5,
            width: 2.4, height: 3.6,
            rotY: Math.PI / 2,
            name: 'Living Room Door'
        });

        // 3. Living to Dining Room Door (z = -22.0, x = -22.0)
        this.createSingleHingedDoor({
            x: -22.0, y: baseY, z: -22.0,
            width: 2.6, height: 3.6,
            rotY: 0,
            name: 'Dining Room Door'
        });

        // 4. Dining to Kitchen Door (z = -37.0, x = -22.0)
        this.createSingleHingedDoor({
            x: -22.0, y: baseY, z: -37.0,
            width: 2.4, height: 3.6,
            rotY: 0,
            name: 'Kitchen Door'
        });

        // 5. Kitchen to West Corridor Door (x = -12.0, z = -44.5)
        this.createSingleHingedDoor({
            x: -12.0, y: baseY, z: -44.5,
            width: 2.4, height: 3.6,
            rotY: Math.PI / 2,
            name: 'Kitchen Service Door'
        });

        // 6. Princess Bedroom Door (x = 12.0, z = -15.0)
        this.createSingleHingedDoor({
            x: 12.0, y: baseY, z: -15.0,
            width: 2.4, height: 3.6,
            rotY: -Math.PI / 2,
            name: 'Princess Bedroom Door'
        });

        // 7. Bedroom to Dressing Room Door (z = -23.0, x = 22.0)
        this.createSingleHingedDoor({
            x: 22.0, y: baseY, z: -23.0,
            width: 2.2, height: 3.6,
            rotY: 0,
            name: 'Dressing Room Door'
        });

        // 8. Bathroom Door (x = 18.0, z = -30.0)
        this.createSingleHingedDoor({
            x: 18.0, y: baseY, z: -30.0,
            width: 2.0, height: 3.5,
            rotY: Math.PI / 2,
            name: 'Royal Bathroom Door'
        });

        // 9. Guest Bedroom Door (x = 12.0, z = -44.5)
        this.createSingleHingedDoor({
            x: 12.0, y: baseY, z: -44.5,
            width: 2.4, height: 3.6,
            rotY: -Math.PI / 2,
            name: 'Guest Room Door'
        });
    }

    createSingleHingedDoor(params) {
        const { x, y, z, width = 2.2, height = 3.6, rotY = 0, name = 'Door' } = params;
        const doorGroup = new THREE.Group();
        doorGroup.position.set(x, y, z);
        doorGroup.rotation.y = rotY;

        // Frame
        const frameGeom = new THREE.BoxGeometry(width + 0.3, height + 0.15, 0.2);
        const frame = new THREE.Mesh(frameGeom, this.materials.gold);
        frame.position.set(0, height / 2, 0);
        doorGroup.add(frame);

        // Hinge Pivot
        const hingePivot = new THREE.Group();
        hingePivot.position.set(-width / 2, 0, 0);

        const leafGeom = new THREE.BoxGeometry(width, height, 0.1);
        const leaf = new THREE.Mesh(leafGeom, this.materials.woodDoor);
        leaf.position.set(width / 2, height / 2, 0);
        leaf.castShadow = true;
        hingePivot.add(leaf);

        // Gold handle
        const handleGeom = new THREE.TorusGeometry(0.12, 0.03, 8, 16);
        const handle = new THREE.Mesh(handleGeom, this.materials.gold);
        handle.position.set(width * 0.85, height / 2, 0.08);
        hingePivot.add(handle);

        doorGroup.add(hingePivot);

        const doorId = `door_${Math.random().toString(36).substr(2, 6)}`;

        // Dynamic collision obstacle for closed door
        let colRef = null;
        if (this.collision) {
            const halfW = width / 2;
            const halfThick = 0.2;
            const minX = rotY === 0 ? x - halfW : x - halfThick;
            const maxX = rotY === 0 ? x + halfW : x + halfThick;
            const minZ = rotY === 0 ? z - halfThick : z - halfW;
            const maxZ = rotY === 0 ? z + halfThick : z + halfW;
            colRef = this.collision.addBox(minX, maxX, minZ, maxZ, y, y + height, {
                id: doorId,
                name: `${name}_Collision`,
                isDoor: true,
                isOpen: false
            });
        }

        const self = this;
        doorGroup.userData = {
            id: doorId,
            isInteractive: true,
            type: 'door',
            name: name,
            prompt: `Open ${name}`,
            isOpen: false,
            openAngle: Math.PI / 2.1,
            hingePivot: hingePivot,
            toggle: function() {
                this.isOpen = !this.isOpen;
                this.prompt = this.isOpen ? `Close ${name}` : `Open ${name}`;
                this.targetRot = this.isOpen ? this.openAngle : 0;
                if (self.collision) {
                    self.collision.setDoorState(this.id, this.isOpen);
                }
            }
        };

        this.doors.push(doorGroup.userData);
        this.interactiveObjects.push(doorGroup);
        this.group.add(doorGroup);
        return doorGroup;
    }

    createHingedDoubleDoor(params) {
        const { x, y, z, width = 4.4, height = 4.0, rotY = 0, name = 'Doors' } = params;
        const doorGroup = new THREE.Group();
        doorGroup.position.set(x, y, z);
        doorGroup.rotation.y = rotY;

        const halfLeafW = width / 2;

        // Left Leaf Hinge
        const leftHinge = new THREE.Group();
        leftHinge.position.set(-halfLeafW, 0, 0);
        const leftLeafGeom = new THREE.BoxGeometry(halfLeafW, height, 0.14);
        const leftLeaf = new THREE.Mesh(leftLeafGeom, this.materials.woodDoor);
        leftLeaf.position.set(halfLeafW / 2, height / 2, 0);
        leftLeaf.castShadow = true;
        leftHinge.add(leftLeaf);

        // Right Leaf Hinge
        const rightHinge = new THREE.Group();
        rightHinge.position.set(halfLeafW, 0, 0);
        const rightLeaf = new THREE.Mesh(leftLeafGeom, this.materials.woodDoor);
        rightLeaf.position.set(-halfLeafW / 2, height / 2, 0);
        rightLeaf.castShadow = true;
        rightHinge.add(rightLeaf);

        doorGroup.add(leftHinge);
        doorGroup.add(rightHinge);

        const doorId = `door_entrance_main`;

        if (this.collision) {
            this.collision.addBox(x - halfLeafW, x + halfLeafW, z - 0.2, z + 0.2, y, y + height, {
                id: doorId,
                name: `${name}_Collision`,
                isDoor: true,
                isOpen: false
            });
        }

        const self = this;
        doorGroup.userData = {
            id: doorId,
            isInteractive: true,
            type: 'castleDoor',
            name: name,
            prompt: 'Open Castle Doors',
            isOpen: false,
            leftPivot: leftHinge,
            rightPivot: rightHinge,
            toggle: function() {
                this.isOpen = !this.isOpen;
                this.prompt = this.isOpen ? 'Close Castle Doors' : 'Open Castle Doors';
                this.targetRot = this.isOpen ? Math.PI / 2.2 : 0;
                if (self.collision) {
                    self.collision.setDoorState(this.id, this.isOpen);
                }
            }
        };

        this.doors.push(doorGroup.userData);
        this.interactiveObjects.push(doorGroup);
        this.group.add(doorGroup);
        return doorGroup;
    }

    // ==========================================
    // 5. GRAND STAIRCASE & UPPER FLOOR
    // ==========================================
    buildGrandStaircase() {
        const stairGroup = new THREE.Group();
        const startY = 1.0;
        const targetY = 6.0;
        const startZ = -14.0;
        const targetZ = -20.0;
        const numSteps = 16;
        const stepWidth = 4.4;
        const dy = (targetY - startY) / numSteps;
        const dz = (targetZ - startZ) / numSteps;

        for (let i = 0; i < numSteps; i++) {
            const stepY = startY + i * dy;
            const stepZ = startZ + i * dz;

            const stepGeom = new THREE.BoxGeometry(stepWidth, dy, Math.abs(dz) * 1.05);
            const step = new THREE.Mesh(stepGeom, this.materials.floorMarble);
            step.position.set(0, stepY + dy / 2, stepZ);
            step.receiveShadow = true;
            stairGroup.add(step);

            // Red carpet runner on steps
            const carpetStepGeom = new THREE.BoxGeometry(2.4, dy * 1.05, Math.abs(dz) * 1.08);
            const carpetStep = new THREE.Mesh(carpetStepGeom, this.materials.redVelvet);
            carpetStep.position.set(0, stepY + dy / 2 + 0.02, stepZ);
            stairGroup.add(carpetStep);
        }

        // Golden Handrails
        for (let side of [-1, 1]) {
            const railGeom = new THREE.CylinderGeometry(0.08, 0.08, Math.hypot(targetY - startY, targetZ - startZ), 8);
            const rail = new THREE.Mesh(railGeom, this.materials.gold);
            rail.position.set(side * (stepWidth / 2 + 0.1), (startY + targetY) / 2 + 0.9, (startZ + targetZ) / 2);
            rail.rotation.x = Math.atan2(targetY - startY, targetZ - startZ) - Math.PI / 2;
            stairGroup.add(rail);
        }

        this.group.add(stairGroup);
    }

    buildUpperFloor() {
        const upperGroup = new THREE.Group();
        const upperY = 6.0;
        const w = 16;
        const d = 13;

        // Upper Mezzanine Walkway Platform (Floor with opening in center overlooking Foyer below)
        // North bridge (x: [-8, 8], z: [-20, -17])
        const northBridgeGeom = new THREE.BoxGeometry(w, 0.3, 3.5);
        const northBridge = new THREE.Mesh(northBridgeGeom, this.materials.floorMarble);
        northBridge.position.set(0, upperY - 0.15, -18.5);
        upperGroup.add(northBridge);

        // South bridge (connects to Balcony doors at z = -7)
        const southBridge = new THREE.Mesh(northBridgeGeom, this.materials.floorMarble);
        southBridge.position.set(0, upperY - 0.15, -8.5);
        upperGroup.add(southBridge);

        // Left walkway connecting North and South
        const leftWalkGeom = new THREE.BoxGeometry(3.0, 0.3, d);
        const leftWalk = new THREE.Mesh(leftWalkGeom, this.materials.floorMarble);
        leftWalk.position.set(-6.5, upperY - 0.15, -13.5);
        upperGroup.add(leftWalk);

        // Right walkway
        const rightWalk = new THREE.Mesh(leftWalkGeom, this.materials.floorMarble);
        rightWalk.position.set(6.5, upperY - 0.15, -13.5);
        upperGroup.add(rightWalk);

        // Golden Balustrade Railings around opening
        const railN = new THREE.Mesh(new THREE.BoxGeometry(10, 0.9, 0.1), this.materials.gold);
        railN.position.set(0, upperY + 0.45, -16.7);
        upperGroup.add(railN);

        const railS = new THREE.Mesh(new THREE.BoxGeometry(10, 0.9, 0.1), this.materials.gold);
        railS.position.set(0, upperY + 0.45, -10.3);
        upperGroup.add(railS);

        // --- Royal Sunset Balcony (z: [-7, -2.5], x: [-5, 5]) ---
        const terraceGeom = new THREE.BoxGeometry(9.0, 0.3, 4.5);
        const terrace = new THREE.Mesh(terraceGeom, this.materials.floorMarble);
        terrace.position.set(0, upperY - 0.15, -4.75);
        upperGroup.add(terrace);

        // Balcony perimeter railings
        const railFront = new THREE.Mesh(new THREE.BoxGeometry(9.0, 1.0, 0.15), this.materials.gold);
        railFront.position.set(0, upperY + 0.5, -2.5);
        upperGroup.add(railFront);

        const railLeft = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.0, 4.5), this.materials.gold);
        railLeft.position.set(-4.5, upperY + 0.5, -4.75);
        upperGroup.add(railLeft);

        const railRight = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.0, 4.5), this.materials.gold);
        railRight.position.set(4.5, upperY + 0.5, -4.75);
        upperGroup.add(railRight);

        // Balcony Scenic View Marker
        terrace.userData = {
            isInteractive: true,
            type: 'balconyView',
            name: 'Royal Sunset Balcony',
            prompt: 'View Romantic Sunset 🌅'
        };
        this.interactiveObjects.push(terrace);

        // Brass Telescope in Upper Observatory
        const telescope = this.createTelescope(-5.5, upperY, -8.5);
        upperGroup.add(telescope);

        // Upper floor mezzanine chandeliers
        const upperChandelierL = this.createChandelier(-6.5, upperY + 3.2, -13.5, 0xfffaec, 2.2, 28);
        const upperChandelierR = this.createChandelier(6.5, upperY + 3.2, -13.5, 0xfffaec, 2.2, 28);
        upperGroup.add(upperChandelierL);
        upperGroup.add(upperChandelierR);

        this.group.add(upperGroup);
    }

    // ==========================================
    // 6. FURNISHINGS (With >3.5m Walkways & Collision)
    // ==========================================

    furnishFoyer() {
        // Grand Crystal Chandelier in Foyer Center
        const chandelier = this.createChandelier(0, 7.2, -13.5, 0xfffaec, 2.5, 38);
        this.group.add(chandelier);

        // Red Carpet in Foyer
        const carpet = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.04, 12), this.materials.redVelvet);
        carpet.position.set(0, 1.02, -13.5);
        this.group.add(carpet);
    }

    furnishLivingRoom() {
        const cx = -22.0;
        const cz = -14.5;
        const baseY = 1.0;

        // Royal Living Room Chandelier
        const chandelier = this.createChandelier(cx, 7.2, cz, 0xfffaec, 2.5, 38);
        this.group.add(chandelier);

        // Roaring Fireplace on West Wall (x = -31.5)
        const fireplace = this.createFireplace(-31.4, baseY, cz, Math.PI / 2);
        this.group.add(fireplace);
        this.registerFurnitureCollision(-32.0, -30.5, cz - 2.0, cz + 2.0, baseY, baseY + 3.0, 'Fireplace');

        // Royal Velvet Sofa facing Fireplace (placed at x = -21.0, z = -14.5)
        const sofa = this.createRoyalSofa(cx, baseY, cz, Math.PI / 2);
        this.group.add(sofa);
        this.registerFurnitureCollision(cx - 1.2, cx + 1.2, cz - 2.6, cz + 2.6, baseY, baseY + 1.8, 'Royal_Sofa');

        // Glass Coffee Table in front of Sofa (x = -25.0)
        const coffeeTable = this.createCoffeeTable(cx - 3.5, baseY, cz);
        this.group.add(coffeeTable);
        this.registerFurnitureCollision(cx - 4.5, cx - 2.5, cz - 1.2, cz + 1.2, baseY, baseY + 1.0, 'Coffee_Table');

        // Bookshelf flat against South Wall (x = -27.0, z = -7.5)
        const bookshelf = this.createBookshelf(-27.0, baseY, -7.5, 0);
        this.group.add(bookshelf);
        this.registerFurnitureCollision(-29.5, -24.5, -7.8, -7.0, baseY, baseY + 4.5, 'Bookshelf');

        // Floor Standing Lamp at corner (x = -14.5, z = -8.0)
        const lamp = this.createFloorLamp(-14.5, baseY, -8.0);
        this.group.add(lamp);
    }

    furnishDiningRoom() {
        const cx = -22.0;
        const cz = -29.5;
        const baseY = 1.0;

        // Grand Dining Table in Center (length 7m, width 2.6m)
        const table = this.createDiningTable(cx, baseY, cz);
        this.group.add(table);
        this.registerFurnitureCollision(cx - 3.6, cx + 3.6, cz - 1.4, cz + 1.4, baseY, baseY + 1.5, 'Dining_Table');

        // 6 Dining Chairs
        for (let i = -1; i <= 1; i++) {
            const chairNorth = this.createDiningChair(cx + i * 2.2, baseY, cz - 1.8, 0);
            const chairSouth = this.createDiningChair(cx + i * 2.2, baseY, cz + 1.8, Math.PI);
            this.group.add(chairNorth);
            this.group.add(chairSouth);
        }

        // Sideboard buffet against West Wall (x = -31.4)
        const sideboard = this.createSideboard(-31.4, baseY, cz, Math.PI / 2);
        this.group.add(sideboard);
        this.registerFurnitureCollision(-32.0, -30.5, cz - 3.0, cz + 3.0, baseY, baseY + 1.6, 'Sideboard');

        // Dining Room Crystal Chandelier
        const chandelier = this.createChandelier(cx, 7.2, cz, 0xfffaec, 2.5, 38);
        this.group.add(chandelier);
    }

    furnishKitchen() {
        const cx = -22.0;
        const cz = -44.5;
        const baseY = 1.0;

        // Bright Kitchen Pendant Chandelier
        const chandelier = this.createChandelier(cx, 7.2, cz, 0xfffaec, 2.5, 38);
        this.group.add(chandelier);

        // Kitchen Counter along West Wall (x = -31.2, z: [-48, -40])
        const counter = this.createKitchenCounter(-31.2, baseY, cz);
        this.group.add(counter);
        this.registerFurnitureCollision(-32.0, -30.0, cz - 3.5, cz + 3.5, baseY, baseY + 1.5, 'Kitchen_Counter');

        // Refrigerator in North-West Corner (x = -30.5, z = -50.2)
        const fridge = this.createRefrigerator(-30.5, baseY, -50.2);
        this.group.add(fridge);
        this.registerFurnitureCollision(-31.8, -29.2, -51.5, -48.8, baseY, baseY + 4.2, 'Refrigerator');

        // Kitchen Island in Center (x = -22.0, z = -44.5)
        const island = this.createKitchenIsland(cx, baseY, cz);
        this.group.add(island);
        this.registerFurnitureCollision(cx - 2.0, cx + 2.0, cz - 1.3, cz + 1.3, baseY, baseY + 1.5, 'Kitchen_Island');

        // Storage Drawers on North Wall (x = -17.0, z = -51.4)
        const drawers = this.createKitchenDrawerUnit(-17.0, baseY, -51.4);
        this.group.add(drawers);
        this.registerFurnitureCollision(-18.5, -15.5, -52.0, -50.5, baseY, baseY + 1.6, 'Kitchen_Drawers');
    }

    furnishPrincessBedroom() {
        const cx = 22.0;
        const cz = -15.0;
        const baseY = 1.0;

        // Princess Romantic Rose Chandelier
        const chandelier = this.createChandelier(cx, 7.2, cz, 0xfff0f5, 2.5, 38);
        this.group.add(chandelier);

        // Four-Poster Royal Canopy Bed against East Wall (x = 28.5, z = -15.0)
        // Leaving 12 meters of free walking space on the West side of the bedroom!
        const bed = this.createCanopyBed(28.5, baseY, cz);
        this.group.add(bed);
        this.registerFurnitureCollision(25.5, 31.8, cz - 3.8, cz + 3.8, baseY, baseY + 5.0, 'Canopy_Bed');

        // Bedside Nightstands with Lamps
        const nightstandL = this.createNightstand(28.5, baseY, cz - 4.5);
        const nightstandR = this.createNightstand(28.5, baseY, cz + 4.5);
        this.group.add(nightstandL);
        this.group.add(nightstandR);
        this.registerFurnitureCollision(27.8, 29.5, cz - 5.2, cz - 3.8, baseY, baseY + 1.5, 'Nightstand_L');
        this.registerFurnitureCollision(27.8, 29.5, cz + 3.8, cz + 5.2, baseY, baseY + 1.5, 'Nightstand_R');

        // Fluffy Princess Rug in bedroom center
        const rug = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.2, 0.06, 32), this.materials.pinkSilk);
        rug.position.set(cx - 2, baseY + 0.03, cz);
        this.group.add(rug);

        // Vanity Dressing Table on South Wall (x = 18.0, z = -7.6)
        const vanity = this.createVanityDresser(18.0, baseY, -7.6, 0);
        this.group.add(vanity);
        this.registerFurnitureCollision(16.0, 20.0, -8.4, -7.0, baseY, baseY + 3.5, 'Vanity_Dresser');

        // Bedroom Fireplace on North Wall (x = 15.0, z = -22.4)
        const fireplace = this.createFireplace(15.0, baseY, -22.4, Math.PI);
        this.group.add(fireplace);
        this.registerFurnitureCollision(13.2, 16.8, -23.0, -21.6, baseY, baseY + 3.0, 'Bed_Fireplace');
    }

    furnishDressingRoom() {
        const cx = 25.0;
        const cz = -30.0;
        const baseY = 1.0;

        // Dressing Room Glamour Chandelier
        const chandelier = this.createChandelier(cx, 7.2, cz, 0xfffaec, 2.4, 34);
        this.group.add(chandelier);

        // Royal Wardrobe against East Wall (x = 31.2, z = -30.0)
        const wardrobe = this.createWardrobe(31.2, baseY, cz);
        this.group.add(wardrobe);
        this.registerFurnitureCollision(29.8, 32.0, cz - 2.2, cz + 2.2, baseY, baseY + 5.0, 'Wardrobe');

        // Full-length Standing Mirror (x = 22.0, z = -36.5)
        const mirror = this.createStandingMirror(22.0, baseY, -36.5);
        this.group.add(mirror);

        // Accessory Dresser (x = 27.5, z = -36.8)
        const dresser = this.createDresserWithDrawers(27.5, baseY, -36.8);
        this.group.add(dresser);
        this.registerFurnitureCollision(25.5, 29.5, -37.8, -36.0, baseY, baseY + 2.2, 'Dresser');
    }

    furnishBathroom() {
        const cx = 13.0;
        const cz = -30.0;
        const baseY = 1.0;

        // Bathroom Soft Glow Lantern
        const chandelier = this.createChandelier(cx, 7.2, cz, 0xfffaec, 2.2, 32);
        this.group.add(chandelier);

        // Clawfoot Bathtub along North Wall (x = 13.0, z = -25.0)
        const bathtub = this.createBathtub(cx, baseY, -25.5);
        this.group.add(bathtub);
        this.registerFurnitureCollision(cx - 2.6, cx + 2.6, -26.8, -24.2, baseY, baseY + 1.8, 'Bathtub');

        // Washbasin with interactive tap on South Wall (x = 13.0, z = -35.0)
        const washbasin = this.createWashbasin(cx, baseY, -35.2);
        this.group.add(washbasin);
        this.registerFurnitureCollision(cx - 1.5, cx + 1.5, -36.2, -34.2, baseY, baseY + 1.6, 'Washbasin');
    }

    furnishGuestBedroom() {
        const cx = 22.0;
        const cz = -45.0;
        const baseY = 1.0;

        // Guest Bedroom Chandelier
        const chandelier = this.createChandelier(cx, 7.2, cz, 0xfffaec, 2.4, 36);
        this.group.add(chandelier);

        // Guest Bed against East Wall (x = 28.5, z = -45.0)
        const guestBed = this.createGuestBed(28.5, baseY, cz);
        this.group.add(guestBed);
        this.registerFurnitureCollision(25.8, 31.8, cz - 3.2, cz + 3.2, baseY, baseY + 3.0, 'Guest_Bed');

        // Writing Desk on North Wall (x = 20.0, z = -50.8)
        const desk = this.createWritingDesk(20.0, baseY, -50.8);
        this.group.add(desk);
        this.registerFurnitureCollision(18.0, 22.0, -51.8, -49.8, baseY, baseY + 2.0, 'Writing_Desk');
    }

    furnishGiftRoom() {
        const cx = 0;
        const cz = -28.0;
        const baseY = 1.0;

        // Magical Gift Room Sparkling Chandelier
        const chandelier = this.createChandelier(cx, 7.2, cz, 0xffe6ff, 2.5, 38);
        this.group.add(chandelier);

        // Grand Circular Marble Dais in Center
        const daisGeom = new THREE.CylinderGeometry(2.0, 2.2, 0.6, 32);
        const dais = new THREE.Mesh(daisGeom, this.materials.gold);
        dais.position.set(cx, baseY + 0.3, cz);
        this.group.add(dais);
        this.registerFurnitureCollision(cx - 2.0, cx + 2.0, cz - 2.0, cz + 2.0, baseY, baseY + 1.8, 'Gift_Dais');

        // The Grand Magical Gift Box for Nandini
        const giftBox = this.createMagicalGiftBox(cx, baseY + 0.6, cz);
        this.group.add(giftBox);

        // Floating Heart Balloons in room corners
        for (let i = 0; i < 4; i++) {
            const balloonGeom = new THREE.SphereGeometry(0.5, 16, 16);
            const balloon = new THREE.Mesh(balloonGeom, this.materials.pinkSilk);
            const bx = (i % 2 === 0 ? -5.5 : 5.5);
            const bz = (i < 2 ? -23.0 : -33.0);
            balloon.position.set(bx, baseY + 4.2, bz);
            this.group.add(balloon);
        }
    }

    furnishPhotoGallery() {
        const cx = 0;
        const cz = -44.0;
        const baseY = 1.0;

        // Photo Gallery Royal Chandelier
        const chandelier = this.createChandelier(cx, 7.2, cz, 0xffffff, 2.5, 38);
        this.group.add(chandelier);

        // Corridor Lighting in West and East Hallways
        const westCorrLight = this.createChandelier(-10.0, 7.2, -29.5, 0xfffaec, 2.2, 30);
        const eastCorrLight = this.createChandelier(10.0, 7.2, -29.5, 0xfffaec, 2.2, 30);
        this.group.add(westCorrLight);
        this.group.add(eastCorrLight);

        // Red Carpet Runner
        const carpet = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.04, 15), this.materials.redVelvet);
        carpet.position.set(cx, baseY + 0.02, cz);
        this.group.add(carpet);

        // Princess Royal Crown on Center Marble Plinth (x = 0, z = -49.5)
        const plinthGeom = new THREE.CylinderGeometry(0.9, 1.1, 1.2, 16);
        const plinth = new THREE.Mesh(plinthGeom, this.materials.floorMarble);
        plinth.position.set(cx, baseY + 0.6, -49.5);
        this.group.add(plinth);
        this.registerFurnitureCollision(-1.0, 1.0, -50.5, -48.5, baseY, baseY + 1.8, 'Crown_Plinth');

        const crown = this.createPrincessCrown(cx, baseY + 1.2, -49.5);
        this.group.add(crown);

        // 8 Illuminated Photo Frames (4 on West Wall x = -7.7, 4 on East Wall x = 7.7)
        const photoList = [
            { id: 1, file: 'photo-1.jpg', title: 'Our Sweetest Smile' },
            { id: 2, file: 'photo-2.jpg', title: 'Fairytale Moments' },
            { id: 3, file: 'photo-3.jpg', title: 'Princess of My Heart' },
            { id: 4, file: 'photo-4.jpg', title: 'Endless Magic Together' },
            { id: 5, file: 'photo-5.jpg', title: 'Pure Joy & Laughter' },
            { id: 6, file: 'photo-6.jpg', title: 'Forever & Always' },
            { id: 7, file: 'photo-7.jpg', title: 'My Dream Come True' },
            { id: 8, file: 'photo-8.jpg', title: 'Happy Princess Day' }
        ];

        for (let i = 0; i < 4; i++) {
            const frameL = this.createPhotoFrame(-7.7, baseY + 2.8, cz - 4.5 + i * 3.0, Math.PI / 2, photoList[i]);
            const frameR = this.createPhotoFrame(7.7, baseY + 2.8, cz - 4.5 + i * 3.0, -Math.PI / 2, photoList[i + 4]);
            this.group.add(frameL);
            this.group.add(frameR);
        }
    }

    registerFurnitureCollision(minX, maxX, minZ, maxZ, minY, maxY, name) {
        if (this.collision) {
            this.collision.addBox(minX, maxX, minZ, maxZ, minY, maxY, { name: name });
        }
    }

    // ==========================================
    // DETAILED INTERACTIVE FIXTURES & ITEMS
    // ==========================================

    createCanopyBed(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const frameGeom = new THREE.BoxGeometry(5.8, 0.8, 7.0);
        const frame = new THREE.Mesh(frameGeom, this.materials.woodDark);
        frame.position.y = 0.4;
        group.add(frame);

        const mattressGeom = new THREE.BoxGeometry(5.4, 0.7, 6.6);
        const mattress = new THREE.Mesh(mattressGeom, this.materials.floorMarble);
        mattress.position.y = 1.0;
        group.add(mattress);

        const quiltGeom = new THREE.BoxGeometry(5.2, 0.2, 4.6);
        const quilt = new THREE.Mesh(quiltGeom, this.materials.pinkSilk);
        quilt.position.set(0, 1.45, 0.9);
        group.add(quilt);

        for (let px of [-1.5, 0, 1.5]) {
            const pillow = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.35, 0.9), this.materials.whiteLace);
            pillow.position.set(px, 1.45, -2.3);
            group.add(pillow);
        }

        // 4 Canopy Pillars
        for (let px of [-2.7, 2.7]) {
            for (let pz of [-3.3, 3.3]) {
                const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 5.0, 12), this.materials.gold);
                pillar.position.set(px, 2.5, pz);
                group.add(pillar);
            }
        }

        const canopyTop = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.15, 7.0), this.materials.gold);
        canopyTop.position.y = 5.0;
        group.add(canopyTop);

        group.userData = {
            id: `bed_princess`,
            isInteractive: true,
            type: 'bed',
            name: 'Royal Canopy Bed',
            prompt: 'Sleep on Royal Bed 🛏️',
            targetPos: new THREE.Vector3(x, y + 1.5, z),
            targetRot: -Math.PI / 2
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createGuestBed(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const frame = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.6, 6.0), this.materials.woodDark);
        frame.position.y = 0.3;
        group.add(frame);

        const mattress = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.6, 5.8), this.materials.royalBlue);
        mattress.position.y = 0.85;
        group.add(mattress);

        group.userData = {
            id: `bed_guest`,
            isInteractive: true,
            type: 'bed',
            name: 'Guest Bed',
            prompt: 'Sleep on Bed 🛏️',
            targetPos: new THREE.Vector3(x, y + 1.2, z),
            targetRot: -Math.PI / 2
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createRoyalSofa(x, y, z, rotY = 0) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        group.rotation.y = rotY;

        const base = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.5, 2.0), this.materials.gold);
        base.position.y = 0.25;
        group.add(base);

        const seat = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.5, 1.8), this.materials.redVelvet);
        seat.position.y = 0.65;
        group.add(seat);

        const back = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.5, 0.4), this.materials.redVelvet);
        back.position.set(0, 1.4, -0.8);
        group.add(back);

        group.userData = {
            id: `sofa_living`,
            isInteractive: true,
            type: 'sofa',
            name: 'Royal Velvet Sofa',
            prompt: 'Sit on Sofa 🛋️',
            targetPos: new THREE.Vector3(x, y + 0.7, z),
            targetRot: rotY
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createCoffeeTable(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const top = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.08, 24), this.materials.glass);
        top.position.y = 0.75;
        group.add(top);

        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.5, 0.7, 12), this.materials.gold);
        base.position.y = 0.35;
        group.add(base);

        const teapot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), this.materials.gold);
        teapot.position.set(0, 0.95, 0);
        group.add(teapot);

        return group;
    }

    createBookshelf(x, y, z, rotY = 0) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        group.rotation.y = rotY;

        const shelf = new THREE.Mesh(new THREE.BoxGeometry(4.5, 4.5, 0.8), this.materials.woodDark);
        shelf.position.y = 2.25;
        group.add(shelf);

        group.userData = {
            id: `bookshelf_living`,
            isInteractive: true,
            type: 'book',
            name: 'Royal Fairytale Library',
            prompt: 'Read Fairytale Book 📖',
            targetPos: new THREE.Vector3(x, y + 1.0, z + 1.5),
            targetRot: rotY
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createDiningTable(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const table = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.2, 2.6), this.materials.woodDark);
        table.position.y = 1.3;
        group.add(table);

        for (let sx of [-3.0, 3.0]) {
            for (let sz of [-1.0, 1.0]) {
                const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.3, 8), this.materials.gold);
                leg.position.set(sx, 0.65, sz);
                group.add(leg);
            }
        }
        return group;
    }

    createDiningChair(x, y, z, rotY = 0) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        group.rotation.y = rotY;

        const seat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 1.2), this.materials.redVelvet);
        seat.position.y = 0.75;
        group.add(seat);

        const back = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.1), this.materials.gold);
        back.position.set(0, 1.4, -0.55);
        group.add(back);

        group.userData = {
            id: `chair_${Math.random().toString(36).substr(2, 6)}`,
            isInteractive: true,
            type: 'chair',
            name: 'Dining Chair',
            prompt: 'Sit at Table 🪑',
            targetPos: new THREE.Vector3(x, y + 0.75, z),
            targetRot: rotY
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createSideboard(x, y, z, rotY = 0) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        group.rotation.y = rotY;

        const mesh = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.5, 1.2), this.materials.woodDark);
        mesh.position.y = 0.75;
        group.add(mesh);
        return group;
    }

    createKitchenCounter(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const counter = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 6.0), this.materials.floorMarble);
        counter.position.y = 0.7;
        group.add(counter);

        const tap = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.05, 8, 16, Math.PI), this.materials.gold);
        tap.position.set(0, 1.65, 0);
        tap.rotation.z = Math.PI / 2;
        group.add(tap);

        const water = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.45, 8), this.materials.waterStream);
        water.position.set(0.2, 1.35, 0);
        water.visible = false;
        group.add(water);

        group.userData = {
            id: `kitchen_tap`,
            isInteractive: true,
            type: 'tap',
            name: 'Kitchen Sink Tap',
            prompt: 'Turn ON Tap 🚿',
            isOn: false,
            waterMesh: water,
            toggle: function() {
                this.isOn = !this.isOn;
                this.prompt = this.isOn ? 'Turn OFF Tap' : 'Turn ON Tap 🚿';
                if (this.waterMesh) this.waterMesh.visible = this.isOn;
            }
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createRefrigerator(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 4.2, 2.0), this.materials.metalChrome);
        body.position.y = 2.1;
        group.add(body);

        const doorPivot = new THREE.Group();
        doorPivot.position.set(-1.1, 0, 1.0);

        const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(2.2, 4.2, 0.15), this.materials.metalChrome);
        doorLeaf.position.set(1.1, 2.1, 0);
        doorPivot.add(doorLeaf);

        group.add(doorPivot);

        group.userData = {
            id: `fridge_main`,
            isInteractive: true,
            type: 'fridge',
            name: 'Royal Refrigerator',
            prompt: 'Open Refrigerator ❄️',
            isOpen: false,
            doorPivot: doorPivot,
            toggle: function() {
                this.isOpen = !this.isOpen;
                this.prompt = this.isOpen ? 'Close Refrigerator' : 'Open Refrigerator ❄️';
                this.doorPivot.rotation.y = this.isOpen ? -Math.PI / 1.8 : 0;
            }
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createKitchenIsland(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const island = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.4, 2.4), this.materials.floorMarble);
        island.position.y = 0.7;
        group.add(island);

        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.35, 12), this.materials.pinkSilk);
        cup.position.set(0, 1.55, 0);
        group.add(cup);

        group.userData = {
            id: `kitchen_cup`,
            isInteractive: true,
            type: 'cup',
            name: 'Princess Tea Cup',
            prompt: 'Pick up Tea Cup ☕',
            isPicked: false,
            cupMesh: cup,
            toggle: function() {
                this.isPicked = !this.isPicked;
                this.prompt = this.isPicked ? 'Place Cup on Counter' : 'Pick up Tea Cup ☕';
                this.cupMesh.position.y = this.isPicked ? 2.5 : 1.55;
            }
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createKitchenDrawerUnit(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const frame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.6, 1.8), this.materials.woodDark);
        frame.position.y = 0.8;
        group.add(frame);

        const drawerSlide = new THREE.Group();
        const drawer = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.45, 1.6), this.materials.woodDoor);
        drawer.position.set(0, 1.1, 0);
        drawerSlide.add(drawer);

        group.add(drawerSlide);

        group.userData = {
            id: `drawer_kitchen`,
            isInteractive: true,
            type: 'drawer',
            name: 'Kitchen Storage Drawer',
            prompt: 'Open Drawer 🗄️',
            isOpen: false,
            drawerSlide: drawerSlide,
            toggle: function() {
                this.isOpen = !this.isOpen;
                this.prompt = this.isOpen ? 'Close Drawer' : 'Open Drawer 🗄️';
                this.drawerSlide.position.z = this.isOpen ? 0.9 : 0;
            }
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createWardrobe(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 4.8, 4.0), this.materials.woodDark);
        frame.position.y = 2.4;
        group.add(frame);

        const leftHinge = new THREE.Group();
        leftHinge.position.set(-0.8, 0, -2.0);
        const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.6, 2.0), this.materials.woodDoor);
        leftDoor.position.set(0, 2.4, 1.0);
        leftHinge.add(leftDoor);

        const rightHinge = new THREE.Group();
        rightHinge.position.set(-0.8, 0, 2.0);
        const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.6, 2.0), this.materials.woodDoor);
        rightDoor.position.set(0, 2.4, -1.0);
        rightHinge.add(rightDoor);

        group.add(leftHinge);
        group.add(rightHinge);

        group.userData = {
            id: `wardrobe_dress`,
            isInteractive: true,
            type: 'wardrobe',
            name: 'Princess Wardrobe',
            prompt: 'Open Wardrobe 👗',
            isOpen: false,
            leftHinge: leftHinge,
            rightHinge: rightHinge,
            toggle: function() {
                this.isOpen = !this.isOpen;
                this.prompt = this.isOpen ? 'Close Wardrobe' : 'Open Wardrobe 👗';
                this.leftHinge.rotation.y = this.isOpen ? -Math.PI / 1.8 : 0;
                this.rightHinge.rotation.y = this.isOpen ? Math.PI / 1.8 : 0;
            }
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createStandingMirror(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 4.2, 0.2), this.materials.gold);
        frame.position.y = 2.1;
        group.add(frame);

        const mirrorMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 3.9), this.materials.mirror);
        mirrorMesh.position.set(0, 2.1, 0.12);
        group.add(mirrorMesh);

        group.userData = {
            id: `mirror_stand`,
            isInteractive: true,
            type: 'mirror',
            name: 'Full-Length Mirror',
            prompt: 'Look in Mirror 🪞',
            targetPos: new THREE.Vector3(x, y + 1.0, z + 1.5),
            targetRot: 0
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createVanityDresser(x, y, z, rotY = 0) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        group.rotation.y = rotY;

        const table = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.2, 1.5), this.materials.woodDark);
        table.position.y = 0.6;
        group.add(table);

        const mirrorMesh = new THREE.Mesh(new THREE.CircleGeometry(1.2, 24), this.materials.mirror);
        mirrorMesh.position.set(0, 2.4, 0.76);
        group.add(mirrorMesh);

        group.userData = {
            id: `vanity_princess`,
            isInteractive: true,
            type: 'mirror',
            name: 'Princess Vanity Mirror',
            prompt: 'Look in Mirror 🪞',
            targetPos: new THREE.Vector3(x, y + 1.0, z),
            targetRot: rotY
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createDresserWithDrawers(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const body = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.0, 1.5), this.materials.woodDark);
        body.position.y = 1.0;
        group.add(body);

        const drawerSlide = new THREE.Group();
        const drawer = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.55, 1.3), this.materials.woodDoor);
        drawer.position.set(0, 1.3, 0);
        drawerSlide.add(drawer);

        group.add(drawerSlide);

        group.userData = {
            id: `drawer_dresser`,
            isInteractive: true,
            type: 'drawer',
            name: 'Accessory Drawer',
            prompt: 'Open Drawer 🗄️',
            isOpen: false,
            drawerSlide: drawerSlide,
            toggle: function() {
                this.isOpen = !this.isOpen;
                this.prompt = this.isOpen ? 'Close Drawer' : 'Open Drawer 🗄️';
                this.drawerSlide.position.z = this.isOpen ? 0.8 : 0;
            }
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createBathtub(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const tub = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.8, 2.4), this.materials.floorMarble);
        tub.position.y = 0.9;
        group.add(tub);

        const water = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.0), this.materials.waterStream);
        water.rotation.x = -Math.PI / 2;
        water.position.y = 1.4;
        group.add(water);

        return group;
    }

    createWashbasin(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const vanity = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 1.6), this.materials.floorMarble);
        vanity.position.y = 0.7;
        group.add(vanity);

        const tap = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 8, 16, Math.PI), this.materials.gold);
        tap.position.set(0, 1.6, 0);
        tap.rotation.z = Math.PI / 2;
        group.add(tap);

        const water = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.4, 8), this.materials.waterStream);
        water.position.set(0.18, 1.35, 0);
        water.visible = false;
        group.add(water);

        group.userData = {
            id: `bath_tap`,
            isInteractive: true,
            type: 'tap',
            name: 'Washbasin Faucet',
            prompt: 'Turn ON Tap 🚿',
            isOn: false,
            waterMesh: water,
            toggle: function() {
                this.isOn = !this.isOn;
                this.prompt = this.isOn ? 'Turn OFF Tap' : 'Turn ON Tap 🚿';
                if (this.waterMesh) this.waterMesh.visible = this.isOn;
            }
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createFireplace(x, y, z, rotY = 0) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        group.rotation.y = rotY;

        const mantel = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.8, 1.2), this.materials.floorMarble);
        mantel.position.y = 1.4;
        group.add(mantel);

        const fire = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.0, 8), this.materials.fireGlow);
        fire.position.set(0, 0.6, 0.2);
        group.add(fire);

        const fireLight = new THREE.PointLight(0xff7733, 1.2, 12);
        fireLight.position.set(0, 1.0, 0.6);
        group.add(fireLight);

        return group;
    }

    createNightstand(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const table = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), this.materials.woodDark);
        table.position.y = 0.6;
        group.add(table);

        const shade = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.6, 12, 1, true), this.materials.pinkSilk);
        shade.position.y = 1.6;
        group.add(shade);

        const pointLight = new THREE.PointLight(0xffecc7, 0.9, 8);
        pointLight.position.set(0, 1.6, 0);
        group.add(pointLight);

        group.userData = {
            id: `lamp_${Math.random().toString(36).substr(2, 6)}`,
            isInteractive: true,
            type: 'light',
            name: 'Bedside Night Lamp',
            prompt: 'Turn OFF Lamp 💡',
            isOn: true,
            light: pointLight,
            toggle: function() {
                this.isOn = !this.isOn;
                this.prompt = this.isOn ? 'Turn OFF Lamp' : 'Turn ON Lamp 💡';
                if (this.light) this.light.intensity = this.isOn ? 0.9 : 0.05;
            }
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createFloorLamp(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.2, 8), this.materials.gold);
        pole.position.y = 1.6;
        group.add(pole);

        const shade = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.8, 16, 1, true), this.materials.pinkSilk);
        shade.position.y = 3.2;
        group.add(shade);

        const pointLight = new THREE.PointLight(0xfffaea, 1.2, 12);
        pointLight.position.set(0, 3.2, 0);
        group.add(pointLight);

        group.userData = {
            id: `floor_lamp`,
            isInteractive: true,
            type: 'light',
            name: 'Royal Standing Lamp',
            prompt: 'Turn OFF Lamp 💡',
            isOn: true,
            light: pointLight,
            toggle: function() {
                this.isOn = !this.isOn;
                this.prompt = this.isOn ? 'Turn OFF Lamp' : 'Turn ON Lamp 💡';
                if (this.light) this.light.intensity = this.isOn ? 1.2 : 0.05;
            }
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createChandelier(x, y, z, color = 0xfff6e8, intensity = 2.4, distance = 36) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        // Ornate Golden Tiered Hub
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.4, 0.4, 12), this.materials.gold);
        group.add(hub);

        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.08, 8, 16), this.materials.gold);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);

        // 6 crystal candle flames
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const cx = Math.cos(angle) * 1.2;
            const cz = Math.sin(angle) * 1.2;

            const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 6), this.materials.wallCream);
            candle.position.set(cx, 0.15, cz);
            group.add(candle);

            const flame = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), this.materials.glowYellow);
            flame.position.set(cx, 0.35, cz);
            group.add(flame);
        }

        // Broad, warm radiant room light
        const light = new THREE.PointLight(color, intensity, distance, 1.2);
        group.add(light);

        return group;
    }

    createWritingDesk(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const desk = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.2, 1.8), this.materials.woodDark);
        desk.position.y = 0.8;
        group.add(desk);

        const book = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 1.0), this.materials.pinkSilk);
        book.position.set(0, 1.45, 0);
        group.add(book);

        group.userData = {
            id: `desk_book`,
            isInteractive: true,
            type: 'book',
            name: 'Romantic Journal',
            prompt: 'Read Romantic Note 📖',
            targetPos: new THREE.Vector3(x, y + 1.0, z + 1.4),
            targetRot: 0
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createMagicalGiftBox(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const box = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.6), this.materials.pinkSilk);
        box.position.y = 0.6;
        group.add(box);

        const lidPivot = new THREE.Group();
        lidPivot.position.set(0, 1.2, -0.8);

        const lid = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.3, 1.7), this.materials.gold);
        lid.position.set(0, 0.15, 0.85);
        lidPivot.add(lid);

        group.add(lidPivot);

        group.userData = {
            id: `gift_box_main`,
            isInteractive: true,
            type: 'giftBox',
            name: 'Magical Gift Box for Nandini',
            prompt: 'Open Royal Gift 🎁',
            isOpen: false,
            lidPivot: lidPivot,
            toggle: function() {
                this.isOpen = true;
                this.prompt = 'Gift Opened ❤️';
                this.lidPivot.rotation.x = -Math.PI / 1.5;
            }
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createPrincessCrown(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.4, 8, 1, true), this.materials.gold);
        group.add(crown);

        group.userData = {
            id: `princess_crown`,
            isInteractive: true,
            type: 'royalCrown',
            name: 'Princess Royal Crown',
            prompt: 'Examine Royal Crown 👑'
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createPhotoFrame(x, y, z, rotY, photoData) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        group.rotation.y = rotY;

        const frame = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.5, 0.15), this.materials.gold);
        group.add(frame);

        const loader = new THREE.TextureLoader();
        const texture = loader.load(`./assets/photos/${photoData.file}`);
        const pic = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.2), new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
        pic.position.z = 0.09;
        group.add(pic);

        group.userData = {
            id: `photo_${photoData.id}`,
            isInteractive: true,
            type: 'photoFrame',
            name: photoData.title,
            prompt: `View Photo: ${photoData.title} 📸`,
            photoId: photoData.id,
            photoFile: photoData.file
        };
        this.interactiveObjects.push(group);
        return group;
    }

    createTelescope(x, y, z) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const tripod = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.4, 3, 1, true), this.materials.woodDark);
        tripod.position.y = 1.2;
        group.add(tripod);

        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 2.5, 12), this.materials.gold);
        tube.position.set(0, 2.4, 0);
        tube.rotation.x = -Math.PI / 4;
        group.add(tube);

        group.userData = {
            id: `telescope`,
            isInteractive: true,
            type: 'telescope',
            name: 'Royal Telescope',
            prompt: 'Look through Telescope 🔭'
        };
        this.interactiveObjects.push(group);
        return group;
    }

    update(delta, time) {
        for (const doorData of this.doors) {
            if (doorData.targetRot !== undefined && doorData.hingePivot) {
                doorData.hingePivot.rotation.y += (doorData.targetRot - doorData.hingePivot.rotation.y) * Math.min(1, delta * 8);
            }
            if (doorData.targetRot !== undefined && doorData.leftPivot && doorData.rightPivot) {
                doorData.leftPivot.rotation.y += (-doorData.targetRot - doorData.leftPivot.rotation.y) * Math.min(1, delta * 8);
                doorData.rightPivot.rotation.y += (doorData.targetRot - doorData.rightPivot.rotation.y) * Math.min(1, delta * 8);
            }
        }
    }
}
