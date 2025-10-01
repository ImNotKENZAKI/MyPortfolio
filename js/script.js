/* toggle icon navbar */
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x')
    navbar.classList.toggle('active')
}; 



/* scroll section active link */
let section = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    section.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id +']').classList.add('active');
            });
        };
    });
/* sticky navbar */
let header = document.querySelector('header');

header.classList.toggle('sticky', window.scrollY > 100);

/* remove toggle icon and navbar when click navbar link (scroll)*/
menuIcon.classList.remove('bx-x')
navbar.classList.remove('active')

};

/* Scroll Reveal */
ScrollReveal ({ 
   // reset: true,
    distance: '80px',
    duration: 2000,
    delay: 200  
});

ScrollReveal().reveal('.home-content,.heading', { origin: 'top'});
ScrollReveal().reveal('.home-img,.services-container, .portfolio-box, .contact form', { origin: 'bottom'});
ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left'});
ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right'});

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
});

/* Enhanced Contact Form with EmailJS and Beautiful Animations */
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    
    // Read EmailJS keys from data-attributes
    let PUBLIC_KEY = '';
    let SERVICE_ID = '';
    let TEMPLATE_ID = '';
    let TO_EMAIL = 'jjmanalo.va@gmail.com';
    
    if (contactForm) {
        PUBLIC_KEY = contactForm.dataset.emailjsPublicKey || '';
        SERVICE_ID = contactForm.dataset.emailjsServiceId || '';
        TEMPLATE_ID = contactForm.dataset.emailjsTemplateId || '';
        TO_EMAIL = contactForm.dataset.emailTo || TO_EMAIL;
        
        if (PUBLIC_KEY) {
            try { emailjs.init(PUBLIC_KEY); } catch (e) { /* ignore */ }
        }
    }
    
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
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                showMessage('Please fill in all required fields correctly.', 'error');
                return;
            }
            
            // Show loading state with animation
            showMessage('Sending your message...', 'loading');
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            submitBtn.value = '';
            
            // Add form submission animation
            contactForm.style.transform = 'scale(0.98)';
            contactForm.style.opacity = '0.8';
            
            // Get form data
            const formData = {
                from_name: document.getElementById('full-name').value.trim(),
                from_email: document.getElementById('email').value.trim(),
                mobile: document.getElementById('mobile').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim(),
                to_email: 'jjmanalo.va@gmail.com',
                reply_to: document.getElementById('email').value.trim()
            };
            
            // Ensure EmailJS keys exist
            if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
                showMessage('Email service is not configured. Add your EmailJS keys in the form attributes.', 'error');
                resetUi();
                return;
            }

            // Send email using EmailJS
            emailjs.send(SERVICE_ID, TEMPLATE_ID, formData)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Success animation
                    setTimeout(() => {
                        showMessage('🎉 Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
                        contactForm.reset();
                        
                        // Reset form animations
                        contactForm.style.transform = 'scale(1)';
                        contactForm.style.opacity = '1';
                        
                        // Add success particles effect
                        createParticles();
                    }, 1000);
                }, function(error) {
                    console.log('FAILED...', error);
                    
                    // Error animation
                    setTimeout(() => {
                        showMessage('❌ Sorry, there was an error sending your message. Please try again or contact me directly at jjmanalo.va@gmail.com', 'error');
                        
                        // Reset form animations
                        contactForm.style.transform = 'scale(1)';
                        contactForm.style.opacity = '1';
                    }, 1000);
                })
                .finally(function() {
                    setTimeout(() => resetUi(), 2000);
                });
        });
    }
    
    function validateForm() {
        const fullName = document.getElementById('full-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!fullName || !email || !subject || !message) {
            return false;
        }
        
        if (!emailRegex.test(email)) {
            return false;
        }
        
        return true;
    }
    
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
    
    function resetUi() {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.value = 'Send Message';
        contactForm.style.transform = 'scale(1)';
        contactForm.style.opacity = '1';
    }
    
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
  