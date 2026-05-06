// ========== API CONFIG ==========
const API_BASE = "http://localhost:5000/api";

async function apiRequest(endpoint, method = "GET", data = null) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: data ? JSON.stringify(data) : null
    });

    return await res.json();
  } catch (err) {
    showToast("Server error", "error");
    console.error(err);
  }
}


// ========== STATE ==========
let currentRole = 'Admin';
let currentPage = 'dashboard';

// ========== LOGIN ==========
function selectRole(el, role) {
  document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentRole = role;
  const roleLabels = { Admin: 'Administrator', Federation: 'Federation Head', Organizer: 'Event Organizer', Athlete: 'Athlete', Referee: 'Certified Referee', Coach: 'Head Coach' };
  document.getElementById('sidebar-role').textContent = roleLabels[role] || role;
}

async function doLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-pass").value;

  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.error) {
    showToast(data.error, "error");
    return;
  }

  // Save session
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("session", JSON.stringify(data.session));

  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').classList.add('visible');

  showToast("Login successful!", "success");
}


function doLogout() {
  localStorage.removeItem("user");
  localStorage.removeItem("session");

  document.getElementById('app').classList.remove('visible');
  document.getElementById('login-screen').style.display = 'flex';

  showToast("Logged out", "info");
}


// ========== NAVIGATION ==========
const pageTitles = {
  dashboard: ['Dashboard', 'Overview of all championships'],
  users: ['User Management', 'Roles, access & federation assignments'],
  championships: ['Championships', 'Create and manage all events'],
  categories: ['Categories', 'Weight classes and age groups'],
  athletes: ['Athletes', 'Registration and duplicate prevention'],
  referees: ['Referee Management', 'Certified referees and match assignments'],
  coaches: ['Coach Management', 'Coaches, athletes and performance'],
  fixtures: ['Fixtures & Brackets', 'Auto-generated tournament brackets'],
  results: ['Results & Medals', 'Match outcomes and standings'],
  rankings: ['Rankings', 'National & State athlete rankings'],
  federation: ['Federation Dashboard', 'Multi-tenant federation view'],
  reports: ['Reports & Export', 'Generate and download reports'],
  audit: ['Audit Log', 'Complete activity trail with timestamps'],
  notifications: ['Notifications', 'Email alerts and system notifications'],
  payments: ['Payments', 'Mock payment integration']
};

function navigate(el, page) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('active');

  currentPage = page;

  if (pageTitles[page]) {
    document.getElementById('topbar-title').textContent = pageTitles[page][0];
    document.getElementById('topbar-sub').textContent = pageTitles[page][1];
  }

  // 🔥 LOAD DATA BASED ON PAGE
  if (page === "athletes") loadAthletes();
}

// ========== MODALS ==========
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
function saveAndClose(id, msg) {
  closeModal(id);
  showToast(msg, 'success');
}
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
});

// ========== TOAST ==========
function showToast(msg, type = 'info') {
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

// ========== TABS ==========
function activateTab(el) {
  el.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

// ========== INIT ==========
window.addEventListener('load', () => {

  const user = localStorage.getItem("user");

  if (user) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').classList.add('visible');
  }

  // existing animation code
  setTimeout(() => {
    document.querySelectorAll('.bar-col').forEach((b, i) => {
      b.style.transition = `height 0.5s ease ${i * 0.05}s`;
    });
  }, 100);
});

// Load athletes from database
async function loadAthletes() {
  const res = await fetch("http://localhost:5000/api/athletes");
  const data = await res.json();

  const table = document.getElementById("athlete-table-body");

  if (!table) return;

  table.innerHTML = "";

  data.forEach((a, index) => {
    const age = new Date().getFullYear() - new Date(a.date_of_birth).getFullYear();

    // initials for avatar
    const initials = a.full_name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();

    table.innerHTML += `
      <tr>
        <td style="color:var(--text3)">#ATH-${String(index + 1).padStart(3, "0")}</td>

        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="avatar" style="background:linear-gradient(135deg,var(--gold),var(--orange));color:#000;font-size:0.65rem">
              ${initials}
            </div>
            <b>${a.full_name}</b>
          </div>
        </td>

        <td>${age}</td>

        <td>${a.weight || "-"} kg</td>

        <td>
          <span class="badge badge-cyan">
            ${a.federation || "N/A"}
          </span>
        </td>

        <td>
          <span class="badge badge-purple">
            ${a.experience_level || "Beginner"}
          </span>
        </td>

        <td>${a.category || "-"}</td>

        <td>
          <span class="badge badge-green">
            Registered
          </span>
        </td>
      </tr>
    `;
  });
}



async function registerAthlete() {
  // get values from form
  const full_name = document.getElementById("athlete-name").value;
  const date_of_birth = document.getElementById("athlete-dob").value;
  const weight = document.getElementById("athlete-weight").value;
  const federation = document.getElementById("athlete-federation").value;

  // basic validation
  if (!full_name || !date_of_birth) {
    showToast("Please fill required fields", "error");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/athletes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        full_name,
        date_of_birth,
        weight,
        federation,
        experience_level: "Beginner",
        category: "U-60"
      })
    });

    const data = await res.json();

    if (data.error) {
      showToast(data.error, "error");
    } else {
      showToast("Athlete registered successfully!", "success");

      // refresh table
      loadAthletes();

      // close modal
      closeModal("modal-athlete");
    }

  } catch (err) {
    console.error(err);
    showToast("Server error", "error");
  }
}

// Add championship
async function createChampionship() {
  const title = document.getElementById("champ-title")?.value;

  if (!title) {
    showToast("Enter title", "error");
    return;
  }

  const res = await apiRequest("/championships", "POST", { title });

  if (res?.error) {
    showToast(res.error, "error");
    return;
  }

  showToast("Championship created!", "success");
}
