// Flag to track the validation state
let isUsernameValid = false;
let isEmailValid = false;

// Selectors
const body = document.body;
console.log(body);

const emailInput = document.getElementById("email-input");
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");
const form = document.querySelector(".form");
const feedback = document.querySelector(".feedback--success");
const spinner = document.querySelector(".spinner-container");

// Helper function
const setLabel = (labelElement, text, color) => {
  labelElement.textContent = text;
  labelElement.style.color = color;
};

const clearFormInput = function () {
  usernameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
};

// Username Validation Function
const validateUsername = function () {
  const usernameRegex = /^[a-z][a-z0-9]{0,9}$/;
  const usernameLabel = document.querySelector(".username-label");

  usernameInput.addEventListener("input", (e) => {
    const usernameValue = e.target.value;

    if (usernameValue.length === 0) {
      setLabel(usernameLabel, "Username is required", "red");
      isUsernameValid = false;
    } else if (!/^[a-z]/.test(usernameValue)) {
      setLabel(usernameLabel, "Username must start with a letter", "red");
      isUsernameValid = false;
    } else if (!usernameRegex.test(usernameValue)) {
      setLabel(
        usernameLabel,
        "Username can contain letters and numbers, up to 10 characters",
        "red"
      );
      isUsernameValid = false;
    } else {
      setLabel(usernameLabel, "Username", "black");
      isUsernameValid = true;
    }
  });
};

// Email validation function
const validateEmail = function () {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const emailLabel = document.querySelector(".email-label");

  emailInput.addEventListener("input", (e) => {
    const emailValue = e.target.value;

    if (emailValue.length === 0) {
      setLabel(emailLabel, "Email is required", "red");
      isEmailValid = false;
    } else if (!/@/.test(emailValue)) {
      setLabel(emailLabel, "Email must contain an '@' symbol", "red");
      isEmailValid = false;
    } else if (!/\.[a-zA-Z]{2,}$/.test(emailValue)) {
      setLabel(emailLabel, "Email domain must be valid, e.g., '.com'", "red");
      isEmailValid = false;
    } else if (!emailRegex.test(emailValue)) {
      setLabel(emailLabel, "Email format is invalid", "red");
      isEmailValid = false;
    } else {
      setLabel(emailLabel, "Email", "black");
      isEmailValid = true;
    }
  });
};

const submitBtn = document.querySelector(".signup-btn");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Input Values
  const username = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  // Check if both the email and username are valid before allowing submission
  if (isUsernameValid && isEmailValid) {
    console.log("Form submission allowed");

    // Display the modal and spinner
    clearFormInput();
    body.classList.add("modal-active");
    spinner.style.display = "block";

    // Proceed with form submission logic
    fetch("http://127.0.0.1:8080/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Wait for 1 second before showing the feedback message
        setTimeout(() => {
          body.classList.remove("modal-active");
          spinner.style.display = "none";
          feedback.children[1].textContent = `${data.welcome_message} ${data.username},!`;
          feedback.style.visibility = "visible";
        }, 1000); // Hide modal after 1 second.
      })
      .catch((error) => (feedback.children[1].textContent = error));
  }
});

// Call the validation functions to set up the event listeners
validateUsername();
validateEmail();
