
document.addEventListener("DOMContentLoaded", () => {

  // =========================================
  // ELEMENTS
  // =========================================

  const loginForm = document.getElementById("lf");

  const nameInput = document.getElementById("ln");
  const emailInput = document.getElementById("le");
  const passwordInput = document.getElementById("lp");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  const passwordToggle = document.getElementById("eye");
  const confirmPasswordToggle = document.getElementById("toggleConfirmPassword");

  const roleInputs = document.querySelectorAll('input[name="role"]');
  const tabButtons = document.querySelectorAll(".tabs button");

  const nameField = document.querySelector(".nmf");
  const confirmPasswordField = document.querySelector(".confirm-password-field");

  const signinOptions = document.querySelector(".signin-options");
  const termsField = document.querySelector(".signup-terms");

  const submitButton = document.getElementById("sub");
  const formMessage = document.getElementById("lm");
  const closeButton = document.getElementById("closeBtn");

  if (!loginForm || !emailInput || !passwordInput || !submitButton) {
    console.error("Login form elements are missing.");
    return;
  }

  // =========================================
  // STATE
  // =========================================

  let selectedRole = "customer";
  let currentTab = "in";

  // =========================================
  // PASSWORD SHOW / HIDE
  // =========================================

  function togglePasswordVisibility(input, button) {

    if (!input || !button) return;

    const icon = button.querySelector("i");
    const isPassword = input.type === "password";

    input.type = isPassword ? "text" : "password";

    if (icon) {
      icon.classList.toggle("fa-eye", !isPassword);
      icon.classList.toggle("fa-eye-slash", isPassword);
    }

    button.setAttribute(
      "aria-label",
      isPassword ? "Hide password" : "Show password"
    );
  }

  passwordToggle?.addEventListener("click", () => {
    togglePasswordVisibility(passwordInput, passwordToggle);
  });

  confirmPasswordToggle?.addEventListener("click", () => {
    togglePasswordVisibility(
      confirmPasswordInput,
      confirmPasswordToggle
    );
  });

  function resetPasswordToggle(input, button) {

    if (!input || !button) return;

    input.type = "password";

    const icon = button.querySelector("i");

    if (icon) {
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }

    button.setAttribute("aria-label", "Show password");
  }

  // =========================================
  // VALIDATION REGEX
  // =========================================

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

  // =========================================
  // MESSAGE
  // =========================================

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

  [
    nameInput,
    emailInput,
    passwordInput,
    confirmPasswordInput
  ].forEach((input) => {

    input?.addEventListener("input", () => {
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

    const isSignup = tab === "up";

    if (nameField) nameField.hidden = !isSignup;

    if (confirmPasswordField) {
      confirmPasswordField.hidden = !isSignup;
    }

    if (termsField) termsField.hidden = !isSignup;

    if (signinOptions) {
      signinOptions.hidden = isSignup;
    }

    if (nameInput) {
      nameInput.required = isSignup;
    }

    if (confirmPasswordInput) {
      confirmPasswordInput.required = isSignup;
    }

    const terms = loginForm.querySelector('input[name="terms"]');

    if (terms) {
      terms.required = isSignup;
    }

    resetPasswordToggle(passwordInput, passwordToggle);
    resetPasswordToggle(confirmPasswordInput, confirmPasswordToggle);

    hideMessage();
    updateButtonText();
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

    submitButton.innerHTML = currentTab === "up"
      ? `Create account as ${roleName} <i class="fa-solid fa-arrow-right"></i>`
      : `Sign in as ${roleName} <i class="fa-solid fa-arrow-right"></i>`;
  }

  // =========================================
  // SIGN IN / SIGNUP SUBMIT
  // =========================================

  loginForm.addEventListener("submit", (event) => {

    event.preventDefault();
    hideMessage();

    const nameValue = nameInput?.value.trim() || "";
    const emailValue = emailInput.value.trim().toLowerCase();
    const passwordValue = passwordInput.value;

    const isSignup = currentTab === "up";

    const activeRole =
      document.querySelector('input[name="role"]:checked');

    const role = activeRole?.value || selectedRole;

    const terms = loginForm.querySelector('input[name="terms"]');

    // =========================================
    // FULL NAME VALIDATION
    // =========================================

    if (isSignup && nameValue.length < 3) {

      showError("Please enter your full name.");
      nameInput?.focus();

      return;
    }

    // =========================================
    // EMAIL VALIDATION
    // =========================================

    if (!emailRegex.test(emailValue)) {

      emailInput.style.borderColor = "#b54747";

      showError("Please enter a valid email address.");
      emailInput.focus();

      return;
    }

    // =========================================
    // PASSWORD VALIDATION
    // =========================================

    if (isSignup && !passwordRegex.test(passwordValue)) {

      showError(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
      );

      passwordInput.focus();
      return;
    }

    if (!isSignup && passwordValue.length < 6) {

      showError("Password must contain at least 6 characters.");
      passwordInput.focus();

      return;
    }

    // =========================================
    // CONFIRM PASSWORD
    // =========================================

    if (isSignup && passwordValue !== confirmPasswordInput.value) {

      showError("Passwords do not match.");
      confirmPasswordInput.focus();

      return;
    }

    // =========================================
    // TERMS AND PRIVACY
    // =========================================

    if (isSignup && (!terms || !terms.checked)) {

      showError("Please accept the Terms and Privacy Policy.");
      terms?.focus();

      return;
    }

    // =========================================
    // LOADING STATE
    // =========================================

    const originalHTML = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.classList.add("loading");

    submitButton.innerHTML = `
      <span>${isSignup ? "Creating Account..." : "Please wait..."}</span>
      <strong class="login-spinner"></strong>
    `;

    // =========================================
    // DEMO LOGIN / REGISTRATION
    // =========================================

    setTimeout(() => {

      const currentUser = {

        name: isSignup
          ? nameValue
          : emailValue.split("@")[0],

        email: emailValue,
        role: role,

        accountType: isSignup ? "new" : "existing"

      };

      try {

        sessionStorage.setItem(
          "stackCurrentUser",
          JSON.stringify(currentUser)
        );

      } catch (error) {

        console.error("Session storage error:", error);

        submitButton.disabled = false;
        submitButton.classList.remove("loading");
        submitButton.innerHTML = originalHTML;

        showError("Unable to save your session.");

        return;
      }

      // =========================================
      // SUCCESS MESSAGE
      // =========================================

      const roleName =
        role === "partner"
          ? "Beauty Partner"
          : "Customer";

      if (isSignup) {

        showSuccess(
          `Account details validated! Welcome, ${nameValue}.`
        );

      } else {

        showSuccess(
          `Welcome back! Redirecting to your ${roleName} dashboard...`
        );

      }

      // =========================================
      // REDIRECT
      // =========================================

      if (!isSignup) {

        const dashboard =
          role === "partner"
            ? "partner-dashboard.html"
            : "customer-dashboard.html";

        setTimeout(() => {
          window.location.href = dashboard;
        }, 1000);

      } else {

        submitButton.disabled = false;
        submitButton.classList.remove("loading");
        submitButton.innerHTML = originalHTML;

      }

    }, 1000);

  });

  // =========================================
  // CLOSE BUTTON
  // =========================================

  closeButton?.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // =========================================
  // INITIAL STATE
  // =========================================

  updateRole("customer");
  updateTab("in");

});
