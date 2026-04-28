document.addEventListener("DOMContentLoaded", function () {
  highlightCurrentPage();
  setupScrollReveal();
  revealOnScroll();
  updateCartCount();
  loadCart();
  loadTheme();
});

function highlightCurrentPage() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active-link");
    }
  });
}

function setupScrollReveal() {
  const selectors = [
    ".hero-box",
    ".feature-card",
    ".content-box",
    ".team-card",
    ".product-card",
    ".form-box",
    ".contact-box",
    ".cart-page-box",
    ".checkout-box"
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.classList.add("reveal"));
  });
}

function revealOnScroll() {
  const revealItems = document.querySelectorAll(".reveal");

  if (revealItems.length === 0) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach(item => observer.observe(item));
}

function getCartItems() {
  return JSON.parse(localStorage.getItem("cartItems")) || [];
}

function saveCartItems(cart) {
  localStorage.setItem("cartItems", JSON.stringify(cart));
}

function getProductPrice(name) {
  const prices = {
    "Gallon of Gas": 8.99,
    "Bucket of Tadpoles": 39.99,
    "Piece of the Artimis II": 2999.99,
    "Coffee beans of some sort": 22.00,
    "Diamond Pickaxe": 799.99,
    "Farmers Almanac": 14.99
  };

  return prices[name] || 0;
}

function updateCartCount() {
  const cart = getCartItems();
  const cartCountElement = document.getElementById("cart-count");

  if (cartCountElement) {
    cartCountElement.textContent = "Cart: " + cart.length;
  }
}

function addToCart(name) {
  const cart = getCartItems();
  cart.push(name);
  saveCartItems(cart);

  updateCartCount();

  const message = document.getElementById("cart-message");
  if (!message) return;

  message.textContent = name + " has been added to your cart!";
  message.style.display = "block";

  setTimeout(() => {
    message.style.display = "none";
  }, 2200);
}

function removeCartItem(index) {
  const cart = getCartItems();
  cart.splice(index, 1);
  saveCartItems(cart);
  updateCartCount();
  loadCart();
}

function clearCart() {
  localStorage.removeItem("cartItems");
  updateCartCount();
  loadCart();
}

function loadCart() {
  const cartItemsDiv = document.getElementById("cart-items");
  const itemCountDiv = document.getElementById("cart-item-count");
  const subtotalDiv = document.getElementById("cart-subtotal");
  const taxDiv = document.getElementById("cart-tax");
  const totalDiv = document.getElementById("cart-total");

  if (!cartItemsDiv || !itemCountDiv || !subtotalDiv || !taxDiv || !totalDiv) return;

  const cart = getCartItems();
  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p class='text-center mb-0'>Your cart is empty.</p>";
    itemCountDiv.textContent = "0";
    subtotalDiv.textContent = "$0.00";
    taxDiv.textContent = "$0.00";
    totalDiv.textContent = "$0.00";
    return;
  }

  let subtotal = 0;

  cart.forEach((item, index) => {
    const price = getProductPrice(item);
    subtotal += price;

    cartItemsDiv.innerHTML += `
      <div class="cart-item-row">
        <div>
          <h5 class="mb-1">${item}</h5>
          <p class="mb-0 text-muted">Standard item</p>
        </div>
        <div class="cart-item-right">
          <div class="cart-price">$${price.toFixed(2)}</div>
          <button class="remove-btn" onclick="removeCartItem(${index})">Remove</button>
        </div>
      </div>
    `;
  });

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  itemCountDiv.textContent = cart.length;
  subtotalDiv.textContent = "$" + subtotal.toFixed(2);
  taxDiv.textContent = "$" + tax.toFixed(2);
  totalDiv.textContent = "$" + total.toFixed(2);
  updateShipping();
}

function sendMessage() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");
  const successBox = document.getElementById("success");

  if (!nameInput || !emailInput || !subjectInput || !messageInput || !successBox) return;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const subject = subjectInput.value;
  const message = messageInput.value.trim();

  if (name === "" || email === "" || subject === "" || message === "") {
    alert("Please fill in all fields.");
    return;
  }

  successBox.style.display = "block";

  nameInput.value = "";
  emailInput.value = "";
  subjectInput.value = "";
  messageInput.value = "";
}
function placeOrder() {
  const inputs = document.querySelectorAll(".form-box input");


for (let input of inputs) {
  if (input.value.trim() === "") {
    alert("Please fill in all fields before placing your order.");
    return;
  }
}


const cardNumber = document.getElementById("card-number").value.replace(/\s/g, "");
const exp = document.getElementById("card-exp").value;
const cvv = document.getElementById("card-cvv").value;

if (cardNumber.length !== 16) {
  alert("Card number must be 16 digits.");
  return;
}

if (!/^\d{2}\/\d{2}$/.test(exp)) {
  alert("Expiration must be in MM/YY format.");
  return;
}

const month = parseInt(exp.split("/")[0]);
if (month < 1 || month > 12) {
  alert("Expiration month must be between 01 and 12.");
  return;
}

if (cvv.length !== 3) {
  alert("CVV must be 3 digits.");
  return;
}

  
  localStorage.removeItem("cartItems");
  updateCartCount();
  loadCart();

  
  const successBox = document.getElementById("order-success");
  if (successBox) {
    successBox.style.display = "block";
    successBox.scrollIntoView({ behavior: "smooth" });
  }

 
  const btn = document.querySelector(".send-btn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Order Placed";
  }
}

function formatCardNumber(input) {
  let digits = input.value.replace(/\D/g, "");

  digits = digits.substring(0, 16);

  let formatted = digits.replace(/(.{4})/g, "$1 ").trim();

  input.value = formatted;
}

function formatExpiration(input) {
  let digits = input.value.replace(/\D/g, "");

  digits = digits.substring(0, 4);

  if (digits.length >= 3) {
    input.value = digits.substring(0, 2) + "/" + digits.substring(2);
  } else {
    input.value = digits;
  }
}

function formatCVV(input) {
  let digits = input.value.replace(/\D/g, "");
  input.value = digits.substring(0, 3);
}
function updateShipping() {
  const selected = document.querySelector('input[name="shipping"]:checked');
  if (!selected) return;

  const shipping = parseFloat(selected.value);

  const subtotal = parseFloat(document.getElementById("cart-subtotal").textContent.replace("$", ""));

  const tax = (subtotal + shipping) * 0.08;
  const total = subtotal + shipping + tax;

  document.getElementById("shipping-cost").textContent = "$" + shipping.toFixed(2);
  document.getElementById("cart-tax").textContent = "$" + tax.toFixed(2);
  document.getElementById("cart-total").textContent = "$" + total.toFixed(2);
}

function setTheme(themeName) {
  // Apply the theme to the body tag
  document.body.setAttribute('data-theme', themeName);
  
  // Update the theme button text or style if needed
  const themeBtn = document.getElementById('theme-dropdown-btn');
  if (themeBtn && themeName === 'crazy') {
      themeBtn.innerText = "Crazy Mode!";
  } else if (themeBtn) {
      themeBtn.innerText = "Themes";
  }

  // Handle existing Dark Mode class logic
  if (themeName === 'dark') {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }

  // Save selection
  localStorage.setItem("selectedTheme", themeName);
}

// This function runs on every page load
function loadTheme() {
  const savedTheme = localStorage.getItem("selectedTheme") || "light";
  setTheme(savedTheme);
}