// Development mode detection and helpers
class DevModeHelper {
    constructor() {
        this.isDevMode = this.detectDevMode();
        this.init();
    }
    
    detectDevMode() {
        const { protocol, hostname } = window.location;
        return protocol === 'file:' || 
               hostname === 'localhost' || 
               hostname === '127.0.0.1' || 
               hostname === '[::1]';
    }
    
    init() {
        if (this.isDevMode) {
            this.addDevTools();
            this.logDevInfo();
        }
    }
    
    addDevTools() {
        // Add development keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + D for dev info
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.showDevInfo();
            }
        });
    }
    
    logDevInfo() {
        const { protocol, hostname, port } = window.location;
        
        console.group('🔧 Development Mode Info');
        console.log(`Protocol: ${protocol}`);
        console.log(`Hostname: ${hostname}`);
        console.log(`Port: ${port || 'default'}`);
        console.log(`Service Worker Support: ${isServiceWorkerSupported() ? '✅' : '❌'}`);
        console.log(`PWA Features: ${protocol === 'https:' || hostname === 'localhost' ? '✅' : '❌'}`);
        
        if (protocol === 'file:') {
            console.warn('📝 Tip: Use a local server for full functionality. See LOCAL_DEV.md');
        }
        
        console.log('💡 Press Ctrl/Cmd + Shift + D for dev tools');
        console.groupEnd();
    }
    
    showDevInfo() {
        const info = {
            'Environment': window.location.protocol === 'file:' ? 'Local File' : 'HTTP Server',
            'Service Worker': 'serviceWorker' in navigator ? 'Supported' : 'Not Supported',
            'SW Registered': isServiceWorkerSupported() ? 'Yes' : 'No (protocol limitation)',
            'Screen Size': `${window.innerWidth} x ${window.innerHeight}`,
            'User Agent': navigator.userAgent.split(' ').slice(-2).join(' '),
            'Theme': document.documentElement.getAttribute('data-theme') || 'system'
        };
        
        console.table(info);
    }
}

