/* The three legal pages share one small script: the site nav's scroll state,
   the mobile menu, the year, and a table of contents that shows where you are.
   Nothing here is required to read the page; it only makes a long policy easier
   to move through. */
(() => {
    "use strict";

    const nav = document.getElementById("nav");
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("mobileMenu");

    const onScroll = () => {
        if (nav) nav.classList.toggle("scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            const open = menu.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(open));
            toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        });

        menu.addEventListener("click", (event) => {
            if (event.target.tagName !== "A") return;
            menu.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open menu");
        });
    }

    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());

    const links = [...document.querySelectorAll(".toc a[href^='#']")];
    const sections = links
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    const byId = new Map(links.map((link) => [link.getAttribute("href").slice(1), link]));
    let ticking = false;

    const paint = () => {
        // Pick the last heading that has passed the reading line. A section can
        // be taller than the viewport, so an intersection test would keep two
        // sections "visible" at once and the marker would sit on the earlier
        // one. Position is the simpler, more honest answer.
        const line = 140;
        let current = sections[0].id;
        for (const section of sections) {
            if (section.getBoundingClientRect().top <= line) current = section.id;
        }
        for (const [id, link] of byId) {
            link.classList.toggle("active", id === current);
        }
    };

    const requestPaint = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            paint();
        });
    };

    window.addEventListener("scroll", requestPaint, { passive: true });
    window.addEventListener("resize", requestPaint);
    paint();
})();
