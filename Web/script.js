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
            // Initialize modules with better error handling
            const moduleClasses = [
                { name: 'DevModeHelper', class: DevModeHelper },
                { name: 'ThemeManager', class: ThemeManager },
                { name: 'NavigationManager', class: NavigationManager },
                { name: 'IntersectionObserverManager', class: IntersectionObserverManager },
                { name: 'LinkManager', class: LinkManager }
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
