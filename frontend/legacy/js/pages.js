/**
 * ============================================
 * PAGES MODULE - Page Renderers
 * ========================================
 * Each Page uses specific Components:
 *   HomePage     → HomeBannerSlider, OfferSlider, CategorySlider, BrandSlider, CategoryBrand, ArticleCard, ProductCard, VideoCard
 *   ProductList  → CategoryCard, ProductCard
 *   ProductDetail→ ProductDetail, ProductDetailGallery, ProductAttribute, ProductCard
 *   Articles     → ArticleCard
 *   ArticleDetail→ ArticleCard, VideoCard
 *   Brands       → BrandSlider, CategoryBrand
 *   BrandDetail  → BrandSlider, ProductCard
 *   AboutUs      → VideoCard
 * ============================================
 */

const Page = {

    // ========================================
    // HOME PAGE
    // Components: HomeBannerSlider, OfferSlider, CategorySlider,
    //             BrandSlider, CategoryBrand, ArticleCard, ProductCard, VideoCard
    // ========================================
    HomePage() {
        const offers = DataService.getOffers();
        const newArrivals = DataService.getNewArrivals();
        const articles = DataService.articles.slice(0, 4);
        const videos = DataService.videos.slice(0, 4);

        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
            <!-- HomeBannerSlider -->
            ${Component.HomeBannerSlider(DataService.banners)}

            <!-- CategorySlider -->
            ${Component.CategorySlider(DataService.categories)}

            <!-- OfferSlider -->
            ${Component.OfferSlider(offers)}

            <!-- New Arrivals (ProductCard grid) -->
            <section data-animate>
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-2xl md:text-3xl font-bold section-title">New Arrivals</h2>
                        <p class="text-gray-500 mt-2">The latest additions to our collection</p>
                    </div>
                    <a href="#/products" class="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 transition">View All <i data-lucide="arrow-right" class="w-4 h-4"></i></a>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    ${newArrivals.map(p => Component.ProductCard(p)).join('')}
                </div>
            </section>

            <!-- BrandSlider -->
            ${Component.BrandSlider(DataService.brands)}

            <!-- CategoryBrand -->
            ${Component.CategoryBrand(DataService.categories, DataService.brands)}

            <!-- Articles (ArticleCard) -->
            <section data-animate>
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-2xl md:text-3xl font-bold section-title">Latest Articles</h2>
                        <p class="text-gray-500 mt-2">Tips, guides, and inspiration</p>
                    </div>
                    <a href="#/articles" class="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 transition">View All <i data-lucide="arrow-right" class="w-4 h-4"></i></a>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    ${articles.map(a => Component.ArticleCard(a)).join('')}
                </div>
            </section>

            <!-- Videos (VideoCard) -->
            <section data-animate>
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-2xl md:text-3xl font-bold section-title">Video Content</h2>
                        <p class="text-gray-500 mt-2">Watch and learn from our experts</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${videos.map(v => Component.VideoCard(v)).join('')}
                </div>
            </section>

            <!-- Newsletter -->
            <section data-animate class="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 md:p-12 text-center text-white">
                <h2 class="text-2xl md:text-3xl font-bold mb-3">Stay in the Loop</h2>
                <p class="text-white/80 mb-6 max-w-md mx-auto">Get the latest updates on new products, exclusive offers, and insider tips.</p>
                <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input type="email" placeholder="Enter your email" class="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 outline-none focus:bg-white/30 transition">
                    <button class="px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition">Subscribe</button>
                </div>
            </section>
        </div>`;
    },

    // ========================================
    // PRODUCT LIST PAGE
    // Components: CategoryCard, ProductCard
    // ========================================
    ProductListPage(params = {}) {
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
        const category = urlParams.get('category') || '';
        const search = urlParams.get('search') || '';
        let products = category ? DataService.getProductsByCategory(category) : [...DataService.products];
        if (search) products = DataService.searchProducts(search);

        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <!-- Breadcrumb -->
            <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <a href="#/" class="hover:text-primary-500 transition">Home</a>
                <i data-lucide="chevron-right" class="w-4 h-4"></i>
                <span class="text-gray-800 font-medium">${category || 'All Products'}</span>
            </nav>

            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar: CategoryCard list -->
                <aside class="w-full lg:w-64 flex-shrink-0">
                    <div class="bg-white rounded-xl border border-gray-100 p-4 sticky top-24">
                        <h3 class="font-bold text-sm mb-4 flex items-center gap-2"><i data-lucide="filter" class="w-4 h-4"></i> Categories</h3>
                        <div class="space-y-2">
                            <a href="#/products" class="block px-3 py-2 rounded-lg text-sm ${!category ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'} transition">All Products</a>
                            ${DataService.categories.map(c => `
                                <a href="#/products?category=${encodeURIComponent(c.name)}" class="block px-3 py-2 rounded-lg text-sm ${category === c.name ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'} transition">${c.name} <span class="text-gray-400">(${c.productCount})</span></a>
                            `).join('')}
                        </div>
                    </div>
                </aside>

                <!-- Products Grid -->
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-6">
                        <p class="text-sm text-gray-500">${products.length} products found</p>
                        <select class="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-200 outline-none">
                            <option>Sort by: Newest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Most Popular</option>
                        </select>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        ${products.map(p => `<div data-animate>${Component.ProductCard(p)}</div>`).join('')}
                    </div>
                </div>
            </div>
        </div>`;
    },

    // ========================================
    // PRODUCT DETAIL PAGE
    // Components: ProductDetail, ProductDetailGallery, ProductAttribute, ProductCard
    // ========================================
    ProductDetailPage(params) {
        const product = DataService.getProduct(params.id);
        if (!product) return '<div class="text-center py-20"><h2 class="text-2xl font-bold">Product not found</h2></div>';
        const related = DataService.getRelatedProducts(product.id);

        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <!-- Breadcrumb -->
            <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <a href="#/" class="hover:text-primary-500 transition">Home</a><i data-lucide="chevron-right" class="w-4 h-4"></i>
                <a href="#/products" class="hover:text-primary-500 transition">Products</a><i data-lucide="chevron-right" class="w-4 h-4"></i>
                <span class="text-gray-800 font-medium truncate">${product.name}</span>
            </nav>

            <!-- ProductDetail (includes ProductDetailGallery + ProductAttribute) -->
            ${Component.ProductDetail(product)}

            <!-- Related Products (ProductCard) -->
            ${related.length ? `
            <section class="mt-16 pt-8 border-t border-gray-100">
                <h2 class="text-2xl font-bold mb-6 section-title">You Might Also Like</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${related.map(p => `<div data-animate>${Component.ProductCard(p)}</div>`).join('')}
                </div>
            </section>` : ''}
        </div>`;
    },

    // ========================================
    // ARTICLES PAGE
    // Components: ArticleCard
    // ========================================
    ArticlesPage() {
        const articles = DataService.articles;
        const featured = articles[0];
        const rest = articles.slice(1);

        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <a href="#/" class="hover:text-primary-500 transition">Home</a><i data-lucide="chevron-right" class="w-4 h-4"></i>
                <span class="text-gray-800 font-medium">Articles</span>
            </nav>

            <h1 class="text-3xl md:text-4xl font-bold mb-8">Articles & Guides</h1>

            <!-- Featured Article -->
            <div class="mb-8" data-animate>
                ${Component.ArticleCard(featured, 'featured')}
            </div>

            <!-- Article Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${rest.map(a => `<div data-animate>${Component.ArticleCard(a)}</div>`).join('')}
            </div>
        </div>`;
    },

    // ========================================
    // ARTICLE DETAIL PAGE
    // Components: ArticleCard, VideoCard
    // ========================================
    ArticleDetailPage(params) {
        const article = DataService.getArticle(params.id);
        if (!article) return '<div class="text-center py-20"><h2 class="text-2xl font-bold">Article not found</h2></div>';
        const related = DataService.articles.filter(a => a.id !== article.id).slice(0, 3);

        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <a href="#/" class="hover:text-primary-500 transition">Home</a><i data-lucide="chevron-right" class="w-4 h-4"></i>
                <a href="#/articles" class="hover:text-primary-500 transition">Articles</a><i data-lucide="chevron-right" class="w-4 h-4"></i>
                <span class="text-gray-800 font-medium truncate">${article.title}</span>
            </nav>

            <article class="max-w-3xl mx-auto">
                <img src="${article.image}" alt="${article.title}" class="w-full h-64 md:h-96 object-cover rounded-2xl mb-8">
                <div class="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <span class="px-3 py-1 bg-primary-50 text-primary-600 rounded-full font-medium">${article.category}</span>
                    <span class="flex items-center gap-1"><i data-lucide="user" class="w-4 h-4"></i> ${article.author}</span>
                    <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-4 h-4"></i> ${article.date}</span>
                    <span class="flex items-center gap-1"><i data-lucide="clock" class="w-4 h-4"></i> ${article.readTime}</span>
                </div>
                <h1 class="text-3xl md:text-4xl font-bold mb-6">${article.title}</h1>
                <p class="text-gray-500 text-lg mb-8">${article.excerpt}</p>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">${article.content}</div>

                ${article.hasVideo ? `
                <div class="mt-10">
                    <h3 class="font-bold text-lg mb-4">Video</h3>
                    ${Component.VideoCard(DataService.videos[0])}
                </div>` : ''}
            </article>

            <!-- Related Articles -->
            <section class="mt-16 pt-8 border-t border-gray-100 max-w-7xl mx-auto">
                <h2 class="text-2xl font-bold mb-6 section-title">Related Articles</h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    ${related.map(a => Component.ArticleCard(a)).join('')}
                </div>
            </section>
        </div>`;
    },

    // ========================================
    // BRANDS PAGE
    // Components: BrandSlider, CategoryBrand
    // ========================================
    BrandsPage() {
        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <a href="#/" class="hover:text-primary-500 transition">Home</a><i data-lucide="chevron-right" class="w-4 h-4"></i>
                <span class="text-gray-800 font-medium">Brands</span>
            </nav>

            <h1 class="text-3xl md:text-4xl font-bold mb-8">Our Brands</h1>

            <!-- BrandSlider -->
            ${Component.BrandSlider(DataService.brands, 'All Brands')}

            <!-- CategoryBrand -->
            ${Component.CategoryBrand(DataService.categories, DataService.brands)}
        </div>`;
    },

    // ========================================
    // BRAND DETAIL PAGE
    // Components: BrandSlider, ProductCard
    // ========================================
    BrandDetailPage(params) {
        const brand = DataService.getBrand(params.id);
        if (!brand) return '<div class="text-center py-20"><h2 class="text-2xl font-bold">Brand not found</h2></div>';
        const products = DataService.getProductsByBrand(brand.id);
        const otherBrands = DataService.brands.filter(b => b.id !== brand.id);

        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <a href="#/" class="hover:text-primary-500 transition">Home</a><i data-lucide="chevron-right" class="w-4 h-4"></i>
                <a href="#/brands" class="hover:text-primary-500 transition">Brands</a><i data-lucide="chevron-right" class="w-4 h-4"></i>
                <span class="text-gray-800 font-medium">${brand.name}</span>
            </nav>

            <!-- Brand Hero -->
            <div class="relative rounded-2xl overflow-hidden mb-8 h-48 md:h-64">
                <img src="${brand.image}" alt="${brand.name}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                <div class="absolute inset-0 flex items-center px-8 md:px-12">
                    <div class="flex items-center gap-4">
                        <img src="${brand.logo}" alt="${brand.name}" class="w-20 h-20 rounded-full border-4 border-white shadow-lg">
                        <div class="text-white">
                            <h1 class="text-3xl md:text-4xl font-bold">${brand.name}</h1>
                            <p class="text-white/80 mt-1">${brand.category} · Est. ${brand.founded} · ${brand.productCount} Products</p>
                        </div>
                    </div>
                </div>
            </div>

            <p class="text-gray-600 text-lg mb-8 max-w-2xl">${brand.description}</p>

            <!-- Products by Brand (ProductCard) -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold mb-6 section-title">${brand.name} Products</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    ${products.map(p => `<div data-animate>${Component.ProductCard(p)}</div>`).join('')}
                </div>
                ${products.length === 0 ? '<p class="text-gray-400 text-center py-12">No products available yet.</p>' : ''}
            </section>

            <!-- Other Brands (BrandSlider) -->
            ${Component.BrandSlider(otherBrands, 'Other Brands')}
        </div>`;
    },

    // ========================================
    // ABOUT US PAGE
    // Components: VideoCard
    // ========================================
    AboutUsPage() {
        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <a href="#/" class="hover:text-primary-500 transition">Home</a><i data-lucide="chevron-right" class="w-4 h-4"></i>
                <span class="text-gray-800 font-medium">About Us</span>
            </nav>

            <!-- Hero -->
            <section data-animate class="text-center py-16">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">About <span class="gradient-text">ShopHub</span></h1>
                <p class="text-gray-500 text-lg max-w-2xl mx-auto">We're on a mission to bring the best products from trusted brands directly to your doorstep, with a seamless shopping experience.</p>
            </section>

            <!-- Stats -->
            <section data-animate class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                ${[
                    { num:'10K+', label:'Happy Customers', icon:'users' },
                    { num:'500+', label:'Products', icon:'package' },
                    { num:'50+', label:'Trusted Brands', icon:'award' },
                    { num:'99%', label:'Satisfaction Rate', icon:'heart' }
                ].map(s => `
                    <div class="bg-white rounded-xl border border-gray-100 p-6 text-center card-hover">
                        <div class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3"><i data-lucide="${s.icon}" class="w-6 h-6 text-primary-500"></i></div>
                        <div class="text-2xl font-bold text-primary-600">${s.num}</div>
                        <div class="text-sm text-gray-500 mt-1">${s.label}</div>
                    </div>
                `).join('')}
            </section>

            <!-- Story -->
            <section data-animate class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <div>
                    <h2 class="text-3xl font-bold mb-4 section-title">Our Story</h2>
                    <p class="text-gray-600 leading-relaxed mb-4">Founded in 2020, ShopHub started with a simple idea: make quality products accessible to everyone. We partner directly with brands to ensure authenticity and fair pricing.</p>
                    <p class="text-gray-600 leading-relaxed">Today, we serve over 10,000 happy customers across the globe, offering a curated selection of products from more than 50 trusted brands.</p>
                </div>
                <div class="rounded-2xl overflow-hidden">
                    <img src="http://static.photos/workspace/640x360/70" alt="Our team" class="w-full h-full object-cover">
                </div>
            </section>

            <!-- Values -->
            <section data-animate class="mb-16">
                <h2 class="text-3xl font-bold mb-8 text-center section-title section-title-center">Our Values</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${[
                        { icon:'shield-check', title:'Quality First', desc:'Every product is carefully vetted before it reaches our platform.' },
                        { icon:'leaf', title:'Sustainability', desc:'We prioritize eco-friendly products and sustainable practices.' },
                        { icon:'heart', title:'Customer Love', desc:'Your satisfaction is our top priority, always.' }
                    ].map(v => `
                        <div class="bg-white rounded-xl border border-gray-100 p-8 text-center card-hover">
                            <div class="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><i data-lucide="${v.icon}" class="w-7 h-7 text-primary-500"></i></div>
                            <h3 class="font-bold text-lg mb-2">${v.title}</h3>
                            <p class="text-gray-500 text-sm">${v.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </section>

            <!-- Videos (VideoCard) -->
            <section data-animate class="mb-12">
                <h2 class="text-3xl font-bold mb-6 section-title section-title-center">See Us in Action</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${DataService.videos.map(v => Component.VideoCard(v)).join('')}
                </div>
            </section>

            <!-- Team -->
            <section data-animate class="mb-12">
                <h2 class="text-3xl font-bold mb-8 text-center section-title section-title-center">Meet the Team</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                    ${[
                        { name:'Sarah Chen', role:'CEO & Founder', img:'http://static.photos/people/200x200/80' },
                        { name:'Alex Rivera', role:'Head of Design', img:'http://static.photos/people/200x200/81' },
                        { name:'Emma Wilson', role:'Marketing Lead', img:'http://static.photos/people/200x200/82' },
                        { name:'James Park', role:'Tech Lead', img:'http://static.photos/people/200x200/83' },
                    ].map(t => `
                        <div class="text-center card-hover">
                            <img src="${t.img}" alt="${t.name}" class="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-white shadow-lg">
                            <h4 class="font-bold text-sm">${t.name}</h4>
                            <p class="text-xs text-gray-400">${t.role}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
        </div>`;
    },

    // ========================================
    // 404 PAGE
    // ========================================
    NotFoundPage() {
        return `
        <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div class="text-8xl font-bold text-primary-100 mb-4">404</div>
            <h1 class="text-3xl font-bold mb-3">Page Not Found</h1>
            <p class="text-gray-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
            <a href="#/" class="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition flex items-center gap-2"><i data-lucide="home" class="w-4 h-4"></i> Back to Home</a>
        </div>`;
    }
};