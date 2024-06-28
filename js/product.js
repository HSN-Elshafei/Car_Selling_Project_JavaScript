import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const auth = getAuth(app);

var productItem = document.getElementById("product-item");

// Function to render products
const renderProducts = (products) => {
  // productItem.innerHTML = "";
  products.forEach((product) => {
    productItem.innerHTML += `
      <div class="col-md-4 pt-5">
        <div class="card">
          <img src="${product.image}" class="card-img-top" alt="product img">
          <div class="card-body">
            <h5 class="card-title">${product.make.slice(0,9)} <span> ${product.model.slice(0, 9)}</span></h5>
            <p class="card-text">Some card's content.</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><span><i class="fa-solid fa-car-on"></i> ${product.features[0].slice(0,18)} </span></li>
            <li class="list-group-item"><span><i class="fa-solid fa-gauge-simple-high"></i> ${product.features[1].slice(0,18)} </span></li>
            <li class="list-group-item"><span><i class="fa-solid fa-car-battery"></i> ${product.features[2].slice(0,18)} </span></li>
            <li class="list-group-item"><span><i class="fa-solid fa-palette"></i> ${product.color} </span><span><i class="fa-solid fa-gas-pump"></i> ${product.fuelType}</span></li>
            <li class="list-group-item"><span><i class="fa-solid fa-hand-holding-dollar"></i> ${product.price} $</span></li>
          </ul>
          <div class="card-body">
            <button class="btn card-btn add-to-cart" data-id="${
              product.id
            }">Add To Cart</button>
          </div>
        </div>
      </div>
    `;
  });
};

// Function to fetch products from Firestore
const fetchProductsFromFirestore = async () => {
  const collectionRef = collection(db, "products");
  try {
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Function to fetch products and render them
const fetchAndRenderProducts = async () => {
  const products = await fetchProductsFromFirestore();
  console.log(products.slice(0, 5));
  renderProducts(products);
  addCartButtonListenersForNonAuthenticated();
};

// Function to fetch cart products for a user
const fetchCartProducts = async (user) => {
  const products = await fetchProductsFromFirestore();
  console.log(products.slice(0, 5));

  const cartRef = collection(db, "users", user.uid, "cart");
  const cartSnapshot = await getDocs(cartRef);
  const cartProducts = cartSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Update quantities in products array based on cart contents
  products.forEach((product) => {
    const cartProduct = cartProducts.find((p) => p.id === product.id);
    if (cartProduct) {
      product.quantity = cartProduct.quantity;
    }
  });

  renderProducts(products);
  addCartButtonListeners(user, products);
};

// Function to add event listeners to "Add To Cart" buttons
const addCartButtonListeners = (user, products) => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      const productId = button.getAttribute("data-id");
      const product = products.find((p) => p.id == productId);
      if (product) {
        const cartRef = doc(db, "users", user.uid, "cart", productId);
        const cartSnapshot = await getDoc(cartRef); // Fetch single document

        if (!cartSnapshot.exists()) {
          // Add new product to cart
          await setDoc(cartRef, {
            id: product.id,
            name: `${product.make} ${product.model}`,
            price: product.price,
            image: product.image,
            color: product.color,
            owners: product.owners,
            quantity: 1,
          });
          console.log("Product added to cart:", product);
          window.location.href = "cart.html";
        } else {
          console.error("Product already in cart");
          window.location.href = "cart.html";
        }
      } else {
        console.error(`Product with id ${productId} not found`);
      }
    });
  });
};

// Function to add event listeners to "Add To Cart" buttons for non-authenticated users
const addCartButtonListenersForNonAuthenticated = () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "login.html";
    });
  });
};

// Monitor authentication state and fetch products accordingly
onAuthStateChanged(auth, (user) => {
  if (user) {
    fetchCartProducts(user);
  } else {
    fetchAndRenderProducts();
  }
});
