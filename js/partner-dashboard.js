document.addEventListener("DOMContentLoaded", () => {

  let currentUser = null;

  try {
    currentUser = JSON.parse(
      sessionStorage.getItem("stackCurrentUser") || "null"
    );
  } catch (error) {
    console.error("User session error:", error);
  }

  if (!currentUser) return;

  document.querySelectorAll(".profileName").forEach((element) => {
    element.textContent = currentUser.name || "User";
  });

  document.querySelectorAll(".profileEmail").forEach((element) => {
    element.textContent = currentUser.email || "";
  });

  document.querySelectorAll(".avatar").forEach((element) => {
    element.textContent =
      currentUser.name?.trim().charAt(0).toUpperCase() || "U";
  });

});


/* =========================================
   PARTNER DASHBOARD — INTERACTIONS
========================================= */

/* ================= PRODUCT DATA ================= */

const prods = [
  { id: "P-101", k: "mk2", n: "Velvet Rouge Lipstick", c: "Cosmetics", p: 899, s: 142, on: 1 },
  { id: "P-102", k: "mk", n: "Eye Palette Dusk", c: "Cosmetics", p: 1299, s: 64, on: 1 },
  { id: "P-103", k: "sk", n: "Glow Serum", c: "Skincare", p: 1099, s: 9, on: 1 },
  { id: "P-104", k: "sk2", n: "Barrier Cream", c: "Skincare", p: 949, s: 88, on: 1 },
  { id: "P-105", k: "fc", n: "Rosewood Wrap Dress", c: "Fashion", p: 2799, s: 23, on: 1 },
  { id: "P-106", k: "fh", n: "Oversized Hoodie", c: "Fashion", p: 1899, s: 0, on: 0 },
  { id: "P-107", k: "fi", n: "Tailored Blazer", c: "Fashion", p: 3299, s: 31, on: 1 },
  { id: "P-108", k: "br", n: "Cloud Brush Set", c: "Cosmetics", p: 1499, s: 12, on: 1 }
];

/* ================= ORDER DATA ================= */

const ords = [
  { id: "#8841", cu: "Meera K.", it: "Rosewood Wrap Dress", t: 2799, st: "Processing", ch: "Website" },
  { id: "#8840", cu: "Ritika S.", it: "Glow Serum x2", t: 2198, st: "Packed", ch: "Instagram" },
  { id: "#8839", cu: "Sana A.", it: "Velvet Rouge Lipstick", t: 899, st: "Shipped", ch: "Website" },
  { id: "#8838", cu: "Divya R.", it: "Tailored Blazer", t: 3299, st: "Delivered", ch: "Marketplace" },
  { id: "#8837", cu: "Tara N.", it: "Cloud Brush Set", t: 1499, st: "Delivered", ch: "Website" },
  { id: "#8836", cu: "Isha P.", it: "Eye Palette Dusk", t: 1299, st: "Returned", ch: "Marketplace" },
  { id: "#8835", cu: "Lakshmi V.", it: "Barrier Cream x3", t: 2847, st: "Pending", ch: "Instagram" }
];

const statuses = [
  "Pending",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Returned"
];

/* ================= CHART DATA ================= */

const days = (n) => Array.from({ length: n }, (_, i) => i + 1 + "");

const rnd = (n, base, variation) =>
  Array.from({ length: n }, (_, i) =>
    Math.round(
      base +
      Math.sin(i / 2) * variation +
      (((i * 37) % 11) * variation) / 6
    )
  );

const RG = {
  "7 days": [
    rnd(7, 38, 9),
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  ],

  "30 days": [
    rnd(15, 40, 10),
    days(15).map((d, i) => i * 2 + 1 + " Nov")
  ],

  "90 days": [
    rnd(12, 42, 12),
    ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"]
  ]
};

const stockStatus = (product) => {
  if (product.s === 0) return "Out of stock";
  if (product.s < 15) return "Low stock";
  return "Active";
};

/* ================= OVERVIEW ================= */

function initOverview() {
  const chart = $("#lch");

  if (!chart) return;

  function drawChart(range) {
    chart.innerHTML = D.line(RG[range][0], RG[range][1]);
  }

  drawChart("30 days");

  $$("#rg .chip").forEach((button) => {
    button.addEventListener("click", () => {
      $$("#rg .chip").forEach((item) => item.classList.remove("on"));

      button.classList.add("on");
      drawChart(button.dataset.r);
    });
  });

  /* Recent orders */
  $("#recentOrders").innerHTML = D.table(
    ["Order", "Customer", "Items", "Total", "Status"],
    ords.slice(0, 5).map((order) => [
      `<b>${order.id}</b>`,
      order.cu,
      order.it,
      inr(order.t),
      D.badge(order.st)
    ])
  );
}

