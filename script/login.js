document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("admin-email").value.trim();
  const password = document.getElementById("admin-password").value.trim();
  const errorDisplay = document.getElementById("login-error");

  // ✅ Your default login credentials
  const defaultEmail = "admin@yumbrix.com";
  const defaultPassword = "admin12345";

  if (email === defaultEmail && password === defaultPassword) {
    errorDisplay.style.color = "green";
    errorDisplay.textContent = "✅ Login successful!";
    
    // Small delay before redirecting
    setTimeout(() => {
      localStorage.setItem("isYumbrixAdmin", "true");
      window.location.href = "dashboard.html";
    }, 1000);
    
  } else {
    errorDisplay.style.color = "red";
    errorDisplay.textContent = "❌ Wrong email or password.";
  }
});
