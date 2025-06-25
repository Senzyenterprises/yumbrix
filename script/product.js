// =========================
// Firebase Setup
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyAbHDp4L93KFi8Ed4-_jGGEqrhAzH9wJSU",
  authDomain: "yumbrix-9b564.firebaseapp.com",
  databaseURL: "https://yumbrix-9b564-default-rtdb.firebaseio.com",
  projectId: "yumbrix-9b564",
  storageBucket: "yumbrix-9b564.appspot.com",
  messagingSenderId: "912384112432",
  appId: "1:912384112432:web:c0074c233e1dc35f52faf5",
  measurementId: "G-Q2V45TL4LP"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// =========================
// Product Data Loader from Firebase
// =========================
function loadProductsSmart() {
  db.ref("products").once("value")
    .then(snapshot => {
      const data = snapshot.val();
      if (data) {
        localStorage.setItem("allProductsData", JSON.stringify(data));
        productData = data;
        renderProducts();
      } else {
        loadFromLocalStorage();
      }
    })
    .catch(() => {
      loadFromLocalStorage();
    });
}

function loadFromLocalStorage() {
  const fallback = JSON.parse(localStorage.getItem("allProductsData")) || {};
  productData = fallback;
  renderProducts();
}

// =========================
// Replace hardcoded productData init with empty object
// =========================
let productData = {};

// Swatch image switching
function applySwatchSwitching() {
  document.querySelectorAll('.product-card').forEach(card => {
    const img = card.querySelector('.product-image');
    card.querySelectorAll('.swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        if (swatch.dataset.img) {
          img.style.backgroundImage = `url('${swatch.dataset.img}')`;
        }
      });
    });
  });
}

function updateCartCounter() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  document.getElementById("cart-count").innerText = cart.length;
}

function goToCart() {
  document.getElementById("slide-cart").classList.add("active");
  renderSlideCart();
}

document.getElementById("close-slide-cart").onclick = function () {
  document.getElementById("slide-cart").classList.remove("active");
};

function renderSlideCart() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items-preview");
  container.innerHTML = "";
  cartItems.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-details">
        <p>${item.name}</p>
        <small>Qty: ${item.quantity || 1}</small><br>
        <strong>$${item.price}</strong>
        <button onclick="removeFromSlideCart(${index})" style="color:red;border:none;background:none;cursor:pointer;">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function removeFromSlideCart(index) {
  const cartItems = JSON.parse(localStorage.getItem("cart") || []);
  cartItems.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  renderSlideCart();
  updateCartCounter();
}

document.getElementById("checkout-btn").onclick = function () {
  window.location.href = "cart.html";
};

updateCartCounter();

document.getElementById("menu-toggle").onclick = () => {
  const nav = document.getElementById("mobile-nav");
  nav.classList.toggle("open");
};

function createSwatches() {
  return `<div class="swatches">
    ${["red", "blue", "green", "black", "white", "yellow"].map(color =>
      `<span class="swatch" style="background:${color}" title="${color}" data-img=""></span>`).join("")}
  </div>`;
}

function createSizes(type, product) {
  if (type === "beauty") {
    return `<div class="sizes">
      ${["S", "M", "L"].map(s => `<span class="size">${s}</span>`).join("")}
    </div>`;
  } else if (type === "electronics") {
    return product.options
      ? `<div class="storage">
          ${product.options.map(opt => `<span class="storage-btn">${opt}</span>`).join("")}
        </div>`
      : '';
  } else {
    return `<div class="gender">
      <span class="gender-btn selected" data-gender="men">Men</span>
      <span class="gender-btn" data-gender="women">Women</span>
    </div>
    <div class="sizes">
      ${["S", "M", "L", "XL"].map(s => `<span class="size">${s}</span>`).join("")}
    </div>`;
  }
}

function renderProducts() {
  for (const section in productData) {
    const container = document.getElementById(`${section}-products`);
    if (!container) continue;
    container.innerHTML = "";
    productData[section].forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-image" style="background-image: url('${p.image}')"></div>
        <div class="product-details">
          <h4>${p.name}</h4>
          <div class="price" data-base="${p.price}">$${p.price}</div>
          ${createSwatches()}
          ${createSizes(section, p)}
          <button class="add-to-cart" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-img="${p.image}">Add to Cart</button>
        </div>`;
      container.appendChild(card);
    });
  }
  applySwatchSwitching();
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("size") || e.target.classList.contains("storage-btn")) {
    const priceEl = e.target.closest(".product-details").querySelector(".price");
    const basePrice = parseFloat(priceEl.dataset.base);
    const size = e.target.innerText;
    let multiplier = size === "M" || size === "128GB" ? 1.1 :
                     size === "L" || size === "256GB" ? 1.25 : 1;
    priceEl.innerText = `$${(basePrice * multiplier).toFixed(2)}`;
    e.target.parentElement.querySelectorAll("span").forEach(el => el.classList.remove("selected"));
    e.target.classList.add("selected");
  }

  if (e.target.classList.contains("gender-btn")) {
    e.target.parentElement.querySelectorAll(".gender-btn").forEach(el => el.classList.remove("selected"));
    e.target.classList.add("selected");
  }

  if (e.target.classList.contains("add-to-cart")) {
    const id = e.target.dataset.id;
    const name = e.target.dataset.name;
    const img = e.target.dataset.img;
    const price = e.target.closest(".product-details").querySelector(".price").innerText.replace('$','');
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ id, name, img, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
  }
});

// Load products from Firebase
window.addEventListener("DOMContentLoaded", loadProductsSmart);