/* ================= PRODUCTS ================= */

function initProducts() {
  const search = $("#ps");
  const category = $("#pcat");
  const table = $("#pt");

  if (!table) return;

  function updateProductCounts() {
    $("#listedCount").textContent = prods.length;

    $("#lowStockCount").textContent = prods.filter(
      (product) => product.s > 0 && product.s < 15
    ).length;

    $("#outStockCount").textContent = prods.filter(
      (product) => product.s === 0
    ).length;
  }

  function drawProducts() {
    const query = search.value.trim().toLowerCase();
    const selectedCategory = category.value;

    const filtered = prods.filter((product) => {
      const matchesSearch =
        product.n.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        product.c === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    table.innerHTML = D.table(
      ["Product", "Category", "Price", "Stock", "Status", "Live"],

      filtered.map((product) => [
        `
          <div class="li" style="padding:0;border:0">
            ${pim(product.k)}
            <div class="t">
              <b>${product.n}</b>
              <small>${product.id}</small>
            </div>
          </div>
        `,

        product.c,
        inr(product.p),
        `<b class="stock">${product.s}</b>`,
        D.badge(stockStatus(product)),
        D.tg("t" + product.id, product.on)
      ])
    );

    /* Product visibility switches */
    $$("#pt .tg input").forEach((input) => {
      input.addEventListener("change", () => {
        const product = prods.find(
          (item) => "t" + item.id === input.id
        );

        if (!product) return;

        product.on = input.checked ? 1 : 0;

        D.toast(
          product.n +
          (product.on ? " is now live" : " hidden from store")
        );
      });
    });

    updateProductCounts();
  }

  search.addEventListener("input", drawProducts);
  category.addEventListener("change", drawProducts);

  /* Add product modal */
  $("#add").addEventListener("click", () => {
    D.modal(`
      <h3>Add new product</h3>

      <form class="form" id="np" style="grid-template-columns:1fr 1fr">

        <label class="f">
          Name
          <input id="n1" required>
        </label>

        <label class="f">
          Category
          <select id="n2">
            <option>Cosmetics</option>
            <option>Skincare</option>
            <option>Fashion</option>
          </select>
        </label>

        <label class="f">
          Price (₹)
          <input id="n3" type="number" min="1" required>
        </label>

        <label class="f">
          Stock
          <input id="n4" type="number" min="0" required>
        </label>

        <div style="grid-column:1/-1">
          <button class="btn" type="submit">Publish product</button>
        </div>

      </form>
    `);

    $("#np").addEventListener("submit", (event) => {
      event.preventDefault();

      const name = $("#n1").value.trim();
      const category = $("#n2").value;
      const price = Number($("#n3").value);
      const stock = Number($("#n4").value);

      if (!name || price <= 0 || stock < 0) return;

      const nextId = Math.max(
        108,
        ...prods.map((product) => Number(product.id.split("-")[1]))
      ) + 1;

      prods.unshift({
        id: "P-" + nextId,
        k: "co",
        n: name,
        c: category,
        p: price,
        s: stock,
        on: 1
      });

      D.close();

      search.value = "";
      $("#pcat").value = "All";

      drawProducts();
      D.toast("Product published");
    });
  });

  drawProducts();
}

/* ================= ORDERS ================= */

function initOrders() {
  const pipeline = $("#kn");
  const orderTable = $("#ot");

  if (!pipeline || !orderTable) return;

  function drawOrders() {
    /* Pipeline */
    pipeline.innerHTML = statuses.slice(0, 5).map((status) => {
      const matchingOrders = ords.filter(
        (order) => order.st === status
      );

      return `
        <div>
          <h4>
            ${status}
            <span>${matchingOrders.length}</span>
          </h4>

          ${matchingOrders.map((order) => `
            <p>${order.id} · ${order.cu}</p>
          `).join("")}
        </div>
      `;
    }).join("");

    /* Orders table */
    orderTable.innerHTML = D.table(
      ["Order", "Customer", "Items", "Channel", "Total", "Status"],

      ords.map((order, index) => [
        `<b>${order.id}</b>`,
        order.cu,
        order.it,
        order.ch,
        inr(order.t),

        `
          <select
            class="st"
            data-i="${index}"
            aria-label="Status for ${order.id}"
          >
            ${statuses.map((status) => `
              <option ${status === order.st ? "selected" : ""}>
                ${status}
              </option>
            `).join("")}
          </select>
        `
      ])
    );

    /* Status change */
    $$("#ot select").forEach((select) => {
      select.addEventListener("change", () => {
        const order = ords[Number(select.dataset.i)];

        order.st = select.value;

        D.toast(
          "Order " + order.id + " marked " + select.value
        );

        drawOrders();
      });
    });
  }

  drawOrders();

  /* Return approval */
  $$("[data-ap]").forEach((button) => {
    button.addEventListener("click", () => {
      button.outerHTML = D.badge("Completed");
      D.toast("Return approved, refund started");
    });
  });
}

/* ================= ANALYTICS ================= */

function initAnalytics() {
  /* Age chart */
  const ageChart = $("#ageChart");

  if (ageChart) {
    ageChart.innerHTML = D.bar(
      [14, 38, 27, 13, 8],
      ["<18", "18-24", "25-34", "35-44", "45+"],
      (value) => value + "%"
    );
  }

  /* Best selling hours */
  const heatmap = $("#hm");

  if (!heatmap) return;

  const times = ["6am", "9am", "12pm", "3pm", "6pm", "9pm"];
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  let html = "<span></span>";

  html += times.map((time) => `<span>${time}</span>`).join("");

  weekdays.forEach((day, row) => {
    html += `<span>${day}</span>`;

    times.forEach((time, col) => {
      const value =
        0.15 + Math.abs(Math.sin(row * 2 + col * 1.3)) * 0.85;

      html += `
        <i
          title="${day} ${time}"
          style="opacity:${value.toFixed(2)};animation-delay:${(row * 6 + col) * 15}ms"
        ></i>
      `;
    });
  });

  heatmap.innerHTML = html;
}

/* ================= PAYOUTS ================= */

function initPayouts() {
  const requestButton = $("#rq");

  if (requestButton) {
    requestButton.addEventListener("click", () => {
      D.modal(`
        <h3>Confirm instant payout</h3>

        <p style="margin-bottom:6px">
          Amount: <b>${inr(86450)}</b>
        </p>

        <p style="margin-bottom:16px">
          Fee (1.5%): <b>${inr(1297)}</b>
          · You receive <b>${inr(85153)}</b>
        </p>

        <button class="btn g" id="confirmPayout">
          Confirm
        </button>
      `);

      $("#confirmPayout").addEventListener("click", () => {
        D.close();
        D.toast("Payout requested. Funds arrive within 30 minutes");
      });
    });
  }

  /* Invoice download actions */
  $$("[data-dl]").forEach((button) => {
    button.addEventListener("click", () => {
      D.toast(button.dataset.dl + " statement downloading");
    });
  });

  /* Bank details */
  const bankButton = $("#sb");

  if (bankButton) {
    bankButton.addEventListener("click", () => {
      const holder = $("#bankHolder").value.trim();
      const account = $("#bankNumber").value.trim();
      const ifsc = $("#bankIfsc").value.trim();

      if (!holder || !account || !ifsc) {
        D.toast("Please complete all bank details");
        return;
      }

      D.toast("Bank details sent for verification");
    });
  }
}

/* ================= SETTINGS ================= */

function initSettings() {
  /* Store profile */
  const storeForm = $("#sf");

  if (storeForm) {
    storeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      D.toast("Store profile saved");
    });
  }

  /* Shipping rules */
  const shippingButton = $("#ss");

  if (shippingButton) {
    shippingButton.addEventListener("click", () => {
      D.toast("Shipping rules saved");
    });
  }

  /* Settings switches */
  $$(".tg input").forEach((input) => {
    input.addEventListener("change", () => {
      D.toast("Setting updated");
    });
  });

  /* Invite team member */
  const inviteButton = $("#inv");

  if (inviteButton) {
    inviteButton.addEventListener("click", () => {
      D.modal(`
        <h3>Invite team member</h3>

        <form class="form" id="iv" style="grid-template-columns:1fr">

          <label class="f">
            Email
            <input type="email" id="inviteEmail" required>
          </label>

          <label class="f">
            Role
            <select id="inviteRole">
              <option>Inventory</option>
              <option>Support</option>
              <option>Manager</option>
            </select>
          </label>

          <div>
            <button class="btn" type="submit">Send invite</button>
          </div>

        </form>
      `);

      $("#iv").addEventListener("submit", (event) => {
        event.preventDefault();

        D.close();
        D.toast("Invitation sent");
      });
    });
  }
}

/* ================= MODULE INITIALIZATION ================= */

const dashboardModules = {
  overview: initOverview,
  products: initProducts,
  orders: initOrders,
  analytics: initAnalytics,
  payouts: initPayouts,
  settings: initSettings
};

document.addEventListener("dashboard:navigate", (event) => {
  const initialize = dashboardModules[event.detail.id];

  if (initialize) initialize();
});

