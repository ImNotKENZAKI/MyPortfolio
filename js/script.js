/* Enhanced toggle icon navbar with accessibility */
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

function toggleMobileMenu() {
    const isActive = navbar.classList.contains('active');
    
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
    
    // Improve accessibility
    menuIcon.setAttribute('aria-expanded', !isActive);
    navbar.setAttribute('aria-hidden', isActive);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isActive ? 'hidden' : '';
}

menuIcon.onclick = toggleMobileMenu;

// Add keyboard navigation support
menuIcon.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMobileMenu();
    }
});

// Close menu with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navbar.classList.contains('active')) {
        toggleMobileMenu();
    }
}); 



/* Optimized scroll section active link with throttling */
let section = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');
let header = document.querySelector('header');

// Throttle function for better performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function handleScroll() {
    const scrollY = window.scrollY;
    
    // Update active navigation links
    section.forEach(sec => {
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(scrollY >= offset && scrollY < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
            });
            const activeLink = document.querySelector('header nav a[href*=' + id +']');
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
    
    // Sticky navbar
    header.classList.toggle('sticky', scrollY > 100);
    
    // Close mobile menu on scroll
    if (navbar.classList.contains('active')) {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
        document.body.style.overflow = '';
        menuIcon.setAttribute('aria-expanded', 'false');
        navbar.setAttribute('aria-hidden', 'true');
    }
}

// Use throttled scroll handler
window.addEventListener('scroll', throttle(handleScroll, 16)); // ~60fps

/* Remove GSAP: using ScrollReveal only */

/* Restore original ScrollReveal timings and targets (slower, smoother) */
ScrollReveal({ distance: '70px', duration: 2200, delay: 220 });
ScrollReveal().reveal('.home-content,.heading', { origin: 'top' });
ScrollReveal().reveal('.home-img,.services-container, .portfolio-box, .contact form, .samples-container, .skills-container', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
ScrollReveal().reveal('.home-content p, .about-content, .samples-intro', { origin: 'right' });
ScrollReveal().reveal('.samples-filter', { origin: 'bottom', delay: 400 });

/* Typed Js */
const typed = new Typed('.multiple-text', {
    strings: ['Freelancer', 'Video Editor', 'Graphic Designer'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});

/* Theme toggle: persists preference */
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedTheme = localStorage.getItem('theme');

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark', isDark);
    themeToggle.classList.toggle('bx-sun', isDark);
    themeToggle.classList.toggle('bx-moon', !isDark);
}

applyTheme(storedTheme || (prefersDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.classList.toggle('bx-sun', isDark);
    themeToggle.classList.toggle('bx-moon', !isDark);
});

/* Discord copy-to-clipboard with toast */
const discordButton = document.getElementById('discord-copy');
const toast = document.getElementById('toast');

function showToast(message) {
    if (!toast) return;
    // Inject Discord icon for better recognition
    toast.innerHTML = `<i class='bx bxl-discord' aria-hidden="true"></i><span>${message}</span>`;
    // Set duration CSS var for progress bar animation
    toast.style.setProperty('--toast-duration', '2200ms');
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
}

async function copyDiscordTag(tag) {
    try {
        await navigator.clipboard.writeText(tag);
        showToast('Add me on Discord: ' + tag);
        setTimeout(() => showToast('Copied: ' + tag), 1100);
    } catch (e) {
        // Fallback: create temp input
        const input = document.createElement('input');
        input.value = tag;
        document.body.appendChild(input);
        input.select();
        try { document.execCommand('copy'); showToast('Copied: ' + tag); }
        catch { showToast('Copy failed. ' + tag); }
        document.body.removeChild(input);
    }
}

if (discordButton) {
    discordButton.addEventListener('click', (e) => {
        e.preventDefault();
        const tag = discordButton.getAttribute('data-discord') || 'kenzaki5885';
        copyDiscordTag(tag);
    });
}

/* Read More functionality */
document.addEventListener('DOMContentLoaded', function() {
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = this.getAttribute('data-target');
            const isExpanded = this.classList.contains('expanded');
            
            if (target === 'about') {
                toggleAboutText(this, isExpanded);
            } else {
                toggleServiceText(this, target, isExpanded);
            }
        });
    });
    
    function toggleAboutText(button, isExpanded) {
        const extendedText = document.querySelector('.about-text-extended');
        
        if (isExpanded) {
            // Collapse
            extendedText.classList.remove('expanded', 'text-reveal');
            button.textContent = 'Read More';
            button.classList.remove('expanded');
        } else {
            // Expand
            extendedText.classList.add('expanded');
            setTimeout(() => {
                extendedText.classList.add('text-reveal');
            }, 100);
            button.textContent = 'Read Less';
            button.classList.add('expanded');
        }
    }
    
    function toggleServiceText(button, target, isExpanded) {
        const serviceBox = button.closest('.services-box');
        const extendedText = serviceBox.querySelector('.service-text-extended');
        
        if (isExpanded) {
            // Collapse this service box
            extendedText.classList.remove('expanded');
            button.textContent = 'Read More';
            button.classList.remove('expanded');
            serviceBox.classList.remove('service-active');
        } else {
            // Expand this service box
            extendedText.classList.add('expanded');
            button.textContent = 'Read Less';
            button.classList.add('expanded');
            serviceBox.classList.add('service-active');
        }
    }
});

