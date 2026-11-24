
const windows = document.querySelectorAll(".window");
const taskbarWindows = document.querySelector(".taskbar-windows");

let highestZIndex = 10;
let activeWindow = null;

windows.forEach((windowElement) => {
    const isVisible = getComputedStyle(windowElement).display !== "none";

    windowElement.dataset.state = isVisible ? "open" : "closed";

    if (isVisible) {
        activeWindow = windowElement;
    }
});

function bringToFront(windowElement) {
    highestZIndex++;
    windowElement.style.zIndex = highestZIndex;
    activeWindow = windowElement;

    updateTaskbar();
}

function selectNextActiveWindow() {
    const openWindows = [...windows].filter(
        (windowElement) => windowElement.dataset.state === "open"
    );

    activeWindow = openWindows.reduce((top, current) => {
        if (!top) return current;

        return Number(current.style.zIndex || 10) >
            Number(top.style.zIndex || 10)
            ? current
            : top;
    }, null);
}

function updateTaskbar() {
    taskbarWindows.innerHTML = "";

    windows.forEach((windowElement) => {
        if (windowElement.dataset.state === "closed") return;

        const button = document.createElement("button");
        button.className = "taskbar-window-button";

        button.textContent =
            windowElement.querySelector("h1").textContent;

        if (windowElement === activeWindow) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {
            if (windowElement === activeWindow) {
                minimizeWindow(windowElement);
            } else {
                restoreWindow(windowElement);
            }
        });

        taskbarWindows.appendChild(button);
    });
}

function openWindow(windowElement) {
    windowElement.dataset.state = "open";
    windowElement.style.display = "flex";

    bringToFront(windowElement);
}

function minimizeWindow(windowElement) {
    windowElement.dataset.state = "minimized";
    windowElement.style.display = "none";

    if (activeWindow === windowElement) {
        selectNextActiveWindow();
    }

    updateTaskbar();
}

function restoreWindow(windowElement) {
    openWindow(windowElement);
}

function closeWindow(windowElement) {
    windowElement.dataset.state = "closed";
    windowElement.style.display = "none";

    if (activeWindow === windowElement) {
        selectNextActiveWindow();
    }

    updateTaskbar();
}

windows.forEach((windowElement) => {
    const header = windowElement.querySelector("header");
    const closeButton = windowElement.querySelector(".close-button");
    const minimizeButton = windowElement.querySelector(".minimize-button");

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    closeButton.addEventListener("click", () => {
        closeWindow(windowElement);
    });

    minimizeButton?.addEventListener("click", () => {
        minimizeWindow(windowElement);
    });

    windowElement.addEventListener("pointerdown", () => {
        bringToFront(windowElement);
    });

    header.addEventListener("pointerdown", (e) => {
        if (e.target.closest(".window-controls")) return;
        if (e.button !== 0) return;

        isDragging = true;

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

document.querySelector("#about-shortcut").addEventListener("click", () => {
    openWindow(document.querySelector(".window:not(.links-window)"));
});

document.querySelector("#links-shortcut").addEventListener("click", () => {
    openWindow(document.querySelector(".links-window"));
});

document.querySelector(".start-button").addEventListener("click", () => {
});

function updateClock() {
    document.querySelector("#clock").textContent =
        new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
}

updateClock();
setInterval(updateClock, 1000);

updateTaskbar();
