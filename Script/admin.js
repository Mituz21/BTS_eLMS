document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const profileDropdown = document.getElementById("profileDropdown");
  const notifDropdown = document.getElementById("notifDropdown");

  const profileMenu = profileDropdown.querySelector(".dropdown-menu");
  const notifMenu = notifDropdown.querySelector(".notif-menu");

  // ===== Sidebar toggle =====
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  // ===== Profile dropdown toggle =====
  profileDropdown.addEventListener("click", (e) => {
    e.stopPropagation();
    profileMenu.style.display =
      profileMenu.style.display === "block" ? "none" : "block";
    notifMenu.style.display = "none";
  });

  // ===== Notification dropdown toggle =====
  notifDropdown.addEventListener("click", (e) => {
    e.stopPropagation();
    notifMenu.style.display =
      notifMenu.style.display === "block" ? "none" : "block";
    profileMenu.style.display = "none";
  });

  // ===== Close dropdowns if clicked outside =====
  document.addEventListener("click", () => {
    profileMenu.style.display = "none";
    notifMenu.style.display = "none";
  });

// ===== Dashboard / News toggle =====
const toggleButtons = document.querySelectorAll(".home-toggle .toggle-btn");
const dashboardView = document.getElementById("dashboardView");
const newsView = document.getElementById("news");

toggleButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    toggleButtons.forEach((b) => b.classList.remove("active"));
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


  // ===== Courses toggle =====
  const courseButtons = document.querySelectorAll(
    ".courses-toggle .toggle-btn"
  );
  const courseTabs = document.querySelectorAll(".courses-tab");

  courseButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      courseButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      courseTabs.forEach((tab) => (tab.style.display = "none"));
      const tabId = btn.getAttribute("data-course-tab");
      document.getElementById(tabId).style.display =
        tabId === "archived" ? "block" : "flex";
    });
  });

 // ===== Sidebar navigation toggle =====
const sidebarLinks = document.querySelectorAll(".sidebar nav a");

// These are the main sections (dashboard, trainer, trainee, etc.)
const mainSections = document.querySelectorAll("main > .tab-content");

sidebarLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetTab = link.getAttribute("data-tab");

    // Hide all main sections
    mainSections.forEach((section) => (section.style.display = "none"));

    if (targetTab === "dashboard") {
      // Show dashboard section (always includes dashboard/news + courses)
      document.getElementById("dashboard").style.display = "block";

      // Default to DashboardView visible, News hidden
      document.getElementById("dashboardView").style.display = "block";
      document.getElementById("news").style.display = "none";
    } else {
      // Show selected section normally
      const activeTab = document.getElementById(targetTab);
      if (activeTab) {
        activeTab.style.display = "block";
      }
    }
  });
});
});
