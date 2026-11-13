
document.addEventListener("DOMContentLoaded", () => {

  // =========================================
  // ELEMENTS
  // =========================================

  const loginForm = document.getElementById("lf");

  const nameInput = document.getElementById("ln");
  const emailInput = document.getElementById("le");
  const passwordInput = document.getElementById("lp");

  const passwordToggle = document.getElementById("eye");
  const roleInputs = document.querySelectorAll('input[name="role"]');

  const tabButtons = document.querySelectorAll(".tabs button");
  const nameField = document.querySelector(".nmf");

  const submitButton = document.getElementById("sub");
  const formMessage = document.getElementById("lm");

  const closeButton = document.getElementById("closeBtn");

  if (!loginForm || !emailInput || !passwordInput || !submitButton) {
    console.error("Login form elements are missing. Check your HTML IDs.");
    return;
  }

  // =========================================
  // LOGIN STATE
  // =========================================

  let selectedRole = "customer";
  let currentTab = "in";

  // =========================================
  // PASSWORD SHOW / HIDE
  // =========================================

  function resetPasswordToggle() {
    passwordInput.type = "password";

    if (passwordToggle) {
      passwordToggle.innerHTML = '<i class="fa-solid fa-eye"></i>';
      passwordToggle.setAttribute("aria-label", "Show password");
    }
  }

  if (passwordToggle) {
    passwordToggle.addEventListener("click", () => {

      const isPassword = passwordInput.type === "password";

      passwordInput.type = isPassword ? "text" : "password";

      passwordToggle.innerHTML = isPassword
        ? '<i class="fa-solid fa-eye-slash"></i>'
        : '<i class="fa-solid fa-eye"></i>';

      passwordToggle.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password"
      );

    });
  }

  // =========================================
  // VALIDATION
  // =========================================

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validatePassword(value) {
    return value.length >= 6;
  }

  function showError(message) {

    if (!formMessage) {
      alert(message);
      return;
    }

    formMessage.textContent = message;
    formMessage.style.color = "#b54747";
    formMessage.classList.add("show");
  }

  function showSuccess(message) {

    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.style.color = "#16845c";
    formMessage.classList.add("show");
  }

  function hideMessage() {

    if (!formMessage) return;

    formMessage.textContent = "";
    formMessage.classList.remove("show");
  }

  // =========================================
  // CLEAR ERRORS WHILE TYPING
  // =========================================

  [nameInput, emailInput, passwordInput].forEach((input) => {

    if (!input) return;

    input.addEventListener("input", () => {
      input.style.borderColor = "";
      hideMessage();
    });

  });

  // =========================================
  // ROLE SELECTION
  // =========================================

  function updateRole(role) {

    selectedRole = role;

    roleInputs.forEach((input) => {
      input.checked = input.value === role;
    });

    updateButtonText();
    hideMessage();
  }

  roleInputs.forEach((input) => {

    input.addEventListener("change", () => {
      updateRole(input.value);
    });

  });

  // =========================================
  // SIGN IN / CREATE ACCOUNT TABS
  // =========================================

  function updateTab(tab) {

    currentTab = tab;

    tabButtons.forEach((button) => {

      const active = button.dataset.t === tab;

      button.classList.toggle("on", active);
      button.setAttribute("aria-pressed", String(active));

    });

    if (nameField) {
      nameField.hidden = tab !== "up";
    }

    if (nameInput) {
      nameInput.required = tab === "up";
    }

    updateButtonText();

    resetPasswordToggle();
    hideMessage();
  }

  tabButtons.forEach((button) => {

    button.addEventListener("click", () => {
      updateTab(button.dataset.t);
    });

  });

  // =========================================
  // BUTTON TEXT
  // =========================================

  function updateButtonText() {

    const roleName =
      selectedRole === "partner"
        ? "Beauty Partner"
        : "Customer";

    submitButton.textContent = currentTab === "up"
      ? `Create account as ${roleName}`
      : `Sign in as ${roleName}`;

  }

  // =========================================
  // LOGIN / REGISTRATION
  // =========================================

  loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    hideMessage();

    const nameValue = nameInput?.value.trim() || "";
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;

    const activeRole =
      document.querySelector('input[name="role"]:checked');

    const role = activeRole?.value || selectedRole;

    // NAME VALIDATION

    if (currentTab === "up" && nameValue.length < 2) {

      showError("Please enter your full name.");
      nameInput?.focus();

      return;
    }

    // EMAIL VALIDATION

    if (!validateEmail(emailValue)) {

      emailInput.style.borderColor = "#b54747";

      showError("Please enter a valid email address.");
      emailInput.focus();

      return;
    }

    // PASSWORD VALIDATION

    if (!passwordValue) {

      passwordInput.style.borderColor = "#b54747";

      showError("Please enter your password.");
      passwordInput.focus();

      return;
    }

    if (!validatePassword(passwordValue)) {

      passwordInput.style.borderColor = "#b54747";

      showError("Password must contain at least 6 characters.");
      passwordInput.focus();

      return;
    }

    // =========================================
    // LOADING STATE
    // =========================================

    const originalHTML = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.classList.add("loading");

    submitButton.innerHTML =
      '<span>Please wait...</span><strong class="login-spinner"></strong>';

    // =========================================
    // DEMO LOGIN / REGISTRATION
    // =========================================

    setTimeout(() => {

      const currentUser = {

        name: currentTab === "up"
          ? nameValue
          : emailValue.split("@")[0],

        email: emailValue,
        role: role,

        accountType: currentTab === "up"
          ? "new"
          : "existing"

      };

      // =========================================
      // SAVE USER - SESSION STORAGE ONLY
      // =========================================

      try {

        sessionStorage.setItem(
          "stackCurrentUser",
          JSON.stringify(currentUser)
        );

      } catch (error) {

        console.error("Could not save login information:", error);

        submitButton.disabled = false;
        submitButton.classList.remove("loading");
        submitButton.innerHTML = originalHTML;

        showError(
          "Unable to save your session. Please check browser storage settings."
        );

        return;
      }

      // =========================================
      // SUCCESS MESSAGE
      // =========================================

      const roleName =
        role === "partner"
          ? "Beauty Partner"
          : "Customer";

      showSuccess(
        currentTab === "up"
          ? `Account created successfully! Welcome, ${nameValue}.`
          : `Welcome back! Redirecting to your ${roleName} dashboard...`
      );

      // =========================================
      // REDIRECT
      // =========================================

      const dashboard =
        role === "partner"
          ? "partner-dashboard.html"
          : "customer-dashboard.html";

      setTimeout(() => {
        window.location.href = dashboard;
      }, 1000);

    }, 800);

  });

  // =========================================
  // CLOSE BUTTON
  // =========================================

  if (closeButton) {

    closeButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });

  }

  // =========================================
  // INITIAL STATE
  // =========================================

  updateRole("customer");
  updateTab("in");

});
