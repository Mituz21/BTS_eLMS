document.addEventListener("DOMContentLoaded", () => {
  // ===== Sidebar & dropdowns =====
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const profileDropdown = document.getElementById("profileDropdown");
  const notifDropdown = document.getElementById("notifDropdown");
  const profileMenu = profileDropdown.querySelector(".dropdown-menu");
  const notifMenu = notifDropdown.querySelector(".notif-menu");

  hamburger.addEventListener("click", () => sidebar.classList.toggle("active"));

  profileDropdown.addEventListener("click", e => {
    e.stopPropagation();
    profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
    notifMenu.style.display = "none";
  });

  notifDropdown.addEventListener("click", e => {
    e.stopPropagation();
    notifMenu.style.display = notifMenu.style.display === "block" ? "none" : "block";
    profileMenu.style.display = "none";
  });

  document.addEventListener("click", () => {
    profileMenu.style.display = "none";
    notifMenu.style.display = "none";
  });

  // ===== Sidebar navigation =====
  const sidebarLinks = document.querySelectorAll(".sidebar nav a");
  const tabs = document.querySelectorAll(".tab-content");

  sidebarLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = link.getAttribute("data-tab");
      tabs.forEach(t => t.style.display = "none");
      const activeTab = document.getElementById(target);
      if (activeTab) activeTab.style.display = "block";
    });
  });

  // ===== Home toggle =====
  const toggleButtons = document.querySelectorAll(".home-toggle .toggle-btn");
  toggleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      toggleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("dashboardView").style.display = btn.dataset.tab === "dashboardView" ? "block" : "none";
      document.getElementById("newsView").style.display = btn.dataset.tab === "newsView" ? "block" : "none";
    });
  });

  // ===== Activity creation & deletion =====
  const activitiesSection = document.getElementById("activitiesSection");
  const batchesList = activitiesSection.querySelector(".batches-list");

  activitiesSection.querySelectorAll(".create-batch-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = prompt("Activity Title:");
      if (!name) return;
      const start = prompt("Start Date (YYYY-MM-DD):");
      const due = prompt("Due Date (YYYY-MM-DD):");
      const late = confirm("Allow late submission?");
      
      const card = document.createElement("div");
      card.className = "batch-card";
      card.innerHTML = `
        <strong>${name}</strong>
        <p>Start: ${start}</p>
        <p>Due: ${due}</p>
        <p>Late Submission: ${late ? "Allowed" : "Not Allowed"}</p>
        <div>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      `;
      batchesList.appendChild(card);

      card.querySelector(".delete-btn").addEventListener("click", () => card.remove());
      card.querySelector(".edit-btn").addEventListener("click", () => alert("Implement edit functionality"));
    });
  });

  // ===== Edit Profile Modal =====
  const editProfileBtn = document.getElementById("editProfileBtn");
  const editProfileModal = document.getElementById("editProfileModal");
  const modalClose = editProfileModal.querySelector(".close");

  editProfileBtn.addEventListener("click", e => {
    e.preventDefault();
    editProfileModal.style.display = "block";
  });

  modalClose.addEventListener("click", () => editProfileModal.style.display = "none");

  window.addEventListener("click", e => {
    if (e.target === editProfileModal) editProfileModal.style.display = "none";
  });
});
