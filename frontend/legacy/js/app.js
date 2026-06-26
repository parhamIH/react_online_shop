/**
 * ============================================
 * APP MODULE - Main Application & Router
 * ============================================
 * Architecture Overview:
 *
 * 📁 LAYOUTS
 *   └── MainLayout (Header + Footer + MobileNav + CartSidebar)
 *
 * 📄 PAGES → COMPONENTS Mapping
 *   HomePage     → HomeBannerSlider, OfferSlider, CategorySlider, BrandSlider, CategoryBrand, ArticleCard, ProductCard, VideoCard
 *   ProductList  → CategoryCard, ProductCard
 *   ProductDetail→ ProductDetail, ProductDetailGallery, ProductAttribute, ProductCard
 *   Articles     → ArticleCard
 *   ArticleDetail→ ArticleCard, VideoCard
 *   Brands       → BrandSlider, CategoryBrand
 *   BrandDetail  → BrandSlider, ProductCard
 *   AboutUs      → VideoCard
 *
 * 🪝 HOOKS
 *   RouterHook  → Client-side hash routing
 *   CartHook     → Cart state management (add, remove, update, toggle)
 *   SliderHook   → Slider/carousel logic (autoplay, navigation)
 *   ToastHook    → Toast notifications
 *   ScrollHook   → Scroll-based animations
 *
 * 📦 DATA SERVICE
 *   DataService  → Mock data & API layer
 * ============================================
 */

const App = {
    init() {
        // Render Layout
        LayoutComponent.render();

        // Subscribe cart updates
        CartHook.subscribe(() => {
            CartHook.renderItems();
            App.updateCartBadge();
        });

        // Register Routes
        this.registerRoutes();

        // Initialize Router
        RouterHook.init();

        // Initial cart render
        CartHook.renderItems();
    },

    registerRoutes() {
        RouterHook.register('/', () => this.renderPage(Page.HomePage()));
        RouterHook.register('/products', (params) => this.renderPage(Page.ProductListPage(params)));
        RouterHook.register('/products/:id', (params) => this.renderPage(Page.ProductDetailPage(params)));
        RouterHook.register('/articles', () => this.renderPage(Page.ArticlesPage()));
        RouterHook.register('/articles/:id', (params) => this.renderPage(Page.ArticleDetailPage(params)));
        RouterHook.register('/brands', () => this.renderPage(Page.BrandsPage()));
        RouterHook.register('/brands/:id', (params) => this.renderPage(Page.BrandDetailPage(params)));
        RouterHook.register('/about', () => this.renderPage(Page.AboutUsPage()));
        RouterHook.register('/404', () => this.renderPage(Page.NotFoundPage()));
    },

    renderPage(html) {
        const content = document.getElementById('app-content');

        // Fade out
        content.style.opacity = '0';
        content.style.transform = 'translateY(10px)';

        setTimeout(() => {
            content.innerHTML = html;
            content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'instant' });

            // Initialize icons
            lucide.createIcons();

            // Initialize sliders
            this.initSliders();

            // Initialize scroll animations
            ScrollHook.init();

            // Update active nav link
            this.updateActiveNav();

            // Setup product detail page interactions
            this.setupProductDetailInteractions();

            // Re-render layout icons
            lucide.createIcons();
        }, 150);
    },

    initSliders() {
        // Hero Banner Slider
        const heroSlider = document.querySelector('[data-slider="hero"]');
        if (heroSlider) {
            SliderHook.destroy('hero');
            SliderHook.create('hero', { autoplay: true, interval: 5000 });
        }

        // Offers Slider
        const offersSlider = document.querySelector('[data-slider="offers"]');
        if (offersSlider) {
            SliderHook.destroy('offers');
            const track = offersSlider.querySelector('.slider-track');
            if (track) {
                // Calculate items per view based on screen width
                const updateOfferSlider = () => {
                    const width = window.innerWidth;
                    const itemsPerView = width < 640 ? 1 : width < 1024 ? 2 : 3;
                    track.querySelectorAll(':scope > div').forEach(item => {
                        item.style.minWidth = `${100 / itemsPerView}%`;
                    });
                };
                updateOfferSlider();
                window.addEventListener('resize', updateOfferSlider);
            }
            SliderHook.create('offers', { autoplay: true, interval: 4000, infinite: true });
        }
    },

    updateActiveNav() {
        const currentPath = RouterHook.getCurrentPath();
        document.querySelectorAll('[data-nav-link]').forEach(link => {
            const href = link.getAttribute('href').slice(1);
            const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(href));
            link.classList.toggle('text-primary-600', isActive);
            link.classList.toggle('bg-primary-50', isActive);
            link.classList.toggle('text-gray-600', !isActive);
        });
    },

    updateCartBadge() {
        const badge = document.getElementById('cart-count');
        if (badge) {
            const count = CartHook.getCount();
            badge.textContent = count;
            badge.classList.toggle('hidden', count === 0);
        }
    },

    setupProductDetailInteractions() {
        // Quantity controls
        const qtyMinus = document.getElementById('qty-minus');
        const qtyPlus = document.getElementById('qty-plus');
        const qtyDisplay = document.getElementById('qty-display');
        const addToCartBtn = document.getElementById('add-to-cart-btn');

        if (qtyMinus && qtyPlus && qtyDisplay) {
            let qty = 1;

            qtyMinus.addEventListener('click', () => {
                qty = Math.max(1, qty - 1);
                qtyDisplay.textContent = qty;
            });

            qtyPlus.addEventListener('click', () => {
                qty = Math.min(99, qty + 1);
                qtyDisplay.textContent = qty;
            });
        }

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                // Get product ID from URL
                const match = window.location.hash.match(/#\/products\/(\d+)/);
                if (match) {
                    const product = DataService.getProduct(match[1]);
                    if (product) {
                        // Get selected attributes
                        const attrs = {};
                        document.querySelectorAll('[data-attr]').forEach(attrGroup => {
                            const key = attrGroup.dataset.attr;
                            const selected = attrGroup.querySelector('.selected');
                            if (selected) attrs[key] = selected.dataset.value;
                        });

                        const qty = parseInt(qtyDisplay?.textContent || '1');
                        CartHook.add(product, attrs, qty);
                    }
                }
            });
        }
    }
};

// 🚀 Initialize App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});