let isEditing = false;
let editingCategory = null;
let editingIndex = null;

// =======================
// DEFAULT PRODUCTS
// =======================
let defaultProducts = {
  fashion: [
    { id: 1, name: "T-Shirt", price: 25, image: "images/pictures/pexels-itay-verchik-1150587-16771847 (1).jpg" },
    { id: 2, name: "Sneakers", price: 40, image: "images/pictures/pexels-melvin-buezo-1253763-2529148 (1).jpg" },
    { id: 3, name: "Bag", price: 30, image: "images/pictures/pexels-lazarus-ziridis-351891426-32642010 (1).jpg" },
    { id: 4, name: "Jacket", price: 45, image: "images/pictures/jacket.jpg" },
    { id: 5, name: "Heels", price: 38, image: "images/pictures/heels.jpg" },
    { id: 6, name: "Cap", price: 18, image: "images/pictures/cap.jpg" },
    { id: 7, name: "Jeans", price: 35, image: "images/pictures/jeans.jpg" },
    { id: 8, name: "Sandals", price: 28, image: "images/pictures/sandals.jpg" }
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

// =======================
// LOGOUT + INACTIVITY HANDLER
// =======================
function logout() {
  localStorage.removeItem("isYumbrixAdmin");
  window.location.href = "login.html";
}

let inactivityTimer;
function resetTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(logout, 30 * 60 * 1000);
}
['click','mousemove','keypress','scroll'].forEach(evt => window.addEventListener(evt, resetTimer));
resetTimer();

// =======================
// DOM ELEMENTS
// =======================
const form = document.getElementById("product-form");
const listContainer = document.getElementById("product-list");
const resetBtn = document.getElementById("reset-button");
const status = document.getElementById("reset-status");
const categorySelect = document.getElementById("product-category");
const optionsWrapper = document.getElementById("options-wrapper");

// =======================
// CATEGORY CHANGE HANDLER
// =======================
categorySelect.addEventListener("change", () => {
  optionsWrapper.style.display = categorySelect.value === "electronics" ? "block" : "none";
});

// =======================
// ADD/EDIT PRODUCT HANDLER
// =======================
form.addEventListener("submit", e => {
  e.preventDefault();
  const cat = categorySelect.value;
  const name = document.getElementById("product-name").value.trim();
  const price = parseFloat(document.getElementById("product-price").value);
  const imageInput = document.getElementById("product-image");
  const imageFile = imageInput.files[0];

  if (!imageFile) return alert("Please select an image!");

  const optionsText = document.getElementById("product-options").value.trim();
  const options = optionsText ? optionsText.split(",").map(opt => opt.trim()) : undefined;

  const reader = new FileReader();
  reader.onload = function (event) {
    const image = event.target.result;
    const data = JSON.parse(localStorage.getItem("productData")) || {};
    if (!data[cat]) data[cat] = [];

    if (isEditing) {
      const updatedProduct = { id: Date.now(), name, price, image };
      if (cat === "electronics" && options) updatedProduct.options = options;
      data[editingCategory][editingIndex] = updatedProduct;

      const allData = JSON.parse(localStorage.getItem("allProductsData")) || {};
      if (allData[editingCategory]) {
        allData[editingCategory][editingIndex] = updatedProduct;
        localStorage.setItem("allProductsData", JSON.stringify(allData));
      }

      isEditing = false;
      editingCategory = null;
      editingIndex = null;
      document.getElementById("edit-status").style.display = "none";
    } else {
      const newProduct = { id: Date.now(), name, price, image };
      if (cat === "electronics" && options) newProduct.options = options;
      data[cat].push(newProduct);
      addProductToLocalStorage(cat, name, price, image, options);
    }

    localStorage.setItem("productData", JSON.stringify(data));
    loadProducts();
    form.reset();
    optionsWrapper.style.display = "none";
  };
  reader.readAsDataURL(imageFile);
});

// =======================
// LOAD PRODUCTS TO LIST
// =======================
function loadProducts() {
  const data = JSON.parse(localStorage.getItem("productData")) || {};
  listContainer.innerHTML = "";
  Object.keys(data).forEach(category => {
    data[category].forEach((product, index) => {
      const div = document.createElement("div");
      div.className = "product-entry";
      div.innerHTML = `
        <span>[${category}] ${product.name} – $${product.price}</span>
        <button onclick="editProduct('${category}', ${index})">Edit</button>
        <button onclick="deleteProduct('${category}', ${index})">Delete</button>`;
      listContainer.appendChild(div);
    });
  });
}

// =======================
// EDIT PRODUCT
// =======================
function editProduct(category, index) {
  const data = JSON.parse(localStorage.getItem("productData"));
  const p = data[category][index];
  document.getElementById("edit-status").style.display = "block";
  document.getElementById("product-category").value = category;
  document.getElementById("product-name").value = p.name;
  document.getElementById("product-price").value = p.price;
  categorySelect.dispatchEvent(new Event("change"));
  if (category === "electronics" && p.options) {
    document.getElementById("product-options").value = p.options.join(", ");
  } else {
    document.getElementById("product-options").value = "";
  }
  form.scrollIntoView({ behavior: "smooth" });
  isEditing = true;
  editingCategory = category;
  editingIndex = index;
}

// =======================
// DELETE PRODUCT
// =======================
function deleteProduct(category, index) {
  const data = JSON.parse(localStorage.getItem("productData"));
  const deletedProduct = data[category][index];
  data[category].splice(index, 1);
  localStorage.setItem("productData", JSON.stringify(data));

  let allData = JSON.parse(localStorage.getItem("allProductsData")) || {};
  if (allData[category]) {
    allData[category] = allData[category].filter(p => p.id !== deletedProduct.id);
    localStorage.setItem("allProductsData", JSON.stringify(allData));
  }
  loadProducts();
}

// =======================
// RESET PRODUCTS TO DEFAULT
// =======================
resetBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset to default products?")) {
    localStorage.setItem("productData", JSON.stringify(defaultProducts));
    localStorage.setItem("allProductsData", JSON.stringify(defaultProducts));
    status.textContent = "✅ Reset successful.";
    loadProducts();
    setTimeout(() => status.textContent = "", 2000);
  }
});

// =======================
// INIT PRODUCT LOAD
// =======================
loadProducts();

// =======================
// SYNC TO allProductsData
// =======================
function addProductToLocalStorage(category, name, price, image, options = undefined) {
  const data = JSON.parse(localStorage.getItem("allProductsData")) || {
    fashion: [], electronics: [], beauty: []
  };

  const newProduct = { id: Date.now(), name, price: parseFloat(price), image };
  if (category === "electronics" && options) newProduct.options = options;
  if (!data[category]) data[category] = [];
  data[category].push(newProduct);
  localStorage.setItem("allProductsData", JSON.stringify(data));
}
