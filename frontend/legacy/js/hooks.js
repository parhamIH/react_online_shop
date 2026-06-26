/**
 * ============================================
 * HOOKS MODULE - State Management & Logic
 * ============================================
 */

// -------- ROUTER HOOK --------
const RouterHook = {
    routes: {},
    currentRoute: null,

    register(path, handler) {
        this.routes[path] = handler;
    },

    navigate(path) {
        window.location.hash = path;
    },

    getCurrentPath() {
        const hash = window.location.hash.slice(1) || '/';
        return hash;
    },

    resolve() {
        const path = this.getCurrentPath();
        const parts = path.split('/').filter(Boolean);

        // Try exact match first
        if (this.routes[path]) {
            this.currentRoute = path;
            this.routes[path]({});
            return;
        }

        // Try parameterized routes
        for (const routePath of Object.keys(this.routes)) {
            const routeParts = routePath.split('/').filter(Boolean);
            if (routeParts.length !== parts.length) continue;

            let match = true;
            const params = {};

            for (let i = 0; i < routeParts.length; i++) {
                if (routeParts[i].startsWith(':')) {
                    params[routeParts[i].slice(1)] = parts[i];
                } else if (routeParts[i] !== parts[i]) {
                    match = false;
                    break;
                }
            }

            if (match) {
                this.currentRoute = routePath;
                this.routes[routePath](params);
                return;
            }
        }

        // 404
        if (this.routes['/404']) {
            this.routes['/404']({});
        }
    },

    init() {
        window.addEventListener('hashchange', () => this.resolve());
        this.resolve();
    }
};

