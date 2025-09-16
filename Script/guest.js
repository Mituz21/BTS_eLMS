// ===== SWITCH BETWEEN DASHBOARD & NEWS =====
document.addEventListener("DOMContentLoaded", () => {
  const switchButtons = document.querySelectorAll(".switch-btn");
  const switchInner = document.getElementById("switchInner");
  const dashboardTab = document.getElementById("dashboard");
  const newsTab = document.getElementById("news");
  const postContainer = document.querySelector(".post-container");

  switchButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      switchButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      switchInner.style.transform = index === 0 ? "translateX(0)" : "translateX(100%)";

      if (btn.dataset.tab === "dashboard") {
        dashboardTab.classList.add("active");
        newsTab.classList.remove("active");
        if (postContainer) postContainer.classList.remove("active");
      } else {
        newsTab.classList.add("active");
        dashboardTab.classList.remove("active");
        if (postContainer) postContainer.classList.add("active");
      }
    });
  });

  if (postContainer) {
    const postButton = document.createElement("button");
    postButton.classList.add("primary-btn");
    postButton.textContent = "+ Post";
    postContainer.appendChild(postButton);

    postButton.addEventListener("click", () => {
      alert("Post button clicked!");
    });
  }
});

// ===== COURSE HANDLING =====
document.addEventListener("DOMContentLoaded", () => {
  const enrollButtons = document.querySelectorAll(".enroll-btn");
  const floatNotif = document.getElementById("floatNotif");
  const courseCards = document.querySelectorAll(".course-card");
  const courseGrid = document.getElementById("courseGrid");
  const courseDetail = document.getElementById("courseDetail");
  const backBtn = document.getElementById("backToCourses");
  const courseTitle = document.getElementById("courseTitle");
  const courseCode = document.getElementById("courseCode");

  // Mark all as not enrolled by default
  courseCards.forEach(card => card.dataset.enrolled = "false");

  // Enroll / Unenroll
  enrollButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const courseCard = btn.closest(".course-card");
      const courseName = courseCard.querySelector(".label-text").textContent;

      if (btn.textContent === "Enroll") {
        btn.textContent = "Unenroll";
        courseCard.dataset.enrolled = "true";
        showFloatNotif(`✅ You are now enrolled in ${courseName}`);
      } else {
        btn.textContent = "Enroll";
        courseCard.dataset.enrolled = "false";
        showFloatNotif(`❌ You have unenrolled from ${courseName}`);
      }
    });
  });

  // Open course detail only if enrolled
  courseCards.forEach(card => {
    card.addEventListener("click", () => {
      if (card.dataset.enrolled === "true") {
        openCourseDetail(card);
      } else {
        showFloatNotif("🔒 Please enroll first to access this course");
      }
    });
  });

  function showFloatNotif(message) {
    floatNotif.textContent = message;
    floatNotif.classList.add("show");
    floatNotif.classList.remove("hidden");

    setTimeout(() => {
      floatNotif.classList.remove("show");
      setTimeout(() => {
        floatNotif.classList.add("hidden");
      }, 300);
    }, 2000);
  }

  function openCourseDetail(card) {
    courseTitle.textContent = card.querySelector(".label-text").textContent;
    courseCode.textContent = card.querySelector(".sub-text").textContent;
    courseGrid.classList.add("hidden");
    courseDetail.classList.remove("hidden");
  }

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
      tabLinks.forEach(l => l.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      link.classList.add("active");
      const target = link.getAttribute("data-tab");
      document.getElementById(target).classList.add("active");
    });
  });
});

// ===== SIDEBAR TOGGLE =====
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const navLinks = document.querySelectorAll(".sidebar .nav a");

  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
    });
  });
});

// ===== USER MENU =====
document.addEventListener("DOMContentLoaded", () => {
  const userMenuToggle = document.getElementById("userMenuToggle");
  const userAvatar = document.getElementById("userAvatar");
  const userDropdown = document.getElementById("userDropdown");
  const notifDropdown = document.getElementById("notifDropdown");

  if (!userMenuToggle || !userAvatar || !userDropdown) return;

  [userMenuToggle, userAvatar].forEach(el => {
    el.addEventListener("click", e => {
      e.stopPropagation();
      userDropdown.classList.toggle("hidden");
      if (notifDropdown) notifDropdown.classList.add("hidden");
    });
  });

  document.addEventListener("click", e => {
    if (!userDropdown.contains(e.target)) {
      userDropdown.classList.add("hidden");
    }
  });
});

// ===== NOTIFICATIONS =====
const notifIcon = document.getElementById("notifIcon");
const notifDropdown = document.getElementById("notifDropdown");
const userDropdown = document.getElementById("userDropdown");

if (notifIcon && notifDropdown) {
  notifIcon.addEventListener("click", e => {
    e.stopPropagation();
    notifDropdown.classList.toggle("hidden");
    userDropdown.classList.add("hidden");
  });

  document.addEventListener("click", e => {
    if (!notifDropdown.contains(e.target) && e.target !== notifIcon) {
      notifDropdown.classList.add("hidden");
    }
  });
}

// ===== PROFILE MODAL =====
const profileLink = document.querySelector("#userDropdown a[href='#']");
const profileModal = document.getElementById("profileModal");
const closeProfileModal = document.getElementById("closeProfileModal");

if (profileLink && profileModal && closeProfileModal) {
  profileLink.addEventListener("click", e => {
    e.preventDefault();
    userDropdown.classList.add("hidden");
    profileModal.classList.remove("hidden");
  });

  closeProfileModal.addEventListener("click", () => {
    profileModal.classList.add("hidden");
  });

  profileModal.addEventListener("click", e => {
    if (e.target === profileModal) profileModal.classList.add("hidden");
  });
}

document.getElementById("changeProfileBtn").addEventListener("click", () => {
  document.getElementById("profileUpload").click();
});

document.getElementById("profileUpload").addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = ev => {
      document.getElementById("profilePreview").src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// ===== DELETE ACCOUNT MODAL =====
document.addEventListener("DOMContentLoaded", () => {
  const deleteAccLink = Array.from(document.querySelectorAll("#userDropdown a"))
    .find(a => a.textContent.trim() === "Delete Acc");
  const deleteAccountModal = document.getElementById("deleteAccountModal");
  const closeDeleteModal = document.getElementById("closeDeleteModal");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  if (!deleteAccLink || !deleteAccountModal) return;

  deleteAccLink.addEventListener("click", e => {
    e.preventDefault();
    deleteAccountModal.classList.remove("hidden");
  });

  closeDeleteModal.addEventListener("click", () => {
    deleteAccountModal.classList.add("hidden");
  });
  cancelDeleteBtn.addEventListener("click", () => {
    deleteAccountModal.classList.add("hidden");
  });

  confirmDeleteBtn.addEventListener("click", () => {
    alert("Your account has been deleted.");
    window.location.href = "../HTML/homepage.html";
  });
});
