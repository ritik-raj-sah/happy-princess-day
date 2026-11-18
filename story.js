// ==========================================
// NANDINI'S MAGICAL KINGDOM - Story & Celebration Controller
// Prologue Cinematic, Photo Lightbox, Princess Day Celebration & Final Letter
// ==========================================

import { audioManager } from './audio.js';

export class StoryController {
    constructor(callbacks) {
        this.callbacks = callbacks || {};
        this.currentPhotoIdx = 1;
        this.photos = [
            { id: 1, file: 'photo-1.jpg', title: 'Our Sweetest Smile', desc: 'Your radiant smile brings more sunshine than anything in this kingdom.' },
            { id: 2, file: 'photo-2.jpg', title: 'Fairytale Moments', desc: 'Every memory we create feels like turning a page in our magical fairytale.' },
            { id: 3, file: 'photo-3.jpg', title: 'Princess of My Heart', desc: 'You wear grace, kindness, and beauty like an effortless crown.' },
            { id: 4, file: 'photo-4.jpg', title: 'Endless Magic Together', desc: 'With you by my side, even ordinary days become extraordinary.' },
            { id: 5, file: 'photo-5.jpg', title: 'Pure Joy & Laughter', desc: 'Your laughter is the sweetest melody that echoes through my soul.' },
            { id: 6, file: 'photo-6.jpg', title: 'Forever & Always', desc: 'Hand in hand, building dreams that will last for a lifetime.' },
            { id: 7, file: 'photo-7.jpg', title: 'My Dream Come True', desc: 'I asked the stars for magic, and they blessed me with you.' },
            { id: 8, file: 'photo-8.jpg', title: 'Happy Princess Day ❤️', desc: 'Today this kingdom, and every day my heart, belongs entirely to you.' }
        ];

        this.initStoryModals();
        this.initPrologue();
        this.initPhotoLightbox();
        this.initCelebration();
    }

    // --- 1. Opening Prologue Cinematic ---
    initPrologue() {
        const enterBtn = document.getElementById('btn-enter-kingdom');
        const prologueOverlay = document.getElementById('prologue-overlay');

        if (enterBtn && prologueOverlay) {
            enterBtn.addEventListener('click', () => {
                audioManager.startBackgroundMusic();
                audioManager.playSparkle();

                prologueOverlay.classList.add('fade-out');
                setTimeout(() => {
                    prologueOverlay.style.display = 'none';
                    if (this.callbacks.onEnterKingdom) {
                        this.callbacks.onEnterKingdom();
                    }
                }, 1000);
            });
        }
    }

    // --- 2. Interactive Story Modals ---
    initStoryModals() {
        const modal = document.getElementById('story-modal');
        const closeBtn = document.getElementById('btn-modal-close');

        if (modal && closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        }
    }

    // --- 3. Photo Lightbox Modal ---
    initPhotoLightbox() {
        const lightbox = document.getElementById('photo-lightbox');
        const closeBtn = document.getElementById('btn-lightbox-close');
        const prevBtn = document.getElementById('btn-photo-prev');
        const nextBtn = document.getElementById('btn-photo-next');

        if (lightbox && closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightbox.classList.remove('active');
            });
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) lightbox.classList.remove('active');
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentPhotoIdx = (this.currentPhotoIdx - 2 + this.photos.length) % this.photos.length + 1;
                this.updateLightboxPhoto();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentPhotoIdx = (this.currentPhotoIdx % this.photos.length) + 1;
                this.updateLightboxPhoto();
            });
        }
    }

    openPhotoGallery(photoId) {
        this.currentPhotoIdx = photoId || 1;
        this.updateLightboxPhoto();
        const lightbox = document.getElementById('photo-lightbox');
        if (lightbox) {
            lightbox.classList.add('active');
            audioManager.playSparkle();
        }
    }

    updateLightboxPhoto() {
        const item = this.photos.find(p => p.id === this.currentPhotoIdx) || this.photos[0];
        const img = document.getElementById('lightbox-img');
        const title = document.getElementById('lightbox-title');
        const desc = document.getElementById('lightbox-desc');
        const counter = document.getElementById('lightbox-counter');

        if (img) {
            img.style.opacity = '0';
            setTimeout(() => {
                img.src = `./assets/photos/${item.file}`;
                img.style.opacity = '1';
            }, 150);
        }
        if (title) title.textContent = item.title;
        if (desc) desc.textContent = item.desc;
        if (counter) counter.textContent = `Photo ${item.id} of ${this.photos.length}`;
    }

    // --- 4. Princess Day Celebration ---
    initCelebration() {
        const celebrateBtn = document.getElementById('btn-celebrate');
        const celebrationModal = document.getElementById('celebration-modal');
        const lastSurpriseBtn = document.getElementById('btn-last-surprise');
        const finalLetterModal = document.getElementById('final-letter-modal');
        const closeFinalBtn = document.getElementById('btn-final-close');

        if (celebrateBtn) {
            celebrateBtn.addEventListener('click', () => {
                this.triggerPrincessDayCelebration();
            });
        }

        if (lastSurpriseBtn && finalLetterModal) {
            lastSurpriseBtn.addEventListener('click', () => {
                celebrationModal.classList.remove('active');
                finalLetterModal.classList.add('active');
                audioManager.playGiftOpen();
            });
        }

        if (closeFinalBtn && finalLetterModal) {
            closeFinalBtn.addEventListener('click', () => {
                finalLetterModal.classList.remove('active');
            });
        }
    }

    triggerPrincessDayCelebration() {
        audioManager.playGiftOpen();
        const celebrationModal = document.getElementById('celebration-modal');
        if (celebrationModal) {
            celebrationModal.classList.add('active');
        }

        // Firework bursts across the sky
        if (this.callbacks.onFireworksBurst) {
            let count = 0;
            const interval = setInterval(() => {
                this.callbacks.onFireworksBurst();
                audioManager.playFirework();
                count++;
                if (count > 12) clearInterval(interval);
            }, 450);
        }
    }
}
