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


/* =====================================================
   ROSE ATELIER — CUSTOMER DASHBOARD
   Functionality only. Dashboard content stays in HTML.
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  // =========================================
  // HELPERS
  // =========================================

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const toast = (message) => D.toast(message);

  const formatINR = (amount) =>
    "₹" + Number(amount).toLocaleString("en-IN");


  // =========================================
  // DATA
  // =========================================

  let points = 2450;

  const orders = [
    {
      id: "RA-10482",
      date: "08 Nov 2026",
      items: "Velvet Rouge Lipstick, Cloud Brush Set",
      total: 2398,
      status: "Shipped",
      step: 2
    },
    {
      id: "RA-10455",
      date: "02 Nov 2026",
      items: "Rosewood Wrap Dress",
      total: 2799,
      status: "Processing",
      step: 0
    },
    {
      id: "RA-10391",
      date: "21 Oct 2026",
      items: "Glow Serum, Barrier Cream",
      total: 2048,
      status: "Delivered",
      step: 4
    },
    {
      id: "RA-10320",
      date: "09 Oct 2026",
      items: "Tailored Blazer",
      total: 3299,
      status: "Delivered",
      step: 4
    },
    {
      id: "RA-10277",
      date: "28 Sep 2026",
      items: "Eye Palette Dusk",
      total: 1299,
      status: "Cancelled",
      step: 0
    },
    {
      id: "RA-10198",
      date: "12 Sep 2026",
      items: "Everyday Co-ord Set, Satin Blush Duo",
      total: 2948,
      status: "Delivered",
      step: 4
    }
  ];

  let wishlist = [
    { id: "fc", name: "Rosewood Wrap Dress", price: 2799, oldPrice: 3299 },
    { id: "mk", name: "Eye Palette Dusk", price: 1299, oldPrice: 1499 },
    { id: "fa", name: "Garden Midi", price: 2399, oldPrice: 2399 },
    { id: "sk", name: "Glow Serum", price: 1099, oldPrice: 1299 },
    { id: "fb", name: "Cargo Layer Set", price: 2599, oldPrice: 2599 },
    { id: "co", name: "Satin Blush Duo", price: 749, oldPrice: 899 }
  ];

  const steps = [
    "Placed",
    "Packed",
    "Shipped",
    "Out for delivery",
    "Delivered"
  ];

  const profile = {
    skin: "Combination",
    tone: "#e0ac8c",
    concerns: ["Dullness", "Dark spots"],
    top: "M",
    bottom: "30",
    shoe: "7"
  };

  const routines = {
    Oily: [
      "Gel cleanser (AM & PM)",
      "Niacinamide serum",
      "Oil-free gel moisturiser",
      "SPF 50 matte sunscreen"
    ],

    Dry: [
      "Cream cleanser",
      "Hyaluronic serum",
      "Barrier Cream (ceramides)",
      "SPF 40 hydrating sunscreen"
    ],

    Combination: [
      "Gentle gel cleanser",
      "Glow Serum (Vitamin C)",
      "Light lotion on T-zone, cream on cheeks",
      "SPF 50 sunscreen"
    ],

    Sensitive: [
      "Fragrance-free milk cleanser",
      "Soothing centella serum",
      "Barrier Cream",
      "Mineral SPF 30"
    ]
  };


  // =========================================
  // ADD TO BAG
  // =========================================

  document.addEventListener("click", (event) => {

    const button = event.target.closest("[data-add]");

    if (!button) return;

    toast(button.dataset.add + " added to your bag");

  });


  // =========================================
  // ORDER FILTERING
  // =========================================

  const orderRows = $("#orderRows");
  const orderFilters = $$("#of .chip");

  function filterOrders(status) {

    if (!orderRows) return;

    $$("#orderRows tr").forEach((row) => {

      const badge = $(".bdg", row);
      const rowStatus = badge ? badge.textContent.trim() : "";

      row.hidden =
        status !== "All" && rowStatus !== status;

    });

  }

  orderFilters.forEach((button) => {

    button.addEventListener("click", () => {

      orderFilters.forEach((item) =>
        item.classList.remove("on")
      );

      button.classList.add("on");

      filterOrders(button.dataset.s);

    });

  });


  // =========================================
  // ORDER TRACKING
  // =========================================

  function trackOrder(order) {

    if (!order) return;

    let content = `
      <h3>Track ${order.id}</h3>

      <p style="color:var(--muted);margin-bottom:18px">
        ${order.items}
      </p>
    `;

    if (order.status === "Cancelled") {

      content += `
        <p>
          This order was cancelled.
          Refund of ${formatINR(order.total)}
          was sent to your original payment method.
        </p>
      `;

    } else {

      content += D.steps(steps, order.step);

      content += `
        <p style="margin-top:16px">
          Courier: BlueDart · Tracking no. BD${order.id.slice(3)}9
        </p>
      `;

    }

    D.modal(content);

  }

  document.addEventListener("click", (event) => {

    const button = event.target.closest("[data-track]");

    if (!button) return;

    const order = orders.find(
      (item) => item.id === button.dataset.track
    );

    trackOrder(order);

  });


  // =========================================
  // WISHLIST
  // =========================================

  const wishlistGrid = $("#wishlistGrid");

  function updateWishlist() {

    const count = wishlist.length;

    const total = wishlist.reduce(
      (sum, item) => sum + item.price,
      0
    );

    if ($("#wishCount")) {
      $("#wishCount").textContent = count;
    }

    if ($("#savedCount")) {
      $("#savedCount").textContent = count;
    }

    if ($("#bagValue")) {
      $("#bagValue").textContent = formatINR(total);
    }

    if (wishlistGrid && count === 0) {

      wishlistGrid.innerHTML = `
        <p>
          Your wishlist is empty.
          Browse the store to save items you love.
        </p>
      `;

    }

  }

  function updatePriceAlerts() {

    const container = $("#priceAlerts");

    if (!container) return;

    const priceDrops = wishlist.filter(
      (item) => item.oldPrice > item.price
    );

    container.innerHTML = priceDrops.length
      ? priceDrops.map((item) => `
          <div class="li">
            <span class="dot">📉</span>

            <div class="t">
              <b>${item.name}</b>
              <small>
                Dropped from ${formatINR(item.oldPrice)}
                to ${formatINR(item.price)}
              </small>
            </div>

            <span class="bdg b-active">Active</span>
          </div>
        `).join("")
      : "<p>No price drops right now.</p>";

  }

  function removeWishlistItem(id, moveToBag = false) {

    const item = wishlist.find(
      (product) => product.id === id
    );

    if (!item) return;

    wishlist = wishlist.filter(
      (product) => product.id !== id
    );

    const card = $(`[data-wish-card="${id}"]`);

    if (card) card.remove();

    updateWishlist();
    updatePriceAlerts();

    if (moveToBag) {
      toast(item.name + " moved to bag");
    } else {
      toast("Removed from wishlist");
    }

  }

  document.addEventListener("click", (event) => {

    const moveButton = event.target.closest("[data-move]");
    const removeButton = event.target.closest("[data-remove]");

    if (moveButton) {
      removeWishlistItem(moveButton.dataset.move, true);
    }

    if (removeButton) {
      removeWishlistItem(removeButton.dataset.remove, false);
    }

  });

  updateWishlist();


  // =========================================
  // COPY TO CLIPBOARD
  // =========================================

  async function copyText(value, message) {

    try {

      if (!navigator.clipboard) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(value);

      toast(message);

    } catch (error) {

      toast("Unable to copy. Please copy manually.");

    }

  }

  $("#copyWishlist")?.addEventListener("click", () => {

    copyText(
      "roseatelier.com/w/aanya-2026",
      "Wishlist link copied"
    );

  });

  $("#copyReferral")?.addEventListener("click", () => {

    copyText(
      "AANYA500",
      "Referral code copied"
    );

  });


  // =========================================
  // BEAUTY PROFILE
  // =========================================

  const skinButtons = $$("#skinTypes [data-skin]");
  const concernButtons = $$("#skinConcerns [data-concern]");
  const toneButtons = $$("#skinTones [data-tone]");

  function updateRoutine() {

    const routineGrid = $("#routineGrid");

    if (!routineGrid) return;

    const icons = ["🧼", "💧", "🧴", "☀️"];

    $$(".rw", routineGrid).forEach((card, index) => {

      const text = $("span:last-child", card);

      if (text) {
        text.textContent = routines[profile.skin][index];
      }

    });

    const focus = $("#routineFocus");

    if (focus) {

      focus.innerHTML = profile.concerns.length
        ? `Focus areas: <b>${profile.concerns.join(", ")}</b>. We suggest a Vitamin C serum in the morning and a gentle exfoliant twice a week.`
        : "Select your skin concerns to receive personalised recommendations.";

    }

    const percentage = Math.min(
      100,
      60 + profile.concerns.length * 8
    );

    if ($("#profilePercent")) {
      $("#profilePercent").textContent = percentage + "%";
    }

    if ($("#profileProgress")) {
      $("#profileProgress").style.width = percentage + "%";
    }

  }

  skinButtons.forEach((button) => {

    button.addEventListener("click", () => {

      skinButtons.forEach((item) =>
        item.classList.remove("on")
      );

      button.classList.add("on");

      profile.skin = button.dataset.skin;

      updateRoutine();

      toast("Skin profile updated");

    });

  });

  concernButtons.forEach((button) => {

    button.addEventListener("click", () => {

      button.classList.toggle("on");

      profile.concerns = concernButtons
        .filter((item) => item.classList.contains("on"))
        .map((item) => item.dataset.concern);

      updateRoutine();

    });

  });

  toneButtons.forEach((button) => {

    button.addEventListener("click", () => {

      toneButtons.forEach((item) =>
        item.classList.remove("on")
      );

      button.classList.add("on");

      profile.tone = button.dataset.tone;

      toast("Shade match updated");

    });

  });

  updateRoutine();


  // =========================================
  // FASHION SIZES
  // =========================================

  $("#saveSizes")?.addEventListener("click", () => {

    profile.top = $("#sizeTop").value;
    profile.bottom = $("#sizeBottom").value;
    profile.shoe = $("#sizeShoe").value;

    toast(
      "Sizes saved: " +
      profile.top + " / " +
      profile.bottom + " / UK " +
      profile.shoe
    );

  });


  // =========================================
  // ADD ADDRESS
  // =========================================

  $("#addAddress")?.addEventListener("click", () => {

    toast("Address management is available in this demo soon.");

  });


  // =========================================
  // REWARDS
  // =========================================

  function updatePoints() {

    const pointsElement = $("#rewardPoints");

    if (pointsElement) {

      pointsElement.innerHTML =
        points.toLocaleString("en-IN") +
        "<small>points</small>";

    }

    const percentage = Math.min(
      100,
      (points / 3000) * 100
    );

    const rewardsSection = $("#rewards");

    const ring = $(".ring", rewardsSection);

    if (ring) {
      ring.style.setProperty("--p", percentage + "%");
    }

    const progress = $(".prog u i", rewardsSection);

    if (progress) {
      progress.style.width = percentage + "%";
    }

    const progressText = $(".prog p b", rewardsSection);

    if (progressText) {
      progressText.textContent =
        points.toLocaleString("en-IN") + " / 3,000";
    }

  }

  $$("[data-redeem]").forEach((button) => {

    button.addEventListener("click", () => {

      const cost = Number(button.dataset.redeem);
      const name = button.dataset.name;

      if (points < cost) {

        toast(
          "You need " +
          (cost - points) +
          " more points for " + name
        );

        return;

      }

      points -= cost;

      updatePoints();

      toast(name + " redeemed! Check your email.");

    });

  });

  updatePoints();


  // =========================================
  // PERSONAL DETAILS
  // =========================================

  $("#profileForm")?.addEventListener("submit", (event) => {

    event.preventDefault();

    const form = event.currentTarget;

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();

    if (!name || !email) {
      toast("Please complete the required fields");
      return;
    }

    const sidebarName = $(".who b");
    const sidebarEmail = $(".who small");
    const avatar = $(".who .av");

    if (sidebarName) {
      sidebarName.textContent = name;
    }

    if (sidebarEmail) {
      sidebarEmail.textContent = email;
    }

    if (avatar) {

      avatar.textContent = name
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    }

    toast("Profile saved");

  });


  // =========================================
  // PASSWORD FORM
  // =========================================

  $("#passwordForm")?.addEventListener("submit", (event) => {

    event.preventDefault();

    const form = event.currentTarget;

    const currentPassword =
      form.elements.currentPassword.value;

    const newPassword =
      form.elements.newPassword.value;

    if (!currentPassword || newPassword.length < 6) {
      toast("Please enter valid password details");
      return;
    }

    toast("Demo only: password update is not connected to a server");

    form.reset();

  });


  // =========================================
  // NOTIFICATION PREFERENCES
  // =========================================

  $$(".tg input").forEach((input) => {

    input.addEventListener("change", () => {

      toast("Preference saved");

    });

  });


  // =========================================
  // DELETE ACCOUNT
  // =========================================

  $("#deleteAccount")?.addEventListener("click", () => {

    D.modal(`
      <h3>Delete account?</h3>

      <p style="margin-bottom:16px">
        This cannot be undone.
        Your points will be lost.
      </p>

      <button class="btn red sm" id="confirmDelete">
        Yes, delete
      </button>

      <button class="btn o sm" id="cancelDelete">
        Keep account
      </button>
    `);

    $("#confirmDelete")?.addEventListener("click", () => {

      D.close();

      toast("Demo only: nothing was deleted");

    });

    $("#cancelDelete")?.addEventListener("click", () => {

      D.close();

    });

  });


  // =========================================
  // INITIAL UI
  // =========================================

  filterOrders("All");

});
