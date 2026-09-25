/* Checkout de portfolio. No transmite ni persiste datos y no procesa pagos. */
(() => {
    'use strict';
    const plans = window.IronHousePlans;
    const key = new URLSearchParams(window.location.search).get('plan');
    const plan = plans && Object.prototype.hasOwnProperty.call(plans, key) ? plans[key] : null;
    if (!plan) {
        document.querySelector('#plan-error').hidden = false;
        return;
    }

    document.querySelector('#checkout-plan-name').textContent = plan.name;
    const period = document.createElement('span');
    period.textContent = `ARS / ${plan.period}`;
    document.querySelector('#checkout-price').replaceChildren(`$${plan.price.toLocaleString('es-AR')} `, period);
    document.querySelector('#checkout-frequency').textContent = plan.frequency;
    document.querySelector('#checkout-benefits').replaceChildren(...plan.benefits.map(text => {
        const item = document.createElement('li');
        item.textContent = text;
        return item;
    }));
    document.querySelector('#checkout-content').hidden = false;
    document.title = `${plan.name} | Iron House`;

    const form = document.querySelector('#checkout-form');
    const feedback = document.querySelector('#checkout-feedback');
    const fields = [
        { input: document.querySelector('#customer-name'), error: document.querySelector('#name-error'), validate: value => value.trim().length > 0, message: 'Ingresá un nombre de prueba.' },
        { input: document.querySelector('#customer-email'), error: document.querySelector('#email-error'), validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()), message: 'Ingresá un email válido, por ejemplo alex@example.com.' },
        { input: document.querySelector('#customer-phone'), error: document.querySelector('#phone-error'), validate: value => /^[+\d\s()-]+$/.test(value) && /^\d{7,15}$/.test(value.replace(/\D/g, '')), message: 'Ingresá un teléfono de prueba de 7 a 15 dígitos.' }
    ];
    function validateField(field) {
        const valid = field.validate(field.input.value);
        field.input.setAttribute('aria-invalid', String(!valid));
        field.error.textContent = valid ? '' : field.message;
        return valid;
    }
    fields.forEach(field => field.input.addEventListener('input', () => {
        feedback.hidden = true;
        if (field.input.getAttribute('aria-invalid') === 'true') validateField(field);
    }));
    form.addEventListener('submit', event => {
        event.preventDefault();
        feedback.hidden = true;
        const invalid = fields.filter(field => !validateField(field));
        if (invalid.length) {
            invalid[0].input.focus();
            return;
        }
        feedback.hidden = false;
        feedback.focus();
    });
    // Enable only after the submit handler exists; no accidental native submission.
    form.noValidate = true;
    document.querySelector('#checkout-fields').disabled = false;
})();
