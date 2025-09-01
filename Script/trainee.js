const state = {
  profile: {
    id:1, name:'Trainee Ana', email:'ana@example.com',
    contact:'+63 912 000 0000', bio:'Aspiring web dev', avatar:'https://i.pravatar.cc/150?img=15'
  },
  enrolledCourses: [
    {id:501,title:'Intro to HTML', instructor:'Jane (Trainer)', progress:58, materials:[{name:'Lecture 1.pdf', url:'#'}, {name:'Slides.zip', url:'#'}]},
    {id:502,title:'CSS Fundamentals', instructor:'Mark (Trainer)', progress:32, materials:[{name:'CSS Guide.pdf', url:'#'}]}
  ],
  activities: [
    {id:601,title:'HTML Assignment 1', course:'Intro to HTML', due:'2025-08-20', status:'Pending', submission:null},
    {id:602,title:'CSS Project', course:'CSS Fundamentals', due:'2025-08-25', status:'Pending', submission:null}
  ],
  availableCourses: [
    {id:701,title:'JavaScript Basics', instructor:'Sam', description:'Learn JS fundamentals'},
    {id:702,title:'Responsive Design', instructor:'Maya', description:'Layout & media queries'}
  ],
  enrollmentRequests: [
    // existing requests from this trainee
    // {id:801,courseId:701,courseTitle:'JavaScript Basics',requestedOn:'2025-08-06',status:'Pending'}
  ]
};

/* ============================
   UI helpers: views & nav
   ============================ */
function showView(v){
  document.querySelectorAll('.view').forEach(el=>el.style.display='none');
  const el = document.getElementById('view-'+v);
  if(el) el.style.display='block';
  document.querySelectorAll('.nav a').forEach(a=>a.classList.remove('active'));
  const nav = document.querySelector('.nav a[data-view="'+v+'"]');
  if(nav) nav.classList.add('active');
}
document.querySelectorAll('.nav a').forEach(a=>{
  a.addEventListener('click', e=>{ e.preventDefault(); showView(a.dataset.view); });
});

/* ============================
   Renderers
   ============================ */
function renderProfileHeader(){
  document.getElementById('avatar').src = state.profile.avatar;
  document.getElementById('displayName').textContent = state.profile.name;
  document.getElementById('displayEmail').textContent = state.profile.email;
  document.getElementById('inpName').value = state.profile.name;
  document.getElementById('inpEmail').value = state.profile.email;
  document.getElementById('inpContact').value = state.profile.contact;
  document.getElementById('inpBio').value = state.profile.bio;
}

function renderOverview(){
  document.getElementById('statEnrolled').textContent = state.enrolledCourses.length;
  // fake hours & avg grade for demo
  document.getElementById('statHours').textContent = 42;
  document.getElementById('statGrade').textContent = '84%';
  // quick courses list
  const qc = document.getElementById('quickCourses');
  qc.innerHTML = state.enrolledCourses.map(c=>`
    <div style="padding:10px;background:white;border-radius:8px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
      <div><strong>${c.title}</strong><div class="muted">${c.instructor}</div></div>
      <div><button class="btn btn-sm btn-primary" onclick="openCourseMaterials(${c.id})">Materials</button></div>
    </div>
  `).join('');
  // enrollment preview
  const ep = document.getElementById('enrollPreview');
  ep.innerHTML = state.enrollmentRequests.length ? state.enrollmentRequests.map(r=>`<div style="padding:8px;background:white;border-radius:8px;margin-bottom:8px"><strong>${r.courseTitle}</strong><div class="muted">Requested: ${r.requestedOn} • ${r.status}</div></div>`).join('') : '<div class="muted">No pending requests</div>';
}

function renderCourses(){
  const tbody = document.querySelector('#coursesTable tbody'); tbody.innerHTML='';
  state.enrolledCourses.forEach(c=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.title}</td><td>${c.instructor}</td><td>${c.progress}%</td>
      <td>
        ${c.materials.map(m=>`<div><a href="${m.url}" onclick="simulateDownload(event,'${m.name}')">${m.name}</a></div>`).join('')}
      </td>`;
    tbody.appendChild(tr);
  });
}

function renderActivities(){
  const tbody = document.querySelector('#activitiesTable tbody'); tbody.innerHTML='';
  state.activities.forEach(a=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${a.title}</td><td>${a.course}</td><td>${a.due}</td><td>${a.status}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="openUpload(${a.id})">${a.submission?'Re-upload':'Upload'}</button>
        ${a.submission? `<div class="muted" style="margin-top:6px">Submitted: ${a.submission.name}</div>` : ''}
      </td>`;
    tbody.appendChild(tr);
  });
}

