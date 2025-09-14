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

  // ===== SWITCH BUTTONS =====
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

  userMenuToggle?.addEventListener("click", () => {
    userDropdown?.classList.toggle("hidden");
    notifDropdown?.classList.add("hidden");
  });

  notifIcon?.addEventListener("click", () => {
    notifDropdown?.classList.toggle("hidden");
    userDropdown?.classList.add("hidden");
  });

  // ===== COURSE CARD FUNCTIONALITY =====
  const courseCards = document.querySelectorAll("#mycourses .course-card");
  const courseDetail = document.getElementById("course-detail");
  const courseTitle = courseDetail.querySelector(".course-title");
  const enrolledTab = document.getElementById("enrolled");
  const backBtn = courseDetail.querySelector(".back-btn");

  // Date formatting function
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const optionsDate = { month: "short", day: "numeric" };
    const optionsTime = { hour: "2-digit", minute: "2-digit" };
    const datePart = date.toLocaleDateString("en-US", optionsDate);
    const timePart = date.toLocaleTimeString("en-US", optionsTime);
    return `<div class="date-line">${datePart}</div><div class="time-line">${timePart}</div>`;
  }

  // Sample activities data
  const sampleActivities = [
    { activity: "Quiz 1", name: "John Doe", start: "2025-09-01T09:00:00", due: "2025-09-07T23:59:00", submitted: "2025-09-05T14:30:00", gradedStatus: "graded", score: "95/100" },
    { activity: "Assignment 1", name: "Jane Smith", start: "2025-09-03T10:00:00", due: "2025-09-10T23:59:00", submitted: "2025-09-11T10:30:00", gradedStatus: "late", score: "85/100" },
    { activity: "Quiz 1", name: "Mike Johnson", start: "2025-09-01T09:00:00", due: "2025-09-07T23:59:00", submitted: "Not submitted", gradedStatus: "missed", score: "0/100" },
    { activity: "Assignment 1", name: "Sarah Williams", start: "2025-09-03T10:00:00", due: "2025-09-10T23:59:00", submitted: "2025-09-08T15:45:00", gradedStatus: "pending", score: "-" }
  ];

  courseCards.forEach(card => {
    card.addEventListener("click", () => {
      const title = card.querySelector("h3")?.textContent || "Course Name";
      courseTitle.textContent = title;

      courseDetail.classList.remove("hidden");
      enrolledTab.classList.add("hidden");

      courseDetail.querySelector("#modules-view").classList.add("active");
      courseDetail.querySelector("#activities-view").classList.remove("active");

      const toggleBtns = courseDetail.querySelectorAll(".toggle-btn");
      toggleBtns.forEach(btn => btn.classList.remove("active"));
      courseDetail.querySelector(".toggle-btn[data-view='modules']").classList.add("active");

      courseDetail.scrollIntoView({ behavior: "smooth" });

      const activitiesTableBody = document.querySelector("#activities-view tbody");
      activitiesTableBody.innerHTML = "";

      sampleActivities.forEach(activity => {
        const row = document.createElement("tr");

        let gradedValue = "-";
        if (activity.gradedStatus === "graded") gradedValue = '<span class="check">✔</span>';
        else if (activity.gradedStatus === "pending") gradedValue = '<span class="pending">-</span>';
        else if (activity.gradedStatus === "late") gradedValue = '<span class="check">✔</span>';
        else if (activity.gradedStatus === "missed") gradedValue = '<span class="missed">✖</span>';

        let submittedValue = "-";
        if (activity.submitted !== "Not submitted") {
          submittedValue = formatDate(activity.submitted);
        }

        row.innerHTML = `
          <td>${activity.activity}</td>
          <td>${activity.name}</td>
          <td>${formatDate(activity.start)}</td>
          <td>${formatDate(activity.due)}</td>
          <td class="center-cell">${submittedValue}</td>
          <td class="center-cell">${gradedValue}</td>
          <td>${activity.score}</td>
        `;
        activitiesTableBody.appendChild(row);
      });
    });
  });

  // Course detail back button
  backBtn.addEventListener("click", () => {
    courseDetail.classList.add("hidden");
    enrolledTab.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Course detail toggle: Modules / Activities
  const courseToggleBtns = courseDetail.querySelectorAll(".toggle-btn");
  const courseDetailViews = courseDetail.querySelectorAll(".detail-view");
  courseToggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      courseToggleBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      courseDetailViews.forEach(v => {
        v.id === view + "-view" ? v.classList.add("active") : v.classList.remove("active");
      });
    });
  });

  // Subtopic accordion
  const subtopicToggles = courseDetail.querySelectorAll(".subtopic-toggle");
  subtopicToggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      const content = toggle.nextElementSibling;
      content.classList.toggle("active");
      toggle.querySelector(".arrow").classList.toggle("rotate");
    });
  });

  // ===== ACTIVITY DETAIL =====
  const activityDetail = document.getElementById("activity-detail");
  const activityTitle = activityDetail.querySelector(".activity-title");
  const activityBackBtn = activityDetail.querySelector(".activity-back");

  // Click activity row to show detail
  document.querySelector("#activities-view tbody").addEventListener("click", e => {
    const row = e.target.closest("tr");
    if (!row) return;

    const activityName = row.cells[0].textContent;
    activityTitle.textContent = activityName;

    activityDetail.classList.remove("hidden");
    courseDetail.querySelector(".detail-body").classList.add("hidden");

    const submissionsBody = activityDetail.querySelector("#submissions-view tbody");
    submissionsBody.innerHTML = "";

    sampleActivities
      .filter(act => act.activity === activityName)
      .forEach(act => {
        const row = document.createElement("tr");

        let gradedValue = "-";
        if (act.gradedStatus === "graded") gradedValue = "✔";
        else if (act.gradedStatus === "pending") gradedValue = "-";
        else if (act.gradedStatus === "late") gradedValue = "✔";
        else if (act.gradedStatus === "missed") gradedValue = "✖";

        let submittedValue = act.submitted !== "Not submitted" ? formatDate(act.submitted) : "-";

        row.innerHTML = `
          <td>${act.name}</td>
          <td class="center-cell">${submittedValue}</td>
          <td class="center-cell">${gradedValue}</td>
          <td>${act.score}</td>
        `;
        submissionsBody.appendChild(row);
      });
  });

  // Activity detail back button
  activityBackBtn.addEventListener("click", () => {
    activityDetail.classList.add("hidden");
    courseDetail.querySelector(".detail-body").classList.remove("hidden");
  });

  // Activity detail toggle: Instructions / Submissions
  const activityToggleBtns = activityDetail.querySelectorAll(".toggle-btn");
  const activityViews = activityDetail.querySelectorAll(".detail-view");
  activityToggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      activityToggleBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activityViews.forEach(v => {
        v.id === view + "-view" ? v.classList.add("active") : v.classList.remove("active");
      });
    });
  });
});
