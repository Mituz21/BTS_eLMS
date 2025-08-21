document.addEventListener("DOMContentLoaded", () => {
  const tempAccounts = {
    admin: { password: "admin", role: "admin" },
    trainer: { password: "trainer", role: "trainer" },
    trainee: { password: "trainee", role: "trainee" },
    guest: { password: "guest", role: "guest" }
  };

  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailOrUser = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value.trim();

    // --- TEMP ACCOUNTS ---
    if (tempAccounts[emailOrUser] && tempAccounts[emailOrUser].password === password) {
      redirectDashboard(tempAccounts[emailOrUser].role);
      return;
    }

    // --- REAL EMAIL LOGIC ---
    if (!emailOrUser.includes("@")) {
      alert("Invalid email format.");
      return;
    }

    if (isAdmin(emailOrUser)) {
      redirectDashboard("admin_dashboard");
    } else if (isTrainer(emailOrUser)) {
      redirectDashboard("trainer_dashboard");
    } else if (isTrainee(emailOrUser)) {
      redirectDashboard("trainee_dashboard");
    } else if (isGuest(emailOrUser)) {
      redirectDashboard("guest_dashboard");
    } else {
      alert("Invalid login credentials!");
    }
  });

  // Redirect helper
  function redirectDashboard(role) {
    switch (role) {
      case "admin":
        window.location.href = "admin_dashboard.html";
        break;
      case "trainer":
        window.location.href = "trainer_dashboard.html";
        break;
      case "trainee":
        window.location.href = "trainee_dashboard.html";
        break;
      case "guest":
        window.location.href = "guest_dashboard.html";
        break;
    }
  }

  // Role checkers for real emails
  function isAdmin(email) {
    return /^[a-z]+[a-z]+\d+@bts\.gov\.ph$/.test(email);
  }
  function isTrainer(email) {
    return /^trainer\.[a-z]+@bts\.gov\.ph$/.test(email);
  }
  function isTrainee(email) {
    return /^[a-z]+\d+@bts\.gov\.ph$/.test(email);
  }
  function isGuest(email) {
    return !email.endsWith("@bts.gov.ph");
  }
});


  // ─── Hero Slideshow ──
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }
  setInterval(nextSlide, 5000);

  // ─── Login Modal ──
  const loginModal = document.getElementById('loginModal');
  const openLoginBtn = document.getElementById('openLogin');
  const closeModalBtn = document.querySelector('.modal .close');

  openLoginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
  });
  closeModalBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
  });
  window.addEventListener('click', e => {
    if (e.target === loginModal) loginModal.style.display = 'none';
  });

  // ─── Registration Modal ──
  const registerModal = document.getElementById('registerModal');
  const openRegisterLink = document.getElementById('openRegister');
  const closeRegisterBtn = document.querySelector('.close-register');
  const registerForm = document.getElementById('registerForm');

  openRegisterLink.addEventListener('click', e => {
    e.preventDefault();
    registerModal.style.display = 'flex';
    loginModal.style.display = 'none';
  });

  closeRegisterBtn.addEventListener('click', () => {
    registerModal.style.display = 'none';
  });

  window.addEventListener('click', e => {
    if (e.target === registerModal) registerModal.style.display = 'none';
  });

  // ─── Registration Validation ──
  function isValidPassword(pw) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[*\-_.])[A-Za-z0-9*\-_.]{8,}$/;
    return regex.test(pw);
  }

  registerForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('regEmail').value.trim();
    const pw = document.getElementById('regPassword').value.trim();
    const cpw = document.getElementById('regConfirmPassword').value.trim();

    if (!isValidPassword(pw)) {
      alert('Password must be at least 8 characters, contain one uppercase letter, one number, and one special character (*-_.).');
      return;
    }

    if (pw !== cpw) {
      alert('Passwords do not match.');
      return;
    }

    alert('Registration successful!');
    registerForm.reset();
    registerModal.style.display = 'none';
  });

  // ─── Course Detail Viewer ──
  const courseCards = document.querySelectorAll('.course-card');
  const courseSection = document.getElementById('courses');
  const courseDetail = document.getElementById('courseDetail');
  const backBtn = document.getElementById('backToGrid');

  const detailImg = document.getElementById('detailImg');
  const detailTitle = document.getElementById('detailTitle');
  const detailDesc = document.getElementById('detailDesc');
  const basicList = document.getElementById('basicList');
  const commonList = document.getElementById('commonList');
  const coreList = document.getElementById('coreList');

  function populateList(el, items) {
    el.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      el.appendChild(li);
    });
  }

  courseCards.forEach(card => {
    card.addEventListener('click', () => {
      const t = card.dataset.title;
      const d = card.dataset.desc;
      const img = card.dataset.img;
      const basic = JSON.parse(card.dataset.basic || '[]');
      const common = JSON.parse(card.dataset.common || '[]');
      const core = JSON.parse(card.dataset.core || '[]');

      if (!t || !d || !img) return;

      detailTitle.textContent = t;
      detailDesc.textContent = d;
      detailImg.src = img;
      populateList(basicList, basic);
      populateList(commonList, common);
      populateList(coreList, core);

      courseSection.classList.add('hidden');
      courseDetail.classList.remove('hidden');
    });
  });

  backBtn.addEventListener('click', () => {
    courseDetail.classList.add('hidden');
    courseSection.classList.remove('hidden');
  });

// ─── Multi-Step Registration Form Navigation ───
const nextBtns = registerForm.querySelectorAll(".next-step");
const prevBtns = registerForm.querySelectorAll(".prev-step");
const formSteps = registerForm.querySelectorAll(".form-step");
let currentStep = 0;

nextBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep < formSteps.length - 1) {
      formSteps[currentStep].classList.remove("form-step-active");
      currentStep++;
      formSteps[currentStep].classList.add("form-step-active");
    }
  });
});

prevBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep > 0) {
      formSteps[currentStep].classList.remove("form-step-active");
      currentStep--;
      formSteps[currentStep].classList.add("form-step-active");
    }
  });
});