// Load cart items and suggestions from localStorage
document.addEventListener("DOMContentLoaded", function () {
  const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
  const cartContainer = document.getElementById("cart-items-list");
  const totalEl = document.getElementById("cart-total");

  let total = 0;

  cartItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <p><strong>${item.name}</strong></p>
      <p>Qty: 1</p>
      <p>Price: $${item.price}</p>
    `;
    total += parseFloat(item.price);
    cartContainer.appendChild(div);
  });

  totalEl.innerText = total.toFixed(2);

  // Suggestions logic (requires setting `allProducts` in localStorage)
  const suggestions = [];
  const allProducts = JSON.parse(localStorage.getItem("allProducts") || "[]");

  while (suggestions.length < 4 && allProducts.length) {
    const index = Math.floor(Math.random() * allProducts.length);
    suggestions.push(allProducts.splice(index, 1)[0]);
  }

  const suggestionContainer = document.getElementById("suggestions-list");

  suggestions.forEach(s => {
    const sug = document.createElement("div");
    sug.className = "suggestion-card";
    sug.innerHTML = `
      <img src="${s.image}" alt="${s.name}" />
      <p>${s.name}</p>
      <strong>$${s.price}</strong>
      <button onclick="addSuggestionToCart('${s.id}', '${s.name}', '${s.price}', '${s.image}')">Add</button>
    `;
    suggestionContainer.appendChild(sug);
  });
});

function addSuggestionToCart(id, name, price, img) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push({ id, name, price, img });
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.reload();
}

  // Header Scroll Behavior
  let prevScrollPos = window.pageYOffset;
  const header = document.getElementById("main-header");
  window.onscroll = () => {
    const currentScroll = window.pageYOffset;
    header.style.top = (prevScrollPos > currentScroll) ? "0" : "-80px";
    prevScrollPos = currentScroll;
  };

  // Mobile Nav Toggle
  document.getElementById("menu-toggle").onclick = () => {
  const nav = document.getElementById("mobile-nav");
  nav.classList.toggle("open");
};

