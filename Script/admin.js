document.addEventListener("DOMContentLoaded", () => {
  /* ==============================
     HOME TAB TOGGLE (Dashboard Tabs)
  ============================== */
  const homeSwitchBtns = document.querySelectorAll("#home .switch-btn");
const homeTabInners = document.querySelectorAll("#home .tab-inner");
const homeSwitchInner = document.getElementById("switchInner");
const newsPostBtn = document.getElementById("newsPostBtn");
const newPostSection = document.getElementById("newPostSection");

homeSwitchBtns.forEach(button => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;

    // Toggle active class
    homeSwitchBtns.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    homeTabInners.forEach(tabInner => tabInner.classList.remove("active"));
    document.getElementById(tab).classList.add("active");

    // Move switch indicator
    homeSwitchInner.style.left = tab === "dashboard" ? "5px" : "115px";

    // Show +Post button only for News
    if (newsPostBtn) {
      newsPostBtn.style.display = (tab === "news") ? "inline-block" : "none";
    }

    // Hide new post section if switching away from News
    if (newPostSection) {
      newPostSection.style.display = (tab === "news") ? newPostSection.style.display : "none";
    }
  });
});

  /* ==============================
     SIDEBAR LINKS (Main Sections + nested tabs)
  ============================== */
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".tab-content");

  tabLinks.forEach(link => {
    link.addEventListener("click", () => {
      const targetId = link.dataset.tab;
      const targetEl = document.getElementById(targetId);

      if (!targetEl) return;

      // Top-level tab-content
      if (targetEl.classList.contains("tab-content")) {
        tabContents.forEach(tc => tc.classList.remove("active"));
        targetEl.classList.add("active");
      }
      // Nested tab-inner (Dashboard/News)
      else if (targetEl.classList.contains("tab-inner")) {
        tabContents.forEach(tc => tc.classList.remove("active"));
        document.getElementById("home").classList.add("active");

        homeTabInners.forEach(ti => ti.classList.remove("active"));
        targetEl.classList.add("active");

        homeSwitchBtns.forEach(btn => {
          btn.classList.toggle("active", btn.dataset.tab === targetId);
          homeSwitchInner.style.left = targetId === "dashboard" ? "5px" : "115px";
        });
      }
    });
  });

  /* ==============================
     COURSES SWITCH (Offered / Archived)
  ============================== */
  const courseSwitchBtns = document.querySelectorAll("#courses .switch-btn");
  const courseSwitchInner = document.getElementById("courseSwitchInner");
  const courseActionBtn = document.getElementById("courseActionBtn");

  courseSwitchBtns.forEach(button => {
    button.addEventListener("click", () => {
      const tab = button.dataset.tab;

      courseSwitchBtns.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      document.querySelectorAll("#courses .tab-inner").forEach(content => content.classList.remove("active"));
      document.getElementById(tab).classList.add("active");

      // Move indicator and change action button text
      courseSwitchInner.style.left = tab === "offeredCourses" ? "5px" : "115px";
      courseActionBtn.textContent = tab === "offeredCourses" ? "+ Add Course" : "Unarchive Course";
    });
  });

  /* ==============================
     TRAINER SWITCH (Active / Archived)
  ============================== */
  const trainerSwitchBtns = document.querySelectorAll("#trainers .switch-btn");
const trainerSwitchInner = document.getElementById("trainerSwitchInner");

function updateTrainerTable(statusTab) {
  const rows = document.querySelectorAll(".trainer-table tbody tr");

  rows.forEach(row => {
    const status = row.dataset.status;
    const editBtn = row.querySelector(".edit-btn");

    if (statusTab === "activeTrainers" && status === "active") {
      row.style.display = "";
      if (editBtn) editBtn.textContent = "Edit";
    } else if (statusTab === "archivedTrainers" && status === "inactive") {
      row.style.display = "";
      if (editBtn) editBtn.textContent = "Unarchive";
    } else {
      row.style.display = "none";
    }
  });

  // ✅ Change the multi-archive button text
  if (multiArchiveBtn) {
    multiArchiveBtn.textContent = statusTab === "activeTrainers" ? "Archive Selected" : "Unarchive Selected";
  }
}

trainerSwitchBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    trainerSwitchBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    trainerSwitchInner.style.left = btn.dataset.tab === "activeTrainers" ? "5px" : "80px";

    // Update table and multi-archive button text
    updateTrainerTable(btn.dataset.tab);
  });
});


  /* ==============================
     MULTI-SELECT ARCHIVE (Trainers)
  ============================== */
  const multiArchiveBtn = document.getElementById("multiArchiveBtn");
  if (multiArchiveBtn) {
    multiArchiveBtn.addEventListener("click", () => {
      const checkboxes = document.querySelectorAll(".trainer-checkbox:checked");

      checkboxes.forEach(cb => {
        const row = cb.closest("tr");
        row.dataset.status = "inactive";
        row.cells[4].textContent = "Inactive";

        const editBtn = row.querySelector(".edit-btn");
        if (editBtn) editBtn.textContent = "Unarchive";

        cb.checked = false;
      });

      const activeBtn = document.querySelector("#trainers .switch-btn.active");
      if (activeBtn && activeBtn.dataset.tab === "archivedTrainers") {
        trainerSwitchBtns.forEach(btn => btn.click());
      }
    });
  }

  /* ==============================
     SELECT / DESELECT ALL TRAINERS
  ============================== */
  const selectAllTrainers = document.getElementById("selectAllTrainers");
  if (selectAllTrainers) {
    selectAllTrainers.addEventListener("change", function () {
      const checkboxes = document.querySelectorAll(".trainer-checkbox");
      checkboxes.forEach(cb => cb.checked = this.checked);
    });
  }

  /* ==============================
     PLACEHOLDER UPLOAD & ARCHIVE BUTTONS
  ============================== */
  document.querySelectorAll(".create-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("Upload/Create new form will appear here.");
      // TODO: replace alert with modal upload form
    });
  });

  document.querySelectorAll(".archive-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      alert(btn.textContent + " action triggered.");
      // TODO: replace with real archive/unarchive logic
    });
  });
});
const switchBtns = document.querySelectorAll('.switch-btn');
const tabInners = document.querySelectorAll('.tab-inner');
const newsPostBtn = document.getElementById('newsPostBtn');

switchBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.dataset.tab;

    // Remove active class from all
    tabInners.forEach(tab => tab.classList.remove('active'));
    switchBtns.forEach(b => b.classList.remove('active'));

    // Activate clicked tab
    btn.classList.add('active');
    document.getElementById(targetTab).classList.add('active');

    // Show +Post button only for News
    newsPostBtn.style.display = (targetTab === 'news') ? 'block' : 'none';
  });
});
// Show/hide post section when +Post is clicked
const newPostSection = document.getElementById("newPostSection");
const cancelPostBtn = document.getElementById("cancelPostBtn");
const uploadBtn = document.getElementById("uploadBtn");
const postImage = document.getElementById("postImage");

if (newsPostBtn) {
  newsPostBtn.addEventListener("click", () => {
    newPostSection.style.display = "block";
    document.getElementById("postCaption").focus();
  });
}

// Cancel button hides the post section
if (cancelPostBtn) {
  cancelPostBtn.addEventListener("click", () => {
    newPostSection.style.display = "none";
    document.getElementById("postCaption").value = "";
  });
}

// Upload photo button triggers file input
if (uploadBtn) {
  uploadBtn.addEventListener("click", () => {
    postImage.click();
  });
}

// Post button (submit)
const submitPostBtn = document.getElementById("submitPostBtn");
if (submitPostBtn) {
  submitPostBtn.addEventListener("click", () => {
    const caption = document.getElementById("postCaption").value;
    const file = postImage.files[0];
    if (!caption && !file) {
      alert("Please add a caption or choose a photo.");
      return;
    }

    // TODO: handle the upload/post logic here
    alert("Post submitted!\nCaption: " + caption + "\nPhoto: " + (file ? file.name : "None"));

    // Reset and hide the post section
    document.getElementById("postCaption").value = "";
    postImage.value = "";
    newPostSection.style.display = "none";
  });
}
// Dashboard card shortcuts
const dashboardCards = document.querySelectorAll(".dashboard-card");
const sidebarLinks = document.querySelectorAll(".sidebar .tab-link");
const tabContents = document.querySelectorAll(".tab-content");

