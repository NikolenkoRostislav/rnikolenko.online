
const windows = document.querySelectorAll(".window");
const shortcuts = document.querySelectorAll(".desktop-icon");

let highestZIndex = 10;

windows.forEach((windowElement) => {
    const header = windowElement.querySelector("header");
    const closeButton = windowElement.querySelector(".close-button");

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    closeButton.addEventListener("click", () => {
        windowElement.style.display = "none";
    });

    header.addEventListener("pointerdown", (e) => {
        if (e.target.closest(".close-button")) return;
        if (e.button !== 0) return;

        isDragging = true;

        highestZIndex++;
        windowElement.style.zIndex = highestZIndex;

        const rect = windowElement.getBoundingClientRect();

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        windowElement.style.left = `${rect.left}px`;
        windowElement.style.top = `${rect.top}px`;
        windowElement.style.transform = "none";

        header.setPointerCapture(e.pointerId);
    });

    header.addEventListener("pointermove", (e) => {
        if (!isDragging) return;

        windowElement.style.left = `${e.clientX - offsetX}px`;
        windowElement.style.top = `${e.clientY - offsetY}px`;
    });

    header.addEventListener("pointerup", () => {
        isDragging = false;
    });

    header.addEventListener("pointercancel", () => {
        isDragging = false;
    });
});

function openWindow(selector) {
    const windowElement = document.querySelector(selector);

    windowElement.style.display = "flex";

    highestZIndex++;
    windowElement.style.zIndex = highestZIndex;
}

document.querySelector("#about-shortcut").addEventListener("click", () => {
    openWindow(".window:not(.links-window)");
});

document.querySelector("#links-shortcut").addEventListener("click", () => {
    openWindow(".links-window");
});