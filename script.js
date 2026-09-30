/* =========================================================
   CodeChef Club Events - easy to read JavaScript
   Sections: 1. Data  2. Pages  3. Home  4. Events page
             5. Registration  6. Admin
   ========================================================= */

// ---------- 1. DATA ----------
// We load saved data from the browser (localStorage). If nothing is saved, use these sample events.
let events = JSON.parse(localStorage.getItem("events")) || [
  { id: 1, name: "HackNova 24h Hackathon", date: "2026-10-20", time: "10:00", venue: "Main Auditorium",
    category: "Hackathon", description: "Build and ship a project in 24 hours.", featured: true },
  { id: 2, name: "Intro to Web Dev Workshop", date: "2026-10-04", time: "15:00", venue: "Lab 3, CS Block",
    category: "Workshop", description: "HTML, CSS and JavaScript from scratch. Bring your laptop.", featured: false },
  { id: 3, name: "AI in Industry: Alumni Talk", date: "2026-10-08", time: "17:30", venue: "Seminar Hall B",
    category: "Talk", description: "Alumni share how AI is used in real products.", featured: false },
  { id: 4, name: "Open Mic Night", date: "2026-10-25", time: "18:00", venue: "Open Air Theatre",
    category: "Cultural", description: "Music, poetry and stand-up.", featured: false }
];
let registrations = JSON.parse(localStorage.getItem("registrations")) || [];

let editingId = null;      // id of the event being edited (null = adding new)
let registeringId = null;  // id of the event a student is registering for

// Save both lists to the browser
function saveData() {
  localStorage.setItem("events", JSON.stringify(events));
  localStorage.setItem("registrations", JSON.stringify(registrations));
}

