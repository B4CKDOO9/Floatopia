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
});

// Menu toggle functionality
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

        document.getElementById("countdown").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "EXPIRED";
        }
    }, 1000);
}