dashboardCards.forEach(card => {
  card.addEventListener("click", () => {
    const targetTab = card.dataset.target;

    // Activate sidebar link
    sidebarLinks.forEach(link => link.classList.remove("active"));
    const correspondingLink = document.querySelector(`.sidebar .tab-link[data-tab="${targetTab}"]`);
    if (correspondingLink) correspondingLink.classList.add("active");

    // Show corresponding tab-content
    tabContents.forEach(tc => tc.classList.remove("active"));
    const targetContent = document.getElementById(targetTab);
    if (targetContent) targetContent.classList.add("active");

    // Hide the +Post section if leaving News
    if (newPostSection) newPostSection.style.display = "none";
  });
});
const createAccBtn = document.querySelector("#trainers .create-btn");
const modal = document.getElementById("createAccountModal");
const closeBtn = document.querySelector(".close-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const form = document.getElementById("createAccountForm");

createAccBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

// Close modal
closeBtn.addEventListener("click", () => modal.style.display = "none");
cancelBtn.addEventListener("click", () => modal.style.display = "none");

// Auto-fill email and password
form.addEventListener("input", () => {
  const lastName = document.getElementById("lastName").value.toLowerCase().trim();
  const firstName = document.getElementById("firstName").value.toLowerCase().trim();
  const birthday = document.getElementById("birthday").value; // yyyy-mm-dd

  // Email format: lastname.firstname@bts.gov.ph
  if(lastName && firstName){
    document.getElementById("email").value = `${lastName}.${firstName}@bts.gov.ph`;
  }

  // Password format: lastname.mmddyy
  if(lastName && birthday){
    const bd = new Date(birthday);
    const mm = String(bd.getMonth()+1).padStart(2,'0');
    const dd = String(bd.getDate()).padStart(2,'0');
    const yy = String(bd.getFullYear()).slice(-2);
    document.getElementById("password").value = `${lastName}.${mm}${dd}${yy}`;
  }
});

// Form validation
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameRegex = /^[A-Za-z\s\-]+$/;
  const mobileRegex = /^09\d{9}$/;
  const lastName = document.getElementById("lastName").value.trim();
  const firstName = document.getElementById("firstName").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const gender = document.getElementById("gender").value;
  const birthday = new Date(document.getElementById("birthday").value);
  const today = new Date();
  const age = today.getFullYear() - birthday.getFullYear();

  if(!nameRegex.test(lastName) || !nameRegex.test(firstName)){
    alert("Names must contain letters only. Hyphen allowed.");
    return;
  }

  if(!mobileRegex.test(mobile)){
    alert("Mobile number must be exactly 11 digits starting with 09.");
    return;
  }

  if(!gender){
    alert("Select gender.");
    return;
  }

  if(age < 5 || age > 60){
    alert("Birthday must be between 5 and 60 years old.");
    return;
  }

  alert("Account created successfully!");
  modal.style.display = "none";
  form.reset();
});
const profileInput = document.getElementById('profileInput');
const profilePreview = document.querySelector('.profile-preview');
uploadBtn.addEventListener('click', () => profileInput.click());

profileInput.addEventListener('change', () => {
  const file = profileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => profilePreview.src = e.target.result;
    reader.readAsDataURL(file);
  }
});

uploadBtn.addEventListener('click', () => profileInput.click());

profileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    profilePreview.src = URL.createObjectURL(file);
  }
});
// -------------------------
// EDIT ACCOUNT MODAL FIX
// -------------------------
const editModal = document.getElementById("editAccountModal");
const editCloseBtn = document.querySelector("#editAccountModal .close-btn");
const editCancelBtn = document.querySelector("#editAccountModal .cancel-btn");

// Function to open edit modal and populate form
function openEditModal(userData) {
  // Fill the form with userData
  document.getElementById("editLastname").value = userData.lastname;
  document.getElementById("editFirstname").value = userData.firstname;
  document.getElementById("editMiddlename").value = userData.middlename;
  document.getElementById("editSuffix").value = userData.suffix || "";
  document.getElementById("editGender").value = userData.gender;
  document.getElementById("editBirthday").value = userData.birthday;
  document.getElementById("editMobile").value = userData.mobile;
  document.getElementById("editEmail").value = userData.email;
  document.getElementById("editBio").value = userData.bio || "";
  document.getElementById("editEducation").value = userData.education || "";
  document.getElementById("editPassword").value = userData.password;

  editModal.style.display = "flex";
}

// Close buttons for Edit Modal
editCloseBtn.addEventListener("click", () => editModal.style.display = "none");
editCancelBtn.addEventListener("click", () => editModal.style.display = "none");

// Close if clicked outside modal content
window.addEventListener("click", e => {
  if (e.target === editModal) editModal.style.display = "none";
});

// Example: attach openEditModal to Edit buttons in trainer table
document.querySelectorAll(".edit-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const row = btn.closest("tr");
    const userData = {
      lastname: row.dataset.lastname || "",
      firstname: row.dataset.firstname || "",
      middlename: row.dataset.middlename || "",
      suffix: row.dataset.suffix || "",
      gender: row.dataset.gender || "",
      birthday: row.dataset.birthday || "",
      mobile: row.dataset.mobile || "",
      email: row.dataset.email || "",
      bio: row.dataset.bio || "",
      education: row.dataset.education || "",
      password: row.dataset.password || ""
    };
    openEditModal(userData);
  });
});
