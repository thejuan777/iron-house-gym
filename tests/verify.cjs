const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

// Minimal DOM doubles test application behavior without a browser or network.
class Element {
    constructor() {
        this.hidden = true; this.disabled = true; this.value = ''; this.textContent = '';
        this.attrs = {}; this.handlers = {}; this.children = []; this.dataset = {};
        const classes = new Set();
        this.classList = {
            toggle: (name, on) => on ? classes.add(name) : classes.delete(name),
            contains: name => classes.has(name), add: name => classes.add(name)
        };
    }
    setAttribute(k, v) { this.attrs[k] = v; }
    getAttribute(k) { return this.attrs[k]; }
    addEventListener(k, fn) { this.handlers[k] = fn; }
    replaceChildren(...children) { this.children = children; }
    focus() { this.owner.activeElement = this; }
    fire(type, extra = {}) {
        const event = { prevented: false, preventDefault() { this.prevented = true; }, ...extra };
        this.handlers[type]?.(event); return event;
    }
}
function makeDocument() {
    const elements = new Map();
    const doc = new Element();
    doc.createElement = () => { const e = new Element(); e.owner = doc; return e; };
    doc.querySelector = selector => {
        if (!elements.has(selector)) elements.set(selector, doc.createElement());
        return elements.get(selector);
    };
    doc.querySelectorAll = () => [];
    doc.body = doc.createElement();
    return doc;
}
function checkout(query) {
    const document = makeDocument();
    const context = vm.createContext({ window: { location: { search: query } }, document, URLSearchParams });
    vm.runInContext(read('plans.js'), context);
    vm.runInContext(read('checkout.js'), context);
    return { document, get: selector => document.querySelector(selector), plans: context.window.IronHousePlans };
}
for (const key of ['dia', '3-veces', 'libre']) {
    const { get, plans } = checkout(`?plan=${key}`);
    assert.equal(get('#checkout-plan-name').textContent, plans[key].name);
    assert.equal(get('#checkout-content').hidden, false);
    assert.equal(get('#checkout-fields').disabled, false);
    assert.equal(get('#checkout-benefits').children.length, 4);
    assert.equal(get('#checkout-price').children[0], `$${plans[key].price.toLocaleString('es-AR')} `);
}
for (const query of ['', '?plan=', '?plan=no-existe', '?plan=__proto__', '?plan=constructor', '?plan=%3Cscript%3E']) {
    const { get } = checkout(query);
    assert.equal(get('#plan-error').hidden, false);
    assert.equal(get('#checkout-content').hidden, true);
    assert.equal(get('#checkout-fields').disabled, true);
}
const { document, get } = checkout('?plan=dia');
const form = get('#checkout-form');
assert.equal(form.fire('submit').prevented, true);
assert.equal(get('#checkout-feedback').hidden, true);
assert.equal(document.activeElement, get('#customer-name'));
get('#customer-name').value = '   ';
form.fire('submit');
assert.equal(get('#customer-name').attrs['aria-invalid'], 'true');
get('#customer-name').value = 'Alex Demo';
get('#customer-email').value = 'no-es-email';
get('#customer-phone').value = 'abcdefg';
form.fire('submit');
assert.equal(document.activeElement, get('#customer-email'));
get('#customer-email').value = 'alex@example.com';
get('#customer-phone').value = '123';
form.fire('submit');
assert.equal(document.activeElement, get('#customer-phone'));
get('#customer-phone').value = '+54 (11) 0000-0000';
assert.equal(form.fire('submit').prevented, true);
assert.equal(get('#checkout-feedback').hidden, false);
assert.equal(document.activeElement, get('#checkout-feedback'));
get('#customer-name').fire('input');
assert.equal(get('#checkout-feedback').hidden, true);
console.log('OK: 3 planes, 6 enlaces inválidos y validación demo sin envío.');

const doc = makeDocument();
const nav = doc.querySelector('#main-nav');
const button = doc.querySelector('.menu-button');
const overlay = doc.querySelector('.menu-overlay');
const links = ['#inicio', '#planes'].map(href => { const e = doc.createElement(); e.setAttribute('href', href); return e; });
nav.querySelectorAll = () => links;
const background = [doc.createElement(), doc.createElement()];
doc.querySelectorAll = selector => selector.startsWith('main,') ? background : [];
const mobile = { matches: true, addEventListener(type, fn) { this.change = fn; } };
const context = vm.createContext({ document: doc, window: { matchMedia: query => query.includes('900') ? mobile : { matches: true } } });
vm.runInContext(read('scrip.js'), context);
assert.equal(nav.inert, true);
button.fire('click');
assert.equal(nav.classList.contains('is-open'), true);
assert.equal(background[0].inert, true);
assert.equal(doc.body.classList.contains('menu-open'), true);
button.focus();
doc.fire('keydown', { key: 'Tab' });
assert.equal(doc.activeElement, links[0]);
doc.fire('keydown', { key: 'Escape' });
assert.equal(button.attrs['aria-expanded'], 'false');
assert.equal(doc.activeElement, button);
button.fire('click'); overlay.fire('click');
assert.equal(nav.inert, true);
button.fire('click'); links[1].fire('click');
assert.equal(button.attrs['aria-expanded'], 'false');
assert.equal(doc.activeElement, doc.querySelector('#planes'));
button.fire('click'); mobile.matches = false; mobile.change();
assert.equal(nav.inert, false);
assert.equal(background[0].inert, false);
assert.equal(doc.body.classList.contains('menu-open'), false);
console.log('OK: menú, overlay, Escape, Tab, navegación y cambio a desktop.');

for (const filename of ['index.html', 'checkout.html']) {
    const html = read(filename);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(ids.length, new Set(ids).size, `${filename}: IDs duplicados`);
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Ancla ${match[1]}`);
    const stack = [];
    const voids = new Set(['meta', 'link', 'img', 'input', 'br', 'hr']);
    for (const match of html.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<(\/?)([a-z][a-z0-9-]*)\b[^>]*>/gi)) {
        const [raw, closing, tag] = match;
        if (closing) assert.equal(stack.pop(), tag, `${filename}: cierre ${tag}`);
        else if (!voids.has(tag) && !raw.endsWith('/>')) stack.push(tag);
    }
    assert.equal(stack.length, 0, `${filename}: etiquetas sin cerrar`);
    for (const match of html.matchAll(/<(?:script|img|link)\b[^>]*(?:src|href)="([^"?#]+)[^"]*"/g)) {
        if (!match[1].startsWith('https:')) assert.ok(fs.existsSync(path.join(root, match[1])), match[1]);
    }
}
const index = read('index.html');
for (const key of ['dia', '3-veces', 'libre']) assert.ok(index.includes(`checkout.html?plan=${key}`));
assert.equal((index.match(/maps\/search/g) || []).length, 2);
assert.ok(index.includes('img/gimnasio-interior.png'));
for (const file of ['checkout.js', 'scrip.js']) assert.ok(!/\b(?:fetch|alert|localStorage|sessionStorage|XMLHttpRequest)\b/.test(read(file)));
const css = read('style.css');
assert.equal((css.match(/{/g)||[]).length, (css.match(/}/g)||[]).length);
console.log('OK: estructura HTML, recursos, anclas, Maps y ausencia de almacenamiento/red en JS.');