/* Contact Form: native submission only (no JS delivery) */
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    
    if (contactForm) {
        // Add floating label effect
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Check if input has value on page load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Enhanced validation
            const formData = {
                from_name: document.getElementById('full-name').value.trim(),
                from_email: document.getElementById('email').value.trim(),
                mobile: document.getElementById('mobile').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            // Validate required fields
            if (!formData.from_name || !formData.from_email || !formData.message) {
                showMessage('❌ Please fill in all required fields.', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.from_email)) {
                showMessage('❌ Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                const resp = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const result = await resp.json();
                
                if (resp.ok) {
                    showMessage('🎉 Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                    // Reset focused states
                    inputs.forEach(input => {
                        input.parentElement.classList.remove('focused');
                    });
                    createParticles();
                } else {
                    showMessage(`❌ ${result.error || 'Failed to send message'}. Please use Gmail/WhatsApp below.`, 'error');
                }
            } catch (err) {
                console.error('Contact form error:', err);
                showMessage('❌ Network error. Please check your connection or use Gmail/WhatsApp below.', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Remove JS validation (native service will handle)
    
    function showMessage(text, type) {
        if (formMessage) {
            // Hide any existing message first
            formMessage.classList.remove('show', 'success', 'error', 'loading');
            
            // Set content and type
            formMessage.textContent = text;
            formMessage.className = `form-message ${type}`;
            
            // Show with animation
            setTimeout(() => {
                formMessage.classList.add('show');
            }, 100);
            
            // Auto-hide success messages after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    hideMessage();
                }, 5000);
            }
            
            // Auto-hide error messages after 7 seconds
            if (type === 'error') {
                setTimeout(() => {
                    hideMessage();
                }, 7000);
            }
        }
    }
    
    function hideMessage() {
        if (formMessage) {
            formMessage.classList.remove('show');
            setTimeout(() => {
                formMessage.classList.remove('success', 'error', 'loading');
            }, 400);
        }
    }
    
    function resetUi() {}

    // Removed endpoint submission
    
    function createParticles() {
        const particleCount = 20;
        const colors = ['#FF4136', '#28a745', '#007bff', '#ffc107'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '10001';
            
            // Random position around the message
            const angle = (Math.PI * 2 * i) / particleCount;
            const radius = 100;
            const x = window.innerWidth / 2 + Math.cos(angle) * radius;
            const y = window.innerHeight / 2 + Math.sin(angle) * radius;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            document.body.appendChild(particle);
            
            // Animate particle
            particle.animate([
                { transform: 'translate(0, 0) scale(0)', opacity: 1 },
                { transform: `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) scale(1)`, opacity: 0 }
            ], {
                duration: 2000,
                easing: 'ease-out'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }
    
    // Add click outside to close message
    document.addEventListener('click', function(e) {
        if (formMessage && formMessage.classList.contains('show') && !formMessage.contains(e.target)) {
            hideMessage();
        }
    });
    
    // Add escape key to close message
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && formMessage && formMessage.classList.contains('show')) {
            hideMessage();
        }
    });
});

/* Enhanced Contact Methods Functionality */
// Copy email function
function copyEmail() {
    const email = 'jjmanalo.va@gmail.com';
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
            showCopyToast('Email copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyEmail(email);
        });
    } else {
        fallbackCopyEmail(email);
    }
}

function fallbackCopyEmail(email) {
    const textArea = document.createElement('textarea');
    textArea.value = email;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyToast('Email copied to clipboard!', 'success');
    } catch (err) {
        showCopyToast('Failed to copy email', 'error');
    }
    
    document.body.removeChild(textArea);
}

