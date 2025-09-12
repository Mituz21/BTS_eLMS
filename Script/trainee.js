document.addEventListener("DOMContentLoaded", () => {
  // ====== SIDEBAR & NAV ======
  const hamburger = document.getElementById("hamburger") || document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");
  const navLinks = document.querySelectorAll(".sidebar .nav a, .tab-link");
  const tabContents = document.querySelectorAll(".tab-content");

  if (hamburger) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("open");
    });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      const target = link.getAttribute("data-tab");
      tabContents.forEach(tab => {
        tab.classList.toggle("active", tab.id === target);
      });

      sidebar.classList.remove("open");

      // ====== RESET MY COURSES TAB WHEN ACTIVATED ======
      if (target === "mycourses") {
        // Reset Enrolled tab as active
        showEnrolledTab();

        // Hide course detail view
        courseDetail.classList.add("hidden");
        courseDetail.classList.remove("active");

        // Show all course boxes
        document.querySelectorAll("#mycourses .course-box").forEach(box =>
          box.classList.remove("hidden")
        );

        // Reset switch buttons
        myCourseSwitchButtons.forEach(b => b.classList.remove("active"));
        myCourseSwitchButtons[0].classList.add("active");
        myCourseSwitchInner.style.transform = `translateX(0%)`;
      }
    });
  });

  // ====== USER DROPDOWN ======
  const userMenuToggle = document.getElementById("userMenuToggle");
  const userAvatar = document.getElementById("userAvatar");
  const userDropdown = document.getElementById("userDropdown");
  const notifIcon = document.getElementById("notifIcon");
  const notifDropdown = document.getElementById("notifDropdown");

  function toggleUserDropdown() {
    userDropdown.classList.toggle("hidden");
    notifDropdown?.classList.add("hidden");
  }

  [userMenuToggle, userAvatar].forEach(el => {
    el?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleUserDropdown();
    });
  });

  notifIcon?.addEventListener("click", (e) => {
    e.stopPropagation();
    notifDropdown.classList.toggle("hidden");
    userDropdown?.classList.add("hidden");
  });

  document.addEventListener("click", (e) => {
    if (sidebar?.classList.contains("open") && !sidebar.contains(e.target) && !hamburger.contains(e.target)) {
      sidebar.classList.remove("open");
    }
    if (userDropdown && !userDropdown.contains(e.target) && !userMenuToggle.contains(e.target) && !userAvatar.contains(e.target)) {
      userDropdown.classList.add("hidden");
    }
    if (notifDropdown && !notifDropdown.contains(e.target) && !notifIcon.contains(e.target)) {
      notifDropdown.classList.add("hidden");
    }
  });

  // ====== DASHBOARD / NEWS SWITCH ======
  const switchButtons = document.querySelectorAll("#home .switch-btn");
  const switchInner = document.querySelector("#home .switch-inner");
  const dashboardTab = document.getElementById("dashboard");
  const newsTab = document.getElementById("news");

  switchButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      switchButtons.forEach(b => b.classList.remove("active"));
      document.querySelectorAll("#home .tab-inner").forEach(tab => tab.classList.remove("active"));
      btn.classList.add("active");
      switchInner.style.transform = `translateX(${index * 100}%)`;

      if (btn.dataset.tab === "dashboard") {
        dashboardTab.classList.add("active");
      } else if (btn.dataset.tab === "news") {
        newsTab.classList.add("active");
      }
    });
  });

  // ====== MY COURSES SWITCH ======
  const myCourseSwitchButtons = document.querySelectorAll("#mycourses .switch-btn");
  const myCourseSwitchInner = document.querySelector("#mycourses .switch-inner");
  const enrolledTab = document.getElementById("enrolled");
  const completedTab = document.getElementById("completed");

  function showEnrolledTab() {
    enrolledTab.classList.add("active");
    completedTab.classList.remove("active");
  }

  function showCompletedTab() {
    completedTab.classList.add("active");
    enrolledTab.classList.remove("active");
  }

  showEnrolledTab();

  myCourseSwitchButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      myCourseSwitchButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      myCourseSwitchInner.style.transform = `translateX(${index * 100}%)`;

      if (btn.dataset.tab === "enrolled") showEnrolledTab();
      else showCompletedTab();
    });
  });

  // ====== COURSE DETAIL VIEW ======
  const courseDetail = document.getElementById("course-detail");
  const backBtn = courseDetail?.querySelector(".back-btn");
  const toggleBtns = courseDetail?.querySelectorAll(".toggle-btn");
  const views = courseDetail?.querySelectorAll(".detail-view");

  // Open detail view when clicking a course
  document.querySelectorAll("#mycourses .course-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll("#mycourses .course-box").forEach(box => box.classList.add("hidden"));
      courseDetail.classList.remove("hidden");
      courseDetail.classList.add("active");
    });
  });

  // Back button
  backBtn?.addEventListener("click", () => {
    courseDetail.classList.add("hidden");
    courseDetail.classList.remove("active");
    document.querySelectorAll("#mycourses .course-box").forEach(box => box.classList.remove("hidden"));
  });

  // Toggle detail tabs
  toggleBtns?.forEach(btn => {
    btn.addEventListener("click", () => {
      toggleBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const view = btn.dataset.view;
      views.forEach(v => v.classList.remove("active"));
      document.getElementById(view + "-view")?.classList.add("active");
    });
  });

  // Subtopic toggle
  document.querySelectorAll(".subtopic-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      content.style.display = content.style.display === "block" ? "none" : "block";
      btn.classList.toggle("active");
    });
  });

  // ====== ACTIVITIES TABLE ======
  const activitiesData = [
    {
      module: "Basic Competency",
      subtopic: "Introduction",
      name: "Activity 1",
      start: "2025-08-09T10:56:00",
      due: "2025-08-10T12:30:00",
      submittedStatus: "submitted",
      gradedStatus: "graded",
      score: 10,
      totalScore: 30
    },
    {
      module: "Common Competency",
      subtopic: "Topic 1",
      name: "Activity 2",
      start: "2025-08-09T11:00:00",
      due: "2025-08-12T15:00:00",
      submittedStatus: "none",
      gradedStatus: "none",
      score: 0,
      totalScore: 20
    },
    {
      module: "Core Competency",
      subtopic: "Advanced Topic",
      name: "Activity 3",
      start: "2025-08-10T09:00:00",
      due: "2025-08-15T14:00:00",
      submittedStatus: "missed",
      gradedStatus: "missed",
      score: 0,
      totalScore: 25
    }
  ];

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const optionsDate = { month: "short", day: "numeric" };
    const optionsTime = { hour: "2-digit", minute: "2-digit" };
    const datePart = date.toLocaleDateString("en-US", optionsDate);
    const timePart = date.toLocaleTimeString("en-US", optionsTime);
    return `<div class="date-line">${datePart}</div><div class="time-line">${timePart}</div>`;
  }

  const activitiesTbody = document.querySelector("#activities-view tbody");
  activitiesTbody.innerHTML = "";

  activitiesData.forEach(act => {
    const row = document.createElement("tr");

let submittedSymbol = "-";
if (act.submittedStatus === "submitted") submittedSymbol = '<span class="check">✔</span>';
else if (act.submittedStatus === "missed") submittedSymbol = '<span class="cross">✖</span>';

let gradedValue = "-";
if (act.gradedStatus === "graded") gradedValue = '<span class="check">✔</span>';
else if (act.gradedStatus === "missed") gradedValue = '<span class="flag">⚑</span>';


    let scoreDisplay = "-";
    if (act.gradedStatus === "graded") scoreDisplay = `${act.score}/${act.totalScore}`;
    else if (act.gradedStatus === "missed") scoreDisplay = `0/${act.totalScore}`;

    row.innerHTML = `
      <td class="activity-name">${act.name} - ${act.module} ${act.subtopic}</td>
      <td>${formatDate(act.start)}</td>
      <td>${formatDate(act.due)}</td>
      <td class="center-cell">${submittedSymbol}</td>
      <td class="center-cell">${gradedValue}</td>
      <td class="center-cell">${scoreDisplay}</td>
    `;
    activitiesTbody.appendChild(row);
  });

  // ====== ENROLL BUTTON ======
  const enrollBtns = document.querySelectorAll(".enroll-btn");
  const enrollModal = document.getElementById("enrollModal");
  const confirmEnroll = document.getElementById("confirmEnroll");
  const cancelEnroll = document.getElementById("cancelEnroll");

  let selectedCourse = null;

  enrollBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedCourse = btn.closest(".course-card");
      enrollModal.classList.remove("hidden");
    });
  });

  cancelEnroll?.addEventListener("click", () => {
    enrollModal.classList.add("hidden");
    selectedCourse = null;
  });

  confirmEnroll?.addEventListener("click", () => {
    enrollModal.classList.add("hidden");
    if (selectedCourse) {
      alert("✅ You have enrolled in: " + selectedCourse.querySelector("h3").textContent);
      // TODO: backend/API logic
    }
    selectedCourse = null;
  });
});
const enrollmentRequests = [
  { course: "Intro to JavaScript", status: "pending...", remarks: "-" },
  { course: "Advanced CSS", status: "accepted", remarks: "-" },
  { course: "Database Management", status: "rejected", remarks: "Prerequisite not met" }
];

