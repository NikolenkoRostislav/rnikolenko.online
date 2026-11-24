const windowElement = document.querySelector(".window");
const header = windowElement.querySelector("header");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

header.addEventListener("mousedown", (e) => {
    isDragging = true;

    const rect = windowElement.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    windowElement.style.left = `${e.clientX - offsetX}px`;
    windowElement.style.top = `${e.clientY - offsetY}px`;

    windowElement.style.transform = "none";
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});


const closeButton = document.querySelector(".close-button");
const shortcut = document.querySelector("#about-shortcut");

closeButton.addEventListener("click", (e) => {
    e.stopPropagation();
    windowElement.style.display = "none";
});

function openWindow() {
    windowElement.style.display = "flex";
}

shortcut.addEventListener("click", openWindow);

shortcut.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openWindow();
    }
});