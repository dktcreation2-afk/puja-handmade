const cart = [];

const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const overlay = document.getElementById('overlay');
const checkoutBtn = document.getElementById('checkoutBtn');

const cartToggle = document.querySelector('.cart-toggle');
const closeCart = document.querySelector('.close-cart');

function formatPrice(value) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function updateCartUI() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
    cartTotal.textContent = '₹0';
    cartCount.textContent = '0';
    checkoutBtn.href = 'https://wa.me/919999999999?text=Hello%20Puja%20Handmade%2C%20I%20want%20to%20place%20my%20order.%20Here%20is%20my%20cart%3A%20';
    return;
  }

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = String(totalItems);
  cartTotal.textContent = formatPrice(totalPrice);

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-item-details">
            <div class="cart-item-row">
              <span class="cart-item-name">${item.name}</span>
              <span class="cart-item-price">${formatPrice(item.price * item.qty)}</span>
            </div>
            <div class="qty-controls">
              <button type="button" data-action="decrease" data-name="${item.name}">−</button>
              <span>${item.qty}</span>
              <button type="button" data-action="increase" data-name="${item.name}">+</button>
            </div>
            <button type="button" class="remove-item" data-action="remove" data-name="${item.name}">Remove</button>
          </div>
        </div>
      `
    )
    .join('');

  const cartSummaryText = cart
    .map((item) => `${item.name} x${item.qty}`)
    .join(', ');

  checkoutBtn.href =
    'https://wa.me/919999999999?text=' +
    encodeURIComponent(
      `Hello Puja Handmade, I want to place my order. Here are my items: ${cartSummaryText}. Total: ${formatPrice(totalPrice)}.`
    );
}

function addToCart(name, price, image) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name, price, image, qty: 1 });
  }

  updateCartUI();
  openCart();
}

function updateQty(name, change) {
  const item = cart.find((entry) => entry.name === name);
  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    const index = cart.findIndex((entry) => entry.name === name);
    cart.splice(index, 1);
  }

  updateCartUI();
}

function openCart() {
  cartPanel.classList.add('open');
  overlay.classList.add('show');
}

function closeCartPanel() {
  cartPanel.classList.remove('open');
  overlay.classList.remove('show');
}

cartToggle.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartPanel);
overlay.addEventListener('click', closeCartPanel);

document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    const name = card.dataset.name;
    const price = Number(card.dataset.price);
    const image = card.querySelector('img').src;
    addToCart(name, price, image);
  });
});

cartItems.addEventListener('click', (event) => {
  const target = event.target;
  const name = target.dataset.name;
  const action = target.dataset.action;

  if (!name || !action) return;

  if (action === 'increase') updateQty(name, 1);
  if (action === 'decrease') updateQty(name, -1);
  if (action === 'remove') updateQty(name, -999);
});

updateCartUI();
