// ==========================================
// NANDINI'S MAGICAL KINGDOM - Smart World Interaction Engine
// Proximity Detection, Contextual Action HUD, Hinged Doors, Sitting, Sleeping, Drawers & Persisted States
// ==========================================

import * as THREE from './libs/three.module.js';
import { audioManager } from './audio.js';

export class InteractionManager {
    constructor(scene, camera, domElement, callbacks = {}) {
        this.scene = scene;
        this.camera = camera;
        this.domElement = domElement;
        this.callbacks = callbacks;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.interactiveList = [];
        this.hoveredObject = null;
        this.nearestObject = null;

        // UI references
        this.hudTooltip = document.getElementById('interaction-tooltip');
        this.actionBtn = document.getElementById('btn-hud-action');
        this.proximityPrompt = document.getElementById('proximity-prompt');

        // Character Manager reference (injected by main.js)
        this.characterManager = null;
        this.collision = null;

        this.initListeners();
    }

    setCollisionSystem(col) {
        this.collision = col;
    }

    setCharacterManager(charManager) {
        this.characterManager = charManager;
    }

    setInteractiveObjects(objects) {
        this.interactiveList = objects.filter(Boolean);
    }

    addInteractiveObject(obj) {
        if (obj && !this.interactiveList.includes(obj)) {
            this.interactiveList.push(obj);
        }
    }

