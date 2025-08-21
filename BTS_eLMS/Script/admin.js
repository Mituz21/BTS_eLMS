// ─── Profile Modal Functions ───
function openProfile() {
  document.getElementById('profileModal').style.display = 'block';
}
function closeProfile() {
  document.getElementById('profileModal').style.display = 'none';
}
function saveProfile() {
  const name = document.getElementById('adminName').value;
  const email = document.getElementById('adminEmail').value;
  const phone = document.getElementById('adminPhone').value;
  const bio = document.getElementById('adminBio').value;

  console.log("Profile Updated:", { name, email, phone, bio });

  const file = document.getElementById('photoUpload').files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('adminPhoto').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  alert("Profile updated successfully!");
  closeProfile();
}

// ─── Sample Data ───
const users = [
  {id:1, name:"John Doe", role:"Trainee", status:"Active"},
  {id:2, name:"Jane Smith", role:"Trainer", status:"Active"}
];

const courses = [
  {id:1, name:"HTML Basics", trainer:"Jane Smith", selfEnrollment:true},
  {id:2, name:"JavaScript Advanced", trainer:"", selfEnrollment:false}
];

const enrollments = [
  {id:1, trainee:"Mark Lee", course:"HTML Basics", status:"Pending"}
];

const activities = [
  {id:1, trainee:"John Doe", course:"HTML Basics", submission:"Assignment 1"}
];

// ─── Render Functions ───
function renderUsers() {
  const tbody = document.querySelector('#userTable tbody');
  tbody.innerHTML = '';
  users.forEach(u => {
    tbody.innerHTML += `
      <tr>
        <td>${u.name}</td>
        <td>${u.role}</td>
        <td>${u.status}</td>
        <td>
          <button onclick="editUser(${u.id})">Edit</button>
          <button class="btn-danger" onclick="archiveUser(${u.id})">Archive</button>
        </td>
      </tr>
    `;
  });
}

function renderCourses() {
  const tbody = document.querySelector('#courseTable tbody');
  tbody.innerHTML = '';
  courses.forEach(c => {
    tbody.innerHTML += `
      <tr>
        <td>${c.name}</td>
        <td>${c.trainer || 'Unassigned'}</td>
        <td>${c.selfEnrollment ? 'Enabled' : 'Disabled'}</td>
        <td>
          <button onclick="assignTrainer(${c.id})">Assign Trainer</button>
          <button onclick="toggleSelfEnrollment(${c.id})">
            ${c.selfEnrollment ? 'Disable' : 'Enable'} Self-Enroll
          </button>
        </td>
      </tr>
    `;
  });
}

function renderEnrollments() {
  const tbody = document.querySelector('#enrollmentTable tbody');
  tbody.innerHTML = '';
  enrollments.forEach(e => {
    tbody.innerHTML += `
      <tr>
        <td>${e.trainee}</td>
        <td>${e.course}</td>
        <td>${e.status}</td>
        <td>
          <button onclick="approveEnrollment(${e.id})">Approve</button>
          <button class="btn-danger" onclick="rejectEnrollment(${e.id})">Reject</button>
        </td>
      </tr>
    `;
  });
}

function renderActivities() {
  const tbody = document.querySelector('#activityTable tbody');
  tbody.innerHTML = '';
  activities.forEach(a => {
    tbody.innerHTML += `
      <tr>
        <td>${a.trainee}</td>
        <td>${a.course}</td>
        <td>${a.submission}</td>
        <td>
          <button onclick="viewSubmission(${a.id})">View</button>
        </td>
      </tr>
    `;
  });
}

// ─── Action Handlers ───
function openCreateUser(){ alert('Open Create User Modal'); }
function editUser(id){ alert('Edit User '+id); }
function archiveUser(id){ alert('Archive User '+id); }
function openCreateCourse(){ alert('Open Create Course Modal'); }
function assignTrainer(courseId){ alert('Assign Trainer to Course '+courseId); }
function toggleSelfEnrollment(courseId){
  const course = courses.find(c=>c.id===courseId);
  course.selfEnrollment = !course.selfEnrollment;
  renderCourses();
}
function approveEnrollment(id){ alert('Enrollment Approved '+id); }
function rejectEnrollment(id){ alert('Enrollment Rejected '+id); }
function viewSubmission(id){ alert('Viewing Submission '+id); }

// ─── Initial Render ───
renderUsers();
renderCourses();
renderEnrollments();
renderActivities();

function logout() {
  // Optional: clear any stored session or localStorage info
  console.log("User logged out");

  // Redirect to login page or homepage
  window.location.href = "../HTML/homepage.html"; // change to your login page
}
