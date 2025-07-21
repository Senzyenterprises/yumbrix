// ✅ CLEANED dashboard.js — Fully working version with Firebase + Auth

let isEditing = false;
let editingCategory = null;
let editingIndex = null;

// =======================
// FIREBASE CONFIG
// =======================
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

// Initialize Firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
const auth = firebase.auth(); // Get the Auth service

// =======================
// DEFAULT PRODUCTS
// =======================
const defaultProducts = {
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
// DOM ELEMENTS
// =======================
const form = document.getElementById("product-form");
const listContainer = document.getElementById("product-list");
const resetBtn = document.getElementById("reset-button");
const status = document.getElementById("reset-status");
const categorySelect = document.getElementById("product-category");
const optionsWrapper = document.getElementById("options-wrapper");

// =======================
// AUTHENTICATION CHECK & INACTIVITY LOGOUT
// =======================

// This listener checks the auth state immediately and whenever it changes
auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in. Allow access to dashboard content.
    console.log("Admin user signed in:", user.uid);
    // Remove the old localStorage check
    // If you have other parts of your code that rely on localStorage.getItem("isYumbrixAdmin")
    // you should replace them with a check against the 'user' object from auth.onAuthStateChanged
    
    // Start inactivity timer only if user is logged in
    resetTimer(); 
    
    // Initialize product listening and rendering ONLY if an admin is logged in
    listenToProducts();

  } else {
    // User is signed out or not authenticated. Redirect to login.
    console.log("No admin user signed in. Redirecting to login.");
    logout(); // This will sign out any Firebase user session and redirect
  }
});

// Original logout function - now signs out from Firebase Auth
function logout() {
  auth.signOut().then(() => {
    // Sign-out successful.
    localStorage.removeItem("isYumbrixAdmin"); // Clean up old localStorage flag (optional)
    window.location.href = "login.html";
  }).catch((error) => {
    console.error("Error signing out:", error);
    // Even if signOut fails, force redirect to login
    localStorage.removeItem("isYumbrixAdmin"); // Ensure flag is removed
    window.location.href = "login.html";
  });
}

let inactivityTimer;
function resetTimer() {
  clearTimeout(inactivityTimer);
  // 25 minutes timer. This will now log out the Firebase user as well.
  inactivityTimer = setTimeout(logout, 25 * 60 * 1000);
}
["click", "mousemove", "keypress", "scroll"].forEach(evt => window.addEventListener(evt, resetTimer));
// The initial call to resetTimer will happen after onAuthStateChanged confirms user.


// =======================
// CATEGORY TOGGLE
// =======================
categorySelect.addEventListener("change", () => {
  optionsWrapper.style.display = categorySelect.value === "electronics" ? "block" : "none";
});

