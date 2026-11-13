
/* =========================================
   STACKLY / ROSE ATELIER
   SHARED DASHBOARD CORE
========================================= */

/* ================= DOM HELPERS ================= */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const inr = (n) =>
  "₹" + Number(n).toLocaleString("en-IN");

/* ================= IMAGE HELPERS ================= */

// const IMG = (i) =>
//   `https://images.unsplash.com/${i}?auto=format&fit=crop&w=500&q=80`;

// const P = {
//   mk2: "photo-1487412947147-5cebf100ffc2",
//   mk: "photo-1522335789203-aabd1fc54bc9",
//   br: "photo-1522337360788-8b13dee7a37e",
//   co: "photo-1596462502278-27bfdc403348",
//   sk: "photo-1571781926291-c477ebfd024b",
//   sk2: "photo-1556228720-195a672e8a03",
//   fc: "photo-1515886657613-9f3515b0c78f",
//   fa: "photo-1469334031218-e382a71b716b",
//   fh: "photo-1503342217505-b0a15ec3261c",
//   fi: "photo-1434389677669-e08b4cac3105",
//   fe: "photo-1490481651871-ab68de25d43d",
//   fb: "photo-1445205170230-053b83016050"
// };

// const pim = (key) =>
//   `<img src="${IMG(P[key])}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">`;

const IMG = (filename) => `images/${filename}`;

const P = {
  mk2: IMG("img13.webp"),
  mk: IMG("img2.webp"),
  br: IMG("img3.webp"),
  co: IMG("img16.webp"),
  sk: IMG("img5.webp"),
  sk2: IMG("img6.webp"),
  fc: IMG("img7.webp"),
  fa: IMG("img8.webp"),
  fh: IMG("img9.webp"),
  fi: IMG("img10.webp"),
  fe: IMG("img11.webp"),
  fb: IMG("img12.webp")
};

const pim = (key) =>
  `<img src="${P[key]}" alt="" loading="lazy">`;

/* ================= WISHLIST IMAGES ================= */

function initWishlistImages() {
  $$("#wishlistGrid .pcard[data-wish-card]").forEach(card => {
    const key = card.dataset.wishCard;
    const imageBox = $(".im", card);

    if (imageBox && P[key]) {
      imageBox.innerHTML = pim(key);
    }
  });
}

/* ================= CHART COLORS ================= */

const COL = [
  "#ff4f86",
  "#f4c26b",
  "#7a4bd6",
  "#18a999",
  "#ff8a5c",
  "#4b8bff"
];

/* =========================================
   SHARED DASHBOARD HELPERS
========================================= */

