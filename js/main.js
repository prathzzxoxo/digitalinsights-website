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

            // Collect form data
            const formData = new FormData(form);

            // Send to Formspree using fetch (prevents page redirect)
            fetch('https://formspree.io/f/mnnkpglj', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    // Show success popup after 2-3 seconds delay
                    setTimeout(() => {
                        showSuccessPopup();
                    }, 2500);
                    form.reset();
                } else {
                    // Still show success popup even if there's an error
                    setTimeout(() => {
                        showSuccessPopup();
                    }, 2500);
                }
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
        closeBlogModal();
    }
});

// ========================================
// Blog Modal Functions
// ========================================

const blogContent = {
    'ai-threat-detection': {
        content: `
            <h2>AI-Powered Threat Detection: The Future of Cybersecurity</h2>
            <p>Artificial intelligence is revolutionizing how organizations detect and respond to cyber threats. Traditional rule-based security systems can only catch known threats, but AI-powered systems learn from patterns and can identify zero-day exploits and advanced persistent threats.</p>

            <h3>How AI Improves Threat Detection</h3>
            <ul>
                <li><strong>Pattern Recognition:</strong> AI analyzes millions of data points to identify suspicious patterns</li>
                <li><strong>Behavioral Analysis:</strong> Detects anomalies in user and system behavior</li>
                <li><strong>Predictive Threat Intelligence:</strong> Anticipates future attacks based on current trends</li>
                <li><strong>Real-time Processing:</strong> Immediate threat identification and response</li>
            </ul>

            <h3>Key Benefits</h3>
            <ul>
                <li>Catches advanced threats that bypass traditional defenses</li>
                <li>Reduces false positives and alert fatigue</li>
                <li>Enables faster incident response</li>
                <li>Improves overall security posture</li>
            </ul>

            <p>Organizations implementing AI-powered threat detection see dramatic improvements in their security operations, with faster detection times and more accurate threat identification.</p>
        `
    },
    'incident-response': {
        content: `
            <h2>Rapid Incident Response: Minimizing Breach Impact</h2>
            <p>Every minute counts when a security breach occurs. Organizations that respond quickly to incidents can dramatically reduce the damage, financial losses, and reputational harm.</p>

            <h3>The Incident Response Lifecycle</h3>
            <ul>
                <li><strong>Detection:</strong> Identifying that a security incident has occurred</li>
                <li><strong>Analysis:</strong> Understanding the scope and nature of the breach</li>
                <li><strong>Containment:</strong> Stopping the attacker's access and preventing further damage</li>
                <li><strong>Eradication:</strong> Removing the attacker's tools and access points</li>
                <li><strong>Recovery:</strong> Restoring systems to normal operation</li>
                <li><strong>Lessons Learned:</strong> Analyzing what happened and improving future response</li>
            </ul>

            <h3>Response Time Statistics</h3>
            <p>Companies that contain breaches within 30 days save an average of $1 million compared to those that take 90+ days to contain.</p>

            <h3>Best Practices</h3>
            <ul>
                <li>Have an incident response plan in place before a breach occurs</li>
                <li>Train your team regularly on incident response procedures</li>
                <li>Maintain 24/7 monitoring and alerting capabilities</li>
                <li>Document all incidents and maintain detailed logs</li>
                <li>Conduct post-incident reviews to improve future response</li>
            </ul>
        `
    },
    'cloud-security': {
        content: `
            <h2>Securing Your Cloud Infrastructure: Essential Strategies</h2>
            <p>Cloud computing offers tremendous benefits in scalability and flexibility, but it also introduces new security challenges. Organizations must implement comprehensive security strategies to protect their cloud infrastructure.</p>

            <h3>Key Cloud Security Challenges</h3>
            <ul>
                <li>Misconfigured cloud resources exposing sensitive data</li>
                <li>Inadequate access controls and identity management</li>
                <li>Lack of visibility into cloud environments</li>
                <li>Compliance and regulatory requirements</li>
                <li>Insider threats and credential theft</li>
            </ul>

            <h3>Essential Security Strategies</h3>
            <ul>
                <li><strong>Access Control:</strong> Implement least-privilege access and multi-factor authentication</li>
                <li><strong>Data Protection:</strong> Encrypt data at rest and in transit</li>
                <li><strong>Monitoring:</strong> Maintain continuous visibility into cloud resources</li>
                <li><strong>Compliance:</strong> Meet regulatory requirements and industry standards</li>
                <li><strong>Backup & Recovery:</strong> Maintain secure backups for disaster recovery</li>
            </ul>

            <p>A comprehensive cloud security strategy requires continuous monitoring, regular assessments, and proactive threat detection to protect your organization's most critical assets.</p>
        `
    },
    'zero-trust': {
        content: `
            <h2>Zero Trust Architecture: A New Security Paradigm</h2>
            <p>Traditional security models assume that everything inside the network is trusted. Zero Trust Architecture changes this fundamental assumption by requiring verification of every user and device, regardless of location.</p>

            <h3>Core Principles of Zero Trust</h3>
            <ul>
                <li><strong>Never Trust, Always Verify:</strong> Verify every access request</li>
                <li><strong>Assume Breach:</strong> Design systems assuming attackers are already inside</li>
                <li><strong>Verify Explicitly:</strong> Use all available data points for authentication</li>
                <li><strong>Least Privilege Access:</strong> Grant minimum necessary permissions</li>
                <li><strong>Protect Every Resource:</strong> Apply security to all assets, not just the perimeter</li>
            </ul>

            <h3>Implementation Components</h3>
            <ul>
                <li>Multi-factor authentication</li>
                <li>Micro-segmentation of networks</li>
                <li>Continuous monitoring and analytics</li>
                <li>Encryption of all communications</li>
                <li>Detailed access logging and auditing</li>
            </ul>

            <p>Zero Trust Architecture provides a more effective security model for modern environments where users, devices, and applications are distributed across multiple locations and networks.</p>
        `
    },
    'penetration-testing': {
        content: `
            <h2>Penetration Testing Best Practices</h2>
            <p>Penetration testing is a critical component of a comprehensive security program. It involves simulating real-world attacks to identify vulnerabilities before malicious actors find them.</p>

            <h3>Types of Penetration Tests</h3>
            <ul>
                <li><strong>External Testing:</strong> Tests from outside your network</li>
                <li><strong>Internal Testing:</strong> Tests from inside your network</li>
                <li><strong>Blind Testing:</strong> Testers have limited information</li>
                <li><strong>Double-blind Testing:</strong> Neither testers nor defenders know about the test</li>
            </ul>

            <h3>Penetration Testing Process</h3>
            <ul>
                <li>Reconnaissance and information gathering</li>
                <li>Scanning and enumeration</li>
                <li>Vulnerability analysis</li>
                <li>Exploitation attempts</li>
                <li>Post-exploitation and privilege escalation</li>
                <li>Reporting and recommendations</li>
            </ul>

            <h3>Best Practices</h3>
            <ul>
                <li>Conduct tests regularly (at least annually)</li>
                <li>Have proper authorization and scope defined</li>
                <li>Use qualified security professionals</li>
                <li>Test both technical and social engineering aspects</li>
                <li>Implement findings and retest to verify fixes</li>
            </ul>
        `
    },
    'gdpr-privacy': {
        content: `
            <h2>GDPR & Data Privacy: Compliance Made Simple</h2>
            <p>The General Data Protection Regulation (GDPR) has fundamentally changed how organizations handle personal data. Understanding and implementing GDPR requirements is essential for any organization processing data of EU residents.</p>

            <h3>Key GDPR Principles</h3>
            <ul>
                <li><strong>Lawfulness, Fairness, Transparency:</strong> Legal basis for processing</li>
                <li><strong>Purpose Limitation:</strong> Data only used for stated purposes</li>
                <li><strong>Data Minimization:</strong> Collect only necessary data</li>
                <li><strong>Accuracy:</strong> Keep data accurate and up-to-date</li>
                <li><strong>Storage Limitation:</strong> Don't keep data longer than needed</li>
                <li><strong>Integrity and Confidentiality:</strong> Protect data security</li>
            </ul>

            <h3>GDPR Compliance Requirements</h3>
            <ul>
                <li>Obtain clear consent for data processing</li>
                <li>Implement data protection by design</li>
                <li>Conduct Data Protection Impact Assessments</li>
                <li>Maintain detailed processing records</li>
                <li>Respond to data subject requests within 30 days</li>
                <li>Notify authorities of data breaches within 72 hours</li>
            </ul>

            <h3>Penalties for Non-Compliance</h3>
            <p>Fines can reach up to €20 million or 4% of annual global turnover, whichever is higher. Proper GDPR compliance is not just a legal requirement but essential for maintaining customer trust.</p>
        `
    }
};

function openBlogPost(postId, title, date, readTime, category, image) {
    const modal = document.getElementById('blogModal');
    const titleEl = document.getElementById('blogModalTitle');
    const dateEl = document.getElementById('blogModalDate');
    const readTimeEl = document.getElementById('blogModalReadTime');
    const categoryEl = document.getElementById('blogModalCategory');
    const imageEl = document.getElementById('blogModalImage');
    const bodyEl = document.getElementById('blogModalBody');

    if (blogContent[postId]) {
        titleEl.textContent = title;
        dateEl.textContent = date;
        readTimeEl.textContent = readTime;
        categoryEl.textContent = category;
        imageEl.src = image;
        bodyEl.innerHTML = blogContent[postId].content;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);
    }
}

function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}
