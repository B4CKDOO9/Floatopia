// filepath: c:\Users\Smolec\Documents\GitHub\Floatopia\Floatopiaaa\src\js\index.js
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    menuToggle.addEventListener("click", () => {
        dropdownMenu.classList.toggle("open");
    });
});

function updateClock(){
    const clock = document.getElementById("clock");
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    clock.textContent = `${hours}:${minutes}:${seconds}`;
}

updateClock();
setInterval(updateClock, 1000);