// ================= CONFIG =================
const AUTH_API = "https://driver-auth.vercel.app/";
const DRIVER_API = "https://driver-service.up.railway.app/drivers";

let token = localStorage.getItem("token");

// ================= AUTH =================
async function register() {
  const res = await fetch(`${AUTH_API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nama: document.getElementById("r_nama").value,
      email: document.getElementById("r_email").value,
      no_hp: document.getElementById("r_nohp").value,
      password: document.getElementById("r_password").value
    })
  });

  const data = await res.json();
  alert(data.message || "Register selesai");
}

async function login() {
  const res = await fetch(`${AUTH_API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("l_email").value,
      password: document.getElementById("l_password").value
    })
  });

  const data = await res.json();
  if (!data.token) {
    alert("Login gagal");
    return;
  }

  token = data.token;
  localStorage.setItem("token", token);

  document.getElementById("auth").style.display = "none";
  document.getElementById("crud").style.display = "block";

  loadDrivers();
}

function logout() {
  localStorage.removeItem("token");
  location.reload();
}

// ================= CRUD DRIVER =================
async function loadDrivers() {
  const res = await fetch(DRIVER_API);
  const drivers = await res.json();

  const tbody = document.getElementById("drivers");
  tbody.innerHTML = "";

  drivers.forEach(d => {
    tbody.innerHTML += `
      <tr>
        <td>${d.id}</td>
        <td>${d.nama}</td>
        <td>${d.email}</td>
        <td>${d.no_hp}</td>
        <td>${d.alamat || ""}</td>
        <td>${d.kendaraan || ""}</td>
        <td>${d.status}</td>
        <td>
          <button onclick='editDriver(${JSON.stringify(d)})'>Edit</button>
          <button onclick='deleteDriver(${d.id})'>Hapus</button>
        </td>
      </tr>
    `;
  });
}

async function saveDriver() {
  const id = document.getElementById("id").value;

  const payload = {
    nama: document.getElementById("nama").value,
    email: document.getElementById("email").value,
    no_hp: document.getElementById("no_hp").value,
    alamat: document.getElementById("alamat").value,
    kendaraan: document.getElementById("kendaraan").value,
    status: document.getElementById("status").value
  };

  const method = id ? "PUT" : "POST";
  const url = id ? `${DRIVER_API}/${id}` : DRIVER_API;

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  resetForm();
  loadDrivers();
}

function editDriver(d) {
  document.getElementById("id").value = d.id;
  document.getElementById("nama").value = d.nama;
  document.getElementById("email").value = d.email;
  document.getElementById("no_hp").value = d.no_hp;
  document.getElementById("alamat").value = d.alamat || "";
  document.getElementById("kendaraan").value = d.kendaraan || "";
  document.getElementById("status").value = d.status;
}

async function deleteDriver(id) {
  if (!confirm("Yakin hapus driver?")) return;

  await fetch(`${DRIVER_API}/${id}`, { method: "DELETE" });
  loadDrivers();
}

function resetForm() {
  document.getElementById("id").value = "";
  document.querySelectorAll("input").forEach(i => i.value = "");
}

// ================= AUTO LOGIN =================
if (token) {
  document.getElementById("auth").style.display = "none";
  document.getElementById("crud").style.display = "block";
  loadDrivers();
}
