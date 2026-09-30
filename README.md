# codechef
**# CodeChef Club Event Management Website

A responsive web app for managing and displaying college club events. Students can browse and register for events, and admins can manage events and view registrations.

Built with plain **HTML, CSS and JavaScript**. There are no frameworks and nothing to install.

---

## Features

### Student side
- **Home page:** club introduction, featured event, and upcoming events.
- **Events page:** all events shown as cards with name, date and time, venue, description and a Register button.
- **Search and filter:** search events by name and filter by category.
- **Event registration form** with:
  - Full name
  - Email
  - College email
  - College and year
  - Phone number (10 digits)
  - LinkedIn profile (optional)
- Form validation with clear error messages.
- Fully responsive (mobile, tablet and desktop).

### Admin side
- Simple password login.
- **Add**, **edit** and **delete** events.
- Mark one event as the **featured** event.
- **View registered students** with their details and LinkedIn link.
- **Search and filter registrations** by name, email, college or event.

---

## Project structure

```
club-events/
├── index.html   -> page structure (nav, pages, popups)
├── style.css    -> styling and responsive layout
├── script.js    -> all the logic (events, registration, admin)
└── README.md    -> this file
```

---

## How to run

**Option 1: just open it**
1. Download the project folder.
2. Double-click `index.html`. It opens in your browser.

**Option 2: VS Code with Live Server**
1. Open the folder in VS Code (File → Open Folder).
2. Install the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.

---

## Admin login

Click **Admin** in the nav bar and enter the password:

```
admin123
```

To change it, edit the `adminLogin()` function in `script.js`.

---

## How it works

| Part | Explanation |
|------|-------------|
| Pages | One HTML file. `showPage()` in `script.js` hides all sections and shows the selected one. |
| Data storage | Events and registrations are saved in the browser's **localStorage**, so they stay after refreshing. |
| Search and filter | `showEvents()` and `showRegistrations()` use JavaScript `filter()` on the data. |
| Add / edit / delete | `saveEvent()` and `deleteEvent()` update the `events` list and save it. |
| Responsive design | CSS Grid (`auto-fill`) and flexbox adapt the layout to any screen size. |
| Security | The `safe()` function escapes user input so it cannot inject HTML into the page. |

`script.js` is split into 6 numbered sections (Data, Pages, Home, Events, Registration, Admin), and each function has a short comment.

---

## Reset the data

To go back to the sample events, open DevTools (`F12`) → **Application** → **Local Storage**, and delete the `events` and `registrations` keys. Then refresh the page.

---

## Limitations and future improvements

- Data lives only in the browser, so it is not shared between users. A real deployment needs a backend (Node.js and MongoDB, or Firebase).
- The admin password is stored in the front-end code. Production use needs real authentication.
- Ideas for later: email confirmation, event capacity limits, downloading registrations as CSV, and event images.

---

## Tech stack

HTML5, CSS3, JavaScript (ES6)**
