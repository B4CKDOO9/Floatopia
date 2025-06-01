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
    setupBasket();
    setupAddToBasket();

    // Only run setupGame if the wheel exists on this page
    if (document.getElementById("wheel")) {
        setupGame();
    }
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

        document.querySelectorAll(".basket-table tbody tr").forEach((row) => {
            const priceText = row.cells[1].textContent.replace("$", "");
            const price = parseFloat(priceText);
            const quantityInput = row.querySelector(".quantity-input");
            const quantity = parseInt(quantityInput.value) || 0;
            const total = price * quantity;

            row.cells[3].textContent = `$${total.toFixed(2)}`;
            subtotal += total;

            if (quantity > 0) {
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

    // Use event delegation instead of individual listeners
    const basketTable = document.querySelector(".basket-table");
    if (basketTable) {
        // Remove old listeners
        basketTable.removeEventListener("click", handleTableClick);
        basketTable.removeEventListener("change", handleTableChange);

        // Add new listeners using event delegation
        basketTable.addEventListener("click", handleTableClick);
        basketTable.addEventListener("change", handleTableChange);
    }

    function handleTableClick(e) {
        if (e.target.classList.contains("remove-item")) {
            const row = e.target.closest("tr");
            const productId = row.getAttribute("data-product-id");

            // Remove from localStorage
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem("cart", JSON.stringify(cart));

            // Remove from DOM
            row.remove();
            updateTotals();
        }
    }

    function handleTableChange(e) {
        if (e.target.classList.contains("quantity-input")) {
            updateTotals();
        }
    }

    // Load cart from localStorage on page load
    function loadCartFromStorage() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const basketTableBody = document.querySelector(".basket-table tbody");

        if (basketTableBody && cart.length > 0) {
            basketTableBody.innerHTML = ""; // Clear existing items

            cart.forEach(item => {
                const newRow = document.createElement("tr");
                newRow.setAttribute("data-product-id", item.id);
                newRow.innerHTML = `
                    <td>
                        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: contain;">
                        ${item.name}
                    </td>
                    <td>${item.price}</td>
                    <td><input type="number" class="quantity-input" value="${item.quantity}" min="0"></td>
                    <td>$0.00</td>
                    <td><button class="remove-item">Remove</button></td>
                `;
                basketTableBody.appendChild(newRow);
            });
        }
    }

    // Load cart from storage first
    loadCartFromStorage();
    updateTotals();

    // Make updateTotals available globally for other functions
    window.updateBasketTotals = updateTotals;
}

// Update the setupGame function
function setupGame() {
    const spinButton = document.getElementById("spin-button");
    const wheel = document.getElementById("wheel");
    const wheelResult = document.getElementById("wheel-result");

    if (!spinButton || !wheel || !wheelResult) return;

    // Prize data (add id/price/image for basket)
    const segments = [
        { name: "Donut", id: "donut", price: "$25.00", image: "./pictures/Floaties_Pictures/donut.png" },
        { name: "Flamingo", id: "flamingo", price: "$25.00", image: "./pictures/Floaties_Pictures/Flamingo.webp" },
        { name: "Pizza", id: "pizza", price: "$25.00", image: "./pictures/Floaties_Pictures/Pizza.jpg" },
        { name: "Tank", id: "tank", price: "$25.00", image: "./pictures/Floaties_Pictures/Tank.jpg" },
        { name: "Nothing", id: "nothing", price: "$0.00", image: "" },
        { name: "Surprise", id: "surprise", price: "$25.00", image: "./pictures/Floaties_Pictures/surprise.png" }
    ];
    const colors = ["#ffdfba", "#ff5e57", "#ffe066", "#8bc34a", "#4dd0e1", "#ba68c8"];
    const count = segments.length;
    const angle = 360 / count;

    // Draw colored wheel using conic-gradient
    wheel.style.background = `conic-gradient(
        ${colors.map((color, i) => `${color} ${i * angle}deg ${(i + 1) * angle}deg`).join(", ")}
    )`;

    // Remove old labels
    wheel.querySelectorAll('.wheel-label').forEach(el => el.remove());

    // Add labels for each segment
    segments.forEach((segment, i) => {
        const label = document.createElement("div");
        label.className = "wheel-label";
        label.innerText = segment.name;
        // Position label at the middle of each wedge
        const theta = (i + 0.5) * angle - 90; // -90 to start at top
        label.style.transform = `rotate(${theta}deg) translate(70px, -50%) rotate(${-theta}deg)`;
        wheel.appendChild(label);
    });

    let hasSpun = false;
    spinButton.onclick = () => {
        if (hasSpun) return;
        hasSpun = true;
        wheelResult.textContent = "";

        const fullSpins = Math.floor(Math.random() * 5) + 5;
        const targetIndex = Math.floor(Math.random() * count);
        const finalAngle = 360 * fullSpins + (360 - (targetIndex * angle) - angle / 2);

        wheel.style.transition = "transform 4s cubic-bezier(0.33, 1, 0.68, 1)";
        wheel.style.transform = `rotate(${finalAngle}deg)`;

        setTimeout(() => {
            const prize = segments[targetIndex];
            if (prize.name === "Nothing") {
                wheelResult.textContent = "Sorry, you didn't win anything.";
            } else {
                wheelResult.textContent = `Congrats! You won a ${prize.name}!`;
                addToCart({
                    id: prize.id,
                    name: prize.name + " Floatie",
                    price: prize.price,
                    image: prize.image,
                    quantity: 1
                });
            }
            hasSpun = false;
        }, 4000);
    };
}

// Update the addToCart function
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Add to basket table if we're on the basket page
    const basketTable = document.querySelector(".basket-table tbody");
    if (basketTable) {
        // Check if item already exists in the table
        const existingRow = document.querySelector(`tr[data-product-id="${product.id}"]`);

        if (existingRow) {
            // Update existing row quantity
            const quantityInput = existingRow.querySelector(".quantity-input");
            quantityInput.value = parseInt(quantityInput.value) + 1;
        } else {
            // Add new row to basket table
            const newRow = document.createElement("tr");
            newRow.setAttribute("data-product-id", product.id);
            newRow.innerHTML = `
                <td>
                    <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: contain;">
                    ${product.name}
                </td>
                <td>${product.price}</td>
                <td><input type="number" class="quantity-input" value="${product.quantity}" min="0"></td>
                <td>$0.00</td>
                <td><button class="remove-item">Remove</button></td>
            `;
            basketTable.appendChild(newRow);
        }

        // Update totals
        if (window.updateBasketTotals) {
            window.updateBasketTotals();
        }
    }

    alert(`${product.name} has been added to your basket!`);
}