function renderEnrollTable(){
  const tbody = document.querySelector('#enrollTable tbody'); tbody.innerHTML='';
  state.enrollmentRequests.forEach(r=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.courseTitle}</td><td>${r.requestedOn}</td><td>${r.status}</td>`;
    tbody.appendChild(tr);
  });
}

/* ============================
   Actions (front-end only)
   ============================ */

/* Open materials modal for a course */
function openCourseMaterials(courseId){
  const c = state.enrolledCourses.find(x=>x.id===courseId);
  if(!c) return alert('Course not found');
  openModal(`<h3>Materials — ${c.title}</h3>
    <div>${c.materials.map(m=>`<div style="padding:8px;background:#f9fbff;border-radius:6px;margin-bottom:6px"><strong>${m.name}</strong><div class="muted">Click to download</div><div style="margin-top:6px"><a href="${m.url}" onclick="simulateDownload(event,'${m.name}')">Download</a></div></div>`).join('')}</div>
    <div style="text-align:right;margin-top:12px"><button class="btn btn-primary" onclick="closeModal()">Close</button></div>`);
}

/* Simulate download (front-end only) */
function simulateDownload(e, name){
  e.preventDefault();
  alert(`Simulated download: ${name}`);
}

/* Upload answer/project for activity */
function openUpload(activityId){
  const a = state.activities.find(x=>x.id===activityId);
  if(!a) return;
  openModal(`<h3>Upload for: ${a.title}</h3>
    <p class="muted">Due: ${a.due}</p>
    <form id="uploadForm">
      <label>Choose file</label>
      <input type="file" name="file" id="uploadFile" required />
      <div class="file-list" id="fileName"></div>
      <div style="text-align:right;margin-top:10px"><button class="btn btn-primary" type="submit">Upload</button></div>
    </form>`);
  const fileInput = document.getElementById('uploadFile');
  const fileName = document.getElementById('fileName');
  fileInput.addEventListener('change', ()=>{ fileName.textContent = fileInput.files[0]?.name || ''; });
  document.getElementById('uploadForm').addEventListener('submit', e=>{
    e.preventDefault();
    const f = fileInput.files[0];
    if(!f) return alert('Select a file');
    // front-end only: store file meta in state.activities
    a.submission = {name:f.name, uploadedOn: new Date().toISOString()};
    a.status = 'Submitted';
    alert('File uploaded (front-end only).');
    closeModal();
    renderActivities();
  });
}

/* Self-enroll modal (create request) */
document.getElementById('btnSelfEnroll').addEventListener('click', ()=>{
  openModal(`<h3>Self-Enroll in Course</h3>
    <form id="enrollForm">
      <label>Select Course</label>
      <select id="selectCourse">${state.availableCourses.map(c=>`<option value="${c.id}">${c.title} — ${c.instructor}</option>`).join('')}</select>
      <div style="text-align:right;margin-top:12px"><button class="btn btn-primary" type="submit">Request Enroll</button></div>
    </form>`);
  document.getElementById('enrollForm').addEventListener('submit', e=>{
    e.preventDefault();
    const courseId = parseInt(document.getElementById('selectCourse').value);
    const course = state.availableCourses.find(c=>c.id===courseId);
    const now = new Date().toISOString().split('T')[0];
    // add a pending request
    state.enrollmentRequests.push({id: Date.now(), courseId: course.id, courseTitle: course.title, requestedOn: now, status:'Pending'});
    alert('Enrollment request created (front-end only). Admin will approve later.');
    closeModal();
    renderOverview(); renderEnrollTable();
  });
});

/* Upload Answer button in Activities view */
document.getElementById('btnUploadAnswer').addEventListener('click', ()=> {
  // open first pending activity as shortcut
  const first = state.activities.find(a=>a.status==='Pending');
  if(first) openUpload(first.id);
  else alert('No pending activities to upload.');
});

/* Profile save */
document.getElementById('fileProfile').addEventListener('change', e=>{
  const f = e.target.files[0];
  if(!f) return;
  const r = new FileReader();
  r.onload = ()=>{ state.profile.avatar = r.result; renderProfileHeader(); };
  r.readAsDataURL(f);
});
document.getElementById('profileForm').addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('inpName').value.trim();
  const email = document.getElementById('inpEmail').value.trim();
  const contact = document.getElementById('inpContact').value.trim();
  const bio = document.getElementById('inpBio').value.trim();
  if(!name||!email) return alert('Name and email required');
  state.profile.name = name; state.profile.email = email; state.profile.contact = contact; state.profile.bio = bio;
  alert('Profile saved (front-end only).');
  renderProfileHeader();
  showView('profile');
});

/* Modal helpers */
const backdrop = document.getElementById('backdrop');
const modalInner = document.getElementById('modalInner');
document.getElementById('backdropClose').addEventListener('click', closeModal);
backdrop.addEventListener('click', e=>{ if(e.target===backdrop) closeModal(); });
function openModal(html){ modalInner.innerHTML = html; backdrop.classList.add('open'); }
function closeModal(){ backdrop.classList.remove('open'); modalInner.innerHTML=''; }

/* Toggle sidebar for small screens */
document.getElementById('toggleSidebar').addEventListener('click', ()=> document.getElementById('sidebar').classList.toggle('open'));

/* ============================
   Initial render
   ============================ */
function refreshAll(){
  renderProfileHeader();
  renderOverview();
  renderCourses();
  renderActivities();
  renderEnrollTable();
}
refreshAll();
showView('overview');

/* ============================
   Notes for backend later:
   - Replace state modifications with fetch()/axios calls to your API.
   - For file uploads, send FormData to server and use returned file URL.
   - Regularly refresh data after server responses.
   ============================ */
