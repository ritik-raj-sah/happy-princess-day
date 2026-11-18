// ==========================================
// NANDINI'S MAGICAL KINGDOM - Physics & Collision Engine
// Capsule-Based Continuous Collision Resolution, Wall Sliding, Dynamic Door Obstacles & Camera Occlusion
// ==========================================

import * as THREE from './libs/three.module.js';

export class CollisionSystem {
    constructor(scene) {
        this.scene = scene;

        // Player Collision Capsule Parameters
        this.playerRadius = 0.55;
        this.playerHeight = 2.0;

        // Static AABB Obstacles (Walls, Buildings, Furniture, Terrain)
        // Each box: { id, name, minX, maxX, minZ, maxZ, minY, maxY, isDoor, isOpen }
        this.colliders = [];

        // Debug visualization
        this.debugGroup = new THREE.Group();
        this.debugGroup.visible = false;
        this.scene.add(this.debugGroup);
        this.isDebug = false;

        // World Island Radius
        this.worldRadius = 38;
    }

    // Add an AABB collider
    addBox(minX, maxX, minZ, maxZ, minY = 0, maxY = 15, options = {}) {
        const box = {
            id: options.id || `col_${Math.random().toString(36).substr(2, 6)}`,
            name: options.name || 'Obstacle',
            minX: Math.min(minX, maxX),
            maxX: Math.max(minX, maxX),
            minZ: Math.min(minZ, maxZ),
            maxZ: Math.max(minZ, maxZ),
            minY: minY,
            maxY: maxY,
            isDoor: options.isDoor || false,
            isOpen: options.isOpen || false,
            doorRef: options.doorRef || null
        };
        this.colliders.push(box);
        if (this.isDebug) this.createDebugMesh(box);
        return box;
    }

    // Add a wall with automatic thickness and length
    addWall(x1, z1, x2, z2, thickness = 0.4, minY = 0, maxY = 15, options = {}) {
        const halfThick = thickness / 2;
        const minX = Math.min(x1, x2) - halfThick;
        const maxX = Math.max(x1, x2) + halfThick;
        const minZ = Math.min(z1, z2) - halfThick;
        const maxZ = Math.max(z1, z2) + halfThick;
        return this.addBox(minX, maxX, minZ, maxZ, minY, maxY, options);
    }

    // Update dynamic door collision state
    setDoorState(doorId, isOpen) {
        const col = this.colliders.find(c => c.id === doorId || (c.doorRef && c.doorRef.id === doorId));
        if (col) {
            col.isOpen = isOpen;
        }
    }

    // ==========================================
    // CAPSULE-AABB CONTINUOUS COLLISION RESOLUTION
    // ==========================================
    resolveMovement(currentPos, targetPos) {
        const r = this.playerRadius;
        const resolved = targetPos.clone();

        // 1. Boundary Check
        const isIndoors = (resolved.z <= -6.8);

        if (isIndoors) {
            // Inside mansion perimeter: x: [-31.5, 31.5], z: [-51.5, -6.8]
            resolved.x = Math.max(-31.5 + r, Math.min(31.5 - r, resolved.x));
            resolved.z = Math.max(-51.5 + r, Math.min(-6.8, resolved.z));
        } else {
            // Outdoor island perimeter (radius 38)
            const dist = Math.hypot(resolved.x, resolved.z);
            if (dist > this.worldRadius - r) {
                const scale = (this.worldRadius - r) / dist;
                resolved.x *= scale;
                resolved.z *= scale;
            }
        }

        // 2. Continuous Wall & Obstacle Sliding Collision
        // Test X and Z axes with sliding response (up to 3 iterations for corner wedges)
        for (let iter = 0; iter < 3; iter++) {
            let collisionOccurred = false;

            for (const col of this.colliders) {
                // If it's an open door, character can walk freely through!
                if (col.isDoor && col.isOpen) continue;

                // Vertical overlap check
                const charBottom = resolved.y;
                const charTop = resolved.y + this.playerHeight;
                if (charTop < col.minY || charBottom > col.maxY) continue;

                // Expanded AABB by character radius
                const expMinX = col.minX - r;
                const expMaxX = col.maxX + r;
                const expMinZ = col.minZ - r;
                const expMaxZ = col.maxZ + r;

                // Check overlap
                if (resolved.x > expMinX && resolved.x < expMaxX &&
                    resolved.z > expMinZ && resolved.z < expMaxZ) {

                    collisionOccurred = true;

                    // Calculate penetration depths along all 4 faces
                    const dLeft   = resolved.x - expMinX; // push to minX
                    const dRight  = expMaxX - resolved.x; // push to maxX
                    const dNorth  = resolved.z - expMinZ; // push to minZ
                    const dSouth  = expMaxZ - resolved.z; // push to maxZ

                    const minD = Math.min(dLeft, dRight, dNorth, dSouth);

                    // Push out along the shallowest penetration axis (smooth surface slide!)
                    if (minD === dLeft) {
                        resolved.x = expMinX;
                    } else if (minD === dRight) {
                        resolved.x = expMaxX;
                    } else if (minD === dNorth) {
                        resolved.z = expMinZ;
                    } else {
                        resolved.z = expMaxZ;
                    }
                }
            }

            if (!collisionOccurred) break;
        }

        // 3. Ground Elevation & Floor Support
        resolved.y = this.getFloorElevation(resolved);

        return resolved;
    }

