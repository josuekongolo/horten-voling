/**
 * Horten Vøling - Main JavaScript
 * Tradisjonelt Handverk i Lom
 */

(function() {
    'use strict';

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMain = document.querySelector('.nav-main');

    if (navToggle && navMain) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';

            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('active');
            navMain.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = navMain.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        const navLinks = navMain.querySelectorAll('a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
                navMain.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMain.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
                navMain.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // CONTACT FORM HANDLING
    // ============================================
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Hide any previous messages
            if (formSuccess) formSuccess.style.display = 'none';
            if (formError) formError.style.display = 'none';

            // Get form data
            const formData = {
                namn: document.getElementById('namn').value.trim(),
                telefon: document.getElementById('telefon').value.trim(),
                epost: document.getElementById('epost').value.trim(),
                stad: document.getElementById('stad').value.trim(),
                prosjekttype: document.getElementById('prosjekttype').value,
                beskriving: document.getElementById('beskriving').value.trim(),
                befaring: document.getElementById('befaring').checked
            };

            // Basic validation
            if (!formData.namn || !formData.telefon || !formData.epost || !formData.beskriving) {
                showFormError('Fyll ut alle obligatoriske felt.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.epost)) {
                showFormError('Skriv inn ei gyldig e-postadresse.');
                return;
            }

            // Phone validation (Norwegian format)
            const phoneRegex = /^(\+47)?[\s]?[0-9]{8}$/;
            const cleanPhone = formData.telefon.replace(/\s/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                showFormError('Skriv inn eit gyldig telefonnummer (8 siffer).');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sender...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            // In production, this would send to Resend API or similar
            setTimeout(function() {
                // For demo purposes, always show success
                // In production, handle actual API response
                showFormSuccess();
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Log form data for debugging (remove in production)
                console.log('Form submitted:', formData);

                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1000);

            /*
            // Production example with Resend API:
            fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                showFormSuccess();
                contactForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                showFormError('Noko gjekk gale. Prøv igjen eller ring oss direkte.');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
            */
        });
    }

    function showFormSuccess() {
        if (formSuccess) {
            formSuccess.style.display = 'block';
        }
        if (formError) {
            formError.style.display = 'none';
        }
    }

    function showFormError(message) {
        if (formError) {
            formError.innerHTML = '<strong>Feil:</strong><br>' + message;
            formError.style.display = 'block';
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (formSuccess) {
            formSuccess.style.display = 'none';
        }
    }

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add shadow on scroll
            if (scrollTop > 10) {
                header.style.boxShadow = '0 2px 10px rgba(61, 50, 41, 0.1)';
            } else {
                header.style.boxShadow = '0 1px 3px rgba(61, 50, 41, 0.1)';
            }

            lastScrollTop = scrollTop;
        }, { passive: true });
    }

    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should fade in
    document.querySelectorAll('.service-card, .benefit-item, .value-card, .coverage-card').forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeInObserver.observe(el);
    });

    // Add CSS for visible state
    const style = document.createElement('style');
    style.textContent = `
        .is-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // CLICK TO CALL TRACKING (optional)
    // ============================================
    document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            // Track phone click event (integrate with analytics)
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    event_category: 'Contact',
                    event_label: 'Phone Call'
                });
            }
            console.log('Phone link clicked');
        });
    });

    // ============================================
    // EMAIL LINK TRACKING (optional)
    // ============================================
    document.querySelectorAll('a[href^="mailto:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            // Track email click event (integrate with analytics)
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    event_category: 'Contact',
                    event_label: 'Email'
                });
            }
            console.log('Email link clicked');
        });
    });

    // ============================================
    // LAZY LOADING FOR IMAGES
    // ============================================
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        document.querySelectorAll('img[data-src]').forEach(function(img) {
            img.src = img.dataset.src;
            img.loading = 'lazy';
        });
    } else {
        // Fallback for older browsers
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // CURRENT YEAR IN FOOTER
    // ============================================
    const yearElements = document.querySelectorAll('[data-year]');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(function(el) {
        el.textContent = currentYear;
    });

    // ============================================
    // CONSOLE MESSAGE
    // ============================================
    console.log('%cHorten Vøling', 'color: #1A4D2E; font-size: 24px; font-weight: bold;');
    console.log('%cTradisjonelt handverk i Lom', 'color: #C4A77D; font-size: 14px;');
    console.log('Nettsida er laga for Horten Vøling - Snekkar i Ottadalen');

})();
