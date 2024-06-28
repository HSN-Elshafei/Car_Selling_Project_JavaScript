
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, onAuthStateChanged,signOut  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
document.getElementById("serveSignOut").addEventListener("click",() =>{
    signOut(auth).then(() => {
        document.getElementById('serveSignOut').classList.replace("d-block","d-none");
        document.getElementById('serveLogin').classList.replace("d-none", "d-flex")
    }).catch((error) => {
        // An error happened.
      });
});
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('serveSignOut').classList.replace("d-none","d-block")
    }
    else{
        document.getElementById('serveLogin').classList.replace("d-none", "d-flex")
    }
  });

// ==== Navbar Toggler ====
var menuBtn = document.getElementById("menu-btn");
var closeBtn = document.getElementById("close-btn");
var navBar = document.querySelector(".nav-links");

menuBtn.onclick = () => {
    navBar.classList.toggle('toggle');
}

closeBtn.onclick = () => {
    navBar.classList.remove('toggle');
}

// ==== Side Menu Toggler =====================================
var menuBtn = document.querySelector(".menu-bar");
var closeBar = document.getElementById("close-bar");
var menuToggle = document.querySelector(".menu-toggle");

menuBtn.onclick = () => {
    menuToggle.classList.add('active')
}

closeBar.onclick = () => {
    menuToggle.classList.remove('active')
}

// ==== Slide Swiper play =====================================
var swiper = new Swiper(".my-hero", {
    spaceBetween: 0,
    centeredSlides: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
});

// ==== fixed nav on scrolling ================================
window.onscroll = () => {
    if (window.scrollY > 50) {
        document.querySelector('.navbar .bottom-nav').classList.add('active');
    } else {
        document.querySelector('.navbar .bottom-nav').classList.remove('active');
    }
}
// ==== client Swiper ================================
var swiper = new Swiper(".myClient",{
    direction: "vertical",
    pagination:{
        el: ".swiper-pagination",
        clickable: true,
    },
});