// -------- CART HOOK --------
const CartHook = {
    items: [],
    listeners: [],

    subscribe(fn) { this.listeners.push(fn); },
    notify() { this.listeners.forEach(fn => fn(this.items)); },

    add(product, attrs = {}, qty = 1) {
        const key = `${product.id}-${JSON.stringify(attrs)}`;
        const existing = this.items.find(item => item.key === key);
        if (existing) {
            existing.qty += qty;
        } else {
            this.items.push({ key, product, attrs, qty });
        }
        this.notify();
        ToastHook.show(`${product.name} added to cart!`, 'success');
    },

    remove(key) {
        this.items = this.items.filter(item => item.key !== key);
        this.notify();
    },

    updateQty(key, qty) {
        const item = this.items.find(item => item.key === key);
        if (item) {
            item.qty = Math.max(1, qty);
            this.notify();
        }
    },

    getTotal() { return this.items.reduce((sum, item) => sum + (item.product.price * item.qty), 0); },
    getCount() { return this.items.reduce((sum, item) => sum + item.qty, 0); },

    clear() {
        this.items = [];
        this.notify();
    },

    toggle() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        const isOpen = !sidebar.classList.contains('translate-x-full');
        if (isOpen) {
            sidebar.classList.add('translate-x-full');
            overlay.classList.add('opacity-0');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        } else {
            overlay.classList.remove('hidden');
            requestAnimationFrame(() => {
                overlay.classList.remove('opacity-0');
                sidebar.classList.remove('translate-x-full');
            });
        }
    },

    renderItems() {
        const container = document.getElementById('cart-items');
        const footer = document.getElementById('cart-footer');

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-gray-400">
                    <i data-lucide="shopping-bag" class="w-16 h-16 mb-4"></i>
                    <p class="text-lg font-medium">Your cart is empty</p>
                    <p class="text-sm mt-1">Add some products to get started</p>
                </div>`;
            footer.innerHTML = '';
            lucide.createIcons();
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="flex gap-4 p-4 bg-gray-50 rounded-xl mb-3 animate-fade-in">
                <img src="${item.product.image}" alt="${item.product.name}" class="w-20 h-20 object-cover rounded-lg">
                <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-sm truncate">${item.product.name}</h4>
                    <p class="text-xs text-gray-500 mt-1">${Object.entries(item.attrs).map(([k,v])=>`${k}: ${v}`).join(' · ')}</p>
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center gap-2">
                            <button onclick="CartHook.updateQty('${item.key}', ${item.qty - 1})" class="qty-btn w-7 h-7 rounded-lg border flex items-center justify-center text-sm">−</button>
                            <span class="text-sm font-medium w-6 text-center">${item.qty}</span>
                            <button onclick="CartHook.updateQty('${item.key}', ${item.qty + 1})" class="qty-btn w-7 h-7 rounded-lg border flex items-center justify-center text-sm">+</button>
                        </div>
                        <span class="font-semibold text-primary-600">$${(item.product.price * item.qty).toFixed(2)}</span>
                    </div>
                </div>
                <button onclick="CartHook.remove('${item.key}')" class="text-gray-400 hover:text-red-500 transition p-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </div>
        `).join('');

        footer.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <span class="text-gray-600">Total</span>
                <span class="text-2xl font-bold text-primary-600">$${this.getTotal().toFixed(2)}</span>
            </div>
            <button class="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition">Checkout</button>
            <button onclick="CartHook.clear()" class="w-full py-2 mt-2 text-gray-500 text-sm hover:text-red-500 transition">Clear Cart</button>
        `;
        lucide.createIcons();
    }
};

// -------- TOAST HOOK --------
const ToastHook = {
    show(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const colors = { success:'bg-emerald-500', error:'bg-red-500', info:'bg-primary-500', warning:'bg-amber-500' };
        const icons = { success:'check-circle', error:'alert-circle', info:'info', warning:'alert-triangle' };

        const toast = document.createElement('div');
        toast.className = `toast-enter flex items-center gap-3 px-5 py-3 ${colors[type]} text-white rounded-xl shadow-lg`;
        toast.innerHTML = `<i data-lucide="${icons[type]}" class="w-5 h-5"></i><span class="text-sm font-medium">${message}</span>`;
        container.appendChild(toast);
        lucide.createIcons();

        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 200);
        }, 3000);
    }
};

// -------- SLIDER HOOK --------
const SliderHook = {
    instances: {},

    create(id, options = {}) {
        const { autoplay = true, interval = 4000, infinite = true } = options;
        this.instances[id] = { current: 0, autoplay, interval, infinite, timer: null, total: 0 };
        if (autoplay) this.startAutoplay(id);
    },

    goTo(id, index) {
        const instance = this.instances[id];
        if (!instance) return;
        const track = document.querySelector(`[data-slider="${id}"] .slider-track`);
        if (!track) return;
        instance.total = instance.total || track.children.length;
        instance.current = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        this.updateDots(id, index);
    },

    next(id) {
        const inst = this.instances[id];
        if (!inst) return;
        const total = document.querySelector(`[data-slider="${id}"] .slider-track`)?.children.length || 0;
        const next = inst.current + 1 >= total ? (inst.infinite ? 0 : inst.current) : inst.current + 1;
        this.goTo(id, next);
    },

    prev(id) {
        const inst = this.instances[id];
        if (!inst) return;
        const total = document.querySelector(`[data-slider="${id}"] .slider-track`)?.children.length || 0;
        const prev = inst.current - 1 < 0 ? (inst.infinite ? total - 1 : 0) : inst.current - 1;
        this.goTo(id, prev);
    },

    updateDots(id, index) {
        const dots = document.querySelectorAll(`[data-slider="${id}"] .slider-dot`);
        dots.forEach((dot, i) => {
            dot.classList.toggle('bg-primary-500', i === index);
            dot.classList.toggle('scale-125', i === index);
            dot.classList.toggle('bg-gray-300', i !== index);
        });
    },

    startAutoplay(id) {
        const inst = this.instances[id];
        if (!inst || !inst.autoplay) return;
        inst.timer = setInterval(() => this.next(id), inst.interval);
    },

    stopAutoplay(id) {
        const inst = this.instances[id];
        if (inst?.timer) clearInterval(inst.timer);
    },

    destroy(id) {
        this.stopAutoplay(id);
        delete this.instances[id];
    }
};

// -------- SCROLL ANIMATION HOOK --------
const ScrollHook = {
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('[data-animate]').forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }
};