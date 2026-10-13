// Mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        menuBtn.setAttribute('aria-expanded', String(!mobileMenu.classList.contains('hidden')));
    });

    // Close mobile menu when any link inside it is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

// Back to top button
const backToTopBtn = document.getElementById('back-to-top');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.remove('opacity-0', 'invisible');
            backToTopBtn.classList.add('opacity-100', 'visible');
        } else {
            backToTopBtn.classList.remove('opacity-100', 'visible');
            backToTopBtn.classList.add('opacity-0', 'invisible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
            });
            
            // Close mobile menu if open
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// Video Playback Handling
document.querySelectorAll('.group').forEach(container => {
    const video = container.querySelector('video');
    const overlay = container.querySelector('.absolute');

    if (video && overlay) {
        // Play video when overlay is clicked
        overlay.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling if needed
            video.play();
            overlay.classList.add('hidden'); // Hide overlay
            video.controls = true; // Ensure controls are active
        });

        // Show overlay again when video ends
        video.addEventListener('ended', () => {
            overlay.classList.remove('hidden');
            video.currentTime = 0;
            // video.load(); // Optional: reset thumbnail
        });
        
        // Optional: If user pauses manually, maybe show overlay? 
        // Let's keep it simple: only show on end.
        
        // Allow clicking the video itself to toggle play/pause if controls are hidden?
        // With 'controls' attribute, browser handles clicks on the video usually.
    }
});

// Competition image lightbox
const competitionViewer = document.getElementById('competition-image-viewer');
const competitionViewerImage = competitionViewer?.querySelector('.competition-viewer-image');
const competitionViewerCaption = competitionViewer?.querySelector('.competition-viewer-caption');

if (competitionViewer && competitionViewerImage && competitionViewerCaption &&
    typeof competitionViewer.showModal === 'function') {
    document.querySelectorAll('.competition-image-button').forEach(button => {
        button.addEventListener('click', () => {
            const image = button.querySelector('img');
            if (!image) return;

            const cardTitle = button.closest('.competition-card')?.querySelector('h3')?.textContent.trim();
            competitionViewerImage.src = image.currentSrc || image.src;
            competitionViewerImage.alt = image.alt;
            competitionViewerCaption.textContent = cardTitle ? `${cardTitle} — ${image.alt}` : image.alt;
            competitionViewer.showModal();
            competitionViewer.querySelector('.competition-viewer-close')?.focus();
        });
    });

    competitionViewer.querySelector('.competition-viewer-close')?.addEventListener('click', () => {
        competitionViewer.close();
    });

    competitionViewer.addEventListener('click', event => {
        if (event.target === competitionViewer) competitionViewer.close();
    });
}

// Project Filtering Logic
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterButtons.length > 0 && projectCards.length > 0) {
    const filterStatus = document.getElementById('projects-filter-status');
    let pendingFilterTimeout;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            window.clearTimeout(pendingFilterTimeout);
            filterButtons.forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
                b.classList.add('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
                b.setAttribute('aria-pressed', String(b === btn));
            });

            btn.classList.remove('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
            btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');

            const filterValue = btn.getAttribute('data-filter');
            const isVisible = card => {
                if (filterValue === 'all') return true;
                if (filterValue === 'featured') return card.getAttribute('data-featured') === 'true';
                return (card.getAttribute('data-category') || '').split(' ').includes(filterValue);
            };
            const visibleCount = Array.from(projectCards).filter(isVisible).length;
            if (filterStatus) {
                filterStatus.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'project' : 'projects'}.`;
            }

            const applyFilter = () => {
                projectCards.forEach(card => {
                    const shouldShow = isVisible(card);
                    card.classList.toggle('hidden', !shouldShow);
                    card.classList.remove('filtering-out');
                });
            };

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                applyFilter();
                return;
            }

            projectCards.forEach(card => {
                card.classList.add('filtering-out');
            });
            pendingFilterTimeout = window.setTimeout(applyFilter, 160);
        });
    });
}