// Modern JavaScript using ES6+ features and best practices

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.html = document.documentElement;
        
        this.init();
    }
    
    init() {
        this.setTheme(this.theme);
        this.bindEvents();
        this.watchSystemTheme();
    }
    
    setTheme(theme) {
        this.theme = theme;
        this.html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateIcon();
        
        // Announce theme change for screen readers
        this.announceThemeChange(theme);
    }
    
    updateIcon() {
        const iconClass = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        this.themeIcon.className = iconClass;
    }
    
    announceThemeChange(theme) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Theme changed to ${theme} mode`;
        document.body.appendChild(announcement);
        
        setTimeout(() => announcement.remove(), 1000);
    }
    
    bindEvents() {
        this.themeToggle?.addEventListener('click', () => {
            const newTheme = this.theme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        });
    }
    
    watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

class NavigationManager {
    constructor() {
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.navLinks = document.getElementById('navLinks');
        this.trapFocus = this.trapFocus.bind(this);
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupKeyboardNavigation();
    }
    
    bindEvents() {
        // Mobile menu toggle
        this.mobileMenuBtn?.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close menu on link click
        this.navLinks?.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Close menu on outside click
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen()) {
                this.closeMobileMenu();
                this.mobileMenuBtn?.focus();
            }
        });
    }
    
    toggleMobileMenu() {
        const isOpen = this.isMobileMenuOpen();
        this.navLinks?.classList.toggle('active');
        this.mobileMenuBtn?.setAttribute('aria-expanded', !isOpen);
        
        if (!isOpen) {
            this.trapFocus();
            this.navLinks?.querySelector('a')?.focus();
        }
    }
    
    closeMobileMenu() {
        this.navLinks?.classList.remove('active');
        this.mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    }
    
    isMobileMenuOpen() {
        return this.navLinks?.classList.contains('active') ?? false;
    }
    
    handleOutsideClick(e) {
        if (!this.navLinks?.contains(e.target) && 
            !this.mobileMenuBtn?.contains(e.target) && 
            this.isMobileMenuOpen()) {
            this.closeMobileMenu();
        }
    }
    
    trapFocus() {
        if (!this.isMobileMenuOpen()) return;
        
        const focusableElements = this.navLinks?.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements?.length) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        });
    }
    
    setupKeyboardNavigation() {
        // Smooth scrolling with proper focus management
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Set focus to the target section for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                }
            });
        });
    }
}

class IntersectionObserverManager {
    constructor() {
        this.observedElements = new Set();
        this.init();
    }
    
    init() {
        // Lazy loading for images
        this.setupLazyLoading();
        
        // Animation on scroll
        this.setupScrollAnimations();
        
        // Performance monitoring
        this.setupPerformanceObserver();
    }
    
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }
    
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            animationObserver.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
            );
            
            animatedElements.forEach(el => animationObserver.observe(el));
        }
    }
    
    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            const perfObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'largest-contentful-paint') {
                        // Only log if LCP is concerning (> 2.5s is poor)
                        const lcpTime = entry.startTime;
                        if (lcpTime > 2500) {
                            console.warn(`⚠️ LCP is slow: ${lcpTime.toFixed(1)}ms (should be < 2.5s)`);
                        } else {
                            console.log(`📊 LCP: ${lcpTime.toFixed(1)}ms`);
                        }
                    }
                });
            });
            
            try {
                perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                // Silently fail for unsupported browsers
            }
        }
    }
}

// Enhanced link behavior
class LinkManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Add loading states to external links
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            link.addEventListener('click', (e) => this.handleExternalLink(e, link));
        });
        
        // Add security attributes to external links
        this.secureExternalLinks();
    }
    
    handleExternalLink(e, link) {
        // Add visual feedback
        link.style.opacity = '0.7';
        
        // Add loading indicator if needed
        const hasIcon = link.querySelector('i');
        if (!hasIcon) {
            const spinner = document.createElement('span');
            spinner.className = 'loading-spinner';
            spinner.setAttribute('aria-hidden', 'true');
            link.appendChild(spinner);
            
            setTimeout(() => {
                spinner.remove();
                link.style.opacity = '1';
            }, 1000);
        } else {
            setTimeout(() => {
                link.style.opacity = '1';
            }, 1000);
        }
    }
    
    secureExternalLinks() {
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (!link.getAttribute('rel')) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
            if (!link.getAttribute('target')) {
                link.setAttribute('target', '_blank');
            }
        });
    }
}

class ProjectsCarousel {
    constructor() {
        this.track = document.getElementById('projectsTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('carouselDots');
        this.currentIndex = 0;
        this.totalProjects = 0;
        this.cardsPerView = 3;
        
        if (this.track) {
            this.init();
        }
    }
    
    init() {
        this.totalProjects = this.track.children.length;
        this.updateCardsPerView();
        this.createDots();
        this.bindEvents();
        this.updateCarousel();
        this.setupSwipeGestures();
        
        // Update on resize
        window.addEventListener('resize', () => {
            this.updateCardsPerView();
            this.updateCarousel();
            this.createDots();
        });
    }
    
    updateCardsPerView() {
        const width = window.innerWidth;
        if (width <= 768) {
            this.cardsPerView = 1;
        } else if (width <= 1024) {
            this.cardsPerView = 2;
        } else {
            this.cardsPerView = 3;
        }
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        const maxSlides = Math.max(0, this.totalProjects - this.cardsPerView + 1);
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < maxSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    bindEvents() {
        this.prevBtn?.addEventListener('click', () => this.previousSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });
    }
    
    setupSwipeGestures() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        const handleStart = (e) => {
            isDragging = true;
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            this.track.style.transition = 'none';
        };
        
        const handleMove = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            currentX = e.touches ? e.touches[0].clientX : e.clientX;
            const diffX = currentX - startX;
            const cardWidth = this.track.children[0].offsetWidth;
            const gap = 32; // 2rem gap
            const moveDistance = (cardWidth + gap) * this.currentIndex;
            
            this.track.style.transform = `translateX(${-moveDistance + diffX}px)`;
        };
        
        const handleEnd = () => {
            if (!isDragging) return;
            
            isDragging = false;
            this.track.style.transition = 'transform 0.5s ease';
            
            const diffX = currentX - startX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            } else {
                this.updateCarousel();
            }
        };
        
        // Touch events
        this.track.addEventListener('touchstart', handleStart, { passive: true });
        this.track.addEventListener('touchmove', handleMove, { passive: false });
        this.track.addEventListener('touchend', handleEnd);
        
        // Mouse events for desktop testing
        this.track.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
    }
    
    previousSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
    
    nextSlide() {
        const maxIndex = Math.max(0, this.totalProjects - this.cardsPerView);
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }
    
    goToSlide(index) {
        const maxIndex = Math.max(0, this.totalProjects - this.cardsPerView);
        this.currentIndex = Math.min(index, maxIndex);
        this.updateCarousel();
    }
    
    updateCarousel() {
        if (!this.track) return;
        
        // Calculate translation based on current index
        const cardWidth = this.track.children[0]?.offsetWidth || 300;
        const gap = 32; // 2rem gap
        const translateX = -this.currentIndex * (cardWidth + gap);
        
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        this.updateButtons();
        this.updateDots();
    }
    
    updateButtons() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        const maxIndex = Math.max(0, this.totalProjects - this.cardsPerView);
        
        this.prevBtn.disabled = this.currentIndex <= 0;
        this.nextBtn.disabled = this.currentIndex >= maxIndex;
    }
    
    updateDots() {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
}

class SpeakingCarousel {
    constructor() {
        this.track = document.getElementById('speakingTrack');
        this.prevBtn = document.getElementById('speakingPrevBtn');
        this.nextBtn = document.getElementById('speakingNextBtn');
        this.dotsContainer = document.getElementById('speakingCarouselDots');
        this.currentIndex = 0;
        this.totalTalks = 0;
        this.cardsPerView = 3;
        
        if (this.track) {
            this.init();
        }
    }
    
    init() {
        this.totalTalks = this.track.children.length;
        this.updateCardsPerView();
        this.createDots();
        this.bindEvents();
        this.updateCarousel();
        this.setupSwipeGestures();
        
        // Update on resize
        window.addEventListener('resize', () => {
            this.updateCardsPerView();
            this.updateCarousel();
            this.createDots();
        });
    }
    
    updateCardsPerView() {
        const width = window.innerWidth;
        if (width <= 768) {
            this.cardsPerView = 1;
        } else if (width <= 1024) {
            this.cardsPerView = 2;
        } else {
            this.cardsPerView = 3;
        }
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        const maxSlides = Math.max(0, this.totalTalks - this.cardsPerView + 1);
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < maxSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to talk ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    bindEvents() {
        this.prevBtn?.addEventListener('click', () => this.previousSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
    }
    
    setupSwipeGestures() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        const handleStart = (e) => {
            isDragging = true;
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            this.track.style.transition = 'none';
        };
        
        const handleMove = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            currentX = e.touches ? e.touches[0].clientX : e.clientX;
            const diffX = currentX - startX;
            const cardWidth = this.track.children[0].offsetWidth;
            const gap = 32; // 2rem gap
            const moveDistance = (cardWidth + gap) * this.currentIndex;
            
            this.track.style.transform = `translateX(${-moveDistance + diffX}px)`;
        };
        
        const handleEnd = () => {
            if (!isDragging) return;
            
            isDragging = false;
            this.track.style.transition = 'transform 0.5s ease';
            
            const diffX = currentX - startX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            } else {
                this.updateCarousel();
            }
        };
        
        // Touch events
        this.track.addEventListener('touchstart', handleStart, { passive: true });
        this.track.addEventListener('touchmove', handleMove, { passive: false });
        this.track.addEventListener('touchend', handleEnd);
        
        // Mouse events for desktop testing
        this.track.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
    }
    
    previousSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
    
    nextSlide() {
        const maxIndex = Math.max(0, this.totalTalks - this.cardsPerView);
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }
    
    goToSlide(index) {
        const maxIndex = Math.max(0, this.totalTalks - this.cardsPerView);
        this.currentIndex = Math.min(index, maxIndex);
        this.updateCarousel();
    }
    
    updateCarousel() {
        if (!this.track) return;
        
        // Calculate translation based on current index
        const cardWidth = this.track.children[0]?.offsetWidth || 300;
        const gap = 32; // 2rem gap
        const translateX = -this.currentIndex * (cardWidth + gap);
        
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        this.updateButtons();
        this.updateDots();
    }
    
    updateButtons() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        const maxIndex = Math.max(0, this.totalTalks - this.cardsPerView);
        
        this.prevBtn.disabled = this.currentIndex <= 0;
        this.nextBtn.disabled = this.currentIndex >= maxIndex;
    }
    
    updateDots() {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
}

// Modern initialization using DOMContentLoaded and modules
class App {
    constructor() {
        this.modules = [];
        this.init();
    }
    
    async init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeModules());
        } else {
            this.initializeModules();
        }
    }
    
    initializeModules() {
        try {
            // Randomize project cards before initializing carousels so each load shows a different ordering
            (function shuffleProjectCards() {
                const track = document.getElementById('projectsTrack');
                if (!track) return;
                const cards = Array.from(track.children);
                if (cards.length < 2) return; // nothing to shuffle
                // Fisher-Yates style shuffle using in-memory array then re-append for minimal layout thrash
                for (let i = cards.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [cards[i], cards[j]] = [cards[j], cards[i]];
                }
                // Re-append in new order
                const frag = document.createDocumentFragment();
                cards.forEach(c => frag.appendChild(c));
                track.appendChild(frag);
            })();

            // Initialize modules with better error handling
            const moduleClasses = [
                { name: 'DevModeHelper', class: DevModeHelper },
                { name: 'ThemeManager', class: ThemeManager },
                { name: 'NavigationManager', class: NavigationManager },
                { name: 'IntersectionObserverManager', class: IntersectionObserverManager },
                { name: 'LinkManager', class: LinkManager },
                { name: 'ProjectsCarousel', class: ProjectsCarousel },
                { name: 'SpeakingCarousel', class: SpeakingCarousel }
            ];

            moduleClasses.forEach(({ name, class: ModuleClass }) => {
                try {
                    const instance = new ModuleClass();
                    this.modules.push(instance);
                    console.log(`✅ ${name} initialized successfully`);
                } catch (error) {
                    console.error(`❌ Failed to initialize ${name}:`, error);
                }
            });
            
            console.log(`🚀 Application initialized with ${this.modules.length}/${moduleClasses.length} modules`);
        } catch (error) {
            console.error('❌ Critical error during module initialization:', error);
        }
    }
}

// Initialize the application
new App();

// Service Worker registration for PWA capabilities
// Only register if we're on a supported protocol (https or localhost)
if ('serviceWorker' in navigator && isServiceWorkerSupported()) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('✅ Service Worker registered successfully:', registration);
            })
            .catch((registrationError) => {
                console.warn('⚠️ Service Worker registration failed:', registrationError.message);
            });
    });
} else if ('serviceWorker' in navigator) {
    console.info('ℹ️ Service Worker not registered: unsupported protocol (file://). This is normal for local development.');
} else {
    console.info('ℹ️ Service Worker not supported in this browser.');
}

function isServiceWorkerSupported() {
    // Service workers only work on HTTPS, localhost, or 127.0.0.1
    const { protocol, hostname } = window.location;
    return protocol === 'https:' || 
           hostname === 'localhost' || 
           hostname === '127.0.0.1' || 
           hostname === '[::1]';
}
