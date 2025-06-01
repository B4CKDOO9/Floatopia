// filepath: c:\Users\Smolec\Documents\GitHub\Floatopia\Floatopiaaa\src\js\index.js
document.addEventListener("DOMContentLoaded", () => {

    fetch("nav.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);
            setupMenuToggle();
        });

    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("beforeend", data);
        });

    CountdownToSummer();

    // Update these functions to only run once
    renderBasket();
    setupAddToBasket();
});

function setupMenuToggle() {
    const menuToggle = document.querySelector(".menu-toggle");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    menuToggle.addEventListener("click", () => {
        dropdownMenu.classList.toggle("open");
    });
}

function CountdownToSummer() {
    const countDownDate = new Date("Jun 13, 2025 24:00:00").getTime();

    const x = setInterval(() => {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const countdownElement = document.getElementById("countdown");
        if (countdownElement) {
            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        if (distance < 0) {
            clearInterval(x);
            if (countdownElement) {
                countdownElement.innerHTML = "EXPIRED";
            }
        }
    }, 1000);
}

// Basket functionality
function setupBasket() {
    const basketElement = document.querySelector(".basket");
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");

    const TAX_RATE = 0.1;

    function updateTotals() {
        let subtotal = 0;
        let hasItems = false;

        getCart().forEach(item => {
            const price = parseFloat(item.price.replace("$", "")) || 0;
            subtotal += price * item.quantity;
            if (item.quantity > 0) {
                hasItems = true;
            }
        });

        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;

        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

        if (hasItems) {
            basketElement?.classList.add("dripping");
        } else {
            basketElement?.classList.remove("dripping");
        }
    }

    updateTotals();
}

class Product {
    constructor(id, name, price, image, quantity = 1) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.quantity = quantity;
    }
}

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
    let cart = getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += product.quantity || 1;
    } else {
        cart.push(product);
    }
    saveCart(cart);
    alert(`${product.name} has been added to your basket!`);
    renderBasket();
}

function removeFromCart(id) {
    let cart = getCart();
    // Find and remove the specific item only
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);

    // Instead of re-rendering the entire table, just remove the specific row
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
        row.remove();
    }

    // Update totals without re-rendering everything
    updateTotals();
}

function updateQuantity(id, quantity) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart(cart);
        renderBasket();
    }
}

function renderBasket() {
    const basketTable = document.querySelector(".basket-table tbody");
    if (!basketTable) return;
    const cart = getCart();
    basketTable.innerHTML = "";
    cart.forEach(item => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", item.id);
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" width="40"> ${item.name}</td>
            <td>${item.price}</td>
            <td><input type="number" class="quantity-input" value="${item.quantity}" min="1"></td>
            <td><button class="remove-item">Remove</button></td>
        `;
        basketTable.appendChild(row);
    });
    // Totals (optional)
    updateTotals();
}

// Event delegation for remove and quantity
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-item")) {
        const row = e.target.closest("tr");
        const id = row.getAttribute("data-id");

        // Call removeFromCart with the correct ID
        removeFromCart(id);

        // Prevent default action and stop propagation
        e.preventDefault();
        e.stopPropagation();
    }
});
document.addEventListener("change", function (e) {
    if (e.target.classList.contains("quantity-input")) {
        const row = e.target.closest("tr");
        const id = row.getAttribute("data-id");
        const qty = parseInt(e.target.value, 10);
        updateQuantity(id, qty);
    }
});

function setupAddToBasket() {
    const addToBasketButtons = document.querySelectorAll(".add-to-basket");

    addToBasketButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const productElement = e.target.closest(".col-4") || e.target.closest(".offer");
            if (!productElement) return;

            // Extract unique ID or fallback to random
            const productId = productElement.getAttribute("data-id") || crypto.randomUUID();

            // Extract product details safely
            const productName = productElement.querySelector("h4")?.textContent.trim()
                || productElement.querySelector("h1")?.textContent.trim()
                || "Unknown Product";

            const productPrice = productElement.querySelector("p")?.textContent.trim() || "$0.00";
            const productImage = productElement.querySelector("img")?.src || "";

            // Construct product object and add to cart
            const product = new Product(productId, productName, productPrice, productImage, 1);
            addToCart(product);

            // Debug (optional)
            console.log("Added to cart:", product);
        });
    });
}


// Totals calculation (optional)
function updateTotals() {
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");
    const TAX_RATE = 0.1;
    let subtotal = 0;
    getCart().forEach(item => {
        const price = parseFloat(item.price.replace("$", "")) || 0;
        subtotal += price * item.quantity;
    });
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}
