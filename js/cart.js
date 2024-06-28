import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
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
document.addEventListener("DOMContentLoaded", function () {
  // Function to fetch products from Firestore
  const fetchProductsFromFirestore = async (user) => {
    const collectionRef = collection(db, "users", user.uid, "cart");
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

  // Function to fetch and render products
  const fetchAndRenderProducts = async (user) => {
    const products = await fetchProductsFromFirestore(user);
    console.log(products.slice(0, 5));
    renderCartProducts(products);
  };

  // Redirect to login if not authenticated
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "../index.html";
    }
  });

  // Function to render cart products
  const renderCartProducts = (cartProducts) => {
    const basketProductsElement = document.getElementById("basket-products");
    const basketSubtotalElement = document.getElementById("basket-subtotal");
    const basketTotalElement = document.getElementById("basket-total");
    basketProductsElement.innerHTML = "";
    let subtotal = 0;

    cartProducts.forEach((product) => {
      const productSubtotal = product.price * product.quantity;
      subtotal += productSubtotal;

      basketProductsElement.innerHTML += `
      <div class="basket-product" data-id="${product.id}">
        <div class="item">
          <div class="product-image">
            <img src="${product.image}" alt="Product Image" class="product-frame">
          </div>
          <div class="product-details">
            <h1><strong>${product.name}</strong></h1>
            <p><strong>${product.color}</strong></p>
          </div>
        </div>
        <div class="price">${product.price}</div>
        <div class="quantity">
          <input type="number" value="${product.quantity}" min="1" max="${product.owners}" class="quantity-field" data-id="${product.id}">
        </div>
        <div class="subtotal">${productSubtotal}</div>
        <div class="remove">
          <button data-id="${product.id}">Remove</button>
        </div>
      </div>
    `;
    });

    // Display subtotal and total
    basketSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    basketTotalElement.textContent = `$${subtotal.toFixed(2)}`;

    // Add event listeners for remove buttons
    const removeButtons = document.querySelectorAll(".remove button");
    removeButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const productId = e.target.getAttribute("data-id");
        await removeProductFromCart(auth.currentUser, productId);
      });
    });

    // Add event listeners for quantity input fields
    const quantityInputs = document.querySelectorAll(".quantity-field");
    quantityInputs.forEach((input) => {
      input.addEventListener("change", async (e) => {
        const newQuantity = e.target.value;
        const productId = e.target.getAttribute("data-id");
        await updateProductQuantity(auth.currentUser, productId, newQuantity);
      });
    });
  };

  // Function to remove product from cart
  const removeProductFromCart = async (user, productId) => {
    const cartItemRef = doc(db, "users", user.uid, "cart", productId);
    try {
      await deleteDoc(cartItemRef);
      console.log("Product removed from cart:", productId);
      // Immediately remove the product from the UI
      document
        .querySelector(`.basket-product[data-id="${productId}"]`)
        .remove();
      // Optionally, update the subtotal and total after removing the product
      updateCartTotals();
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  // Function to update product quantity in Firestore
  const updateProductQuantity = async (user, productId, newQuantity) => {
    const cartItemRef = doc(db, "users", user.uid, "cart", productId);
    try {
      await updateDoc(cartItemRef, {
        quantity: parseInt(newQuantity, 10),
      });
      console.log("Product quantity updated:", productId, newQuantity);
      // Update the subtotal for the updated product
      const productElement = document.querySelector(
        `.basket-product[data-id="${productId}"]`
      );
      const price = parseFloat(
        productElement.querySelector(".price").textContent
      );
      const newSubtotal = price * newQuantity;
      productElement.querySelector(".subtotal").textContent =
        newSubtotal.toFixed(2);
      // Update the total cart amounts
      updateCartTotals();
    } catch (error) {
      console.error("Error updating product quantity:", error);
    }
  };

  // Function to update cart totals
  const updateCartTotals = () => {
    const basketProductsElement = document.getElementById("basket-products");
    const basketSubtotalElement = document.getElementById("basket-subtotal");
    const basketTotalElement = document.getElementById("basket-total");
    const products = basketProductsElement.querySelectorAll(".basket-product");
    let subtotal = 0;

    products.forEach((product) => {
      const price = parseFloat(product.querySelector(".price").textContent);
      const quantity = parseInt(
        product.querySelector(".quantity input").value,
        10
      );
      subtotal += price * quantity;
    });

    basketSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    basketTotalElement.textContent = `$${subtotal.toFixed(2)}`;
    return subtotal;
  };
  const clearCart = async (user) => {
    const collectionRef = collection(db, "users", user.uid, "cart");
    try {
      const querySnapshot = await getDocs(collectionRef);
      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
      console.log("All items removed from cart");
      // Clear the cart UI
      document.getElementById("basket-products").innerHTML = "";
      updateCartTotals();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };
  document
    .querySelector(".checkout-cta")
    .addEventListener("click", async () => {
      const user = auth.currentUser;
      if (user && updateCartTotals() != 0) {
        await clearCart(user);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "you have bought great cars.",
          showConfirmButton: false,
          timer: 4500,
        });
      }
    });

  // Monitor authentication state and fetch products accordingly
  onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchAndRenderProducts(user);
    }
  });
});
