// ============================================
// MAIN JAVASCRIPT - WinterFest Togo
// ============================================

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initNavigation();
    initScrollAnimations();
    initLightbox();
    initVideoPauseEffect();
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect on header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes to sections
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.classList.add('fade-in-up');
        section.classList.add(`stagger-${(index % 4) + 1}`);
        observer.observe(section);
    });

    // Add animation to cards
    const cards = document.querySelectorAll('.card, .team-card, .news-card, .testimony-card');
    cards.forEach((card, index) => {
        card.classList.add('fade-in-up');
        card.classList.add(`stagger-${(index % 4) + 1}`);
        observer.observe(card);
    });

    // Add animation to stats
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        item.classList.add('fade-in-up');
        item.classList.add(`stagger-${(index % 4) + 1}`);
        observer.observe(item);
    });

    // Add animation to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.classList.add('fade-in-up');
        item.classList.add(`stagger-${(index % 4) + 1}`);
        observer.observe(item);
    });
}

// ============================================
// LIGHTBOX
// ============================================
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const clickableImages = document.querySelectorAll('.poster-image, .masonry-image, .card-image');

    clickableImages.forEach(img => {
        img.addEventListener('click', () => {
            if (lightbox && lightboxImage) {
                lightboxImage.src = img.src;
                lightbox.classList.add('active');
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Email constant
const CONTACT_EMAIL = 'contact@winterfesttogo.org';

// ============================================
// VIDEO PAUSE EFFECT
// ============================================
function initVideoPauseEffect() {
    const videos = document.querySelectorAll('.experience-video video');

    videos.forEach(video => {
        // Add paused class initially if video is paused
        if (video.paused) {
            video.classList.add('paused');
        }

        // Add/remove paused class on play/pause events
        video.addEventListener('play', () => {
            video.classList.remove('paused');
        });

        video.addEventListener('pause', () => {
            video.classList.add('paused');
        });
    });
}
