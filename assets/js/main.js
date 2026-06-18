function myMenuFunction() {
    const menu = document.getElementById("myNavMenu");
    const toggle = document.querySelector(".nav-menu-btn");
    const isOpen = menu.classList.toggle("responsive");

    document.body.classList.toggle("menu-open", isOpen);

    if (toggle) {
        toggle.setAttribute("aria-expanded", String(isOpen));
    }
}

function applyTheme(theme) {
    const root = document.documentElement;
    const toggle = document.querySelector(".theme-toggle");
    const icon = toggle ? toggle.querySelector("i") : null;
    const nextTheme = theme === "dark" ? "dark" : "light";

    root.dataset.theme = nextTheme;

    if (toggle) {
        const isDark = nextTheme === "dark";
        toggle.setAttribute("aria-pressed", String(isDark));
        toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    }

    if (icon) {
        icon.className = nextTheme === "dark" ? "uil uil-sun" : "uil uil-moon";
    }
}

function initTheme() {
    const urlTheme = new URLSearchParams(window.location.search).get("theme");
    const savedTheme = localStorage.getItem("portfolio-theme");
    const requestedTheme = urlTheme === "dark" || urlTheme === "light" ? urlTheme : null;
    const initialTheme = requestedTheme || savedTheme || "dark";
    const toggle = document.querySelector(".theme-toggle");

    applyTheme(initialTheme);

    if (toggle) {
        toggle.addEventListener("click", () => {
            const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
            const nextTheme = currentTheme === "dark" ? "light" : "dark";

            localStorage.setItem("portfolio-theme", nextTheme);
            applyTheme(nextTheme);
        });
    }
}

function headerShadow() {
    const navHeader = document.getElementById("header");

    if (!navHeader) {
        return;
    }

    navHeader.classList.toggle("is-scrolled", window.scrollY > 12);
}

function updateScrollProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

    document.documentElement.style.setProperty("--scroll-progress", String(Math.min(Math.max(progress, 0), 1)));
}

function scrollActive() {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.scrollY;

    sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute("id");
        const link = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (!link) {
            return;
        }

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            link.classList.add("active-link");
        } else {
            link.classList.remove("active-link");
        }
    });
}

function initMotion() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = document.querySelectorAll(
        ".content-section .section-heading, .about-copy, .skills-panel, .info-card, .experience-card, .project-card, .recognition-card, .contact-band"
    );

    document.body.classList.add("motion-ready");

    revealItems.forEach((item, index) => {
        item.classList.add("reveal-item", `reveal-delay-${index % 3}`);
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("in-view"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            rootMargin: "0px 0px -12% 0px",
            threshold: 0.08,
        }
    );

    revealItems.forEach((item) => observer.observe(item));
}

document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        const menu = document.getElementById("myNavMenu");
        const toggle = document.querySelector(".nav-menu-btn");

        if (menu) {
            menu.classList.remove("responsive");
        }

        document.body.classList.remove("menu-open");

        if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
        }
    });
});

window.addEventListener("scroll", () => {
    headerShadow();
    updateScrollProgress();
    scrollActive();
}, { passive: true });

window.addEventListener("load", () => {
    initTheme();
    initMotion();
    headerShadow();
    updateScrollProgress();
    scrollActive();
});
