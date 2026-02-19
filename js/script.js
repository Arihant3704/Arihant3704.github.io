// Mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
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
            behavior: 'smooth'
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
            entry.target.classList.add('fade-in');
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
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
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