function showCopyToast(message, type) {
    // Remove any existing toast
    const existingToast = document.querySelector('.copy-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `copy-toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class='bx ${type === 'success' ? 'bx-check' : 'bx-error'}'></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add toast styles
    toast.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #28a745, #20c997)' : 'linear-gradient(135deg, #dc3545, #e74c3c)'};
        color: white;
        padding: 1.2rem 2rem;
        border-radius: 0.8rem;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        opacity: 0;
        transform: translateY(-20px) scale(0.9);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    toast.querySelector('.toast-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.8rem;
        font-size: 1.4rem;
        font-weight: 600;
    `;
    
    toast.querySelector('i').style.cssText = `
        font-size: 1.8rem;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0) scale(1)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px) scale(0.9)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Enhanced contact card animations
document.addEventListener('DOMContentLoaded', function() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    // Add intersection observer for contact cards
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                contactObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Initially hide cards and observe them
    contactCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        contactObserver.observe(card);
    });
    
    // Add hover sound effect simulation (visual feedback)
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animate availability status
    const availabilityStatus = document.querySelector('.availability-status');
    if (availabilityStatus) {
        const statusObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    statusObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        availabilityStatus.style.opacity = '0';
        availabilityStatus.style.transform = 'translateY(20px) scale(0.95)';
        availabilityStatus.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        statusObserver.observe(availabilityStatus);
    }
    
    // Add click tracking for analytics (placeholder)
    document.querySelectorAll('.contact-actions .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.classList.contains('btn-gmail') ? 'Gmail' :
                           this.classList.contains('btn-whatsapp') ? 'WhatsApp' :
                           this.classList.contains('btn-linkedin') ? 'LinkedIn' :
                           this.classList.contains('btn-telegram') ? 'Telegram' : 'Unknown';
            
            console.log(`Contact method clicked: ${platform}`);
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

/* Samples Section Functionality */
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sampleItems = document.querySelectorAll('.sample-item');
    
    // Enhanced filter functionality with professional animations
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // First hide all items with staggered animation
            sampleItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('hidden');
                }, index * 50);
            });
            
            // Then show matching items with staggered animation
            setTimeout(() => {
                let visibleIndex = 0;
                sampleItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        setTimeout(() => {
                            item.classList.remove('hidden');
                        }, visibleIndex * 100);
                        visibleIndex++;
                    }
                });
            }, 300);
        });
    });
    
    // Enhanced video error handling
    const iframes = document.querySelectorAll('.sample-video iframe');
    iframes.forEach(iframe => {
        // Check if iframe loads successfully
        iframe.addEventListener('load', function() {
            // Try to detect if the video is actually available
            setTimeout(() => {
                try {
                    // If iframe content is not accessible, it might be restricted
                    const iframeDoc = this.contentDocument || this.contentWindow.document;
                    if (!iframeDoc) {
                        // Content not accessible, might be restricted
                        console.log('Video might be restricted for embedding');
                    }
                } catch (e) {
                    // Cross-origin restriction is normal for YouTube
                    console.log('Video loaded successfully');
                }
            }, 1000);
        });
        
        iframe.addEventListener('error', function() {
            console.log('Video failed to load, showing fallback');
            this.style.display = 'none';
            const fallback = this.nextElementSibling;
            if (fallback && fallback.classList.contains('video-fallback')) {
                fallback.style.display = 'flex';
            }
        });
    });
    
    // Enhanced Intersection Observer for professional autoplay on scroll
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const iframe = entry.target.querySelector('iframe');
            const fallback = entry.target.querySelector('.video-fallback');
            const sampleItem = entry.target;
            
            // Only try autoplay if iframe is visible (not fallback)
            if (iframe && iframe.style.display !== 'none' && fallback && fallback.style.display !== 'flex') {
                if (entry.isIntersecting) {
                    // Add visual indicator that video is about to play
                    sampleItem.classList.add('video-playing');
                    
                    // Auto-play when in view (muted) with slight delay for smooth experience
                    setTimeout(() => {
                        const src = iframe.src;
                        if (!src.includes('autoplay=1')) {
                            iframe.src = src.replace('autoplay=0', 'autoplay=1');
                        }
                    }, 200);
                } else {
                    // Remove playing indicator and pause
                    sampleItem.classList.remove('video-playing');
                    const src = iframe.src;
                    if (src.includes('autoplay=1')) {
                        iframe.src = src.replace('autoplay=1', 'autoplay=0');
                    }
                }
            }
        });
    }, {
        threshold: 0.4, // More aggressive threshold for better autoplay
        rootMargin: '0px 0px -20px 0px' // Start playing sooner
    });
    
    // Observe all sample items
    sampleItems.forEach(item => {
        videoObserver.observe(item);
    });
    
    // Professional counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        const displayValue = Math.floor(current);
                        // Add % symbol for the percentage stat
                        if (target === 100) {
                            entry.target.textContent = displayValue + '%';
                        } else {
                            entry.target.textContent = displayValue;
                        }
                        requestAnimationFrame(updateCounter);
                    } else {
                        // Final value with proper formatting
                        if (target === 100) {
                            entry.target.textContent = target + '%';
                        } else {
                            entry.target.textContent = target;
                        }
                    }
                };
                
                updateCounter();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // Additional fallback check after page load
    setTimeout(() => {
        iframes.forEach(iframe => {
            // Check if iframe has loaded content
            if (iframe.offsetHeight === 0 || iframe.offsetWidth === 0) {
                console.log('Video appears to have loading issues, showing fallback');
                iframe.style.display = 'none';
                const fallback = iframe.nextElementSibling;
                if (fallback && fallback.classList.contains('video-fallback')) {
                    fallback.style.display = 'flex';
                }
            }
        });
    }, 3000);
});

