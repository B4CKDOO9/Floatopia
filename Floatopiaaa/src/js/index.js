// filepath: c:\Users\Smolec\Documents\GitHub\Floatopia\Floatopiaaa\src\js\index.js
document.addEventListener("DOMContentLoaded", () => {
    // Load navigation
    fetch("nav.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);
            setupMenuToggle(); // Reinitialize menu toggle after injecting nav
        });

    // Load footer
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("beforeend", data);
        });

    // Countdown function
    CountdownToSummer();

    // Initialize basket functionality
    setupBasket();

    // Initialize "Add to Basket" functionality
    setupAddToBasket();
});

// Menu toggle functionality
function setupMenuToggle() {
    const menuToggle = document.querySelector(".menu-toggle");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    menuToggle.addEventListener("click", () => {
        dropdownMenu.classList.toggle("open");
    });
}

// Countdown to summer
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
    const quantityInputs = document.querySelectorAll(".quantity-input");
    const removeButtons = document.querySelectorAll(".remove-item");
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");

    const TAX_RATE = 0.1;

    function updateTotals() {
        let subtotal = 0;

        document.querySelectorAll(".basket-table tbody tr").forEach((row) => {
            const price = parseFloat(row.cells[2].textContent.replace("$", ""));
            const quantity = parseInt(row.querySelector(".quantity-input").value);
            const total = price * quantity;

            row.cells[3].textContent = `$${total.toFixed(2)}`;
            subtotal += total;
        });

        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;

        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }

    quantityInputs.forEach((input) => {
        input.addEventListener("change", updateTotals);
    });

    removeButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.target.closest("tr").remove();
            updateTotals();
        });
    });

    updateTotals();
}

// Function to handle "Add to Basket" button clicks
function setupAddToBasket() {
    const addToBasketButtons = document.querySelectorAll(".add-to-basket");

    addToBasketButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const productElement = e.target.closest(".col-4") || e.target.closest(".offer");
            const productId = productElement.querySelector("button").id;
            const productName = productElement.querySelector("h4")?.textContent || productElement.querySelector("h1").textContent;
            const productPrice = productElement.querySelector("p").textContent;
            const productImage = productElement.querySelector("img").src;

            // Create a product object
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1,
            };

            // Add the product to the cart in localStorage
            addToCart(product);
        });
    });
}

// Function to add a product to the cart in localStorage
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the product already exists in the cart
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1; // Increment quantity if it already exists
    } else {
        cart.push(product); // Add new product to the cart
    }

    // Save the updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product.name} has been added to your basket!`);
}