// Turns "2026-10-04" + "15:00" into a nice readable text
function formatDate(e) {
  return new Date(e.date + "T" + e.time).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

// Stops users from typing HTML into our page (safety)
function safe(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ---------- 2. PAGES ----------
// Hide every page, then show only the one we want
function showPage(name) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(name).classList.remove("hidden");
  if (name === "home") showHome();
  if (name === "events") showEvents();
}

function closeModals() {
  document.getElementById("registerModal").classList.add("hidden");
  document.getElementById("eventModal").classList.add("hidden");
}

// One event card (used on Home and Events pages)
function makeCard(e) {
  return `
    <div class="card">
      <span class="tag">${safe(e.category)}</span>
      <h3>${safe(e.name)}</h3>
      <p>📅 ${formatDate(e)}<br>📍 ${safe(e.venue)}</p>
      <p>${safe(e.description)}</p>
      <button class="btn" onclick="openRegister(${e.id})">Register</button>
    </div>`;
}

// ---------- 3. HOME PAGE ----------
function showHome() {
  const featured = events.find(e => e.featured) || events[0];
  document.getElementById("featured").innerHTML = featured ? `
    <div class="featured">
      <h2>${safe(featured.name)}</h2>
      <p>📅 ${formatDate(featured)} &nbsp; 📍 ${safe(featured.venue)}</p>
      <p>${safe(featured.description)}</p>
      <button class="btn" onclick="openRegister(${featured.id})">Register now</button>
    </div>` : "<p>No events yet.</p>";

  // Sort by date and take the first 3
  const upcoming = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  document.getElementById("upcoming").innerHTML = upcoming.map(makeCard).join("");
}

// ---------- 4. EVENTS PAGE (search + filter) ----------
function showEvents() {
  const text = document.getElementById("searchBox").value.toLowerCase();
  const category = document.getElementById("categoryBox").value;

  const result = events.filter(e =>
    e.name.toLowerCase().includes(text) &&                 // name contains search text
    (category === "All" || e.category === category)        // category matches
  );

  document.getElementById("eventList").innerHTML =
    result.map(makeCard).join("") || "<p>No events found.</p>";
}

// ---------- 5. REGISTRATION ----------
function openRegister(id) {
  registeringId = id;
  const event = events.find(e => e.id === id);
  document.getElementById("registerTitle").textContent = "Register: " + event.name;
  ["rName", "rEmail", "rCollegeEmail", "rCollege", "rPhone", "rLinkedin"].forEach(i => document.getElementById(i).value = "");
  document.getElementById("registerError").textContent = "";
  document.getElementById("registerModal").classList.remove("hidden");
}

function submitRegistration() {
  const name = document.getElementById("rName").value.trim();
  const email = document.getElementById("rEmail").value.trim();
  const collegeEmail = document.getElementById("rCollegeEmail").value.trim();
  const college = document.getElementById("rCollege").value.trim();
  const year = document.getElementById("rYear").value;
  const phone = document.getElementById("rPhone").value.trim();
  const linkedin = document.getElementById("rLinkedin").value.trim();
  const error = document.getElementById("registerError");

  // Simple checks
  const emailPattern = /^\S+@\S+\.\S+$/;
  if (name.length < 2) return error.textContent = "Please enter your name.";
  if (!emailPattern.test(email)) return error.textContent = "Enter a valid email.";
  if (!emailPattern.test(collegeEmail)) return error.textContent = "Enter a valid college email.";
  if (!college) return error.textContent = "Enter your college.";
  if (!/^\d{10}$/.test(phone)) return error.textContent = "Phone must be 10 digits.";
  if (linkedin && !linkedin.includes("linkedin.com")) return error.textContent = "Enter a valid LinkedIn link.";

  // Save the registration
  registrations.push({ id: Date.now(), eventId: registeringId, name, email, collegeEmail, college, year, phone, linkedin });
  saveData();
  closeModals();
  alert("Registration successful! 🎉");
}

// ---------- 6. ADMIN ----------
function adminLogin() {
  if (document.getElementById("password").value === "admin123") {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    showAdmin();
  } else {
    alert("Wrong password");
  }
}

// Redraw everything on the admin page
function showAdmin() {
  // Events table with Edit and Delete buttons
  let rows = "<tr><th>Name</th><th>Date</th><th>Category</th><th>Actions</th></tr>";
  events.forEach(e => {
    rows += `<tr>
      <td>${safe(e.name)}</td><td>${formatDate(e)}</td><td>${safe(e.category)}</td>
      <td><button class="btn" onclick="openEventForm(${e.id})">Edit</button>
          <button class="btn red" onclick="deleteEvent(${e.id})">Delete</button></td></tr>`;
  });
  document.getElementById("eventTable").innerHTML = rows;

  // Fill the "filter by event" dropdown
  const filter = document.getElementById("regFilter");
  const current = filter.value || "all";
  filter.innerHTML = '<option value="all">All events</option>' +
    events.map(e => `<option value="${e.id}">${safe(e.name)}</option>`).join("");
  filter.value = current;

  showRegistrations();
}

// Registrations table with search + filter
function showRegistrations() {
  const text = document.getElementById("regSearch").value.toLowerCase();
  const eventId = document.getElementById("regFilter").value;

  const result = registrations.filter(r =>
    (eventId === "all" || r.eventId == eventId) &&
    (r.name + r.email + r.collegeEmail + r.college).toLowerCase().includes(text)
  );

  let rows = "<tr><th>Name</th><th>Email</th><th>College / Year</th><th>Phone</th><th>Event</th><th>LinkedIn</th></tr>";
  result.forEach(r => {
    const event = events.find(e => e.id === r.eventId);
    rows += `<tr>
      <td>${safe(r.name)}</td>
      <td>${safe(r.email)}<br>${safe(r.collegeEmail)}</td>
      <td>${safe(r.college)}<br>${safe(r.year)}</td>
      <td>${safe(r.phone)}</td>
      <td>${event ? safe(event.name) : "(deleted)"}</td>
      <td>${r.linkedin ? `<a href="${safe(r.linkedin)}" target="_blank">Profile</a>` : "-"}</td></tr>`;
  });
  if (!result.length) rows += '<tr><td colspan="6">No registrations found.</td></tr>';
  document.getElementById("regTable").innerHTML = rows;
}

// Open the popup to add a new event (no id) or edit an existing one (with id)
function openEventForm(id) {
  editingId = id || null;
  const e = id ? events.find(x => x.id === id)
               : { name: "", date: "", time: "", venue: "", category: "Workshop", description: "", featured: false };
  document.getElementById("formTitle").textContent = id ? "Edit Event" : "Add Event";
  document.getElementById("eName").value = e.name;
  document.getElementById("eDate").value = e.date;
  document.getElementById("eTime").value = e.time;
  document.getElementById("eVenue").value = e.venue;
  document.getElementById("eCategory").value = e.category;
  document.getElementById("eDesc").value = e.description;
  document.getElementById("eFeatured").checked = e.featured;
  document.getElementById("eventError").textContent = "";
  document.getElementById("eventModal").classList.remove("hidden");
}

function saveEvent() {
  const data = {
    name: document.getElementById("eName").value.trim(),
    date: document.getElementById("eDate").value,
    time: document.getElementById("eTime").value,
    venue: document.getElementById("eVenue").value.trim(),
    category: document.getElementById("eCategory").value,
    description: document.getElementById("eDesc").value.trim(),
    featured: document.getElementById("eFeatured").checked
  };
  if (!data.name || !data.date || !data.time || !data.venue) {
    document.getElementById("eventError").textContent = "Name, date, time and venue are required.";
    return;
  }
  if (data.featured) events.forEach(e => e.featured = false);   // only one featured event

  if (editingId) {
    Object.assign(events.find(e => e.id === editingId), data);  // EDIT: update existing
  } else {
    events.push({ id: Date.now(), ...data });                   // ADD: create new
  }
  saveData();
  closeModals();
  showAdmin();
}

function deleteEvent(id) {
  if (!confirm("Delete this event and its registrations?")) return;
  events = events.filter(e => e.id !== id);
  registrations = registrations.filter(r => r.eventId !== id);
  saveData();
  showAdmin();
}

// ---------- START ----------
showHome();
