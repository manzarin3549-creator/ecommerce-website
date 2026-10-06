const products = [
  {
    id: 1,
    name: "Aurora Speaker",
    category: "electronics",
    price: 129.99,
    tag: "Best seller",
    rating: 4.8,
    reviews: 248,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Minimal Lamp",
    category: "home",
    price: 84.5,
    tag: "New",
    rating: 4.7,
    reviews: 179,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Canvas Tote",
    category: "fashion",
    price: 46.0,
    tag: "Trending",
    rating: 4.9,
    reviews: 312,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Core Smartwatch",
    category: "electronics",
    price: 199.0,
    tag: "Hot",
    rating: 4.6,
    reviews: 132,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 5,
    name: "Scented Candle Set",
    category: "wellness",
    price: 32.0,
    tag: "Limited",
    rating: 4.8,
    reviews: 215,
    image:
      "https://images.unsplash.com/photo-1602872029705-8d6a0aad94c0?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 6,
    name: "Luna Throw",
    category: "home",
    price: 72.25,
    tag: "Cozy",
    rating: 4.7,
    reviews: 94,
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 7,
    name: "Urban Runner",
    category: "fashion",
    price: 88.9,
    tag: "New",
    rating: 4.5,
    reviews: 163,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 8,
    name: "Breeze Bottle",
    category: "wellness",
    price: 27.75,
    tag: "Eco",
    rating: 4.9,
    reviews: 402,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80"
  }
];

const cart = [];
let activeFilter = "all";

const productGrid = document.querySelector("#product-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartButton = document.querySelector("#cart-button");
const cartPanel = document.querySelector("#cart-panel");
const cartOverlay = document.querySelector("#cart-overlay");
const closeCartButton = document.querySelector("#close-cart");
const cartItemsContainer = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const subtotalEl = document.querySelector("#subtotal");
const totalEl = document.querySelector("#total");

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function getFilteredProducts() {
  if (activeFilter === "all") {
    return products;
  }

  return products.filter((product) => product.category === activeFilter);
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  if (!filteredProducts.length) {
    productGrid.innerHTML = '<div class="empty-state">No products match this category.</div>';
    return;
  }

  productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-card" data-id="${product.id}">
          <div class="product-image-wrap">
            <img src="${product.image}" alt="${product.name}" />
            <span class="product-tag">${product.tag}</span>
          </div>
          <div class="product-body">
            <div class="product-meta">
              <span>${product.category}</span>
              <span>${product.reviews} reviews</span>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">
              <span class="stars">★★★★★</span>
              <span>${product.rating}</span>
            </div>
            <div class="product-footer">
              <span class="product-price">${formatPrice(product.price)}</span>
              <button class="add-to-cart" data-id="${product.id}">Add to cart</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find((item) => item.id === productId);
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  openCart();
}

function removeFromCart(productId) {
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex === -1) return;

  cart.splice(itemIndex, 1);
  renderCart();
}

function updateQuantity(productId, change) {
  const item = cart.find((cartItem) => cartItem.id === productId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  renderCart();
}

function calculateCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  return { subtotal, total };
}

function renderCart() {
  if (!cart.length) {
    cartItemsContainer.innerHTML = '<div class="empty-state">Your cart is empty. Start shopping to add favorites.</div>';
    cartCount.textContent = "0";
    subtotalEl.textContent = formatPrice(0);
    totalEl.textContent = formatPrice(0);
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="item-details">
            <h4>${item.name}</h4>
            <span class="item-price">${formatPrice(item.price)}</span>
          </div>
          <div class="item-actions">
            <div class="qty-control">
              <button class="qty-button" data-action="decrease" data-id="${item.id}">−</button>
              <span>${item.quantity}</span>
              <button class="qty-button" data-action="increase" data-id="${item.id}">+</button>
            </div>
            <button class="item-remove" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `
    )
    .join("");

  const { subtotal, total } = calculateCartTotals();
  cartCount.textContent = String(cart.reduce((sum, item) => sum + item.quantity, 0));
  subtotalEl.textContent = formatPrice(subtotal);
  totalEl.textContent = formatPrice(total);
}

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("visible");
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("visible");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.category;

    filterButtons.forEach((btn) => {
      btn.classList.toggle("active", btn === button);
    });

    renderProducts();
  });
});

document.addEventListener("click", (event) => {
  const addToCartButton = event.target.closest(".add-to-cart");
  if (addToCartButton) {
    addToCart(Number(addToCartButton.dataset.id));
    return;
  }

  const cartTrigger = event.target.closest("#cart-button");
  if (cartTrigger) {
    openCart();
    return;
  }

  const closeTrigger = event.target.closest("#close-cart");
  if (closeTrigger) {
    closeCart();
    return;
  }

  const qtyButton = event.target.closest(".qty-button");
  if (qtyButton) {
    const { action, id } = qtyButton.dataset;
    updateQuantity(Number(id), action === "increase" ? 1 : -1);
    return;
  }

  const removeButton = event.target.closest(".item-remove");
  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.id));
  }

  if (event.target === cartOverlay) {
    closeCart();
  }
});

renderProducts();
renderCart();
