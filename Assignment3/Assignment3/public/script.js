const apiBase = "http://localhost:3000/user"; // adjust if needed

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const loadUsersBtn = document.getElementById("loadUsersBtn");
const usersList = document.getElementById("usersList");

async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error");
  return data;
}

/* ================= REGISTER ================= */
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value,
    };

    try {
      await request(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      alert("Registered successfully!");
      window.location.href = "login.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

/* ================= LOGIN ================= */
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      email: document.getElementById("loginEmail").value.trim(),
      password: document.getElementById("loginPassword").value,
    };

    try {
      const res = await request(`${apiBase}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      localStorage.setItem("user", JSON.stringify(res.user));

      window.location.href = "dashboard.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

/* ================= DASHBOARD ================= */

// protect route
if (window.location.pathname.includes("dashboard.html")) {
  const user = localStorage.getItem("user");
  if (!user) {
    window.location.href = "login.html";
  } else {
    const u = JSON.parse(user);
    document.getElementById("welcomeText").innerText = `Welcome ${u.firstName}`;
  }
}

/* ================= LOAD USERS ================= */
if (loadUsersBtn) {
  loadUsersBtn.addEventListener("click", loadUsers);
}

async function loadUsers() {
  try {
    document.getElementById("welcomeText").innerText = "Users List";
    const users = await request(apiBase, { method: "GET" });

    usersList.innerHTML = `
      <table>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
        ${users.map(u => `
          <tr>
            <td>${u.firstName} ${u.lastName}</td>
            <td>${u.email}</td>
            <td>
              <button class="action-btn edit"
                onclick="editUser('${u._id}', '${u.firstName}', '${u.lastName}', '${u.email}')">
                Edit
              </button>

              <button class="action-btn delete"
                onclick="deleteUser('${u._id}')">
                Delete
              </button>
            </td>
          </tr>
        `).join("")}
      </table>
    `;
  } catch (err) {
    alert(err.message);
  }
}

/* ================= EDIT ================= */
async function editUser(id, firstName, lastName, email) {
  const newName = prompt("First name:", firstName);
  if (!newName) return;

  try {
    await request(`${apiBase}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: newName }),
    });

    alert("Updated!");
    loadUsers();
  } catch (err) {
    alert(err.message);
  }
}

/* ================= DELETE ================= */
async function deleteUser(id) {
  if (!confirm("Delete user?")) return;

  try {
    await request(`${apiBase}/${id}`, { method: "DELETE" });
    alert("Deleted!");
    loadUsers();
  } catch (err) {
    alert(err.message);
  }
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}