    // ==========================================
    // FLOOR ELEVATION & STAIRCASE RAMP
    // ==========================================
    getFloorElevation(pos) {
        // A. Outdoor castle steps (terrace from z = -5 to z = -7)
        if (pos.z > -7.0 && pos.z <= -5.0 && Math.abs(pos.x) < 4.5) {
            return 1.0;
        }

        // B. Inside the palace (z <= -7.0)
        if (pos.z <= -7.0) {
            // Grand Staircase: x: [-2.6, 2.6], z from -14.0 to -20.0
            if (Math.abs(pos.x) <= 2.6 && pos.z <= -14.0 && pos.z >= -20.0) {
                const progress = (-14.0 - pos.z) / 6.0; // 0.0 at -14, 1.0 at -20
                return 1.0 + progress * 5.0; // smoothly climbs 1.0 -> 6.0!
            }

            // Upper floor mezzanine & sunset balcony if player is at upper elevation (y >= 4.5)
            if (pos.y >= 4.5) {
                // Balcony outdoor terrace: z: [-7.0, -2.5], x: [-5.0, 5.0]
                if (pos.z >= -7.0 && pos.z <= -2.5 && Math.abs(pos.x) <= 5.0) {
                    return 6.0;
                }
                // Upper mezzanine walkway: z: [-20.0, -7.0], x: [-8.0, 8.0]
                if (pos.z <= -7.0 && pos.z >= -20.0 && Math.abs(pos.x) <= 8.0) {
                    return 6.0;
                }
            }

            // Ground floor rooms (y = 1.0)
            return 1.0;
        }

        // C. Default outdoor garden ground (y = 0)
        return 0.0;
    }

    // ==========================================
    // CAMERA OCCLUSION & WALL CLAMPING
    // ==========================================
    resolveCameraPosition(charPos, desiredCamPos) {
        // Prevent camera from clipping through interior walls and ceiling
        const safePos = desiredCamPos.clone();
        const minCamY = (charPos.y >= 5.0) ? 7.2 : 2.0;
        const maxCamY = (charPos.y >= 5.0) ? 14.5 : 10.5;

        // Clamp camera vertical range when indoors
        if (charPos.z <= -7.0) {
            safePos.y = Math.max(minCamY, Math.min(maxCamY, safePos.y));
            // Keep camera inside mansion perimeter with comfortable padding
            safePos.x = Math.max(-33.0, Math.min(33.0, safePos.x));
            safePos.z = Math.max(-53.0, Math.min(-5.0, safePos.z));
        }

        return safePos;
    }

    // ==========================================
    // VISUAL DEBUG MODE
    // ==========================================
    toggleDebug() {
        this.isDebug = !this.isDebug;
        this.debugGroup.visible = this.isDebug;

        if (this.isDebug && this.debugGroup.children.length === 0) {
            this.rebuildDebugMeshes();
        }
        return this.isDebug;
    }

    rebuildDebugMeshes() {
        while (this.debugGroup.children.length > 0) {
            this.debugGroup.remove(this.debugGroup.children[0]);
        }

        for (const col of this.colliders) {
            this.createDebugMesh(col);
        }
    }

    createDebugMesh(col) {
        const w = col.maxX - col.minX;
        const d = col.maxZ - col.minZ;
        const h = Math.min(col.maxY - col.minY, 5.0);

        const geom = new THREE.BoxGeometry(w, h, d);
        const edges = new THREE.EdgesGeometry(geom);
        const color = col.isDoor ? 0x00ffcc : 0xff0055;
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: color }));
        line.position.set((col.minX + col.maxX) / 2, col.minY + h / 2, (col.minZ + col.maxZ) / 2);
        this.debugGroup.add(line);
    }
}
