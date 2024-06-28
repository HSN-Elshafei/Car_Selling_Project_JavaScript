
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA6EaLaov-StQjXqnqlUuztQ9QeI49RbiI",
  authDomain: "car-selling-project-iti.firebaseapp.com",
  databaseURL: "https://car-selling-project-iti-default-rtdb.firebaseio.com",
  projectId: "car-selling-project-iti",
  storageBucket: "car-selling-project-iti.appspot.com",
  messagingSenderId: "590886305979",
  appId: "1:590886305979:web:d0cb65101ba90447a9e99e",
  measurementId: "G-X8C2KVZ346",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const emailField = document.getElementById("email");
  const passwordField = document.getElementById("password");
  const rememberMeCheckbox = document.getElementById("rememberMe");
  const passwordFeedback = document.getElementById("invalid-pass");


  if (!emailField || !passwordField || !rememberMeCheckbox || !passwordFeedback) {
    console.log("One or more form elements are missing.");
    return;
  }

  const emailFeedback = document.createElement("div");
  emailFeedback.classList.add("invalid-feedback");
  emailField.parentNode.appendChild(emailFeedback);

  let isFormSubmitted = false;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "../index.html";
    }
  });

  loadRememberedCredentials();

  form.addEventListener("submit", handleFormSubmit);
  form.addEventListener("input", handleFormInput);

  function loadRememberedCredentials() {
    if (localStorage.getItem("rememberMe") === "true") {
      emailField.value = localStorage.getItem("email") || "";
      passwordField.value = localStorage.getItem("password") || "";
      rememberMeCheckbox.checked = true;
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    isFormSubmitted = true;

    if (isFormValid()) {
      const email = emailField.value;
      const password = passwordField.value;

      saveCredentials(email, password);

      signInWithEmailAndPassword(auth, email, password)
        .then(handleSignInSuccess)
        .catch(handleSignInError);
    } else {
      form.classList.add("was-validated");
    }
  }

  function handleFormInput(event) {
    if (isFormSubmitted) {
      if (event.target.name === "email") {
        validateEmail();
      }
      if (event.target.name === "password") {
        validatePassword();
      }
    }
  }

  function saveCredentials(email, password) {
    if (rememberMeCheckbox.checked) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      localStorage.setItem("rememberMe", "false");
    }
  }

  function handleSignInSuccess(userCredential) {
    const user = userCredential.user;
    const dt = new Date();
    update(ref(db, `users/${user.uid}`), {
      last_login: dt.toISOString(),
    })
      .then(() => {
        window.location.href = "../index.html";
      })
      .catch((error) => {
        displayError(`invalid email or password`);
      });
  }

  function handleSignInError(error) {
    displayError(`invalid email or password`);
  }

  function displayError(message) {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("alert", "alert-danger");
    errorContainer.textContent = message;
    form.prepend(errorContainer);
  }

  function validateEmail() {
    const email = emailField.value;
    const regex = /^[a-zA-Z]{1,3}[a-zA-Z0-9._]{0,10}@(yahoo|gmail)\.com$/;

    if (regex.test(email)) {
      emailField.setCustomValidity("");
      emailField.classList.remove("is-invalid");
      emailFeedback.textContent = "Please enter a valid email address.";
      return true;
    } else {
      // emailField.setCustomValidity(
      //   "Email must start with 1-3 letters, followed by 0-10 alphanumeric characters or dots/underscores, and end with '@yahoo.com' or '@gmail.com'."
      // );
      emailField.classList.remove("is-valid");
      emailField.classList.add("is-invalid");
      // emailFeedback.textContent =
      //   "Email must start with 1-3 letters, followed by 0-10 alphanumeric characters or dots/underscores, and end with '@yahoo.com' or '@gmail.com'.";
      return false;
    }
  }

  function validatePassword() {
    const password = passwordField.value;
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;

    if (regex.test(password)) {
      passwordField.setCustomValidity("");
      passwordField.classList.remove("is-invalid");
      passwordFeedback.textContent = "Please enter your password.";
      return true;
    } else {
      passwordField.setCustomValidity(
        "Password must contain at least one letter, one number, and one special character."
      );
      passwordField.classList.remove("is-valid");
      passwordField.classList.add("is-invalid");
      passwordFeedback.textContent =
        "Password must contain at least one letter, one number, and one special character.";
      return false;
    }
  }

  function isFormValid() {
    const emailValid = validateEmail();
    const passwordValid = validatePassword();
    return form.checkValidity() && emailValid && passwordValid;
  }
});
