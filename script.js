let cart = [];
let total = 0;

// 🟢 ADD TO CART
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.getAttribute("data-name");
    const price = parseInt(btn.getAttribute("data-price"));

    cart.push({ name, price });
    total += price;

    document.getElementById("cart-count").innerText = cart.length;

    // ENABLE CHECKOUT BUTTON
    document.getElementById("checkoutBtn").disabled = false;

    alert(name + " added to cart!");
  });
});

// 🟢 VIEW CART
document.getElementById("viewCartBtn").addEventListener("click", () => {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item.name + " - ₹" + item.price;
    cartItems.appendChild(li);
  });

  document.getElementById("total").innerText = total;

  document.getElementById("cartModal").style.display = "block";
});

// 🟢 CLOSE CART
document.getElementById("closeCartBtn").addEventListener("click", () => {
  document.getElementById("cartModal").style.display = "none";
});

// 🟢 ORDER NOW BUTTON (scroll to menu)
document.getElementById("orderBtn").addEventListener("click", () => {
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
});

// 🟢 CHECKOUT → SCROLL TO PAYMENT
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (total === 0) {
    alert("Cart is empty!");
    return;
  }

  document.getElementById("cartModal").style.display = "none";

  document.getElementById("payment").scrollIntoView({
    behavior: "smooth"
  });
});

// 🟢 PAYMENT FUNCTION
function makePayment(event) {
  event.preventDefault();

  const customerName = document.getElementById("customerName").value;

  if (!customerName) {
    alert("Please enter your name!");
    return;
  }

  if (total === 0) {
    alert("Cart is empty!");
    return;
  }

  const paymentMethod = document.querySelector('input[name="payment"]:checked');

  if (!paymentMethod) {
    alert("Please select a payment method!");
    return;
  }

  console.log("Sending data:", {
    name: customerName,
    total: total,
    payment: paymentMethod.value
  });

  fetch("http://10.11.28.28:8080/tummytaxi/backend/api/orders.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: customerName,
      total: total,
      payment: paymentMethod.value
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Response:", data);

    if (data.success) {
      document.getElementById("confirmationMessage").style.display = "block";
      document.getElementById("confirmationMessage").innerText =
        "Order placed successfully by " + customerName + " 🎉";

      // RESET CART
      cart = [];
      total = 0;

      document.getElementById("cart-count").innerText = 0;
      document.getElementById("total").innerText = 0;
      document.getElementById("checkoutBtn").disabled = true;

      // CLEAR FORM
      document.getElementById("customerName").value = "";
      document.querySelectorAll('input[name="payment"]').forEach(r => r.checked = false);
    } else {
      alert("Error: " + data.error);
    }
  })
  .catch(err => {
    console.error(err);
    alert("Error placing order");
  });
}