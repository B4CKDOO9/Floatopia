// filepath: c:\Users\Smolec\Documents\GitHub\Floatopia\Floatopiaaa\src\js\index.js
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    menuToggle.addEventListener("click", () => {
        dropdownMenu.classList.toggle("open");
    });
});