const D = {

  /* TOAST */
  toast(message) {
    const toast = $("#toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("on");

    clearTimeout(toast._t);

    toast._t = setTimeout(() => {
      toast.classList.remove("on");
    }, 2800);
  },

  /* MODAL */
  modal(content) {
    const modal = $("#modal");

    if (!modal) return;

    modal.innerHTML = `
      <div class="mbox" role="dialog" aria-modal="true">
        <button class="mx" type="button" aria-label="Close">×</button>
        ${content}
      </div>
    `;

    modal.classList.add("on");

    const closeButton = $("#modal .mx");

    if (closeButton) {
      closeButton.onclick = D.close;
    }
  },

  /* CLOSE MODAL */
  close() {
    $("#modal")?.classList.remove("on");
  },

  /* STATUS BADGE */
  badge(status) {
    return `
      <span class="bdg b-${status.toLowerCase().replace(/\s/g, "")}">
        ${status}
      </span>
    `;
  },

  /* TABLE */
  table(columns, rows) {
    return `
      <div class="tw">
        <table>
          <thead>
            <tr>
              ${columns.map(c => `<th>${c}</th>`).join("")}
            </tr>
          </thead>

          <tbody>
            ${rows.map(row => `
              <tr>
                ${row.map(cell => `<td>${cell}</td>`).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  },

  /* TOGGLE */
  tg(id, on) {
    return `
      <label class="tg">
        <input type="checkbox" id="${id}" ${on ? "checked" : ""}>
        <i></i>
      </label>
    `;
  },

  /* HORIZONTAL BAR */
  hbar(rows) {
    const max = Math.max(1, ...rows.map(r => r[1]));

    return `
      <div class="hb">
        ${rows.map(([name, value, label]) => `
          <div>
            <span>${name}</span>
            <u>
              <i style="width:${Math.max(0, value / max * 100)}%"></i>
            </u>
            <b>${label || value}</b>
          </div>
        `).join("")}
      </div>
    `;
  },

  /* BAR CHART */
  bar(values, labels, formatter = x => x) {
    const max = Math.max(1, ...values);

    return `
      <div class="bars">
        ${values.map((value, i) => `
          <div class="bc" title="${labels[i]}: ${formatter(value)}">
            <i style="height:${Math.max(0, value / max * 100)}%;animation-delay:${i * 70}ms"></i>
            <span>${labels[i]}</span>
          </div>
        `).join("")}
      </div>
    `;
  },

  /* LINE CHART */
  line(values, labels) {
    const W = 600;
    const H = 210;

    if (!values.length) return "";

    const max = Math.max(1, ...values) * 1.1;

    const x = i =>
      values.length === 1
        ? W / 2
        : 30 + (i * (W - 50)) / (values.length - 1);

    const y = value =>
      H - 24 - (value / max) * (H - 44);

    const points = values.map((value, i) => [
      x(i),
      y(value)
    ]);

    const path = points.map((point, i) =>
      (i ? "L" : "M") +
      point[0].toFixed(1) +
      " " +
      point[1].toFixed(1)
    ).join(" ");

    const step = Math.ceil(values.length / 8);

    return `
      <div class="lc">
        <svg viewBox="0 0 ${W} ${H}">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#ff4f86" stop-opacity=".35"/>
              <stop offset="1" stop-color="#ff4f86" stop-opacity="0"/>
            </linearGradient>
          </defs>

          <path
            d="${path} L${x(values.length - 1)} ${H - 24} L30 ${H - 24}Z"
            fill="url(#lg)"
          />

          <path class="ln" d="${path}"/>

          ${points.map((point, i) => `
            <circle
              cx="${point[0]}"
              cy="${point[1]}"
              r="4"
              fill="#f4c26b"
            >
              <title>
                ${labels[i]}: ${values[i].toLocaleString("en-IN")}
              </title>
            </circle>

            ${i % step === 0 ? `
              <text
                x="${point[0]}"
                y="${H - 6}"
                text-anchor="middle"
              >
                ${labels[i]}
              </text>
            ` : ""}
          `).join("")}
        </svg>
      </div>
    `;
  },

  /* DONUT CHART */
  donut(pairs, centerText = "") {
    const total = pairs.reduce(
      (sum, pair) => sum + pair[1],
      0
    );

    if (!total) return "";

    let start = 0;

    const gradient = pairs.map((pair, i) => {
      const previous = start;

      start += (pair[1] / total) * 100;

      return `${COL[i % COL.length]} ${previous}% ${start}%`;
    }).join(",");

    return `
      <div class="dn-w">
        <div
          class="donut"
          style="background:conic-gradient(${gradient})"
        >
          <div>${centerText}</div>
        </div>

        <div class="leg">
          ${pairs.map((pair, i) => `
            <span>
              <i style="background:${COL[i % COL.length]}"></i>
              ${pair[0]}
              <b>${Math.round((pair[1] / total) * 100)}%</b>
            </span>
          `).join("")}
        </div>
      </div>
    `;
  },

  /* PROGRESS BAR */
  prog(percent, label, right = "") {
    const safePercent = Math.max(
      0,
      Math.min(100, Number(percent) || 0)
    );

    return `
      <div class="prog">
        <p>
          <span>${label}</span>
          <b>${right || safePercent + "%"}</b>
        </p>

        <u>
          <i style="width:${safePercent}%"></i>
        </u>
      </div>
    `;
  },

  /* KPI CARD */
  kpi(label, value, note, icon, positive = true) {
    return `
      <div class="kpi">
        <div class="ki">${icon}</div>

        <div>
          <small>${label}</small>
          <h3>${value}</h3>
          <span class="${positive ? "up" : "dn"}">${note}</span>
        </div>
      </div>
    `;
  },

  /* CONTENT PANEL */
  panel(title, content, note = "") {
    return `
      <section class="panel">
        <div class="ph">
          <h3>${title}</h3>
          ${note ? `<small>${note}</small>` : ""}
        </div>

        <div class="pb">
          ${content}
        </div>
      </section>
    `;
  },

  /* ORDER STEPS */
  steps(labels, active) {
    return `
      <div class="steps">
        ${labels.map((label, index) => `
          <div class="step ${index <= active ? "done" : ""}">
            <span>
              ${index < active ? "✓" : index + 1}
            </span>

            <small>${label}</small>
          </div>
        `).join("")}
      </div>
    `;
  }
};

/* =========================================
   USER MANAGEMENT
========================================= */

let currentUser = {};

/* PARTNER USER */
function getUser() {
  let storedUser = {};

  try {
    storedUser =
      JSON.parse(sessionStorage.getItem("ra_user")) || {};
  } catch (error) {
    storedUser = {};
  }

  const demoUser = {
    name: "Priya Nair",
    email: "partner@roseatelier.com",
    role: "partner"
  };

  currentUser = {
    ...demoUser,
    ...(storedUser.role === "partner" ? storedUser : {})
  };

  return currentUser;
}

/* CUSTOMER USER */
function getUserForDashboard(demo) {
  let storedUser = {};

  try {
    storedUser =
      JSON.parse(sessionStorage.getItem("stackCurrentUser")) || {};
  } catch (error) {
    storedUser = {};
  }

  return {
    ...demo,
    ...(storedUser.role === demo.role ? storedUser : {})
  };
}

/* USER INITIALS */
function getInitials(name = "User") {
  return name
    .trim()
    .split(/\s+/)
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* PARTNER PROFILE */
function initUserProfile() {
  const user = getUser();

  if ($("#userInitials")) {
    $("#userInitials").textContent = getInitials(user.name);
  }

  if ($("#userName")) {
    $("#userName").textContent = user.name;
  }
}

/* =========================================
   CUSTOMER DASHBOARD - DYNAMIC MOUNT
========================================= */

function mount(config) {
  const side = $("#side");
  const top = $("#top");
  const view = $("#view");

  if (!side || !top || !view) return;

  const modules = config.modules || [];
  const demo = config.demo || {};
  const notes = config.notes || [];

  const user = getUserForDashboard(demo);

  const firstName = (user.name || "User").split(" ")[0];
  const initials = getInitials(user.name);

  /* ================= SIDEBAR ================= */

  side.innerHTML = `
    <div class="side-head">
      <a href="#" class="logo">
        <span>Rosé Atelier</span>
      </a>

      <button
        class="side-close"
        id="sideClose"
        type="button"
        aria-label="Close menu"
      >
        ×
      </button>
    </div>

    <div class="side-user">
      <div class="avatar">${initials}</div>

      <div>
        <b>${user.name}</b>
        <small>${user.email}</small>
      </div>
    </div>

    <nav class="side-nav">
      <small class="nav-label">MENU</small>

      ${modules.map(module => `
        <button
          class="mb"
          type="button"
          data-m="${module.id}"
        >
          <span>${module.icon}</span>
          <span>${module.label}</span>

          ${module.cnt
            ? `<i>${module.cnt}</i>`
            : ""}
        </button>
      `).join("")}
    </nav>

    <div class="side-bottom">
      <button
        class="mb"
        id="lo"
        type="button"
      >
        <span>↪</span>
        <span>Logout</span>
      </button>
    </div>
  `;

  /* ================= TOPBAR ================= */

  top.innerHTML = `
    <button
      class="burger"
      type="button"
      aria-label="Open menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div class="top-title">
      <h2 id="ttl">Overview</h2>
      <small>Welcome back, ${firstName}</small>
    </div>

    <div class="top-actions">

      <button
        class="tb-icon"
        id="bell"
        type="button"
        aria-label="Notifications"
      >
        ♡
      </button>

      <div class="drop" id="drop">
        ${notes.map(note => `
          <div class="notice">${note}</div>
        `).join("")}
      </div>

      <div class="top-user">
        <span class="avatar">${initials}</span>
        <span>${user.name}</span>
      </div>

    </div>
  `;

  /* ================= LOGOUT ================= */

  function logout() {
    sessionStorage.removeItem("ra_user");
    location.href = "login.html";
  }

  $("#lo")?.addEventListener("click", logout);

  /* ================= SIDEBAR ================= */

  const overlay = $("#ov");

  function toggleSidebar(open) {
    side.classList.toggle("open", open);

    overlay?.classList.toggle("on", open);

    document.body.style.overflow = open
      ? "hidden"
      : "";
  }

  $(".burger", top)?.addEventListener("click", () => {
    toggleSidebar(!side.classList.contains("open"));
  });

  $("#sideClose")?.addEventListener("click", () => {
    toggleSidebar(false);
  });

  overlay?.addEventListener("click", () => {
    toggleSidebar(false);
  });

  /* ================= MODULE RENDERING ================= */

  function renderModule(id) {
    const module =
      modules.find(item => item.id === id) || modules[0];

    if (!module) return;

    /* Active menu */
    $$(".mb[data-m]", side).forEach(button => {
      button.classList.toggle(
        "on",
        button.dataset.m === module.id
      );
    });

    /* Page title */
    const title = $("#ttl");

    if (title) {
      title.textContent = module.label;
    }

    document.title =
      module.label + " | Rosé Atelier";

    /* Render module */
    view.innerHTML = module.render(user);

    /* Initialize module interactions */
    if (typeof module.init === "function") {
      module.init();
    }

    /* Close mobile sidebar */
    toggleSidebar(false);

    /* Close notification dropdown */
    $("#drop")?.classList.remove("on");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  /* ================= MODULE BUTTONS ================= */

  side.querySelectorAll(".mb[data-m]").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.m;

      if (location.hash === "#" + id) {
        renderModule(id);
      } else {
        location.hash = id;
      }
    });
  });

  /* ================= HASH NAVIGATION ================= */

  function navigate() {
    const requestedId =
      location.hash.slice(1) || "overview";

    const validModule = modules.some(
      module => module.id === requestedId
    );

    renderModule(
      validModule ? requestedId : "overview"
    );
  }

  window.addEventListener("hashchange", navigate);

  /* ================= NOTIFICATIONS ================= */

  $("#bell")?.addEventListener("click", () => {
    $("#drop")?.classList.toggle("on");
  });

  /* ================= ESCAPE ================= */

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      toggleSidebar(false);

      $("#drop")?.classList.remove("on");

      D.close();
    }
  });

  /* ================= MODAL BACKDROP ================= */

  $("#modal")?.addEventListener("click", event => {
    if (event.target.id === "modal") {
      D.close();
    }
  });

  /* ================= FIRST MODULE ================= */

  navigate();
}