const requestsBody = document.getElementById("requests-body");

enrollmentRequests.forEach(req => {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td class="course-name">${req.course}</td>
    <td class="status ${req.status}">${req.status.charAt(0).toUpperCase() + req.status.slice(1)}</td>
    <td>${req.remarks}</td>
    <td><button class="cancel-btn-request">Cancel Request</button></td>
  `;

  // Cancel button click
  row.querySelector(".cancel-btn-request").addEventListener("click", () => {
    alert(`Request for ${req.course} has been canceled.`);
    row.remove(); // Remove row from table
  });

  requestsBody.appendChild(row);
});
document.addEventListener("DOMContentLoaded", () => {
  const profileModal = document.getElementById("profileModal");
  const profileLink = document.getElementById("profileLink"); // Profile link in dropdown
  const closeProfileBtn = document.getElementById("closeProfileModal");
  const cancelProfileBtn = profileModal.querySelector(".cancel-btn");
  const changeProfileBtn = document.getElementById("changeProfileBtn");
  const profileUpload = document.getElementById("profileUpload");
  const profilePreview = document.getElementById("profilePreview");

  // Open modal when Profile link is clicked
  profileLink.addEventListener("click", (e) => {
    e.preventDefault(); // prevent page jump
    profileModal.classList.remove("hidden");
    document.getElementById("userDropdown").classList.add("hidden"); // close dropdown
  });

  // Close modal on X or Cancel
  closeProfileBtn.addEventListener("click", () => profileModal.classList.add("hidden"));
  cancelProfileBtn.addEventListener("click", () => profileModal.classList.add("hidden"));

  // Upload profile image preview
  changeProfileBtn.addEventListener("click", () => profileUpload.click());

  profileUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { profilePreview.src = ev.target.result; };
      reader.readAsDataURL(file);
    }
  });

  // Close modal if clicking outside content
  profileModal.addEventListener("click", (e) => {
    if (e.target === profileModal) profileModal.classList.add("hidden");
  });
});
