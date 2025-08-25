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

  // ===== Courses toggle (inside dashboard) =====
  const courseButtons = document.querySelectorAll(".courses-toggle .toggle-btn");
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
  const mainSections = document.querySelectorAll("main > .tab-content");

  sidebarLinks.forEach((link) => {
    const targetTab = link.getAttribute("data-tab");
    if (!targetTab) return; // ignore links like "Courses" without data-tab

    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Hide all main sections
      mainSections.forEach((section) => (section.style.display = "none"));

      // Show dashboard or other section
      if (targetTab === "dashboard") {
        document.getElementById("dashboard").style.display = "block";
        document.getElementById("dashboardView").style.display = "block";
        document.getElementById("news").style.display = "none";
      } else {
        const activeTab = document.getElementById(targetTab);
        if (activeTab) activeTab.style.display = "block";
      }
    });
  });

  // ===== Courses submenu toggle in sidebar =====
  const coursesMenu = document.querySelector(".courses-menu");
  const coursesToggle = coursesMenu.querySelector("a"); // the main Courses link

  coursesToggle.addEventListener("click", (e) => {
    e.preventDefault(); // prevent navigating / opening main section
    coursesMenu.classList.toggle("active");

    // Optional: change arrow direction
    if (coursesMenu.classList.contains("active")) {
      coursesToggle.textContent = "Courses ▾";
    } else {
      coursesToggle.textContent = "Courses ▸";
    }
  });
});
// Select all course cards in dashboard
const courseCards = document.querySelectorAll(".courses-tab .course-card");

courseCards.forEach(card => {
  card.addEventListener("click", () => {
    const courseName = card.querySelector("p").textContent;

    // Show batches section
    const batchesSection = document.getElementById("batchesSection");
    batchesSection.style.display = "block";

    // Update course title
    document.getElementById("selectedCourse").textContent = courseName;

    // Populate batches dynamically
    const batchesList = batchesSection.querySelector(".batches-list");
    batchesList.innerHTML = ""; // clear previous batches

    ["Batch 1", "Batch 2"].forEach(batch => {
      const batchDiv = document.createElement("div");
      batchDiv.className = "batch-card";
      batchDiv.textContent = batch;
      batchesList.appendChild(batchDiv);
    });

    // Hide other main sections
    document.querySelectorAll("main > .tab-content").forEach(sec => {
      if (sec.id !== "batchesSection") sec.style.display = "none";
    });
  });
});

// Handle Create Batch button
document.querySelector(".create-batch-btn").addEventListener("click", () => {
  const batchName = prompt("Enter batch name:");
  if (batchName) {
    const batchDiv = document.createElement("div");
    batchDiv.className = "batch-card";
    batchDiv.textContent = batchName;
    document.querySelector(".batches-list").appendChild(batchDiv);
  }
});