/* =========================================
   PARTNER DASHBOARD - STATIC NAVIGATION
========================================= */

function initPartnerNavigation() {
  const side = $("#side");
  const overlay = $("#ov");

  const sections = $$(".dashboard-section");
  const navButtons = $$(".mb[data-m]");

  /* Do not run on Customer Dashboard */
  if (!sections.length || !navButtons.length) return;

  const modules = [
    { id: "overview", label: "Overview" },
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
    { id: "analytics", label: "Analytics" },
    { id: "payouts", label: "Payouts" },
    { id: "settings", label: "Store Settings" }
  ];

  /* ================= SIDEBAR ================= */

  function toggleSidebar(open) {
    side?.classList.toggle("open", open);

    overlay?.classList.toggle("on", open);

    document.body.style.overflow = open
      ? "hidden"
      : "";
  }

  /* ================= NAVIGATION ================= */

  function navigate() {
    const requestedId =
      location.hash.slice(1) || "overview";

    const activeModule =
      modules.find(module => module.id === requestedId)
      || modules[0];

    /* Show selected section */
    sections.forEach(section => {
      section.hidden =
        section.id !== activeModule.id;
    });

    /* Active menu */
    navButtons.forEach(button => {
      button.classList.toggle(
        "on",
        button.dataset.m === activeModule.id
      );
    });

    /* Page title */
    const title = $("#ttl");

    if (title) {
      title.textContent = activeModule.label;
    }

    document.title =
      activeModule.label + " | Stackly Partner Dashboard";

    /* Close sidebar */
    toggleSidebar(false);

    /* Close dropdown */
    $("#drop")?.classList.remove("on");

    /* Scroll to top */
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    /* Trigger Partner module initialization */
    document.dispatchEvent(
      new CustomEvent("dashboard:navigate", {
        detail: {
          id: activeModule.id
        }
      })
    );
  }

  /* ================= MENU BUTTONS ================= */

  navButtons.forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.m;

      if (location.hash === "#" + id) {
        navigate();
      } else {
        location.hash = id;
      }
    });
  });

  /* ================= MOBILE SIDEBAR ================= */

  $(".burger")?.addEventListener("click", () => {
    toggleSidebar(!side?.classList.contains("open"));
  });

  overlay?.addEventListener("click", () => {
    toggleSidebar(false);
  });

  /* ================= HASH CHANGE ================= */

  window.addEventListener("hashchange", navigate);

  /* ================= MODULE SEARCH ================= */

  $("#sq")?.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;

    const query =
      event.target.value.trim().toLowerCase();

    const match = modules.find(module =>
      module.label.toLowerCase().includes(query)
    );

    if (match) {
      location.hash = match.id;
      event.target.value = "";
    } else {
      D.toast(`No module matches "${query}"`);
    }
  });

  /* ================= NOTIFICATIONS ================= */

  $("#bell")?.addEventListener("click", () => {
    $("#drop")?.classList.toggle("on");
  });

  /* ================= LOGOUT ================= */

  function logout() {
    sessionStorage.removeItem("ra_user");
    location.href = "login.html";
  }

  $("#lo")?.addEventListener("click", logout);
  $("#lo2")?.addEventListener("click", logout);

  /* ================= ESCAPE ================= */

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      toggleSidebar(false);

      $("#drop")?.classList.remove("on");

      D.close();
    }
  });

  /* ================= MODAL BACKDROP ================= */

  $("#modal")?.addEventListener("click", event => {
    if (event.target.id === "modal") {
      D.close();
    }
  });

  /* ================= INITIAL MODULE ================= */

  navigate();
}