// =======================
// LISTEN TO PRODUCTS (REALTIME)
// =======================
function listenToProducts() {
  db.ref("products").on("value", snapshot => {
    const data = snapshot.val() || {};
    // localStorage.setItem("productData", JSON.stringify(data)); // This line might not be strictly needed for admin but doesn't hurt
    renderProductList(data);
    estimateStorageUsage(data);
  });
}
function renderProductList(data) {
  listContainer.innerHTML = "";
  Object.keys(data).forEach(category => {
    // Ensure data[category] is an array before trying to iterate
    const categoryProducts = Array.isArray(data[category]) ? data[category] : Object.values(data[category] || {});

    categoryProducts.forEach((product, index) => {
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
// ADD/EDIT PRODUCT
// =======================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const cat = categorySelect.value;
  const name = document.getElementById("product-name").value.trim();
  const price = parseFloat(document.getElementById("product-price").value);
  const imageInput = document.getElementById("product-image");
  const imageFile = imageInput.files[0];
  if (imageFile && imageFile.size > 1024 * 1024) { // 1MB
    alert("Image is too large. Please compress it below 1MB.");
    return;
  }
  const optionsText = document.getElementById("product-options").value.trim();
  const options = optionsText ? optionsText.split(",").map(opt => opt.trim()) : undefined;

  db.ref("products/" + cat).once("value", (snap) => {
    const existing = snap.val() || [];

    const buildAndSaveProduct = (imageBase64) => {
      let product = {
        id: Date.now(),
        name,
        price,
        image: imageBase64
      };

      if (cat === "electronics" && options) {
        product.options = options;
      }

      if (isEditing) {
        product.id = existing[editingIndex].id;
        if (!imageBase64) {
          product.image = existing[editingIndex].image;
        }
        existing[editingIndex] = product;
        isEditing = false;
        editingCategory = null;
        editingIndex = null;
        document.getElementById("edit-status").style.display = "none";
      } else {
        if (!imageBase64) {
          alert("Please select an image when adding a new product.");
          return;
        }
        existing.push(product);
      }

      db.ref("products/" + cat).set(existing, (error) => {
        if (error) {
          console.error("Error saving product:", error);
          alert("Error saving product. Check console for details. (Permission denied?)");
        } else {
          form.reset();
          optionsWrapper.style.display = "none";
        }
      });
    };

    if (isEditing && !imageFile) {
      buildAndSaveProduct(null);
    } else if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        buildAndSaveProduct(e.target.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      alert("Please select an image!");
    }
  });
});

// =======================
// EDIT PRODUCT
// =======================
window.editProduct = function (category, index) {
  db.ref(`products/${category}`).once("value", snap => {
    // Handle if snapshot.val() is null or not an array/object
    const categoryData = snap.val();
    const p = Array.isArray(categoryData) ? categoryData[index] : Object.values(categoryData || {})[index];

    if (!p) {
        console.error("Product not found for editing:", category, index);
        alert("Product not found. Please refresh and try again.");
        return;
    }

    document.getElementById("edit-status").style.display = "block";
    document.getElementById("product-category").value = category;
    document.getElementById("product-name").value = p.name;
    document.getElementById("product-price").value = p.price;
    categorySelect.dispatchEvent(new Event("change"));
    document.getElementById("product-options").value = p.options ? p.options.join(", ") : "";
    isEditing = true;
    editingCategory = category;
    editingIndex = index;
    form.scrollIntoView({ behavior: "smooth" });
  });
};

// =======================
// DELETE PRODUCT
// =======================
window.deleteProduct = function (category, index) {
  db.ref(`products/${category}`).once("value", snap => {
    const products = snap.val();
    if (products && Array.isArray(products)) { // Ensure it's an array before splicing
        products.splice(index, 1);
        db.ref(`products/${category}`).set(products, (error) => {
            if (error) {
                console.error("Error deleting product:", error);
                alert("Error deleting product. Check console for details. (Permission denied?)");
            }
        });
    } else {
        console.error("Could not delete: products for category are not an array or are null.", products);
        alert("Cannot delete product. Data structure mismatch.");
    }
  });
};

// =======================
// RESET TO DEFAULT
// =======================
resetBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset to default products? This will overwrite ALL current product data.")) {
    db.ref("products").set(defaultProducts, (error) => {
      if (error) {
        console.error("Error resetting products:", error);
        status.textContent = "❌ Reset failed. (Permission denied?)";
        status.style.color = "red";
      } else {
        localStorage.setItem("productData", JSON.stringify(defaultProducts)); // Keep this for the display site potentially
        status.textContent = "✅ Reset successful.";
        status.style.color = "green";
        setTimeout(() => status.textContent = "", 2000);
      }
    });
  }
});

// ==================================================
//  ESTIMATE STORAGE SPACE
// ====================================================
function estimateStorageUsage(data) {
  let totalBytes = 0;

  Object.keys(data).forEach(category => {
    const categoryData = data[category];
    // Handle cases where categoryData might be an object (if Firebase pushes objects)
    const productsArray = Array.isArray(categoryData) ? categoryData : Object.values(categoryData || {});

    productsArray.forEach(product => {
      if (product && product.image) { // Added null/undefined check for product
        // If base64, count its size
        if (product.image.startsWith("data:image")) {
          totalBytes += product.image.length;
        }
      }
    });
  });

  const totalKB = totalBytes / 1024;
  const usageEl = document.getElementById("storage-usage");

  // Optional alert when you're close to the 1MB soft limit
  if (totalKB > 800) {
    alert(`⚠️ Warning: You’re using ${totalKB.toFixed(1)} KB out of 1000 KB.\nYou’re nearing the database size limit.`);
  }

  // Optional display inside a span on dashboard
  if (usageEl) {
    usageEl.textContent = `Storage Used: ${totalKB.toFixed(1)} KB of 1000 KB`;
    usageEl.style.color = totalKB > 800 ? "red" : "green";
  }
}

// Initial call to listenToProducts is now inside onAuthStateChanged,
// so remove the standalone listenToProducts() call at the end.
// This ensures data loading only happens after admin is authenticated.
// You had listenToProducts() here.
