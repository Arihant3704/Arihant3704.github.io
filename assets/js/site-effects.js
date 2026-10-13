(() => {
    const themeToggle = document.querySelector('#theme-toggle');
    const themeLabel = themeToggle?.querySelector('[data-theme-label]');
    const themeIcon = themeToggle?.querySelector('i');

    const updateThemeButton = theme => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
        themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
        themeLabel.textContent = `${nextTheme === 'light' ? 'Light' : 'Dark'} mode`;
        themeIcon.classList.toggle('fa-sun', nextTheme === 'light');
        themeIcon.classList.toggle('fa-moon', nextTheme === 'dark');
    };

    if (themeToggle && themeLabel && themeIcon) {
        const storedTheme = localStorage.getItem('portfolio-theme');
        if (storedTheme === 'light' || storedTheme === 'dark') {
            document.documentElement.dataset.theme = storedTheme;
        }

        updateThemeButton(document.documentElement.dataset.theme || 'dark');
        themeToggle.addEventListener('click', () => {
            const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.dataset.theme = nextTheme;
            localStorage.setItem('portfolio-theme', nextTheme);
            updateThemeButton(nextTheme);
        });
    }

    const simulationPrompt = document.querySelector('#scroll-simulation-prompt');
    const simulationLab = document.querySelector('#simulation-lab');
    if (simulationPrompt && simulationLab && !sessionStorage.getItem('simulation-prompt-dismissed')) {
        const showSimulationPrompt = () => {
            if (!simulationPrompt.hidden) return;
            simulationPrompt.hidden = false;
        };

        if ('IntersectionObserver' in window) {
            let hasEnteredSimulationLab = false;
            const promptObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        hasEnteredSimulationLab = true;
                    } else if (hasEnteredSimulationLab && window.scrollY > simulationLab.offsetTop) {
                        showSimulationPrompt();
                        promptObserver.disconnect();
                    }
                });
            });
            promptObserver.observe(simulationLab);
        } else {
            const checkScrollPrompt = () => {
                if (simulationLab.getBoundingClientRect().bottom < 0) {
                    showSimulationPrompt();
                    window.removeEventListener('scroll', checkScrollPrompt);
                }
            };
            window.addEventListener('scroll', checkScrollPrompt, { passive: true });
            checkScrollPrompt();
        }

        const closePrompt = () => {
            simulationPrompt.hidden = true;
            sessionStorage.setItem('simulation-prompt-dismissed', 'true');
        };
        simulationPrompt.querySelector('.scroll-prompt-close')?.addEventListener('click', closePrompt);
        simulationPrompt.querySelector('a')?.addEventListener('click', () => {
            closePrompt();
        });
    }

    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (finePointer.matches && !reducedMotion.matches) {
        document.querySelectorAll('.simulation-preview-card').forEach(card => {
            card.addEventListener('pointermove', event => {
                if (event.pointerType !== 'mouse') return;

                const bounds = card.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                card.style.setProperty('--tilt-x', `${y * -7}deg`);
                card.style.setProperty('--tilt-y', `${x * 7}deg`);
                card.classList.add('is-tilting');
            });

            card.addEventListener('pointerleave', () => {
                card.style.removeProperty('--tilt-x');
                card.style.removeProperty('--tilt-y');
                card.classList.remove('is-tilting');
            });
        });
    }

    if (!finePointer.matches || reducedMotion.matches) return;

    const cursorOrbit = document.createElement('span');
    cursorOrbit.className = 'cursor-orbit';
    cursorOrbit.setAttribute('aria-hidden', 'true');
    document.body.append(cursorOrbit);

    let lastTrailPoint = null;
    let lastTrailTime = 0;
    let trailIndex = 0;

    document.addEventListener('pointermove', event => {
        if (event.pointerType !== 'mouse') return;

        document.body.classList.add('cursor-active');
        cursorOrbit.style.left = `${event.clientX}px`;
        cursorOrbit.style.top = `${event.clientY}px`;

        const now = performance.now();
        const point = { x: event.clientX, y: event.clientY };
        if (!lastTrailPoint) {
            lastTrailPoint = point;
        }
        const movedEnough = Math.hypot(
            point.x - lastTrailPoint.x,
            point.y - lastTrailPoint.y
        ) > 26;

        if (movedEnough && now - lastTrailTime > 48) {
            const trail = document.createElement('span');
            trail.className = `cursor-trail cursor-trail-${trailIndex % 3}`;
            trail.style.left = `${point.x}px`;
            trail.style.top = `${point.y}px`;
            trail.setAttribute('aria-hidden', 'true');
            document.body.append(trail);
            trail.addEventListener('animationend', () => trail.remove(), { once: true });
            trailIndex += 1;
            lastTrailTime = now;
            lastTrailPoint = point;
        }
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
        document.body.classList.remove('cursor-active');
    });
})();
