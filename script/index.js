// Wait for DOM to load
window.onload = function () {
  // Hero Slider
  let slideIndex = 0;
  const slides = document.querySelectorAll('.slide');
  function showSlides() {
    slides.forEach(slide => slide.classList.remove('active'));
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('active');
  }
  setInterval(showSlides, 5000);

// Header Scroll Behavior + Close Mobile Nav on Scroll
let prevScrollPos = window.pageYOffset;
const header = document.getElementById("main-header");
const mobileNav = document.getElementById("mobile-nav");
const menuToggle = document.getElementById("menu-toggle");

window.onscroll = () => {
  const currentScroll = window.pageYOffset;
  header.style.top = (prevScrollPos > currentScroll) ? "0" : "-80px";
  prevScrollPos = currentScroll;

  // Close mobile nav on scroll
  if (mobileNav.classList.contains("open")) {
    mobileNav.classList.remove("open");
  }
};

// Mobile Nav Toggle
menuToggle.onclick = () => {
  mobileNav.classList.toggle("open");
};

// Close mobile nav on outside click
document.addEventListener("click", (e) => {
  if (
    mobileNav.classList.contains("open") &&
    !mobileNav.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    mobileNav.classList.remove("open");
  }
});


  // Email Popup Logic
  const popup = document.getElementById("popup-overlay");
  const closeBtn = document.getElementById("close-popup");
  const notInterestedBtn = document.getElementById("not-interested-btn");
  const interestedBtn = document.getElementById("interested-btn");

  setTimeout(() => {
    if (!localStorage.getItem("popupDismissed")) {
      popup.style.display = "flex";
    }
  }, 3000);

  closeBtn.onclick = () => popup.style.display = "none";
  notInterestedBtn.onclick = () => {
    popup.style.display = "none";
    localStorage.setItem("popupDismissed", true);
  };

  interestedBtn.onclick = () => {
    const email = document.getElementById("popup-email").value;
    if (email) {
      alert("Thanks for subscribing, " + email);
      popup.style.display = "none";
      localStorage.setItem("popupDismissed", true);
    } else {
      alert("Please enter your email.");
    }
  };
};

document.querySelectorAll('.category-card').forEach(card => {
  card.addEventListener('click', () => {
    const category = card.dataset.category;
    window.location.href = `shop.html#${category}`; // or route accordingly
  });
});

// Cookie Banner Logic
const cookieBanner = document.getElementById('cookie-banner');
const acceptBtn = document.getElementById('accept-cookies');
const declineBtn = document.getElementById('decline-cookies');

acceptBtn.onclick = () => {
  cookieBanner.classList.add('hide');
};

declineBtn.onclick = () => {
  cookieBanner.classList.add('hide');
};
