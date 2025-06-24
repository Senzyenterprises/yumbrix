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

// Add to Cart with accurate count
function updateCartCounter() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  document.getElementById("cart-count").innerText = cart.length;
}

// Slide cart logic
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
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  cartItems.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  renderSlideCart();
  updateCartCounter();
}

document.getElementById("checkout-btn").onclick = function () {
  window.location.href = "cart.html";
};

updateCartCounter();

// Mobile Nav Toggle
  document.getElementById("menu-toggle").onclick = () => {
  const nav = document.getElementById("mobile-nav");
  nav.classList.toggle("open");
};

// Fetch products from localStorage or fallback to original
let productData = JSON.parse(localStorage.getItem("allProductsData"));
if (!productData) {
  productData = {
    fashion: [
      { id: 1, name: "T-Shirt", price: 25, image:"images/pictures/pexels-itay-verchik-1150587-16771847 (1).jpg" },
      { id: 2, name: "Sneakers", price: 40, image: "images/pictures/pexels-melvin-buezo-1253763-2529148 (1).jpg"},
      { id: 3, name: "Bag", price: 30, image:"images/pictures/pexels-lazarus-ziridis-351891426-32642010 (1).jpg"},
      { id: 4, name: "Jacket", price: 45, image: "images/pictures/jacket.jpg" },
      { id: 5, name: "Heels", price: 38, image: "images/pictures/heels.jpg" },
      { id: 6, name: "Cap", price: 18, image: "images/pictures/cap.jpg" },
      { id: 7, name: "Jeans", price: 35, image: "images/pictures/jeans.jpg" },
      { id: 8, name: "Sandals", price: 28, image: "images/pictures/sandals.jpg" },
    ],
    electronics: [
      { id: 9, name: "Smartphone", price: 299, image: "images/pictures/smartphones.jpg", options: ["64GB", "128GB", "256GB"] },
      { id: 10, name: "Headset", price: 89, image: "images/pictures/pexels-sound-on-3394650 (1).jpg", options: ["Black", "White", "Red"] },
      { id: 11, name: "Smartwatch", price: 149, image: "images/pictures/pexels-karolina-grabowska-4041176 (1).jpg", options: ["38mm", "42mm", "45mm"] },
      { id: 12, name: "Monitor", price: 199, image: "images/pictures/monitor.jpg", options: ["Standard", "Pro", "Gaming"] },
      { id: 13, name: "Tablet", price: 538, image: "images/pictures/tablet.jpg", options: ["64GB", "128GB", "256GB"] },
      { id: 14, name: "Speaker", price: 269, image: "images/pictures/speaker.jpg", options: ["Basic", "Stereo", "Bass Boosted"] },
      { id: 15, name: "Power Bank", price: 125, image: "images/pictures/powerbank.jpg", options: ["5000mAh", "10000mAh", "20000mAh"] },
      { id: 16, name: "Mouse", price: 50, image: "images/pictures/mouse.jpg", options: ["Wired", "Wireless", "Rechargeable"] }
    ],
    beauty: [
      { id: 17, name: "Body Spray", price: 15, image: "images/pictures/bodyspray.jpg" },
      { id: 18, name: "Face Cream", price: 22, image: "images/pictures/pexels-n-voitkevich-8558492 (1).jpg" },
      { id: 19, name: "Skincare Kit", price: 35, image: "images/pictures/skincare.jpg" },
      { id: 20, name: "Lip Gloss", price: 9, image: "images/pictures/lipgloss.jpg" },
      { id: 21, name: "Perfume", price: 28, image: "images/pictures/perfume.jpg" },
      { id: 22, name: "Hair Cream", price: 20, image: "images/pictures/haircream.jpg" },
      { id: 23, name: "Body Lotion", price: 26, image: "images/pictures/bodylotion.jpg" },
      { id: 24, name: "Face Wash", price: 14, image: "images/pictures/facewash.jpg" }
    ]
  };
  localStorage.setItem("allProductsData", JSON.stringify(productData));
}

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

renderProducts();

// Handle price and cart events

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
