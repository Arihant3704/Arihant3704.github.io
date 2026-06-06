// Mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when any link inside it is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
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

// Project Filtering Logic
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes from all buttons
            filterButtons.forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
                b.classList.add('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
            });
            
            // Add active classes to clicked button
            btn.classList.remove('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
            btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                // First fade out
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                
                setTimeout(() => {
                    let isVisible = false;
                    
                    if (filterValue === 'all') {
                        isVisible = true;
                    } else if (filterValue === 'featured') {
                        isVisible = card.getAttribute('data-featured') === 'true';
                    } else {
                        const cardCategory = card.getAttribute('data-category') || '';
                        const categories = cardCategory.split(' ');
                        isVisible = categories.includes(filterValue);
                    }
                    
                    if (isVisible) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 200);
            });
        });
    });
}
