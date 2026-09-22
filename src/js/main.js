// ============================================================
// MP1 Portfolio - Main JavaScript
// ============================================================

// ---------- Navbar ----------
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.querySelector(".navbar__links");
const navItems = document.querySelectorAll(".navbar__links a");


// Shrink navbar when the user scrolls
function updateNavbar() {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", updateNavbar);


// Mobile navigation
navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});


// Close mobile navigation after selecting a section
navItems.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
    });
});


// ---------- Position Indicator ----------
const sections = document.querySelectorAll("main section[id]");
const sectionLinks = document.querySelectorAll(".navbar__links a");

function updatePositionIndicator() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.35;

    // Once the user has scrolled to (or very near) the bottom of the page,
    // force the last section's nav item to stay highlighted even though
    // there is no more content below it to trigger the normal check.
    const atBottom =
        window.innerHeight + Math.ceil(window.scrollY) >=
        document.documentElement.scrollHeight - 2;

    let currentSection = "";

    if (atBottom && sections.length > 0) {
        currentSection = sections[sections.length - 1].id;
    } else {
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionBottom
            ) {
                currentSection = section.id;
            }
        });
    }

    sectionLinks.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", updatePositionIndicator);
window.addEventListener("resize", updatePositionIndicator);


// ---------- Project Carousel ----------
const slides = document.querySelectorAll(".project-slide");
const previousButton = document.getElementById("carousel-prev");
const nextButton = document.getElementById("carousel-next");

let currentSlide = 0;


function showSlide(index) {
    if (index < 0) {
        currentSlide = slides.length - 1;
    } else if (index >= slides.length) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }

    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle(
            "active",
            slideIndex === currentSlide
        );
    });
}


previousButton.addEventListener("click", () => {
    showSlide(currentSlide - 1);
});


nextButton.addEventListener("click", () => {
    showSlide(currentSlide + 1);
});


// Allow keyboard navigation for the carousel
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        showSlide(currentSlide - 1);
    }

    if (event.key === "ArrowRight") {
        showSlide(currentSlide + 1);
    }
});


// ---------- Modals ----------
const modalButtons = document.querySelectorAll(".modal-button");
const modals = document.querySelectorAll(".modal");
const modalCloseButtons = document.querySelectorAll(".modal__close");


function openModal(modalId) {
    const modal = document.getElementById(modalId);

    if (modal) {
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
    }
}


function closeModal(modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
}


// Open modal buttons
modalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modalId = button.getAttribute("data-modal");
        openModal(modalId);
    });
});


// Close buttons
modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modal = button.closest(".modal");
        closeModal(modal);
    });
});


// Close modal when clicking outside the modal content
modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
});


// Close modal with Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        modals.forEach((modal) => {
            if (modal.classList.contains("open")) {
                closeModal(modal);
            }
        });
    }
});


// ---------- Hero background video ----------
// Respect prefers-reduced-motion by freezing on the poster frame instead
// of looping the clip.
(function initHeroVideo() {
    const heroVideo = document.querySelector(".hero__bg-video");

    if (!heroVideo) {
        return;
    }

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
        heroVideo.pause();
        heroVideo.removeAttribute("autoplay");
    }
})();


// ---------- Starfield background ----------
// A lightweight, dependency-free canvas starfield that sits behind all
// page content (#starfield, z-index -1 in the SCSS). Stars gently twinkle
// and, every so often, a shooting star streaks across the sky.
(function initStarfield() {
    const canvas = document.getElementById("starfield");

    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let stars = [];
    let shootingStar = null;
    let lastFrameTime = 0;

    function createStars() {
        const density = 0.00012; // stars per square pixel
        const count = Math.round(width * height * density);

        stars = new Array(count).fill(null).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.3 + 0.3,
            baseAlpha: Math.random() * 0.5 + 0.35,
            twinkleSpeed: Math.random() * 0.0015 + 0.0004,
            twinklePhase: Math.random() * Math.PI * 2,
        }));
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        createStars();
    }

    function maybeSpawnShootingStar() {
        if (shootingStar || prefersReducedMotion) {
            return;
        }

        if (Math.random() < 0.0025) {
            const startX = Math.random() * width * 0.6;
            shootingStar = {
                x: startX,
                y: -20,
                length: Math.random() * 120 + 80,
                speed: Math.random() * 9 + 7,
                angle: Math.PI / 3.2,
                life: 1,
            };
        }
    }

    function drawStars(time) {
        ctx.clearRect(0, 0, width, height);

        stars.forEach((star) => {
            const twinkle = prefersReducedMotion
                ? 0
                : Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.35;

            const alpha = Math.max(0, Math.min(1, star.baseAlpha + twinkle));

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(235, 240, 255, ${alpha})`;
            ctx.fill();
        });
    }

    function drawShootingStar() {
        if (!shootingStar) {
            return;
        }

        const dx = Math.cos(shootingStar.angle) * shootingStar.speed;
        const dy = Math.sin(shootingStar.angle) * shootingStar.speed;

        shootingStar.x += dx;
        shootingStar.y += dy;
        shootingStar.life -= 0.012;

        const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
        const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

        const gradient = ctx.createLinearGradient(
            shootingStar.x, shootingStar.y, tailX, tailY
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${Math.max(shootingStar.life, 0)})`);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        if (
            shootingStar.life <= 0 ||
            shootingStar.y > height + shootingStar.length ||
            shootingStar.x > width + shootingStar.length
        ) {
            shootingStar = null;
        }
    }

    function frame(time) {
        lastFrameTime = time;
        drawStars(time);
        maybeSpawnShootingStar();
        drawShootingStar();
        requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);

    if (prefersReducedMotion) {
        // Draw a single static frame instead of a continuous animation loop.
        drawStars(0);
    } else {
        requestAnimationFrame(frame);
    }
})();


// ---------- Initial State ----------
updateNavbar();
updatePositionIndicator();
showSlide(0);
