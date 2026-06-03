const products = [
  {id:1,name:"iPhone 15",category:"Electronics",price:1500,rating:5,image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",description:"Sleek smartphone with powerful performance, exceptional camera, and premium glass finish."},
  {id:2,name:"Samsung TV",category:"Electronics",price:1800,rating:4,image:"https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80",description:"Smart 4K TV with vibrant colors, seamless streaming apps, and immersive sound."},
  {id:3,name:"Laptop",category:"Electronics",price:2000,rating:5,image:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",description:"Lightweight laptop for work and creativity with excellent battery life."},
  {id:4,name:"Noise Cancelling Headphones",category:"Electronics",price:750,rating:4,image:"https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",description:"Premium wireless headphones with deep bass and active noise cancellation."},
  {id:5,name:"Smartwatch",category:"Electronics",price:680,rating:3,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",description:"Stylish smartwatch with fitness tracking and long battery life."},
  {id:6,name:"Shoes",category:"Fashion",price:900,rating:3,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",description:"Comfortable everyday sneakers with great traction and modern streetwear style."},
  {id:7,name:"T-Shirt",category:"Fashion",price:300,rating:2,image:"https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",description:"Soft cotton tee with a relaxed fit, perfect for layered looks and casual days."},
  {id:8,name:"Jeans",category:"Fashion",price:700,rating:3,image:"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",description:"Classic denim jeans with durable stitching and a comfortable mid-rise fit."},
  {id:9,name:"Backpack",category:"Sports",price:520,rating:3,image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",description:"Durable travel backpack with multiple compartments and water-resistant fabric."},
  {id:10,name:"Yoga Mat",category:"Sports",price:260,rating:2,image:"https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80",description:"Non-slip yoga mat with cushioned support for home workouts."},
  {id:11,name:"Aroma Diffuser",category:"Home",price:420,rating:4,image:"https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",description:"Minimal diffuser to fill your room with calming fragrance and soft light."},
  {id:12,name:"Desk Lamp",category:"Home",price:640,rating:5,image:"https://images.unsplash.com/photo-1774647002345-5301814a66bb?auto=format&fit=crop&w=800&q=80",description:"Smart LED desk lamp with adjustable brightness and eye-care mode."},
  {id:13,name:"Perfume",category:"Beauty",price:540,rating:5,image:"https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",description:"Luxury fragrance with floral notes designed for evening wear."},
  {id:14,name:"Sunglasses",category:"Fashion",price:380,rating:4,image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",description:"Retro sunglasses with UV protection and lightweight acetate frame."}
];

const PRICE_MIN = Math.min(...products.map(p => p.price));
const PRICE_MAX = Math.max(...products.map(p => p.price));
const FALLBACK_IMAGE = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect fill="#e5e7eb" width="800" height="600"/><text x="400" y="300" text-anchor="middle" fill="#6b7280" font-family="sans-serif" font-size="28">No image</text></svg>'
);

const state = {
  search: '',
  category: 'all',
  rating: 'all',
  price: PRICE_MAX,
  sort: 'none',
  page: 1,
  pageSize: 12,
  darkMode: false
};

const cart = JSON.parse(localStorage.getItem('megaCart') || '[]');
const wishlist = new Set(JSON.parse(localStorage.getItem('megaWishlist') || '[]'));

const productsDiv = document.getElementById('products');
const resultCount = document.getElementById('resultCount');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');
const ratingSelect = document.getElementById('rating');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const priceMinEl = document.getElementById('priceMin');
const priceMaxEl = document.getElementById('priceMax');
const sortSelect = document.getElementById('sortSelect');
const clearFilters = document.getElementById('clearFilters');
const priceButtons = document.querySelectorAll('.price-btn');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const cartCountEl = document.getElementById('cartCount');
const toastEl = document.getElementById('toast');
const themeToggle = document.getElementById('themeToggle');
const productModal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const modalRating = document.getElementById('modalRating');
const modalAddToCart = document.getElementById('modalAddToCart');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

let activeProduct = null;

function persistCart() {
  localStorage.setItem('megaCart', JSON.stringify(cart));
}

function persistWishlist() {
  localStorage.setItem('megaWishlist', JSON.stringify(Array.from(wishlist)));
}

function formatPrice(n) {
  return n.toLocaleString(undefined);
}

function renderStars(r) {
  return '★'.repeat(r) + '☆'.repeat(Math.max(0, 5 - r));
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playClickSound() {
  const duration = 0.04;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'square';
  oscillator.frequency.value = 600;
  gain.gain.setValueAtTime(0.15, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

function showToast(text) {
  if (!toastEl) return;
  playClickSound();
  toastEl.textContent = text;
  toastEl.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toastEl.classList.remove('show'), 1800);
}

function updateCartCount() {
  if (!cartCountEl) return;
  cartCountEl.textContent = cart.length;
}

function updatePriceLabel() {
  if (priceValue) {
    priceValue.textContent = state.price >= PRICE_MAX
      ? `₹${formatPrice(PRICE_MAX)}`
      : `Up to ₹${formatPrice(state.price)}`;
  }
  updateSliderFill();
}

function updateSliderFill() {
  if (!priceRange) return;
  const range = PRICE_MAX - PRICE_MIN;
  const progress = range === 0 ? 100 : ((state.price - PRICE_MIN) / range) * 100;
  priceRange.style.setProperty('--slider-progress', `${progress}%`);
}

function setMaxPrice(value) {
  state.price = Math.min(PRICE_MAX, Math.max(PRICE_MIN, value));
  if (priceRange) priceRange.value = String(state.price);
  updatePriceLabel();
  updatePriceButtons();
}

function handleImageError(img) {
  img.onerror = null;
  img.src = FALLBACK_IMAGE;
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.price, 0);
}

function renderCart() {
  if (!cartItems || !cartTotal) return;
  cartItems.innerHTML = '';
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    cartTotal.textContent = '₹0';
    checkoutBtn.disabled = true;
    return;
  }
  checkoutBtn.disabled = false;

  cart.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <p>${item.category} • ${item.rating}⭐</p>
      </div>
      <div class="cart-item-actions">
        <span>₹${formatPrice(item.price)}</span>
        <button class="remove-item" data-index="${index}">Remove</button>
      </div>
    `;
    const removeBtn = row.querySelector('.remove-item');
    removeBtn.addEventListener('click', () => {
      cart.splice(index, 1);
      persistCart();
      updateCartCount();
      renderCart();
      showToast(`${item.name} removed from cart`);
    });
    cartItems.appendChild(row);
  });
  cartTotal.textContent = `₹${formatPrice(getCartTotal())}`;
}

function openCart() {
  renderCart();
  cartModal.classList.remove('hidden');
}

function closeCart() {
  cartModal.classList.add('hidden');
}

function processPayment() {
  if (cart.length === 0) {
    showToast('Add items to your cart before checking out.');
    return;
  }
  cart.length = 0;
  persistCart();
  updateCartCount();
  renderCart();
  closeCart();
  showToast('Payment successful! Your order is confirmed.');
}

function getFilteredSortedProducts() {
  const filtered = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(state.search.toLowerCase());
    const matchesCategory = state.category === 'all' || product.category === state.category;
    const matchesRating = state.rating === 'all' || product.rating >= state.rating;
    const matchesPriceRange = product.price <= state.price;
    return matchesSearch && matchesCategory && matchesRating && matchesPriceRange;
  });

  if (state.sort === 'lowHigh') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sort === 'highLow') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.sort === 'ratingHigh') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return filtered;
}

function renderProducts() {
  const filtered = getFilteredSortedProducts();
  const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
  state.page = Math.min(state.page, totalPages);
  const start = (state.page - 1) * state.pageSize;
  const pageItems = filtered.slice(start, start + state.pageSize);

  productsDiv.innerHTML = '';
  resultCount.textContent = `${filtered.length} Products Found`;
  noResults.style.display = filtered.length === 0 ? 'block' : 'none';

  pageInfo.textContent = `Page ${state.page} of ${totalPages}`;
  prevPage.disabled = state.page === 1;
  nextPage.disabled = state.page === totalPages;

  if (filtered.length === 0) {
    productsDiv.innerHTML = '';
    return;
  }

  pageItems.forEach(product => {
    const card = document.createElement('article');
    card.className = 'card';
    const isWishlisted = wishlist.has(product.id);

    card.innerHTML = `
      <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" aria-label="Toggle wishlist">${isWishlisted ? '♥' : '♡'}</button>
      <img loading="lazy" src="${product.image}" alt="${product.name}">
      <div class="info">
        <h3>${product.name}</h3>
        <div class="price">₹ ${formatPrice(product.price)}</div>
        <div class="rating">${renderStars(product.rating)}</div>
        <div class="product-meta">
          <span>${product.category}</span>
          <span>${product.rating}⭐</span>
        </div>
        <div class="card-footer">
          <button class="btn add">Add to Cart</button>
          <button class="btn view">View Details</button>
        </div>
      </div>
    `;

    const wishlistBtn = card.querySelector('.wishlist-btn');
    wishlistBtn.addEventListener('click', () => {
      playClickSound();
      if (wishlist.has(product.id)) {
        wishlist.delete(product.id);
        wishlistBtn.classList.remove('active');
        wishlistBtn.textContent = '♡';
        showToast(`${product.name} removed from wishlist`);
      } else {
        wishlist.add(product.id);
        wishlistBtn.classList.add('active');
        wishlistBtn.textContent = '♥';
        showToast(`${product.name} added to wishlist`);
      }
      persistWishlist();
    });

    const addBtn = card.querySelector('.add');
    addBtn.addEventListener('click', () => {
      playClickSound();
      cart.push(product);
      updateCartCount();
      persistCart();
      showToast(`${product.name} added to cart`);
    });

    const viewBtn = card.querySelector('.view');
    viewBtn.addEventListener('click', () => {
      playClickSound();
      openModal(product);
    });

    const img = card.querySelector('img');
    img.addEventListener('error', () => handleImageError(img));

    productsDiv.appendChild(card);
  });
}

function openModal(product) {
  activeProduct = product;
  modalImage.onerror = () => handleImageError(modalImage);
  modalImage.src = product.image;
  modalImage.alt = product.name;
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;
  modalPrice.textContent = `₹ ${formatPrice(product.price)}`;
  modalRating.textContent = renderStars(product.rating);
  productModal.classList.remove('hidden');
}

function closeModal() {
  productModal.classList.add('hidden');
}

function applyFilters() {
  renderProducts();
}

function resetFilters() {
  state.search = '';
  state.category = 'all';
  state.rating = 'all';
  state.price = PRICE_MAX;
  state.sort = 'none';
  state.page = 1;
  searchInput.value = '';
  categorySelect.value = 'all';
  ratingSelect.value = 'all';
  sortSelect.value = 'none';
  setMaxPrice(PRICE_MAX);
  renderProducts();
}

function applyTheme() {
  document.body.classList.toggle('dark', state.darkMode);
  themeToggle.textContent = state.darkMode ? '☀️' : '🌙';
  localStorage.setItem('megaTheme', state.darkMode ? 'dark' : 'light');
}

function updatePriceButtons() {
  priceButtons.forEach(btn => {
    const preset = btn.dataset.value;
    const isActive = preset === 'all'
      ? state.price >= PRICE_MAX
      : state.price === Number(preset);
    btn.classList.toggle('active', isActive);
  });
}

function initPriceSlider() {
  if (!priceRange) return;
  priceRange.min = String(PRICE_MIN);
  priceRange.max = String(PRICE_MAX);
  priceRange.step = String(Math.max(10, Math.round((PRICE_MAX - PRICE_MIN) / 40 / 10) * 10));
  priceRange.value = String(state.price);
  if (priceMinEl) priceMinEl.textContent = `₹${formatPrice(PRICE_MIN)}`;
  if (priceMaxEl) priceMaxEl.textContent = `₹${formatPrice(PRICE_MAX)}`;
  updatePriceLabel();
  updatePriceButtons();
}

function init() {
  const savedTheme = localStorage.getItem('megaTheme');
  state.darkMode = savedTheme === 'dark';
  applyTheme();
  updateCartCount();
  initPriceSlider();
  renderProducts();
}

searchInput.addEventListener('input', event => {
  state.search = event.target.value;
  state.page = 1;
  applyFilters();
});

categorySelect.addEventListener('change', event => {
  state.category = event.target.value;
  state.page = 1;
  applyFilters();
});

ratingSelect.addEventListener('change', event => {
  const val = event.target.value;
  state.rating = val === 'all' ? 'all' : Number(val);
  state.page = 1;
  applyFilters();
});

priceRange.addEventListener('input', event => {
  setMaxPrice(Number(event.target.value));
  state.page = 1;
  applyFilters();
});

sortSelect.addEventListener('change', event => {
  playClickSound();
  state.sort = event.target.value;
  state.page = 1;
  applyFilters();
});

priceButtons.forEach(button => {
  button.addEventListener('click', event => {
    playClickSound();
    const preset = event.currentTarget.dataset.value;
    setMaxPrice(preset === 'all' ? PRICE_MAX : Number(preset));
    state.page = 1;
    applyFilters();
  });
});

clearFilters.addEventListener('click', () => {
  playClickSound();
  resetFilters();
});
prevPage.addEventListener('click', () => {
  playClickSound();
  state.page = Math.max(1, state.page - 1);
  renderProducts();
});
nextPage.addEventListener('click', () => {
  playClickSound();
  state.page += 1;
  renderProducts();
});

themeToggle.addEventListener('click', () => {
  playClickSound();
  state.darkMode = !state.darkMode;
  applyTheme();
});

if (cartBtn) {
  cartBtn.addEventListener('click', () => {
    playClickSound();
    openCart();
  });
}

if (cartClose) {
  cartClose.addEventListener('click', () => {
    playClickSound();
    closeCart();
  });
}

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    playClickSound();
    processPayment();
  });
}

modalClose.addEventListener('click', closeModal);
productModal.addEventListener('click', event => {
  if (event.target === productModal) closeModal();
});
modalAddToCart.addEventListener('click', () => {
  if (!activeProduct) return;
  cart.push(activeProduct);
  persistCart();
  updateCartCount();
  showToast(`${activeProduct.name} added to cart`);
  closeModal();
});

init();