/* =========================================
   CUSTOMER DASHBOARD - STATIC NAVIGATION
========================================= */

function initCustomerNavigation() {
  const side = $("#side");
  const overlay = $("#ov");
  const sections = $$(".dashboard-section");
  const navButtons = $$(".mb[data-m]");

  if (!side || !sections.length || !navButtons.length) return;

  const modules = [
    { id: "overview", label: "Overview" },
    { id: "orders", label: "My Orders" },
    { id: "wishlist", label: "Wishlist" },
    { id: "profile", label: "Beauty Profile" },
    { id: "rewards", label: "Rewards" },
    { id: "settings", label: "Settings" }
  ];

  /* SIDEBAR */
  function toggleSidebar(open) {
    side.classList.toggle("open", open);
    overlay?.classList.toggle("on", open);

    document.body.style.overflow = open ? "hidden" : "";
  }

  /* NAVIGATION */
  function navigate() {
    const requestedId = location.hash.slice(1) || "overview";

    const activeModule =
      modules.find(module => module.id === requestedId) ||
      modules[0];

    /* Show selected section */
    sections.forEach(section => {
      section.hidden = section.id !== activeModule.id;
    });

    /* Active menu */
    navButtons.forEach(button => {
      button.classList.toggle(
        "on",
        button.dataset.m === activeModule.id
      );
    });

    /* Update title */
    const title = $("#ttl");

    if (title) {
      title.textContent = activeModule.label;
    }

    document.title =
      activeModule.label + " | Customer Dashboard | Rose Atelier";

    /* Close sidebar and notifications */
    toggleSidebar(false);
    $("#drop")?.classList.remove("on");

    /* Scroll to top */
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  /* MENU BUTTONS */
  navButtons.forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.m;

      if (location.hash === "#" + id) {
        navigate();
      } else {
        location.hash = id;
      }
    });
  });

  /* MOBILE SIDEBAR */
  $(".burger")?.addEventListener("click", () => {
    toggleSidebar(!side.classList.contains("open"));
  });

  overlay?.addEventListener("click", () => {
    toggleSidebar(false);
  });

  /* HASH NAVIGATION */
  window.addEventListener("hashchange", navigate);

  /* NOTIFICATIONS */
  $("#bell")?.addEventListener("click", () => {
    $("#drop")?.classList.toggle("on");
  });

  /* LOGOUT */
  $("#lo")?.addEventListener("click", () => {
    sessionStorage.removeItem("ra_user");
    location.href = "login.html";
  });

  /* ESCAPE KEY */
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      toggleSidebar(false);
      $("#drop")?.classList.remove("on");
      D.close();
    }
  });

  /* MODAL BACKDROP */
  $("#modal")?.addEventListener("click", event => {
    if (event.target.id === "modal") {
      D.close();
    }
  });

  /* INITIAL SECTION */
  navigate();
}


/* =========================================
   SHARED DASHBOARD STARTUP
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* CUSTOMER DASHBOARD */
  if (document.body.classList.contains("cust")) {
    initWishlistImages();
    initCustomerNavigation();
    return;
  }

  /* PARTNER DASHBOARD */
  if ($$(".dashboard-section").length) {
    initUserProfile();
    initPartnerNavigation();
  }

});
