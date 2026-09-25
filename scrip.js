/* Sitio estático: menú, catálogo, contacto y animaciones independientes. */
(() => {
    'use strict';
    const config = {
        whatsappNumber: '541100000000', // Placeholder: reemplazar antes de publicar.
        whatsappMessage: 'Hola Iron House, quiero información sobre los planes.',
        instagramUrl: '#'
    };

    function initMobileMenu() {
        const button = document.querySelector('.menu-button');
        const nav = document.querySelector('#main-nav');
        const overlay = document.querySelector('.menu-overlay');
        const mobile = window.matchMedia('(max-width: 900px)');
        if (!button || !nav || !overlay) return;
        const background = document.querySelectorAll('main, .footer, .whatsapp-float, .header .logo, .skip-link');
        const links = [...nav.querySelectorAll('a')];
        function setOpen(open, restoreFocus = false) {
            open = open && mobile.matches;
            nav.classList.toggle('is-open', open);
            document.body.classList.toggle('menu-open', open);
            nav.inert = mobile.matches && !open;
            background.forEach(element => { element.inert = open; });
            button.setAttribute('aria-expanded', String(open));
            button.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
            button.textContent = open ? '✕' : '☰';
            if (restoreFocus) button.focus();
        }
        button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
        overlay.addEventListener('click', () => setOpen(false, true));
        links.forEach(link => link.addEventListener('click', () => {
            setOpen(false);
            const section = document.querySelector(link.getAttribute('href'));
            if (section) {
                section.setAttribute('tabindex', '-1');
                section.focus({ preventScroll: true });
            }
        }));
        document.addEventListener('keydown', event => {
            if (button.getAttribute('aria-expanded') !== 'true') return;
            if (event.key === 'Escape') {
                setOpen(false, true);
            } else if (event.key === 'Tab') {
                const focusable = [...links, button];
                const index = focusable.indexOf(document.activeElement);
                event.preventDefault();
                const next = (index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
                focusable[next].focus();
            }
        });
        mobile.addEventListener('change', () => setOpen(false));
        setOpen(false);
    }

    function initPlans() {
        const plans = window.IronHousePlans;
        if (!plans) return;
        document.querySelectorAll('.plan-card[data-plan]').forEach(card => {
            const plan = plans[card.dataset.plan];
            if (!plan) return;
            card.querySelector('h3').textContent = plan.name;
            const price = card.querySelector('.price');
            const period = document.createElement('span');
            period.textContent = `ARS / ${plan.period}`;
            price.replaceChildren(`$${plan.price.toLocaleString('es-AR')} `, period);
            card.querySelector('.plan-description').textContent = plan.description;
            card.querySelector('.benefits').replaceChildren(...plan.benefits.map(text => {
                const item = document.createElement('li');
                item.textContent = text;
                return item;
            }));
        });
    }

    function initContact() {
        const url = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappMessage)}`;
        document.querySelectorAll('[data-whatsapp]').forEach(link => { link.href = url; });
        document.querySelectorAll('[data-instagram]').forEach(link => {
            link.href = config.instagramUrl;
            link.addEventListener('click', event => {
                if (config.instagramUrl !== '#') return;
                event.preventDefault();
                const message = 'Instagram estará disponible próximamente. Este sitio es un proyecto demo.';
                const feedback = link.closest('.footer')
                    ? document.querySelector('#social-feedback')
                    : document.querySelector('#contact-feedback');
                if (feedback) feedback.textContent = message;
            });
        });
    }

    function initScrollAnimations() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
        const sections = document.querySelectorAll('main > section:not(.hero)');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0, rootMargin: '0px 0px -35px 0px' });
        sections.forEach(section => {
            if (section.getBoundingClientRect().top < window.innerHeight) return;
            section.classList.add('reveal');
            observer.observe(section);
        });
        reducedMotion.addEventListener('change', event => {
            if (event.matches) {
                observer.disconnect();
                sections.forEach(section => section.classList.add('is-visible'));
            }
        });
    }

    initMobileMenu();
    initPlans();
    initContact();
    initScrollAnimations();
})();
