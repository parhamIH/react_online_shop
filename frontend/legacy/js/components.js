/**
 * ============================================
 * COMPONENTS MODULE - Reusable UI Components
 * ============================================
 */

const Component = {

    // ========================================
    // HomeBannerSlider Component
    // Used in: HomePage
    // ========================================
    HomeBannerSlider(banners) {
        return `
        <section data-slider="hero" class="slider-container rounded-2xl overflow-hidden relative group">
            <div class="slider-track">
                ${banners.map(b => `
                    <div class="banner-slide relative h-[300px] sm:h-[400px] md:h-[500px]">
                        <img src="${b.image}" alt="${b.title}" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                        <div class="absolute inset-0 flex items-center px-8 md:px-16">
                            <div class="max-w-lg text-white">
                                <h1 class="hero-title text-3xl md:text-5xl font-bold mb-3 leading-tight">${b.title}</h1>
                                <p class="hero-subtitle text-lg md:text-xl text-white/80 mb-6">${b.subtitle}</p>
                                <a href="${b.link}" class="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:gap-3">
                                    ${b.btn} <i data-lucide="arrow-right" class="w-4 h-4"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button onclick="SliderHook.prev('hero')" class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-white">
                <i data-lucide="chevron-left" class="w-5 h-5"></i>
            </button>
            <button onclick="SliderHook.next('hero')" class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-white">
                <i data-lucide="chevron-right" class="w-5 h-5"></i>
            </button>
            <div class="banner-dots absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                ${banners.map((_, i) => `<button onclick="SliderHook.goTo('hero', ${i})" class="slider-dot w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-primary-500 scale-125' : 'bg-white/70'} transition-all"></button>`).join('')}
            </div>
        </section>`;
    },

    // ========================================
    // OfferSlider Component
    // Used in: HomePage
    // ========================================
    OfferSlider(products) {
        return `
        <section data-animate class="mb-12">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-2xl md:text-3xl font-bold section-title">Special Offers</h2>
                    <p class="text-gray-500 mt-2">Don't miss these amazing deals</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="SliderHook.prev('offers')" class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary-50 hover:border-primary-200 transition"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                    <button onclick="SliderHook.next('offers')" class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary-50 hover:border-primary-200 transition"><i data-lucide="chevron-right" class="w-5 h-5"></i></button>
                </div>
            </div>
            <div data-slider="offers" class="slider-container">
                <div class="slider-track">
                    ${products.map((p, i) => `
                        <div class="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2 stagger-${i+1}">
                            ${this.ProductCard(p, true)}
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>`;
    },

    // ========================================
    // BrandSlider Component
    // Used in: HomePage, BrandsPage
    // ========================================
    BrandSlider(brands, title = 'Top Brands') {
        return `
        <section data-animate class="mb-12">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-2xl md:text-3xl font-bold section-title">${title}</h2>
                    <p class="text-gray-500 mt-2">Trusted by millions worldwide</p>
                </div>
                <a href="#/brands" class="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 transition">View All <i data-lucide="arrow-right" class="w-4 h-4"></i></a>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                ${brands.map(b => `
                    <a href="#/brands/${b.id}" class="card-hover flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all group">
                        <img src="${b.logo}" alt="${b.name}" class="w-16 h-16 rounded-full object-cover border-2 border-gray-100 group-hover:border-primary-200 transition">
                        <span class="font-semibold text-sm">${b.name}</span>
                        <span class="text-xs text-gray-400">${b.productCount} Products</span>
                    </a>
                `).join('')}
            </div>
        </section>`;
    },

    // ========================================
    // CategorySlider Component
    // Used in: HomePage
    // ========================================
    CategorySlider(categories) {
        return `
        <section data-animate class="mb-12">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-2xl md:text-3xl font-bold section-title">Shop by Category</h2>
                    <p class="text-gray-500 mt-2">Find exactly what you need</p>
                </div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                ${categories.map((c, i) => `
                    <a href="#/products?category=${encodeURIComponent(c.name)}" class="card-hover flex flex-col items-center gap-3 p-5 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all stagger-${i+1} group">
                        <div class="w-14 h-14 ${c.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i data-lucide="${c.icon}" class="w-7 h-7"></i>
                        </div>
                        <span class="font-semibold text-sm text-center">${c.name}</span>
                        <span class="text-xs text-gray-400">${c.productCount} items</span>
                    </a>
                `).join('')}
            </div>
        </section>`;
    },

    // ========================================
    // CategoryBrand Component
    // Used in: HomePage, BrandsPage
    // ========================================
    CategoryBrand(categories, brands) {
        return `
        <section data-animate class="mb-12">
            <div class="mb-6">
                <h2 class="text-2xl md:text-3xl font-bold section-title">Brands by Category</h2>
                <p class="text-gray-500 mt-2">Explore brands organized by their specialty</p>
            </div>
            <div class="space-y-8">
                ${categories.slice(0, 4).map(cat => {
                    const catBrands = brands.filter(b => b.category === cat.name);
                    if (catBrands.length === 0) return '';
                    return `
                    <div class="bg-white rounded-xl border border-gray-100 p-6">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 ${cat.color} rounded-lg flex items-center justify-center"><i data-lucide="${cat.icon}" class="w-5 h-5"></i></div>
                            <h3 class="font-bold text-lg">${cat.name}</h3>
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            ${catBrands.map(b => `
                                <a href="#/brands/${b.id}" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group">
                                    <img src="${b.logo}" alt="${b.name}" class="w-10 h-10 rounded-full object-cover">
                                    <div>
                                        <p class="font-medium text-sm group-hover:text-primary-600 transition">${b.name}</p>
                                        <p class="text-xs text-gray-400">${b.productCount} products</p>
                                    </div>
                                </a>
                            `).join('')}
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </section>`;
    },

    // ========================================
    // ArticleCard Component
    // Used in: HomePage, ArticlesPage, ArticleDetailPage
    // ========================================
    ArticleCard(article, size = 'normal') {
        if (size === 'featured') {
            return `
            <a href="#/articles/${article.id}" class="card-hover group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary-200 transition-all">
                <div class="relative overflow-hidden">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500">
                    <span class="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-semibold">${article.category}</span>
                </div>
                <div class="p-6">
                    <h3 class="font-bold text-xl mb-2 group-hover:text-primary-600 transition">${article.title}</h3>
                    <p class="text-gray-500 text-sm mb-4 line-clamp-2">${article.excerpt}</p>
                    <div class="flex items-center justify-between text-xs text-gray-400">
                        <span class="flex items-center gap-1"><i data-lucide="user" class="w-3.5 h-3.5"></i> ${article.author}</span>
                        <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3.5 h-3.5"></i> ${article.readTime}</span>
                    </div>
                </div>
            </a>`;
        }
        return `
        <a href="#/articles/${article.id}" class="card-hover group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary-200 transition-all">
            <div class="relative overflow-hidden">
                <img src="${article.image}" alt="${article.title}" class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500">
                <span class="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-semibold">${article.category}</span>
                ${article.hasVideo ? '<span class="absolute top-3 right-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center"><i data-lucide="play" class="w-4 h-4 text-white"></i></span>' : ''}
            </div>
            <div class="p-5">
                <h3 class="font-bold text-sm mb-2 group-hover:text-primary-600 transition line-clamp-2">${article.title}</h3>
                <p class="text-gray-400 text-xs mb-3 line-clamp-2">${article.excerpt}</p>
                <div class="flex items-center justify-between text-xs text-gray-400">
                    <span>${article.author}</span>
                    <span>${article.date}</span>
                </div>
            </div>
        </a>`;
    },

    // ========================================
    // ProductCard Component
    // Used in: HomePage, ProductListPage, BrandDetailPage, ProductDetailPage
    // ========================================
    ProductCard(product, showOffer = false) {
        const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
        return `
        <div class="card-hover bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary-200 transition-all group">
            <a href="#/products/${product.id}" class="block">
                <div class="product-img-wrapper relative">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                    <div class="absolute top-3 left-3 flex flex-col gap-1">
                        ${product.isNew ? '<span class="px-2 py-0.5 bg-primary-500 text-white text-xs font-semibold rounded-md">New</span>' : ''}
                        ${discount > 0 ? `<span class="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-md">-${discount}%</span>` : ''}
                    </div>
                </div>
            </a>
            <div class="p-4">
                <a href="#/products/${product.id}" class="block">
                    <p class="text-xs text-gray-400 mb-1">${product.brand}</p>
                    <h3 class="font-semibold text-sm mb-2 group-hover:text-primary-600 transition line-clamp-2">${product.name}</h3>
                </a>
                <div class="flex items-center gap-1 mb-2">
                    <div class="star-rating flex items-center gap-0.5">
                        ${Array(5).fill(0).map((_, i) => `<i data-lucide="star" class="w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}"></i>`).join('')}
                    </div>
                    <span class="text-xs text-gray-400">(${product.reviews})</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-primary-600">$${product.price}</span>
                        ${product.originalPrice ? `<span class="text-xs text-gray-400 line-through">$${product.originalPrice}</span>` : ''}
                    </div>
                    <button onclick="event.stopPropagation(); CartHook.add(DataService.getProduct(${product.id}))" class="w-9 h-9 rounded-lg bg-primary-50 hover:bg-primary-500 text-primary-500 hover:text-white flex items-center justify-center transition-all">
                        <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>`;
    },

    // ========================================
    // CategoryCard Component
    // Used in: ProductListPage
    // ========================================
    CategoryCard(category) {
        return `
        <a href="#/products?category=${encodeURIComponent(category.name)}" class="card-hover group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 transition-all">
            <div class="w-16 h-16 ${category.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <i data-lucide="${category.icon}" class="w-8 h-8"></i>
            </div>
            <div class="flex-1 min-w-0">
                <h3 class="font-bold text-sm group-hover:text-primary-600 transition">${category.name}</h3>
                <p class="text-xs text-gray-400 mt-1">${category.productCount} Products</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-gray-300 group-hover:text-primary-400 transition"></i>
        </a>`;
    },

    // ========================================
    // ProductDetail Component
    // Used in: ProductDetailPage
    // ========================================
    ProductDetail(product) {
        return `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <!-- Gallery -->
            ${this.ProductDetailGallery(product)}
            <!-- Info -->
            <div class="animate-slide-right">
                <div class="mb-4">
                    <a href="#/brands/${product.brandId}" class="text-sm text-primary-500 font-medium hover:text-primary-700 transition">${product.brand}</a>
                    <h1 class="text-2xl md:text-3xl font-bold mt-2">${product.name}</h1>
                </div>
                <div class="flex items-center gap-3 mb-4">
                    <div class="star-rating flex items-center gap-0.5">
                        ${Array(5).fill(0).map((_, i) => `<i data-lucide="star" class="w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}"></i>`).join('')}
                    </div>
                    <span class="text-sm text-gray-500">${product.rating} (${product.reviews} reviews)</span>
                </div>
                <div class="flex items-center gap-3 mb-6">
                    <span class="text-3xl font-bold text-primary-600">$${product.price}</span>
                    ${product.originalPrice ? `<span class="text-lg text-gray-400 line-through">$${product.originalPrice}</span><span class="px-2 py-1 bg-red-50 text-red-500 text-sm font-semibold rounded-lg">-${Math.round((1 - product.price / product.originalPrice) * 100)}%</span>` : ''}
                </div>
                <p class="text-gray-600 leading-relaxed mb-6">${product.description}</p>
                <!-- Attributes -->
                ${this.ProductAttribute(product.attributes)}
                <!-- Add to Cart -->
                <div class="flex items-center gap-4 mt-8">
                    <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button id="qty-minus" class="qty-btn px-4 py-3 text-gray-600 transition"><i data-lucide="minus" class="w-4 h-4"></i></button>
                        <span id="qty-display" class="px-4 py-3 font-semibold text-center min-w-[3rem]">1</span>
                        <button id="qty-plus" class="qty-btn px-4 py-3 text-gray-600 transition"><i data-lucide="plus" class="w-4 h-4"></i></button>
                    </div>
                    <button id="add-to-cart-btn" class="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                        <i data-lucide="shopping-cart" class="w-5 h-5"></i> Add to Cart
                    </button>
                    <button class="w-12 h-12 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition group">
                        <i data-lucide="heart" class="w-5 h-5 text-gray-400 group-hover:text-red-500 transition"></i>
                    </button>
                </div>
                <div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div class="flex items-center gap-2 text-sm text-gray-500"><i data-lucide="truck" class="w-5 h-5 text-primary-500"></i> Free Shipping</div>
                    <div class="flex items-center gap-2 text-sm text-gray-500"><i data-lucide="refresh-cw" class="w-5 h-5 text-primary-500"></i> 30-Day Returns</div>
                    <div class="flex items-center gap-2 text-sm text-gray-500"><i data-lucide="shield-check" class="w-5 h-5 text-primary-500"></i> 2-Year Warranty</div>
                </div>
            </div>
        </div>`;
    },

    // ========================================
    // ProductDetailGallery Component
    // Used in: ProductDetailPage
    // ========================================
    ProductDetailGallery(product) {
        return `
        <div class="animate-slide-left">
            <div class="relative rounded-2xl overflow-hidden bg-gray-100 mb-4">
                <img id="gallery-main" src="${product.images[0]}" alt="${product.name}" class="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover transition-all duration-300">
                ${product.videoUrl ? `<button class="play-btn absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg"><i data-lucide="play" class="w-4 h-4 text-primary-600 ml-0.5"></i></button>` : ''}
            </div>
            <div class="flex gap-3 overflow-x-auto pb-2">
                ${product.images.map((img, i) => `
                    <button onclick="document.getElementById('gallery-main').src='${img}'; document.querySelectorAll('.gallery-thumb').forEach(t=>t.classList.remove('active')); this.classList.add('active');" class="gallery-thumb flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden ${i === 0 ? 'active' : ''}">
                        <img src="${img}" alt="" class="w-full h-full object-cover">
                    </button>
                `).join('')}
            </div>
        </div>`;
    },

    // ========================================
    // ProductAttribute Component
    // Used in: ProductDetailPage
    // ========================================
    ProductAttribute(attributes) {
        if (!attributes) return '';
        return `
        <div class="space-y-4">
            ${Object.entries(attributes).map(([key, values]) => `
                <div>
                    <h4 class="font-semibold text-sm text-gray-700 mb-2">${key}</h4>
                    <div class="flex flex-wrap gap-2" data-attr="${key}">
                        ${values.map((v, i) => `
                            <button onclick="Component.selectAttr(this, '${key}')" class="attr-option px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:border-primary-300 ${i === 0 ? 'selected' : ''}" data-value="${v}">${v}</button>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>`;
    },

    selectAttr(el, attrKey) {
        el.closest(`[data-attr="${attrKey}"]`).querySelectorAll('.attr-option').forEach(btn => btn.classList.remove('selected'));
        el.classList.add('selected');
    },

    // ========================================
    // VideoCard Component
    // Used in: HomePage, ArticlesPage, AboutUsPage
    // ========================================
    VideoCard(video) {
        return `
        <div class="card-hover group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary-200 transition-all">
            <div class="relative overflow-hidden">
                <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition">
                    <div class="play-btn w-14 h-14 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                        <i data-lucide="play" class="w-6 h-6 text-primary-600 ml-0.5"></i>
                    </div>
                </div>
                <span class="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">${video.duration}</span>
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-sm line-clamp-2 group-hover:text-primary-600 transition">${video.title}</h3>
                <p class="text-xs text-gray-400 mt-1">${video.category}</p>
            </div>
        </div>`;
    },

    // ========================================
    // Search Component (Header)
    // ========================================
    SearchBar() {
        return `
        <div class="relative" id="search-wrapper">
            <div class="flex items-center bg-gray-100 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary-200 focus-within:bg-white transition-all border border-transparent focus-within:border-primary-200">
                <i data-lucide="search" class="w-4 h-4 text-gray-400 flex-shrink-0"></i>
                <input id="search-input" type="text" placeholder="Search products..." class="bg-transparent border-none outline-none ml-2 text-sm w-full placeholder-gray-400" oninput="Component.handleSearch(this.value)" onfocus="document.getElementById('search-results').classList.remove('hidden')" onblur="setTimeout(()=>document.getElementById('search-results').classList.add('hidden'), 200)">
            </div>
            <div id="search-results" class="hidden absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto z-50"></div>
        </div>`;
    },

    handleSearch(query) {
        const container = document.getElementById('search-results');
        if (!query.trim()) { container.innerHTML = ''; return; }
        const results = DataService.searchProducts(query);
        if (results.length === 0) {
            container.innerHTML = '<div class="p-4 text-center text-gray-400 text-sm">No results found</div>';
            return;
        }
        container.innerHTML = results.slice(0, 5).map(p => `
            <a href="#/products/${p.id}" class="flex items-center gap-3 p-3 hover:bg-gray-50 transition">
                <img src="${p.image}" alt="${p.name}" class="w-12 h-12 rounded-lg object-cover">
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm truncate">${p.name}</p>
                    <p class="text-xs text-gray-400">${p.brand} · $${p.price}</p>
                </div>
            </a>
        `).join('');
    }
};