// Initialize Firebase (if not already done globally for both login and dashboard)
// It's usually fine to initialize once globally or at the top of each script.
// Ensure this part is identical to the one in dashboard.js
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
// Only initialize if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth(); // Get the Auth service

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("admin-email").value.trim();
  const password = document.getElementById("admin-password").value.trim();
  const errorDisplay = document.getElementById("login-error");

  // Clear previous errors
  errorDisplay.textContent = "";

  // Use Firebase Authentication to sign in
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      errorDisplay.style.color = "green";
      errorDisplay.textContent = "✅ Login successful!";

      // No need for localStorage.setItem("isYumbrixAdmin", "true");
      // Firebase Auth handles the session, and security rules will check auth.uid

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      errorDisplay.style.color = "red";
      // Display a user-friendly error message
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
        errorDisplay.textContent = "❌ Invalid email or password.";
      } else if (errorCode === 'auth/invalid-email') {
        errorDisplay.textContent = "❌ Invalid email format.";
      } else {
        errorDisplay.textContent = `❌ Login failed: ${errorMessage}`;
        console.error("Firebase Login Error:", error); // Log full error for debugging
      }
    });
});
