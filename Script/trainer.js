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

  // Sample activities data with student names and grading status
  const sampleActivities = [
    { 
      id: 1,
      activity: "Quiz 1", 
      name: "Introduction Quiz", 
      description: "Test your knowledge on basic concepts",
      students: [
        { 
          name: "John Doe", 
          start: "2025-09-01T09:00:00", 
          due: "2025-09-07T23:59:00", 
          submitted: "2025-09-05T14:30:00", 
          gradedStatus: "graded", 
          score: "95/100" 
        },
        { 
          name: "Mike Johnson", 
          start: "2025-09-01T09:00:00", 
          due: "2025-09-07T23:59:00", 
          submitted: "Not submitted", 
          gradedStatus: "missed", 
          score: "0/100" 
        }
      ]
    },
    { 
      id: 2,
      activity: "Assignment 1", 
      name: "First Programming Task", 
      description: "Create a simple program using the concepts learned",
      students: [
        { 
          name: "Jane Smith", 
          start: "2025-09-03T10:00:00", 
          due: "2025-09-10T23:59:00", 
          submitted: "2025-09-11T10:30:00", 
          gradedStatus: "late", 
          score: "85/100" 
        },
        { 
          name: "Sarah Williams", 
          start: "2025-09-03T10:00:00", 
          due: "2025-09-10T23:59:00", 
          submitted: "2025-09-08T15:45:00", 
          gradedStatus: "pending", 
          score: "-" 
        }
      ]
    }
  ];

  courseCards.forEach(card => {
    card.addEventListener("click", () => {
      // Set course title
      const title = card.querySelector("h3")?.textContent || "Course Name";
      courseTitle.textContent = title;

      // Show course detail, hide enrolled list
      courseDetail.classList.remove("hidden");
      enrolledTab.classList.add("hidden");

      // Default toggle: show modules, hide activities
      courseDetail.querySelector("#modules-view").classList.add("active");
      courseDetail.querySelector("#activities-view").classList.remove("active");
      courseDetail.querySelector("#activity-detail-view").classList.remove("active");

      // Set toggle buttons correctly
      const toggleBtns = courseDetail.querySelectorAll(".toggle-btn");
      toggleBtns.forEach(btn => btn.classList.remove("active"));
      courseDetail.querySelector(".toggle-btn[data-view='modules']").classList.add("active");

      // Scroll into view
      courseDetail.scrollIntoView({ behavior: "smooth" });

      // Populate activities list
      const activitiesList = document.querySelector("#activities-list");
      activitiesList.innerHTML = "";
      
      sampleActivities.forEach(activity => {
        const activityItem = document.createElement("div");
        activityItem.className = "activity-item";
        activityItem.dataset.id = activity.id;
        
        activityItem.innerHTML = `
          <div class="activity-info">
            <h4>${activity.activity}: ${activity.name}</h4>
            <p>${activity.description}</p>
          </div>
          <div class="activity-stats">
            <span class="submission-count">${activity.students.length} students</span>
            <i class="fas fa-chevron-right"></i>
          </div>
        `;
        
        activityItem.addEventListener("click", () => {
          showActivityDetail(activity);
        });
        
        activitiesList.appendChild(activityItem);
      });
    });
  });

  // Function to show activity detail
  function showActivityDetail(activity) {
    // Hide activities list, show activity detail
    document.getElementById("activities-view").classList.remove("active");
    document.getElementById("activity-detail-view").classList.add("active");
    
    // Set activity title
    document.getElementById("activity-detail-title").textContent = `${activity.activity}: ${activity.name}`;
    
    // Populate activity detail table
    const activitiesTableBody = document.querySelector(".activity-detail-table tbody");
    activitiesTableBody.innerHTML = "";
    
    activity.students.forEach(student => {
      const row = document.createElement("tr");
      
      // Determine graded status symbol
      let gradedValue = "-";
      if (student.gradedStatus === "graded") gradedValue = '<span class="check">✔</span>';
      else if (student.gradedStatus === "pending") gradedValue = '<span class="pending">-</span>';
      else if (student.gradedStatus === "late") gradedValue = '<span class="check">✔</span>';
      else if (student.gradedStatus === "missed") gradedValue = '<span class="missed">✖</span>';
      
      // Format submitted date - use "-" for "Not submitted"
      let submittedValue = "-";
      if (student.submitted !== "Not submitted") {
        submittedValue = formatDate(student.submitted);
      }
      
      row.innerHTML = `
        <td>${student.name}</td>
        <td>${formatDate(student.start)}</td>
        <td>${formatDate(student.due)}</td>
        <td class="center-cell">${submittedValue}</td>
        <td class="center-cell">${gradedValue}</td>
        <td>${student.score}</td>
      `;
      activitiesTableBody.appendChild(row);
    });
  }

  // Back button from course detail to course list
  backBtn.addEventListener("click", () => {
    courseDetail.classList.add("hidden");
    enrolledTab.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Back button from activity detail to activities list
  const activityBackBtn = document.getElementById("activity-back-btn");
  activityBackBtn.addEventListener("click", () => {
    document.getElementById("activity-detail-view").classList.remove("active");
    document.getElementById("activities-view").classList.add("active");
  });

  // Toggle between modules, activities list, and activity detail
  const toggleBtns = courseDetail.querySelectorAll(".toggle-btn");
  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      toggleBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      // Show the selected view, hide others
      if (view === "modules") {
        document.getElementById("modules-view").classList.add("active");
        document.getElementById("activities-view").classList.remove("active");
        document.getElementById("activity-detail-view").classList.remove("active");
      } else if (view === "activities") {
        document.getElementById("modules-view").classList.remove("active");
        document.getElementById("activities-view").classList.add("active");
        document.getElementById("activity-detail-view").classList.remove("active");
      }
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
});