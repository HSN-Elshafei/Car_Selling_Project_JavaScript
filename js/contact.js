import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

var contactBtn = document.getElementById("contact-btn");

contactBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  var fuName = document.getElementById("fuName").value;
  var email = document.getElementById("Email").value;
  var subject = document.getElementById("Subject").value;
  var message = document.getElementById("message").value;
  const collectionRef = collection(db, "message");
  try {
    if (
      validateEmail(email) &&
      fuName != "" &&
      subject != "" &&
      message != ""
    ) {
      await addDoc(collectionRef, {
        name: fuName,
        email: email,
        subject: subject,
        message: message,
      });
      
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Message Has Been Sent Successfully",
        showConfirmButton: false,
        timer: 4500,
      });
    }
    else{
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Invalid Message",
        showConfirmButton: false,
        timer: 4500,
      });
    }
  } catch (error) {
    console.error(`Error uploading car ID: ${car.id}`, error);
  }
});
function validateEmail(email) {
  const regex = /^[a-zA-Z]{1,3}[a-zA-Z0-9._]{0,10}@(yahoo|gmail)\.com$/;

  if (regex.test(email)) {
    return true;
  } else {
    return false;
  }
}
