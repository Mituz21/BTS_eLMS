document.addEventListener("DOMContentLoaded", () => {
  const switchButtons = document.querySelectorAll(".switch-btn");
  const switchInner = document.getElementById("switchInner");
  const dashboardTab = document.getElementById("dashboard");
  const newsTab = document.getElementById("news");
  const postContainer = document.querySelector(".post-container");

  // Switch between Dashboard and News
  switchButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      // Reset active state
      switchButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Move highlight
      switchInner.style.transform = index === 0 ? "translateX(0)" : "translateX(100%)";

      // Show the correct tab
      if (btn.dataset.tab === "dashboard") {
        dashboardTab.classList.add("active");
        newsTab.classList.remove("active");
        postContainer.classList.remove("active"); // hide + Post
      } else {
        newsTab.classList.add("active");
        dashboardTab.classList.remove("active");
        postContainer.classList.add("active"); // show + Post
      }
    });
  });

  // Example Post button functionality
  const postButton = document.createElement("button");
  postButton.classList.add("primary-btn");
  postButton.textContent = "+ Post";
  postContainer.appendChild(postButton);

  postButton.addEventListener("click", () => {
    alert("Post button clicked!");
    // Here you can open a modal or show a form for new posts
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const courseCards = document.querySelectorAll(".course-card");
  const courseGrid = document.getElementById("courseGrid");
  const courseDetail = document.getElementById("courseDetail");
  const backBtn = document.getElementById("backToCourses");
  const courseTitle = document.getElementById("courseTitle");
  const courseCode = document.getElementById("courseCode");

  // Example data for courses
  const courses = {
    wd101: {
      title: "Web Development",
      code: "WD101 | 40 hours",
      basic: ["Use computer systems", "Apply safety standards"],
      common: ["Create web layout", "Use HTML and CSS"],
      core: ["Develop dynamic websites", "Deploy web applications"]
    },
    db201: {
      title: "Database Management",
      code: "DB201 | 60 hours",
      basic: ["Apply ICT concepts", "Maintain database security"],
      common: ["Design relational databases", "Use SQL queries"],
      core: ["Build database-driven apps", "Optimize database performance"]
    },
    prg101: {
      title: "Programming Basics",
      code: "PRG101 | 30 hours",
      basic: ["Understand programming logic", "Use algorithms"],
      common: ["Write simple code", "Debug programs"],
      core: ["Develop console apps", "Apply structured programming"]
    }
  };

  // Open detail view
  courseCards.forEach(card => {
    card.addEventListener("click", () => {
      const courseKey = card.dataset.course;
      const data = courses[courseKey];

      if (data) {
        courseTitle.textContent = data.title;
        courseCode.textContent = data.code;

        // Fill lists
        document.getElementById("basicList").innerHTML = data.basic.map(i => `<li>${i}</li>`).join("");
        document.getElementById("commonList").innerHTML = data.common.map(i => `<li>${i}</li>`).join("");
        document.getElementById("coreList").innerHTML = data.core.map(i => `<li>${i}</li>`).join("");

        courseGrid.classList.add("hidden");
        courseDetail.classList.remove("hidden");
      }
    });
  });

  // Back to course grid
  backBtn.addEventListener("click", () => {
    courseDetail.classList.add("hidden");
    courseGrid.classList.remove("hidden");
  });
});
// ===== SIDEBAR TAB SWITCHING =====
document.addEventListener("DOMContentLoaded", () => {
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".tab-content");

  tabLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      // Reset all tabs
      tabLinks.forEach(l => l.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      // Activate clicked tab
      link.classList.add("active");
      const target = link.getAttribute("data-tab");
      document.getElementById(target).classList.add("active");
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const navLinks = document.querySelectorAll(".sidebar .nav a");

  // Toggle sidebar
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  // Close sidebar when clicking overlay
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Close sidebar when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const userMenuToggle = document.getElementById("userMenuToggle");
  const userAvatar = document.getElementById("userAvatar");
  const userDropdown = document.getElementById("userDropdown");
  const notifDropdown = document.getElementById("notifDropdown");

  if (!userMenuToggle || !userAvatar || !userDropdown) return;

  // Handle clicks on both username + avatar
  [userMenuToggle, userAvatar].forEach(el => {
    el.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent triggering document click
      userDropdown.classList.toggle("hidden");

      // Close notification dropdown if open
      if (notifDropdown) {
        notifDropdown.classList.add("hidden");
      }
    });
  });

  // Close dropdown if clicked outside
  document.addEventListener("click", (e) => {
    if (!userDropdown.contains(e.target)) {
      userDropdown.classList.add("hidden");
    }
  });
});

const notifIcon = document.getElementById("notifIcon");
const notifDropdown = document.getElementById("notifDropdown");

if (notifIcon && notifDropdown) {
  notifIcon.addEventListener("click", (e) => {
    e.stopPropagation(); 
    notifDropdown.classList.toggle("hidden");
    userDropdown.classList.add("hidden"); // close profile if open
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!notifDropdown.contains(e.target) && e.target !== notifIcon) {
      notifDropdown.classList.add("hidden");
    }
  });
}
const profileLink = document.querySelector("#userDropdown a[href='#']"); // Profile link
const profileModal = document.getElementById("profileModal");
const closeProfileModal = document.getElementById("closeProfileModal");

if (profileLink && profileModal && closeProfileModal) {
  // Open modal when clicking "Profile"
  profileLink.addEventListener("click", (e) => {
    e.preventDefault();
    userDropdown.classList.add("hidden"); // hide dropdown
    profileModal.classList.remove("hidden");
  });

  // Close modal
  closeProfileModal.addEventListener("click", () => {
    profileModal.classList.add("hidden");
  });

  // Close modal when clicking outside
  profileModal.addEventListener("click", (e) => {
    if (e.target === profileModal) {
      profileModal.classList.add("hidden");
    }
  });

  // Handle form submission
  const profileForm = document.getElementById("profileForm");
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Profile updated successfully!"); 
    // TODO: Send data to backend via fetch/ajax
    profileModal.classList.add("hidden");
  });
}
const cancelProfile = document.getElementById("cancelProfile");
// Cancel button closes modal
if (cancelProfile) {
  cancelProfile.addEventListener("click", () => {
    profileModal.classList.add("hidden");
  });
}
document.getElementById('changeProfileBtn').addEventListener('click', function() {
  document.getElementById('profileUpload').click();
});

document.getElementById('profileUpload').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('profilePreview').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});
// Elements
document.addEventListener("DOMContentLoaded", () => {
const deleteAccLink = Array.from(document.querySelectorAll("#userDropdown a"))
  .find(a => a.textContent.trim() === "Delete Acc");
  const deleteAccountModal = document.getElementById("deleteAccountModal");
  const closeDeleteModal = document.getElementById("closeDeleteModal");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  if (!deleteAccLink || !deleteAccountModal) return;

  // Open modal
  deleteAccLink.addEventListener("click", (e) => {
    e.preventDefault();
    deleteAccountModal.classList.remove("hidden");
  });

  // Close modal
  closeDeleteModal.addEventListener("click", () => {
    deleteAccountModal.classList.add("hidden");
  });
  cancelDeleteBtn.addEventListener("click", () => {
    deleteAccountModal.classList.add("hidden");
  });

  // Confirm delete
  confirmDeleteBtn.addEventListener("click", () => {
    alert("Your account has been deleted.");
    window.location.href = "../HTML/homepage.html"; 
  });
});
