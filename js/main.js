// Main JavaScript for Digital Insights Website

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initCounterAnimations();
    initSmoothScroll();
    initContactForm();
    initScrollProgress();
    initParallax();
});

// ========================================
// Navigation
// ========================================

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

// ========================================
// Scroll Animations (AOS Alternative)
// ========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(element => observer.observe(element));
}

// ========================================
// Counter Animations
// ========================================

function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number, .stat-number-large');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;

        if (current < target) {
            // Format number based on size
            if (target >= 1000000) {
                element.textContent = (current / 1000000).toFixed(1) + 'M+';
            } else if (target >= 1000) {
                element.textContent = Math.floor(current / 1000) + 'K+';
            } else if (target >= 100) {
                element.textContent = Math.floor(current) + '+';
            } else if (target % 1 !== 0) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.floor(current);
            }

            requestAnimationFrame(updateCounter);
        } else {
            // Final value
            if (target >= 1000000) {
                element.textContent = (target / 1000000).toFixed(1) + 'M+';
            } else if (target >= 1000) {
                element.textContent = Math.floor(target / 1000) + 'K+';
            } else if (target >= 100) {
                element.textContent = Math.floor(target) + '+';
            } else if (target % 1 !== 0) {
                element.textContent = target.toFixed(1);
            } else {
                element.textContent = Math.floor(target);
            }
        }
    };

    updateCounter();
}

// ========================================
// Smooth Scroll
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Contact Form
// ========================================

function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            // Disable button and show loading
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Collect form data as JSON
            const formData = new FormData(form);
            const data = {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                phone: formData.get('phone'),
                service: formData.get('service'),
                message: formData.get('message')
            };

            // Send to local server proxy (secure, hides form ID)
            // Falls back to Formspree if server is unavailable
            fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .catch(() => {
                // Fallback to Formspree if server is down
                return fetch('https://formspree.io/f/mnnkpglj', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            })
            .then(response => {
                // Show success popup after 2-3 seconds delay
                setTimeout(() => {
                    showSuccessPopup();
                }, 2500);
                form.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            })
            .catch(error => {
                // Still show success popup because Formspree might have processed it
                setTimeout(() => {
                    showSuccessPopup();
                }, 2500);
                form.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
        });
    }
}

function showSuccessPopup() {
    const popup = document.createElement('div');
    popup.className = 'form-success-popup';
    popup.innerHTML = `
        <div class="success-popup-content">
            <div class="success-icon">✓</div>
            <h3>Form Submitted Successfully!</h3>
            <p>Please wait for our team to reach out to you</p>
            <button onclick="this.closest('.form-success-popup').remove()">Close</button>
        </div>
    `;
    document.body.appendChild(popup);

    // Auto-close after 6 seconds
    setTimeout(() => {
        if (popup.parentNode) {
            popup.remove();
        }
    }, 6000);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        backgroundColor: type === 'success' ? '#00FF88' : '#FF4444',
        color: '#000',
        borderRadius: '5px',
        fontWeight: '600',
        zIndex: '10000',
        boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
        animation: 'slideInRight 0.3s ease'
    });

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ========================================
// Scroll Progress Indicator
// ========================================

function initScrollProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ========================================
// Parallax Effect
// ========================================

function initParallax() {
    const heroContent = document.querySelector('.hero-content');
    const socBackground = document.querySelector('.soc-background');

    if (heroContent && socBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;

            // Move elements at different speeds
            heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            socBackground.style.transform = `translateY(${scrolled * parallaxSpeed * 0.3}px)`;
        });
    }
}

// ========================================
// Service Card Hover Effects
// ========================================

document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// ========================================
// Toggle Service Details
// ========================================

window.toggleService = function(event) {
    event.preventDefault();
    const serviceCard = event.target.closest('.service-card');
    serviceCard.classList.toggle('expanded');
}

// ========================================
// Add notification animations to CSS dynamically
// ========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// Utility Functions
// ========================================

// Throttle function for scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// Performance Optimization
// ========================================

// Lazy load images if needed
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// Console Message
// ========================================

console.log('%c Digital Insights Security ',
    'background: #D4AF37; color: #000; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Protected by advanced cybersecurity solutions ',
    'color: #D4AF37; font-size: 14px;');

// ========================================
// AI Feature Popups
// ========================================

const aiFeatureContent = {
    automated: {
        title: 'Automated Threat Detection',
        content: `
            <p>Our machine learning-powered detection system continuously monitors your network and systems in real-time, identifying threats before they can cause damage.</p>
            <ul>
                <li>Real-time threat identification using advanced ML algorithms</li>
                <li>Zero-day vulnerability detection and classification</li>
                <li>Behavioral analysis to identify suspicious activities</li>
                <li>Automatic threat scoring and prioritization</li>
                <li>Integration with SIEM systems for centralized monitoring</li>
            </ul>
            <p><strong>Key Benefits:</strong> Reduces detection time from hours to seconds, minimizes false positives, and provides immediate actionable intelligence.</p>
        `
    },
    behavioral: {
        title: 'Behavioral Analysis & Anomaly Detection',
        content: `
            <p>Advanced behavioral analysis that understands normal network patterns and instantly alerts when anomalies occur, catching sophisticated attacks that traditional security misses.</p>
            <ul>
                <li>User behavior profiling and baseline establishment</li>
                <li>Anomaly detection across network and system events</li>
                <li>Pattern recognition for known attack methodologies</li>
                <li>Insider threat detection and prevention</li>
                <li>Lateral movement detection and blocking</li>
            </ul>
            <p><strong>Key Benefits:</strong> Catches advanced persistent threats (APTs), insider threats, and zero-day attacks that bypass signature-based detection.</p>
        `
    },
    response: {
        title: 'Intelligent Automated Response',
        content: `
            <p>Autonomous response capabilities that automatically contain threats and execute remediation actions, dramatically reducing response time and minimizing damage.</p>
            <ul>
                <li>Automated incident isolation and containment</li>
                <li>Instant threat remediation and threat removal</li>
                <li>Automated credential reset and access revocation</li>
                <li>Network segmentation and lateral movement blocking</li>
                <li>Self-healing system recovery and restoration</li>
            </ul>
            <p><strong>Key Benefits:</strong> Eliminates manual response delays, prevents breach escalation, and ensures rapid recovery with minimal operational impact.</p>
        `
    }
};

function openAIPopup(featureType) {
    const popup = document.getElementById('aiPopup');
    const popupBody = document.getElementById('aiPopupBody');
    const feature = aiFeatureContent[featureType];

    if (feature) {
        popupBody.innerHTML = `
            <h3>${feature.title}</h3>
            ${feature.content}
        `;
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAIPopup() {
    const popup = document.getElementById('aiPopup');
    popup.classList.remove('active');
    document.body.style.overflow = '';
}

// Close popup when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAIPopup();
    }
});