    initListeners() {
        // Pointer Move for hover tooltip
        this.domElement.addEventListener('pointermove', (e) => {
            const rect = this.domElement.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            this.checkHover(e.clientX, e.clientY);
        });

        // Pointer Down / Tap on 3D object
        this.domElement.addEventListener('pointerdown', (e) => {
            // Only trigger if not tapping on UI
            if (e.target.closest('#hud-controls') || e.target.closest('.bottom-sliding-bar') || e.target.closest('.fairytale-modal') || e.target.closest('.top-hud')) {
                return;
            }
            const rect = this.domElement.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            const obj = this.getIntersectedObject();
            if (obj) {
                this.executeInteraction(obj);
            }
        });

        // Contextual Action Button click
        if (this.actionBtn) {
            this.actionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.characterManager && (this.characterManager.isSitting || this.characterManager.isSleeping || this.characterManager.isReading)) {
                    // Stand up / wake up
                    this.characterManager.standUp();
                    audioManager.playSparkle();
                    this.showToast('✨ Standing up!');
                    this.updateContextualHUD();
                    return;
                }
                if (this.nearestObject) {
                    this.executeInteraction(this.nearestObject);
                }
            });
        }

        // Keyboard 'E' key for interaction
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyE') {
                if (this.characterManager && (this.characterManager.isSitting || this.characterManager.isSleeping || this.characterManager.isReading)) {
                    this.characterManager.standUp();
                    audioManager.playSparkle();
                    this.showToast('✨ Standing up!');
                    this.updateContextualHUD();
                    return;
                }
                if (this.nearestObject) {
                    this.executeInteraction(this.nearestObject);
                }
            }
        });
    }

    getIntersectedObject() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveList, true);

        if (intersects.length > 0) {
            let target = intersects[0].object;
            while (target && !target.userData?.isInteractive && target.parent) {
                target = target.parent;
            }
            if (target && target.userData?.isInteractive) {
                return target;
            }
        }
        return null;
    }

    checkHover(screenX, screenY) {
        const obj = this.getIntersectedObject();
        if (obj !== this.hoveredObject) {
            this.hoveredObject = obj;
            if (obj && this.hudTooltip) {
                const prompt = obj.userData.prompt || obj.userData.name || 'Interact';
                this.hudTooltip.textContent = `✨ ${prompt}`;
                this.hudTooltip.style.opacity = '1';
                this.domElement.style.cursor = 'pointer';
            } else if (this.hudTooltip) {
                this.hudTooltip.style.opacity = '0';
                this.domElement.style.cursor = 'default';
            }
        }

        if (this.hudTooltip && this.hoveredObject) {
            this.hudTooltip.style.left = `${screenX + 16}px`;
            this.hudTooltip.style.top = `${screenY - 24}px`;
        }
    }

    // ==========================================
    // PROXIMITY DETECTION & CONTEXTUAL HUD
    // ==========================================
    updateProximity() {
        if (!this.characterManager || !this.characterManager.princess) return;

        // If currently sitting or sleeping, button should say STAND UP or WAKE UP
        if (this.characterManager.isSleeping) {
            if (this.actionBtn) this.actionBtn.innerHTML = '☀️ Wake';
            if (this.proximityPrompt) {
                this.proximityPrompt.textContent = '☀️ Press E or tap to Wake Up';
                this.proximityPrompt.style.display = 'block';
            }
            return;
        }

        if (this.characterManager.isSitting) {
            if (this.actionBtn) this.actionBtn.innerHTML = '🚶 Stand';
            if (this.proximityPrompt) {
                this.proximityPrompt.textContent = '🚶 Press E or tap to Stand Up';
                this.proximityPrompt.style.display = 'block';
            }
            return;
        }

        if (this.characterManager.isReading) {
            if (this.actionBtn) this.actionBtn.innerHTML = '📖 Close';
            if (this.proximityPrompt) {
                this.proximityPrompt.textContent = '📖 Press E or tap to Close Book';
                this.proximityPrompt.style.display = 'block';
            }
            return;
        }

        const charPos = this.characterManager.princess.position;
        let closestObj = null;
        let closestDist = Infinity;

        // Find nearest interactive object within its interaction threshold
        for (const obj of this.interactiveList) {
            if (!obj || !obj.userData || !obj.userData.isInteractive) continue;

            const worldPos = new THREE.Vector3();
            obj.getWorldPosition(worldPos);

            const dist = Math.hypot(charPos.x - worldPos.x, charPos.z - worldPos.z);
            const threshold = obj.userData.threshold || 3.8;

            if (dist < threshold && dist < closestDist) {
                closestDist = dist;
                closestObj = obj;
            }
        }

        this.nearestObject = closestObj;
        this.updateContextualHUD();
    }

    updateContextualHUD() {
        const isInteractingState = this.characterManager && 
            (this.characterManager.isSitting || this.characterManager.isSleeping || this.characterManager.isReading);

        if (isInteractingState) {
            if (this.proximityPrompt) {
                this.proximityPrompt.textContent = this.characterManager.isSleeping ? '☀️ Wake Up' : '🚶 Stand Up';
                this.proximityPrompt.style.display = 'block';
            }
            if (this.actionBtn) {
                this.actionBtn.style.display = 'flex';
                this.actionBtn.innerHTML = this.characterManager.isSleeping ? '☀️ Wake' : '🚶 Stand';
            }
            return;
        }

        if (!this.nearestObject) {
            if (this.proximityPrompt) this.proximityPrompt.style.display = 'none';
            if (this.actionBtn) this.actionBtn.style.display = 'none';
            return;
        }

        const data = this.nearestObject.userData;
        const prompt = data.prompt || data.name || 'Interact';

        // Update floating prompt
        if (this.proximityPrompt) {
            this.proximityPrompt.textContent = `✨ ${prompt}`;
            this.proximityPrompt.style.display = 'block';
        }

        // Update Right Action Button text & icon
        if (this.actionBtn) {
            this.actionBtn.style.display = 'flex';
            switch (data.type) {
                case 'door':
                case 'castleDoor':
                    this.actionBtn.innerHTML = data.isOpen ? '🚪 Close' : '🚪 Open';
                    break;
                case 'bed':
                    this.actionBtn.innerHTML = '🛏️ Sleep';
                    break;
                case 'chair':
                case 'sofa':
                case 'bench':
                case 'heartTreeBench':
                    this.actionBtn.innerHTML = '🪑 Sit';
                    break;
                case 'swing':
                    this.actionBtn.innerHTML = '🌸 Swing';
                    break;
                case 'fridge':
                    this.actionBtn.innerHTML = data.isOpen ? '❄️ Close' : '❄️ Fridge';
                    break;
                case 'wardrobe':
                    this.actionBtn.innerHTML = data.isOpen ? '👗 Close' : '👗 Open';
                    break;
                case 'drawer':
                    this.actionBtn.innerHTML = data.isOpen ? '🗄️ Close' : '🗄️ Open';
                    break;
                case 'tap':
                    this.actionBtn.innerHTML = data.isOn ? '🚿 Off' : '🚿 Tap';
                    break;
                case 'light':
                case 'lamp':
                case 'bedroomLamp':
                    this.actionBtn.innerHTML = data.isOn ? '🌙 Off' : '💡 On';
                    break;
                case 'book':
                    this.actionBtn.innerHTML = '📖 Read';
                    break;
                case 'mirror':
                    this.actionBtn.innerHTML = '🪞 Look';
                    break;
                case 'giftBox':
                    this.actionBtn.innerHTML = '🎁 Gift';
                    break;
                case 'fountain':
                    this.actionBtn.innerHTML = '🪙 Wish';
                    break;
                case 'flower':
                    this.actionBtn.innerHTML = '🌸 Touch';
                    break;
                case 'cup':
                    this.actionBtn.innerHTML = data.isPicked ? '☕ Place' : '☕ Pick';
                    break;
                default:
                    this.actionBtn.innerHTML = '✨ Use';
                    break;
            }
        }
    }

    // ==========================================
    // EXECUTE INTERACTION (Unified Action System)
    // ==========================================
    executeInteraction(obj) {
        if (!obj || !obj.userData) return;
        const data = obj.userData;
        audioManager.playSparkle();

        // Arm reach animation
        if (this.characterManager) {
            this.characterManager.triggerReach();
        }

        // 1. Hinged Doors (Castle Door, Room Doors)
        if (data.type === 'door') {
            if (typeof data.toggle === 'function') {
                data.toggle();
            } else {
                data.isOpen = !data.isOpen;
                if (data.hingePivot) {
                    data.hingePivot.rotation.y = data.isOpen ? (data.openAngle || Math.PI / 2) : 0;
                }
            }
            audioManager.playGateOpen();
            this.showToast(data.isOpen ? `🚪 ${data.name} Opened` : `🚪 ${data.name} Closed`);
            this.updateContextualHUD();
        }
        else if (data.type === 'castleDoor') {
            data.isOpen = !data.isOpen;
            audioManager.playGateOpen();
            const angle = data.isOpen ? -Math.PI / 2.2 : 0;
            if (data.leftPivot) data.leftPivot.rotation.y = angle;
            if (data.rightPivot) data.rightPivot.rotation.y = -angle;
            this.showToast(data.isOpen ? '🏰 Royal Castle Doors Opened!' : '🏰 Royal Castle Doors Closed.');
            this.updateContextualHUD();
        }

        // 2. Bed (Sleep & Wake up)
        else if (data.type === 'bed') {
            if (this.characterManager) {
                const worldPos = new THREE.Vector3();
                obj.getWorldPosition(worldPos);
                worldPos.y = (data.targetPos ? data.targetPos.y : 1.5);
                this.characterManager.sleepOn(worldPos, data.targetRot || 0, obj);
                this.showToast('🛏️ Princess Nandini is sleeping peacefully... Sweet dreams! 💖');
                this.updateContextualHUD();
            }
        }

        // 3. Sitting on Chairs, Sofas, Benches, Swing
        else if (data.type === 'chair' || data.type === 'sofa' || data.type === 'bench' || data.type === 'heartTreeBench' || data.type === 'swing') {
            if (this.characterManager) {
                const worldPos = new THREE.Vector3();
                obj.getWorldPosition(worldPos);
                worldPos.y = (data.targetPos ? data.targetPos.y : 0.7);
                this.characterManager.sitOn(worldPos, data.targetRot || 0, obj);
                this.showToast(`✨ Resting comfortably on ${data.name}!`);
                this.updateContextualHUD();
            }
        }

        // 4. Refrigerator
        else if (data.type === 'fridge') {
            if (typeof data.toggle === 'function') data.toggle();
            audioManager.playGateOpen();
            this.showToast(data.isOpen ? '❄️ Opened refrigerator! Delicious desserts & drinks inside 🍰' : '❄️ Closed refrigerator');
            this.updateContextualHUD();
        }

        // 5. Wardrobe
        else if (data.type === 'wardrobe') {
            if (typeof data.toggle === 'function') data.toggle();
            audioManager.playGateOpen();
            this.showToast(data.isOpen ? '👗 Wardrobe opened! Gorgeous princess gowns revealed ✨' : '👗 Wardrobe closed');
            this.updateContextualHUD();
        }

        // 6. Drawers
        else if (data.type === 'drawer') {
            if (typeof data.toggle === 'function') data.toggle();
            audioManager.playSparkle();
            this.showToast(data.isOpen ? '🗄️ Drawer pulled open!' : '🗄️ Drawer closed');
            this.updateContextualHUD();
        }

        // 7. Kitchen & Bathroom Water Taps
        else if (data.type === 'tap') {
            if (typeof data.toggle === 'function') data.toggle();
            audioManager.playSplash();
            this.showToast(data.isOn ? '🚿 Fresh royal spring water is flowing!' : '🚿 Tap turned off');
            this.updateContextualHUD();
        }

        // 8. Lights & Lamps
        else if (data.type === 'light' || data.type === 'lamp' || data.type === 'bedroomLamp') {
            if (typeof data.toggle === 'function') data.toggle();
            else {
                data.isOn = !data.isOn;
                if (data.light) data.light.intensity = data.isOn ? 1.0 : 0.05;
            }
            audioManager.playSparkle();
            this.showToast(data.isOn ? '💡 Royal lamp turned ON' : '🌙 Royal lamp turned OFF');
            this.updateContextualHUD();
        }

        // 9. Reading Books
        else if (data.type === 'book') {
            if (this.characterManager) {
                const worldPos = new THREE.Vector3();
                obj.getWorldPosition(worldPos);
                this.characterManager.readBook(worldPos, data.targetRot || 0);
                this.showToast('📖 Reading: “The Tale of Princess Nandini & Her True Love” ❤️');
                this.updateContextualHUD();
            }
        }

        // 10. Looking in Mirror
        else if (data.type === 'mirror') {
            if (this.characterManager) {
                this.characterManager.princess.rotation.y = data.targetRot || 0;
            }
            this.showToast('🪞 “Mirror, mirror on the wall... Nandini is the most beautiful of them all!” ✨');
        }

        // 11. Kitchen Cup
        else if (data.type === 'cup') {
            if (typeof data.toggle === 'function') data.toggle();
            this.showToast(data.isPicked ? '☕ Picked up warm royal rose tea!' : '☕ Placed tea cup on counter');
            this.updateContextualHUD();
        }

        // 12. Magical Gift Box Surprise
        else if (data.type === 'giftBox') {
            if (typeof data.toggle === 'function') data.toggle();
            audioManager.playGiftOpen();
            if (this.callbacks.onOpenGift) {
                this.callbacks.onOpenGift();
            }
            this.showModal(
                '🎁 A Royal Gift for Nandini',
                '“For the most beautiful princess in my world. Every dream is sweeter with you.” ❤️',
                'Happy Princess Day!'
            );
        }

        // 13. Balcony Scenic View
        else if (data.type === 'balconyView') {
            audioManager.playSparkle();
            if (this.callbacks.onBalconyView) {
                this.callbacks.onBalconyView();
            }
            this.showModal(
                '🌅 The Royal Sunset Balcony',
                '“Look out at our magical kingdom, Nandini. You are the heartbeat of every corner of this world.”',
                'Forever & Always'
            );
        }

        // 14. Heart Tree
        else if (data.type === 'heartTree' || data.type === 'heartTreeBench') {
            audioManager.playSparkle();
            if (this.callbacks.onHeartTree) {
                this.callbacks.onHeartTree();
            }
            this.showModal(
                '💖 The Magical Heart Tree',
                '“Every moment we share blossoms like the sweetest petals.”',
                'Nandini’s Love Garden'
            );
        }

        // 15. Fountain
        else if (data.type === 'fountain') {
            audioManager.playSplash();
            if (this.callbacks.onFountainWish) {
                this.callbacks.onFountainWish();
            }
            this.showToast('🪙 You tossed a golden coin into the fountain: "May all Nandini’s dreams come true!"');
        }

        // 16. Blooming Flowers
        else if (data.type === 'flower') {
            data.isBloomed = true;
            data.scaleAnim = 1.6;
            audioManager.playSparkle();
            this.showToast('🌸 The flower blossomed with sparkling royal magic!');
        }

        // 17. Butterflies
        else if (data.type === 'butterfly') {
            audioManager.playFlutter();
            if (this.callbacks.onScareButterfly) {
                this.callbacks.onScareButterfly(obj);
            }
            this.showToast('🦋 The magical butterfly fluttered happily!');
        }

        // 18. Photo Frame
        else if (data.type === 'photoFrame') {
            audioManager.playSparkle();
            if (this.callbacks.onOpenPhoto) {
                this.callbacks.onOpenPhoto(data.photoId, data.photoFile, data.name);
            }
        }

        // 19. Royal Crown
        else if (data.type === 'royalCrown') {
            audioManager.playSparkle();
            this.showModal(
                '👑 Princess Royal Crown',
                '“To the Queen of my heart — Nandini. You wear the crown of my love forever.” ❤️',
                'Royal Treasure'
            );
        }
    }

    showToast(message) {
        const toast = document.getElementById('toast-notification');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    showModal(title, message, subtext) {
        const modal = document.getElementById('story-modal');
        const modalTitle = document.getElementById('story-modal-title');
        const modalBody = document.getElementById('story-modal-body');
        const modalSub = document.getElementById('story-modal-sub');

        if (modal && modalTitle && modalBody) {
            modalTitle.textContent = title;
            modalBody.textContent = message;
            if (modalSub && subtext) modalSub.textContent = subtext;
            modal.classList.add('show');
        }
    }
}
