// ===== ONE setupMultiArchive function =====
function setupMultiArchive(buttonId, switchBtns) {
  const multiBtn = document.getElementById(buttonId);
  const toggleBtns = document.querySelectorAll(switchBtns);

  if (!multiBtn || toggleBtns.length === 0) return;

  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.tab.includes("archived")) {
        multiBtn.textContent = "Multi-Unarchive";
      } else {
        multiBtn.textContent = "Multi-Archive";
      }
    });
  });
}

// Trainers
setupMultiArchive("multiArchiveBtn", "#trainers .switch-btn");
// Guests
setupMultiArchive("multiActionBtn", "#guests .switch-btn");
// Courses
setupMultiArchive("courseActionBtn", "#courses .switch-btn");
// Trainees
setupMultiArchive("multiTraineeBtn", "#trainees .switch-btn");


// ===== Trainee Create & Edit =====
// Reuse Trainer Modal for Trainees
const traineeCreateBtn = document.getElementById("createTraineeBtn");
if (traineeCreateBtn) {
  traineeCreateBtn.addEventListener("click", () => {
    openCreateAccountModal("trainee"); // reuse trainer create modal
  });
}

// Attach edit buttons
document.querySelectorAll("#trainees .edit-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const row = btn.closest("tr");
    const userData = {
      lastname: row.children[1].textContent.split(" ")[1] || "",
      firstname: row.children[1].textContent.split(" ")[0] || "",
      traineeId: row.children[2].textContent,
      role: row.children[4].textContent,
      status: row.children[5].textContent
    };
    openEditModal(userData); // reuse Trainer edit modal
  });
});