/* Data Entry privacy modal */
document.addEventListener('DOMContentLoaded', function() {
    const dataEntryLinks = document.querySelectorAll('.data-entry-link');
    const modal = document.getElementById('data-entry-modal');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;

    function openModal(e) {
        if (e) e.preventDefault();
        if (!modal) return;
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    dataEntryLinks.forEach(link => {
        link.addEventListener('click', openModal);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});

/* ========== STANDOUT FEATURES FUNCTIONALITY ========== */

/* Floating Action Button */
document.addEventListener('DOMContentLoaded', function() {
    const floatingBtn = document.getElementById('floating-btn');
    const fabMain = floatingBtn.querySelector('.fab-main');
    
    fabMain.addEventListener('click', function() {
        floatingBtn.classList.toggle('active');
    });
    
    // Close FAB when clicking outside
    document.addEventListener('click', function(e) {
        if (!floatingBtn.contains(e.target)) {
            floatingBtn.classList.remove('active');
        }
    });
});

/* Professional Scroll Progress */
window.addEventListener('scroll', function() {
    const scrollProgress = document.querySelector('.scroll-progress-bar');
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    scrollProgress.style.width = scrollPercent + '%';
});

/* Live Visitor Counter with Animation */
document.addEventListener('DOMContentLoaded', function() {
    const visitorCount = document.getElementById('visitor-count');
    
    // Simulate live visitor count updates
    function updateVisitorCount() {
        const currentCount = parseInt(visitorCount.textContent.replace(',', ''));
        const increment = Math.floor(Math.random() * 3) + 1; // Random 1-3
        const newCount = currentCount + increment;
        
        // Add comma formatting
        visitorCount.textContent = newCount.toLocaleString();
        
        // Add flash effect
        visitorCount.style.color = '#ff6b6d';
        setTimeout(() => {
            visitorCount.style.color = 'var(--main-color)';
        }, 300);
    }
    
    // Update visitor count every 15-30 seconds
    setInterval(updateVisitorCount, Math.random() * 15000 + 15000);
});

/* Enhanced Video Hover Effects */
document.addEventListener('DOMContentLoaded', function() {
    const sampleItems = document.querySelectorAll('.sample-item');
    
    sampleItems.forEach(item => {
        const video = item.querySelector('.sample-video');
        
        item.addEventListener('mouseenter', function() {
            // Add subtle pulse effect to video
            video.style.transform = 'scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            video.style.transform = 'scale(1)';
        });
    });
});

/* Professional Loading Animation with Performance Optimization */
window.addEventListener('load', function() {
    // Add loaded class to body for any load-based animations
    document.body.classList.add('loaded');
    
    // Lazy load images for better performance
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
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
    
    // Animate elements in sequence with requestAnimationFrame for better performance
    const elementsToAnimate = [
        '.samples-stats .stat-item',
        '.sample-item',
        '.filter-btn'
    ];
    
    elementsToAnimate.forEach((selector, index) => {
        setTimeout(() => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el, i) => {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, i * 100);
                });
            });
        }, index * 200);
    });
});

/* Skills Section Animations */
document.addEventListener('DOMContentLoaded', function() {
    // Animate skill progress bars when they come into view
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetWidth = entry.target.getAttribute('data-width');
                setTimeout(() => {
                    entry.target.style.width = targetWidth;
                }, 200);
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    skillBars.forEach(bar => {
        skillsObserver.observe(bar);
    });
    
    // Animate software items with stagger effect
    const softwareItems = document.querySelectorAll('.software-item');
    const softwareObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                softwareObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Initially hide software items
    softwareItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        softwareObserver.observe(item);
    });
});
  