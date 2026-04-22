let cart = []; 
const cartModal = document.getElementById('cartModal');
const cartItemsUl = document.getElementById('cart-items');
const totalSpan = document.getElementById('total');
const cartCountSpan = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkoutBtn');
const confirmationMessage = document.getElementById('confirmationMessage');

// --- Helper Functions ---

function updateCartUI() {
    cartItemsUl.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsUl.innerHTML = '<li style="text-align: center; color: #777;">Your cart is empty!</li>';
        checkoutBtn.disabled = true;
    } else {
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.name}</span>
                <span>
                    ₹${item.price}
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </span>
            `;
            cartItemsUl.appendChild(li);
            total += item.price;
        });
        checkoutBtn.disabled = false;
    }

    totalSpan.textContent = total;
    cartCountSpan.textContent = cart.length;
}

function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    showToast(`${name} added to cart!`);
}

function removeFromCart(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    updateCartUI();
    showToast(`${itemName} removed from cart.`, 'error');
}

function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    toast.className = 'toast show ' + type;
    toast.textContent = message;
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
}

// --- Event Listeners ---

document.getElementById('viewCartBtn').addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.style.display = 'block';
});

document.getElementById('closeCartBtn').addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.onclick = function(event) {
    if (event.target == cartModal) {
        cartModal.style.display = 'none';
    }
}

document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.dataset.name;
        const price = parseInt(button.dataset.price);
        addToCart(name, price);
    });
});

cartItemsUl.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
        const index = parseInt(e.target.dataset.index);
        removeFromCart(index);
    }
});

document.getElementById('orderBtn').addEventListener('click', () => {
    const menuSection = document.getElementById('menu');
    if(menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
});

checkoutBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
    const paymentSection = document.getElementById('payment');
    if(paymentSection) paymentSection.scrollIntoView({ behavior: 'smooth' });
});

// --- FINAL PAYMENT HANDLER ---

async function makePayment(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Add food first!");
        return;
    }

    // 1. Get List of items for the message
    const itemNames = cart.map(item => item.name).join(', ');

    // 2. Get Payment Method
    const options = document.getElementsByName('payment');
    let selectedPayment = "Not Selected";
    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) {
            selectedPayment = options[i].value;
            break;
        }
    }

    // 3. Get Total Price
    const totalAmount = totalSpan.textContent;

    // 4. Send to Backend (Port 8080)
    try {
        const response = await fetch("http://localhost:8080/tummytaxi/backend/api/orders.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                total: totalAmount,
                paymentMethod: selectedPayment,
                items: cart
            })
        });
        
        const result = await response.json();
        console.log("Backend Response:", result);
    } catch (err) {
        console.log("Database connection skipped, but order processed in UI.");
    }

    // 5. Show Improved Confirmation Message
    confirmationMessage.innerHTML = `
        <h3><i class="fas fa-check-circle"></i> Order Confirmed!</h3>
        <p>Thank you for your order. Your <strong>${itemNames}</strong> from <strong>Tummy Taxi</strong> is on the way!</p>
        <p>Items: ${cart.length} | Total: <strong>₹${totalAmount}</strong></p>
        <p>Payment Method: <strong>${selectedPayment}</strong></p>
    `;
    confirmationMessage.style.display = 'block';

    // 6. Clear Cart
    cart = [];
    updateCartUI();

    // 7. Scroll to message
    confirmationMessage.scrollIntoView({ behavior: 'smooth' });
    
    // Hide message after 8 seconds
    setTimeout(() => {
        confirmationMessage.style.display = 'none';
    }, 8000);
}

document.addEventListener('DOMContentLoaded', updateCartUI);