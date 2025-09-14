document.addEventListener("DOMContentLoaded", () => {
  // ===== TAB SWITCHING =====
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".tab-content");

  tabLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      tabLinks.forEach(l => l.classList.remove("active"));
      tabContents.forEach(t => t.classList.remove("active"));

      link.classList.add("active");
      const tab = document.getElementById(link.dataset.tab);
      if (tab) tab.classList.add("active");
    });
  });

  // ===== SWITCH BUTTONS (for dashboard/news or enrolled/completed) =====
  const switchGroups = document.querySelectorAll(".switch-oval");
  switchGroups.forEach(group => {
    const buttons = group.querySelectorAll(".switch-btn");
    const inner = group.querySelector(".switch-inner");

    buttons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const parentSection = group.closest(".tab-content");
        const views = parentSection.querySelectorAll(".tab-inner");
        views.forEach(v => v.classList.remove("active"));

        const targetView = parentSection.querySelector(`#${btn.dataset.tab}`);
        if (targetView) targetView.classList.add("active");

        inner.style.transform = `translateX(${index * 100}%)`;
      });
    });
  });

  // ===== USER MENU & NOTIFICATIONS =====
  const userMenuToggle = document.getElementById("userMenuToggle");
  const userDropdown = document.getElementById("userDropdown");
  const notifIcon = document.getElementById("notifIcon");
  const notifDropdown = document.getElementById("notifDropdown");

  userMenuToggle.addEventListener("click", () => {
    userDropdown.classList.toggle("hidden");
    notifDropdown.classList.add("hidden");
  });

  notifIcon.addEventListener("click", () => {
    notifDropdown.classList.toggle("hidden");
    userDropdown.classList.add("hidden");
  });

  // ===== ENROLL MODAL =====
  const enrollBtns = document.querySelectorAll(".enroll-btn");
  const enrollModal = document.getElementById("enrollModal");
  const cancelEnroll = document.getElementById("cancelEnroll");

  enrollBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      enrollModal.classList.remove("hidden");
    });
  });

  if (cancelEnroll) {
    cancelEnroll.addEventListener("click", () => {
      enrollModal.classList.add("hidden");
    });
  }

  // ===== COURSE DETAIL VIEW =====
  const courseCards = document.querySelectorAll("#mycourses .course-card");
  const courseDetail = document.getElementById("course-detail");
  const backBtn = courseDetail ? courseDetail.querySelector(".back-btn") : null;

  courseCards.forEach(card => {
    card.addEventListener("click", () => {
      if (courseDetail) courseDetail.classList.remove("hidden");

      // Optional: update course title dynamically
      const title = card.querySelector("h3")?.textContent;
      const courseTitle = courseDetail?.querySelector(".course-title");
      if (courseTitle && title) courseTitle.textContent = title;
    });
  });

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      courseDetail.classList.add("hidden");
    });
  }

  // ===== MODULE / ACTIVITY TOGGLE =====
  const toggleBtns = document.querySelectorAll(".toggle-btn");
  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".toggle-wrapper");
      const buttons = parent.querySelectorAll(".toggle-btn");
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const container = btn.closest(".detail-body");
      const views = container.querySelectorAll(".detail-view");
      views.forEach(v => v.classList.remove("active"));

      const target = container.querySelector(`#${btn.dataset.view}-view`);
      if (target) target.classList.add("active");
    });
  });

  // ===== SUBTOPIC ACCORDION =====
  const subtopicToggles = document.querySelectorAll(".subtopic-toggle");
  subtopicToggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      const content = toggle.nextElementSibling;
      if (content) content.classList.toggle("active");
      const arrow = toggle.querySelector(".arrow");
      if (arrow) arrow.classList.toggle("rotate");
    });
  });
});
