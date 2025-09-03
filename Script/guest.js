document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");

  // ===== Sidebar toggle =====
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  // ===== Profile dropdown toggle =====
  const profileDropdown = document.getElementById("profileDropdown");
  const profileMenu = profileDropdown.querySelector(".dropdown-menu");

  profileDropdown.addEventListener("click", (e) => {
    e.stopPropagation();
    profileMenu.style.display =
      profileMenu.style.display === "block" ? "none" : "block";
  });

  // Close dropdown if clicked outside
  document.addEventListener("click", () => {
    profileMenu.style.display = "none";
  });

  // ===== Sidebar navigation toggle =====
  const sidebarLinks = document.querySelectorAll(".sidebar nav a");
  const mainSections = document.querySelectorAll("main > .tab-content");

  sidebarLinks.forEach((link) => {
    const targetTab = link.getAttribute("data-tab");
    link.addEventListener("click", (e) => {
      e.preventDefault();
      mainSections.forEach(sec => sec.style.display = "none");
      document.getElementById(targetTab).style.display = "block";

      // Reset Dashboard toggle when Home is clicked
      if (targetTab === "dashboard") {
        document.getElementById("dashboardView").style.display = "block";
        document.getElementById("newsView").style.display = "none";
        document.querySelectorAll(".home-toggle .toggle-btn").forEach(btn => btn.classList.remove("active"));
        document.querySelector(".home-toggle .toggle-btn[data-tab='dashboardView']").classList.add("active");
      }
    });
  });

  // ===== Dashboard / News toggle =====
  const toggleButtons = document.querySelectorAll(".home-toggle .toggle-btn");
  const dashboardView = document.getElementById("dashboardView");
  const newsView = document.getElementById("newsView");

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (btn.getAttribute("data-tab") === "dashboardView") {
        dashboardView.style.display = "block";
        newsView.style.display = "none";
      } else {
        dashboardView.style.display = "none";
        newsView.style.display = "block";
      }
    });
  });

  // ===== PROFILE MODAL FUNCTIONALITY =====
const profileModal = document.getElementById("profileModal");
const profileLink = document.querySelector("#profileDropdown .dropdown-menu a"); // first link (Profile)
const closeBtn = profileModal.querySelector(".close-btn");
const profileForm = document.getElementById("profileForm");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");

// Open modal when "Profile" clicked
profileLink.addEventListener("click", (e) => {
  e.preventDefault();
  profileModal.style.display = "flex"; // ensures centering
});

// Close modal when X clicked
closeBtn.addEventListener("click", () => {
  profileModal.style.display = "none";
});

// Close modal when clicking outside content
window.addEventListener("click", (e) => {
  if (e.target === profileModal) profileModal.style.display = "none";
});

// Handle form submit
profileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Profile changes saved! (Connect to backend later.)");
  profileModal.style.display = "none";
});

// Delete account
deleteAccountBtn.addEventListener("click", () => {
  const confirmDelete = confirm("Are you sure you want to delete your account?");
  if (confirmDelete) {
    alert("Account deleted! (Connect to backend.)");
    profileModal.style.display = "none";
  }
});
});
