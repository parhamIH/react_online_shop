/**
 * ============================================
 * LAYOUT MODULE - Header, Footer, Navigation
 * Layout Components used across all pages
 * ============================================
 */

const LayoutComponent = {
    mobileMenuOpen: false,

    // ========================================
    // HEADER (Part of MainLayout)
    // ========================================
    Header() {
        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Left: Mobile Menu + Logo -->
                <div class="flex items-center gap-4">
                    <button onclick="LayoutComponent.toggleMobileMenu()" class="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition">
                        <i data-lucide="menu" class="w-5 h-5"></i>
                    </button>
                    <a href="#/" class="flex items-center gap-2">
                        <span class="text-2xl">🛍️</span>
                        <span class="text-xl font-bold text-primary-600 hidden sm:inline">ShopHub</span>
                    </a>
                </div>

                <!-- Center: Desktop Nav -->
                <nav class="hidden lg:flex items-center gap-1">
                    ${[
                        { label:'Home', href:'#/' },
                        { label:'Products', href:'#/products' },
                        { label:'Brands', href:'#/brands' },
                        { label:'Articles', href:'#/articles' },
                        { label:'About', href:'#/about' },
                    ].map(l => `
                        <a href="${l.href}" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" data-nav-link>${l.label}</a>
                    `).join('')}
                </nav>

                <!-- Right: Search + Cart -->
                <div class="flex items-center gap-3">
                    <div class="hidden md:block w-64">${Component.SearchBar()}</div>
                    <button onclick="CartHook.toggle()" class="relative p-2 hover:bg-gray-100 rounded-lg transition">
                        <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                        <span id="cart-count" class="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ${CartHook.getCount() > 0 ? '' : 'hidden'}">${CartHook.getCount()}</span>
                    </button>
                    <button class="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition">
                        <i data-lucide="user" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>

            <!-- Mobile Search -->
            <div class="md:hidden pb-3">${Component.SearchBar()}</div>
        </div>`;
    },

    // ========================================
    // FOOTER (Part of MainLayout)
    // ========================================
    Footer() {
        return `
        <footer class="bg-gray-900 text-white mt-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    <!-- Brand -->
                    <div>
                        <div class="flex items-center gap-2 mb-4">
                            <span class="text-2xl">🛍️</span>
                            <span class="text-xl font-bold">ShopHub</span>
                        </div>
                        <p class="text-gray-400 text-sm leading-relaxed">Your one-stop destination for premium products from trusted brands worldwide.</p>
                        <div class="flex gap-3 mt-4">
                            ${['facebook','twitter','instagram','youtube'].map(s => `
                                <a href="#" class="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition"><i data-lucide="${s}" class="w-4 h-4"></i></a>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Quick Links -->
                    <div>
                        <h3 class="font-bold mb-4">Quick Links</h3>
                        <ul class="space-y-2 text-gray-400 text-sm">
                            ${[['Home','#/'],['Products','#/products'],['Brands','#/brands'],['Articles','#/articles'],['About Us','#/about']].map(([label, href]) => `
                                <li><a href="${href}" class="hover:text-primary-400 transition">${label}</a></li>
                            `).join('')}
                        </ul>
                    </div>

                    <!-- Categories -->
                    <div>
                        <h3 class="font-bold mb-4">Categories</h3>
                        <ul class="space-y-2 text-gray-400 text-sm">
                            ${DataService.categories.map(c => `
                                <li><a href="#/products?category=${encodeURIComponent(c.name)}" class="hover:text-primary-400 transition">${c.name}</a></li>
                            `).join('')}
                        </ul>
                    </div>

                    <!-- Contact -->
                    <div>
                        <h3 class="font-bold mb-4">Contact Us</h3>
                        <ul class="space-y-3 text-gray-400 text-sm">
                            <li class="flex items-center gap-2"><i data-lucide="mail" class="w-4 h-4 text-primary-400"></i> hello@shophub.com</li>
                            <li class="flex items-center gap-2"><i data-lucide="phone" class="w-4 h-4 text-primary-400"></i> +1 (555) 123-4567</li>
                            <li class="flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4 text-primary-400"></i> 123 Main St, New York</li>
                        </ul>
                    </div>
                </div>

                <div class="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
                    <p>© 2025 ShopHub. All rights reserved.</p>
                    <div class="flex gap-4 mt-3 sm:mt-0">
                        <a href="#" class="hover:text-primary-400 transition">Privacy</a>
                        <a href="#" class="hover:text-primary-400 transition">Terms</a>
                        <a href="#" class="hover:text-primary-400 transition">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>`;
    },

    // ========================================
    // MOBILE NAVIGATION
    // ========================================
    MobileNav() {
        const links = [
            { label:'Home', href:'#/', icon:'home' },
            { label:'Products', href:'#/products', icon:'package' },
            { label:'Brands', href:'#/brands', icon:'award' },
            { label:'Articles', href:'#/articles', icon:'file-text' },
            { label:'About Us', href:'#/about', icon:'info' },
        ];

        // Category section
        const categoryLinks = DataService.categories.map(c => `
            <a href="#/products?category=${encodeURIComponent(c.name)}" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition text-sm">
                <i data-lucide="${c.icon}" class="w-4 h-4"></i> ${c.name}
            </a>
        `).join('');

        return `
            <div class="space-y-1">
                ${links.map(l => `
                    <a href="${l.href}" onclick="LayoutComponent.toggleMobileMenu()" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition font-medium">
                        <i data-lucide="${l.icon}" class="w-5 h-5"></i> ${l.label}
                    </a>
                `).join('')}
            </div>
            <div class="mt-6 pt-4 border-t border-gray-100">
                <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
                <div class="space-y-0.5">${categoryLinks}</div>
            </div>
        `;
    },

    // ========================================
    // MOBILE MENU TOGGLE
    // ========================================
    toggleMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');
        this.mobileMenuOpen = !this.mobileMenuOpen;

        if (this.mobileMenuOpen) {
            overlay.classList.remove('hidden');
            requestAnimationFrame(() => {
                overlay.classList.remove('opacity-0');
                menu.classList.remove('-translate-x-full');
            });
        } else {
            overlay.classList.add('opacity-0');
            menu.classList.add('-translate-x-full');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        }
    },

    // ========================================
    // RENDER LAYOUT
    // ========================================
    render() {
        document.getElementById('app-header').innerHTML = this.Header();
        document.getElementById('app-footer').innerHTML = this.Footer();
        document.getElementById('mobile-nav').innerHTML = this.MobileNav();
        lucide.createIcons();
    }
};