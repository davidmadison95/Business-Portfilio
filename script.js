// Particle.js Configuration
const particlesConfig = {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: "#2563eb"
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: 0.5,
            random: false
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#2563eb",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "repulse"
            },
            onclick: {
                enable: true,
                mode: "push"
            },
            resize: true
        }
    },
    retina_detect: true
};

// Initialize Particle.js
if (document.getElementById('particles-js')) {
    particlesJS('particles-js', particlesConfig);
}

// Theme Management
const ThemeManager = {
    init() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.setInitialTheme();
        this.bindEvents();
    },

    setInitialTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.setAttribute('data-theme', 'dark');
            this.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    },

    bindEvents() {
        this.themeToggle.addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
            this.themeToggle.innerHTML = isDark ? 
                '<i class="fas fa-moon"></i>' : 
                '<i class="fas fa-sun"></i>';
        });
    }
};

// Page Transitions
const PageTransitions = {
    init() {
        this.transitionElement = document.querySelector('.page-transition');
        this.bindEvents();
    },

    bindEvents() {
        document.querySelectorAll('a').forEach(link => {
            if (link.hostname === window.location.hostname) {
                link.addEventListener('click', (e) => {
                    if (!link.hasAttribute('target')) {
                        e.preventDefault();
                        const target = link.href;
                        this.transitionTo(target);
                    }
                });
            }
        });
    },

    transitionTo(target) {
        this.transitionElement.style.transform = 'translateY(0)';
        setTimeout(() => {
            window.location.href = target;
        }, 500);
    }
};

// Resume Modal
const ResumeModal = {
    init() {
        this.modal = document.getElementById('resumeModal');
        this.openBtn = document.getElementById('resumeBtn');
        this.closeBtn = document.querySelector('.close-modal');
        this.downloadBtns = document.querySelectorAll('.btn-download');
        
        if (this.modal) {
            this.bindEvents();
            this.loadStats();
        }
    },

    bindEvents() {
        // Open modal
        if (this.openBtn) {
            this.openBtn.addEventListener('click', () => this.open());
        }

        // Close modal
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Track downloads
        this.downloadBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = btn.dataset.format;
                this.handleDownload(btn, format);
            });
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    },

    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    },

    handleDownload(btn, format) {
        // Add downloading animation
        btn.classList.add('downloading');
        
        // Update stats
        const stats = this.getStats();
        stats.total++;
        stats[format] = (stats[format] || 0) + 1;
        stats.lastDownload = new Date().toISOString();
        localStorage.setItem('resume_stats', JSON.stringify(stats));
        
        // Update UI
        this.updateStats();
        
        // Remove animation after delay
        setTimeout(() => {
            btn.classList.remove('downloading');
        }, 2000);
    },

    getStats() {
        return JSON.parse(localStorage.getItem('resume_stats') || '{"total":0}');
    },

    loadStats() {
        const stats = this.getStats();
        this.updateStats(stats);
    },

    updateStats() {
        const stats = this.getStats();
        const totalElement = document.getElementById('totalDownloads');
        const lastDownloadElement = document.getElementById('lastDownload');
        
        if (totalElement) {
            this.animateNumber(totalElement, parseInt(totalElement.textContent), stats.total);
        }
        
        if (lastDownloadElement && stats.lastDownload) {
            const date = new Date(stats.lastDownload);
            lastDownloadElement.textContent = date.toLocaleDateString();
        }
    },

    animateNumber(element, start, end) {
        const duration = 1000;
        const step = Math.ceil((end - start) / (duration / 50));
        let current = start;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = current;
        }, 50);
    }
};

// Skill Animations
const SkillAnimations = {
    init() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.observeSkills();
    },

    observeSkills() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.5 });

        this.skillBars.forEach(bar => observer.observe(bar));
    }
};

// Contact Form
const ContactForm = {
    init() {
        this.form = document.getElementById('contact-form');
        if (this.form) {
            this.bindEvents();
        }
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitForm();
            }
        });
    },

    validateForm() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                this.showError(input, 'This field is required');
            } else {
                this.clearError(input);
            }
        });

        return isValid;
    },

    showError(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    },

    clearError(input) {
        const errorDiv = input.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    },

    submitForm() {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Message sent successfully!';
        this.form.appendChild(successMessage);
        
        // Reset form
        this.form.reset();
        
        // Remove success message after delay
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }
};

// Analytics Tracking
const Analytics = {
    init() {
        this.updateVisitorCount();
        this.trackTimeOnSite();
    },

    updateVisitorCount() {
        const count = parseInt(localStorage.getItem('visitor_count') || '0') + 1;
        localStorage.setItem('visitor_count', count);
        
        const countElement = document.getElementById('visitorCount');
        if (countElement) {
            this.animateNumber(countElement, 0, count);
        }
    },

    trackTimeOnSite() {
        let seconds = 0;
        const timeElement = document.getElementById('avgTime');
        
        setInterval(() => {
            seconds++;
            if (timeElement) {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                timeElement.textContent = 
                    `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    },

    animateNumber(element, start, end) {
        const duration = 2000;
        const step = Math.ceil((end - start) / (duration / 50));
        let current = start;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = current;
        }, 50);
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    PageTransitions.init();
    ResumeModal.init();
    SkillAnimations.init();
    ContactForm.init();
    Analytics.init();

    // Initialize typewriter effect if element exists
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const text = typewriterElement.dataset.text;
        let i = 0;
        function type() {
            if (i < text.length) {
                typewriterElement.textContent += text.charAt(i);
                i++;
                setTimeout(type, 100);
            }
        }
        type();
    }
});
